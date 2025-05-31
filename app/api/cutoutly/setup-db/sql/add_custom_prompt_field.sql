-- Add custom_prompt field to cutoutly_cartoons table
ALTER TABLE cutoutly_cartoons
ADD COLUMN IF NOT EXISTS custom_prompt TEXT,
ADD COLUMN IF NOT EXISTS is_custom_mode BOOLEAN DEFAULT FALSE;

-- Add comment to explain the fields
COMMENT ON COLUMN cutoutly_cartoons.custom_prompt IS 'Custom prompt text for free-form generation';
COMMENT ON COLUMN cutoutly_cartoons.is_custom_mode IS 'Whether this cartoon was generated using custom prompt mode';
