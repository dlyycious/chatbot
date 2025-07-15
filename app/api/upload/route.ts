import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createOpenAI } from "@ai-sdk/openai";
import { embed } from "ai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Function to extract text from PDF (simplified)
async function extractTextFromPDF(file: File): Promise<string> {
  // In a real implementation, you would use a library like pdf-parse
  // For now, we'll return a placeholder
  return `Extracted text from PDF: ${file.name}\nThis is sample content that would be extracted from the PDF file.`;
}

// Function to extract text from Excel (simplified)
async function extractTextFromExcel(file: File): Promise<string> {
  // In a real implementation, you would use a library like xlsx
  // For now, we'll return a placeholder
  return `Extracted data from Excel: ${file.name}\nThis is sample content that would be extracted from the Excel file.`;
}

// Function to chunk text into smaller pieces
function chunkText(text: string, chunkSize = 1000): string[] {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ". " : "") + sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set");
    return NextResponse.json(
      { error: "Server mis-configuration: OPENAI_API_KEY is missing" },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const database = formData.get("database") as string;

    if (!file || !database) {
      return NextResponse.json({ error: "File and database are required" }, { status: 400 });
    }

    // Extract text based on file type
    let extractedText: string;
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".pdf")) {
      extractedText = await extractTextFromPDF(file);
    } else if (fileName.endsWith(".xlsx")) {
      extractedText = await extractTextFromExcel(file);
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    // Chunk the text
    const chunks = chunkText(extractedText);

    // Generate embeddings for each chunk
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const embedder = openai.embedding("text-embedding-3-small");

    const embeddings = await Promise.all(
      chunks.map(async (chunk) => {
        const { embedding } = await embed({
          model: embedder,
          value: chunk,
        });
        return embedding;
      })
    );

    // Store in database
    const documents = chunks.map((chunk, index) => ({
      content: chunk,
      embedding: embeddings[index],
      filename: file.name,
      database_name: database,
      file_type: fileName.endsWith(".pdf") ? "pdf" : "excel",
      created_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("documents").insert(documents);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to store in database" }, { status: 500 });
    }

    return NextResponse.json({
      message: "File uploaded and processed successfully",
      chunks: chunks.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
