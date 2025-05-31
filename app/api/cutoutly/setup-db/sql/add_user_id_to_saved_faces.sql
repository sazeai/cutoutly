-- Add user_id column to cutoutly_saved_faces table if it doesn't exist
ALTER TABLE IF EXISTS cutoutly_saved_faces 
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cutoutly_saved_faces_user_id ON cutoutly_saved_faces(user_id);

-- Add comment for documentation
COMMENT ON COLUMN cutoutly_saved_faces.user_id IS 'The ID of the user who saved this face';
