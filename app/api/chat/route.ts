import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, embed, cosineSimilarity } from "ai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is missing.");
}

// OpenAI instance dengan apiKey di sini
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/* ----------  helpers ---------- */

function isQuotaError(error: unknown) {
  const msg = (typeof error === "string" && error) || (error as { message?: string })?.message;
  return msg?.toLowerCase().includes("quota");
}

async function getEmbedding(text: string) {
  try {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: text,
    });
    return embedding;
  } catch (err) {
    if (!isQuotaError(err)) throw err;
  }

  const { embedding } = await embed({
    model: openai.embedding("text-embedding-ada-002"),
    value: text,
  });
  return embedding;
}

async function streamAnswer({
  messages,
  context,
}: {
  messages: { role: "user" | "system" | "assistant" | "data"; content: string }[];
  context: string;
}) {
  const systemPrompt = `Anda adalah AI assistant yang membantu menjawab pertanyaan berdasarkan dokumen yang telah di-upload.

Gunakan konteks berikut untuk menjawab pertanyaan user:
${context}

Jika informasi tidak tersedia dalam konteks, katakan bahwa Anda tidak memiliki informasi tersebut dalam database.
Selalu berikan jawaban dalam bahasa Indonesia yang jelas dan informatif.
Jika memungkinkan, sebutkan sumber dokumen yang Anda gunakan untuk menjawab.`;

  try {
    return await streamText({
      model: openai.chat("gpt-4o"),
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    });
  } catch (err) {
    if (!isQuotaError(err)) throw err;
  }

  return streamText({
    model: openai.chat("gpt-3.5-turbo"),
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  });
}

/* ----------  route ---------- */

export async function POST(req: NextRequest) {
  try {
    const { messages, database } = await req.json();
    const lastMessage = messages[messages.length - 1];

    const queryEmbedding = await getEmbedding(lastMessage.content);

    let query = supabase.from("documents").select("content, filename, database_name, embedding");

    if (database && database !== "all") {
      query = query.eq("database_name", database);
    }

    const { data: docs, error } = await query;
    if (error) throw new Error(error.message);

    const relevantDocs =
      docs
        ?.map((d) => ({
          ...d,
          similarity: cosineSimilarity(queryEmbedding, d.embedding),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5) || [];

    const context = relevantDocs
      .map((d) => `[${d.filename} - ${d.database_name}]: ${d.content}`)
      .join("\n\n");

    const result = await streamAnswer({ messages, context });
    return result.toDataStreamResponse();
  } catch (err) {
    console.error("Chat API error:", err);

    if (isQuotaError(err)) {
      return new Response(
        JSON.stringify({
          error:
            "OpenAI quota terlampaui. Silakan cek penggunaan API Anda atau gunakan model lain.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
