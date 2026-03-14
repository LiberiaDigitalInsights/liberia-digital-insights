-- Add title column to newsletters for internal reference
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS title VARCHAR(255);

-- Update existing newsletters to have a title (default to subject)
UPDATE newsletters SET title = subject WHERE title IS NULL;
