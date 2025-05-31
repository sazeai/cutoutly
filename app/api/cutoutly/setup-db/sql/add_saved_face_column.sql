-- Add a new table for saved faces
CREATE TABLE IF NOT EXISTS cutoutly_saved_faces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  face_image_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add a column to reference saved faces
ALTER TABLE cutoutly_cartoons 
ADD COLUMN IF NOT EXISTS saved_face_id UUID REFERENCES cutoutly_saved_faces(id) NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cutoutly_cartoons_saved_face_id ON cutoutly_cartoons(saved_face_id);
