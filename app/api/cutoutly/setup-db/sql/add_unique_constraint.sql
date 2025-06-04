-- First, create a temporary table with the most recent face for each user
CREATE TEMP TABLE temp_saved_faces AS
SELECT DISTINCT ON (user_id) *
FROM cutoutly_saved_faces
WHERE user_id IS NOT NULL
ORDER BY user_id, created_at DESC;

-- Delete all existing faces
DELETE FROM cutoutly_saved_faces
WHERE user_id IS NOT NULL;

-- Insert back only the most recent face for each user
INSERT INTO cutoutly_saved_faces (id, user_id, face_image_path, created_at)
SELECT id, user_id, face_image_path, created_at
FROM temp_saved_faces;

-- Drop the temporary table
DROP TABLE temp_saved_faces;

-- Add unique constraint on user_id to ensure one face per user
ALTER TABLE cutoutly_saved_faces
ADD CONSTRAINT cutoutly_saved_faces_user_id_key UNIQUE (user_id);

-- Add comment for documentation
COMMENT ON CONSTRAINT cutoutly_saved_faces_user_id_key ON cutoutly_saved_faces 
IS 'Ensures each user can only have one saved face';

-- First, create a temporary table with the most recent profile face for each user
CREATE TEMP TABLE temp_saved_profile_faces AS
SELECT DISTINCT ON (user_id) *
FROM cutoutly_saved_profile_faces
WHERE user_id IS NOT NULL
ORDER BY user_id, created_at DESC;

-- Delete all existing profile faces
DELETE FROM cutoutly_saved_profile_faces
WHERE user_id IS NOT NULL;

-- Insert back only the most recent profile face for each user
INSERT INTO cutoutly_saved_profile_faces (id, user_id, face_image_path, created_at)
SELECT id, user_id, face_image_path, created_at
FROM temp_saved_profile_faces;

-- Drop the temporary table
DROP TABLE temp_saved_profile_faces;

-- Add unique constraint on user_id to ensure one profile face per user
ALTER TABLE cutoutly_saved_profile_faces
ADD CONSTRAINT cutoutly_saved_profile_faces_user_id_key UNIQUE (user_id);

-- Add comment for documentation
COMMENT ON CONSTRAINT cutoutly_saved_profile_faces_user_id_key ON cutoutly_saved_profile_faces 
IS 'Ensures each user can only have one saved profile face'; 