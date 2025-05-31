-- Create cutoutly_cartoons table
CREATE TABLE IF NOT EXISTS cutoutly_cartoons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  status VARCHAR(50) NOT NULL DEFAULT 'processing',
  progress_stage VARCHAR(50),
  progress_percent INTEGER DEFAULT 0,
  error_message TEXT,
  
  -- Input parameters
  input_image_path TEXT,
  pose VARCHAR(50),
  prop VARCHAR(50),
  style VARCHAR(50),
  expression VARCHAR(50),
  speech_bubble TEXT,
  use_case VARCHAR(50),
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
CREATE INDEX IF NOT EXISTS idx_cutoutly_cartoons_user_id ON cutoutly_cartoons(user_id);
CREATE INDEX IF NOT EXISTS idx_cutoutly_cartoons_status ON cutoutly_cartoons(status);

-- Add comment for documentation
COMMENT ON TABLE cutoutly_cartoons IS 'Stores cartoon PNG generations with transparent backgrounds using GPT-image-1';
