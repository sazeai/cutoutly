-- Add a new table for saved profile faces
CREATE TABLE IF NOT EXISTS cutoutly_saved_profile_faces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  face_image_path TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add a column to reference saved profile faces
ALTER TABLE cutoutly_avatars 
ADD COLUMN IF NOT EXISTS saved_face_id UUID REFERENCES cutoutly_saved_profile_faces(id) NULL;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_cutoutly_avatars_saved_face_id ON cutoutly_avatars(saved_face_id);
CREATE INDEX IF NOT EXISTS idx_cutoutly_saved_profile_faces_user_id ON cutoutly_saved_profile_faces(user_id);

-- Add comments for documentation
COMMENT ON COLUMN cutoutly_saved_profile_faces.user_id IS 'The ID of the user who saved this profile face';
COMMENT ON COLUMN cutoutly_avatars.saved_face_id IS 'Reference to the saved profile face used for this avatar'; 