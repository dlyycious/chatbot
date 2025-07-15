import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { openai } from "@ai-sdk/openai"
import { streamText, embed } from "ai"
import { cosineSimilarity } from "ai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

if (!process.env.OPENAI_API_KEY) {
  // Fail immediately on boot so the developer notices.
  throw new Error("OPENAI_API_KEY environment variable is missing.")
}

/* ----------  helpers ---------- */

/** Detect the “quota exceeded / insufficient quota” family of errors */
function isQuotaError(error: unknown) {
  const msg = (typeof error === "string" && error) || (error as { message?: string })?.message
  return msg?.toLowerCase().includes("quota")
}

/** Get an embedding, with automatic model fallback when quota is exhausted */
async function getEmbedding(text: string) {
  // 1st choice – newest small embedding model
  try {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small", {
        apiKey: process.env.OPENAI_API_KEY!,
      }),
      value: text,
    })
    return embedding
  } catch (err) {
    if (!isQuotaError(err)) throw err
  }

  // Fallback – Ada-002 (older, but cheaper / usually still in quota)
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-ada-002", {
      apiKey: process.env.OPENAI_API_KEY!,
    }),
    value: text,
  })
  return embedding
}

/** Stream a response with fallback from GPT-4o → GPT-3.5-Turbo on quota errors  */
async function streamAnswer({
  messages,
  context,
}: {
  messages: { role: string; content: string }[]
  context: string
}) {
  const systemPrompt = `Anda adalah AI assistant yang membantu menjawab pertanyaan berdasarkan dokumen yang telah di-upload.

Gunakan konteks berikut untuk menjawab pertanyaan user:
${context}

Jika informasi tidak tersedia dalam konteks, katakan bahwa Anda tidak memiliki informasi tersebut dalam database.
Selalu berikan jawaban dalam bahasa Indonesia yang jelas dan informatif.
Jika memungkinkan, sebutkan sumber dokumen yang Anda gunakan untuk menjawab.`

  // preferred model
  try {
    return await streamText({
      model: openai("gpt-4o", { apiKey: process.env.OPENAI_API_KEY! }),
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    })
  } catch (err) {
    if (!isQuotaError(err)) throw err
  }

  // fallback model
  return streamText({
    model: openai("gpt-3.5-turbo", { apiKey: process.env.OPENAI_API_KEY! }),
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  })
}

/* ----------  route ---------- */

export async function POST(req: NextRequest) {
  try {
    const { messages, database } = await req.json()
    const lastMessage = messages[messages.length - 1]

    /* 1. Embed user question */
    const queryEmbedding = await getEmbedding(lastMessage.content)

    /* 2. Retrieve top-k relevant chunks */
    let query = supabase.from("documents").select("content, filename, database_name, embedding")

    if (database && database !== "all") {
      query = query.eq("database_name", database)
    }

    const { data: docs, error } = await query
    if (error) throw new Error(error.message)

    const relevantDocs =
      docs
        ?.map((d) => ({
          ...d,
          similarity: cosineSimilarity(queryEmbedding, d.embedding),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5) || []

    const context = relevantDocs.map((d) => `[${d.filename} - ${d.database_name}]: ${d.content}`).join("\n\n")

    /* 3. Generate / stream answer with fallback */
    const result = await streamAnswer({ messages, context })
    return result.toDataStreamResponse()
  } catch (err) {
    console.error("Chat API error:", err)

    // Distinguish quota problems so the client can show a relevant msg
    if (isQuotaError(err)) {
      return new Response(
        JSON.stringify({
          error: "OpenAI quota terlampaui. Silakan cek penggunaan API Anda atau gunakan model lain.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      )
    }

    return new Response("Internal Server Error", { status: 500 })
  }
}
