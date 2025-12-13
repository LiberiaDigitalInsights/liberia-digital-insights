-- Add missing columns to podcasts table
-- Run this migration in Supabase SQL editor

ALTER TABLE podcasts 
ADD COLUMN IF NOT EXISTS guest VARCHAR(255),
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id),
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en',
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Update status check constraint to include 'archived'
ALTER TABLE podcasts 
DROP CONSTRAINT IF EXISTS podcasts_status_check;

ALTER TABLE podcasts 
ADD CONSTRAINT podcasts_status_check 
CHECK (status IN ('draft', 'published', 'pending', 'archived'));

-- Create index for frequently queried fields
CREATE INDEX IF NOT EXISTS idx_podcasts_category_id ON podcasts(category_id);
CREATE INDEX IF NOT EXISTS idx_podcasts_is_featured ON podcasts(is_featured);
CREATE INDEX IF NOT EXISTS idx_podcasts_status ON podcasts(status);
CREATE INDEX IF NOT EXISTS idx_podcasts_published_at ON podcasts(published_at);
