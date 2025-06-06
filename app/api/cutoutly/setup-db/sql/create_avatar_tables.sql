-- Create cutoutly_avatars table
CREATE TABLE IF NOT EXISTS cutoutly_avatars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input_image_path TEXT NOT NULL,
  output_image_path TEXT,
  style VARCHAR(50) NOT NULL,
  expression VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'initializing',
  progress_stage VARCHAR(50),
  progress_percent INTEGER DEFAULT 0,
  error_message TEXT,
  last_processed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cutoutly_avatars_user_id ON cutoutly_avatars(user_id);
CREATE INDEX IF NOT EXISTS idx_cutoutly_avatars_status ON cutoutly_avatars(status);

-- Add comment for documentation
COMMENT ON TABLE cutoutly_avatars IS 'Stores AI-generated avatar profile pictures with various styles and backgrounds'; 