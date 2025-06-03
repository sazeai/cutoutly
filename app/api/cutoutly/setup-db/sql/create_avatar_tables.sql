-- Create cutoutly_avatars table
CREATE TABLE IF NOT EXISTS cutoutly_avatars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  status VARCHAR(50) NOT NULL DEFAULT 'processing',
  progress_stage VARCHAR(50),
  progress_percent INTEGER DEFAULT 0,
  error_message TEXT,
  
  -- Input parameters
  input_image_path TEXT,
  style VARCHAR(50),
  expression VARCHAR(50),
  background_type VARCHAR(50),
  background_value TEXT,
  outfit_theme VARCHAR(50),
  size VARCHAR(20),
  
  -- Output
  output_image_path TEXT,
  prompt TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_processed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cutoutly_avatars_user_id ON cutoutly_avatars(user_id);
CREATE INDEX IF NOT EXISTS idx_cutoutly_avatars_status ON cutoutly_avatars(status);

-- Add comment for documentation
COMMENT ON TABLE cutoutly_avatars IS 'Stores AI-generated avatar profile pictures with various styles and backgrounds'; 