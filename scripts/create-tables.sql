-- Create extension for vector operations
CREATE EXTENSION IF NOT EXISTS vector;

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding vector(1536),
  filename VARCHAR(255) NOT NULL,
  database_name VARCHAR(100) NOT NULL,
  file_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS documents_embedding_idx 
ON documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index for database filtering
CREATE INDEX IF NOT EXISTS documents_database_idx 
ON documents (database_name);

-- Create index for filename search
CREATE INDEX IF NOT EXISTS documents_filename_idx 
ON documents (filename);
