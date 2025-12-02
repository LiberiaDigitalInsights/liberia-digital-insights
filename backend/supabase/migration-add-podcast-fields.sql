-- Migration: Add missing fields to podcasts table
-- Run this in your Supabase SQL Editor to add the missing podcast fields

-- Add missing columns to podcasts table
ALTER TABLE podcasts 
ADD COLUMN IF NOT EXISTS guest VARCHAR(255),
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id),
ADD COLUMN IF NOT EXISTS host_id UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS episode_number INTEGER,
ADD COLUMN IF NOT EXISTS season_number INTEGER,
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en',
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS plays_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS downloads_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS audio_file_size BIGINT,
ADD COLUMN IF NOT EXISTS cover_image_thumbnail TEXT;

-- Update existing records to have default values
UPDATE podcasts 
SET 
    guest = NULL,
    category_id = NULL,
    host_id = NULL,
    episode_number = NULL,
    season_number = NULL,
    language = 'en',
    tags = '{}',
    is_featured = false,
    plays_count = 0,
    downloads_count = 0,
    likes_count = 0,
    audio_file_size = NULL,
    cover_image_thumbnail = NULL
WHERE guest IS NULL OR category_id IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_podcasts_category_id ON podcasts(category_id);
CREATE INDEX IF NOT EXISTS idx_podcasts_host_id ON podcasts(host_id);
CREATE INDEX IF NOT EXISTS idx_podcasts_episode_number ON podcasts(episode_number);
CREATE INDEX IF NOT EXISTS idx_podcasts_season_number ON podcasts(season_number);
CREATE INDEX IF NOT EXISTS idx_podcasts_is_featured ON podcasts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_podcasts_plays_count ON podcasts(plays_count);
CREATE INDEX IF NOT EXISTS idx_podcasts_tags ON podcasts USING GIN(tags);

-- Add comments for documentation
COMMENT ON COLUMN podcasts.guest IS 'Guest name or interviewee for the podcast episode';
COMMENT ON COLUMN podcasts.category_id IS 'Category reference for categorizing podcasts';
COMMENT ON COLUMN podcasts.host_id IS 'Host reference linking to users table';
COMMENT ON COLUMN podcasts.episode_number IS 'Episode number in the series';
COMMENT ON COLUMN podcasts.season_number IS 'Season number for seasonal podcasts';
COMMENT ON COLUMN podcasts.language IS 'Language code (e.g., en, fr, etc.)';
COMMENT ON COLUMN podcasts.tags IS 'Array of tags for better searchability';
COMMENT ON COLUMN podcasts.is_featured IS 'Whether this podcast is featured/showcased';
COMMENT ON COLUMN podcasts.plays_count IS 'Number of times the podcast has been played';
COMMENT ON COLUMN podcasts.downloads_count IS 'Number of times the podcast has been downloaded';
COMMENT ON COLUMN podcasts.likes_count IS 'Number of likes/favorites for the podcast';
COMMENT ON COLUMN podcasts.audio_file_size IS 'Size of the audio file in bytes';
COMMENT ON COLUMN podcasts.cover_image_thumbnail IS 'Thumbnail version of the cover image';

-- Update RLS policies to include new columns if needed
-- Note: Existing policies should still work, but if you have specific policies for these fields, add them here

-- Sample data update (optional - uncomment if you want to add sample data)
/*
UPDATE podcasts 
SET 
    guest = 'John Doe',
    category_id = (SELECT id FROM categories WHERE slug = 'technology' LIMIT 1),
    episode_number = 1,
    season_number = 1,
    tags = ARRAY['technology', 'innovation', 'africa'],
    is_featured = true
WHERE title LIKE '%Tech%' AND guest IS NULL;
*/
