-- Update URL field lengths to handle longer Supabase URLs
-- Run this migration in Supabase SQL editor

-- Increase URL field lengths from 500 to 1000 characters
ALTER TABLE podcasts 
ALTER COLUMN audio_url TYPE VARCHAR(1000),
ALTER COLUMN video_url TYPE VARCHAR(1000),
ALTER COLUMN youtube_url TYPE VARCHAR(1000),
ALTER COLUMN facebook_url TYPE VARCHAR(1000),
ALTER COLUMN spotify_url TYPE VARCHAR(1000),
ALTER COLUMN apple_podcasts_url TYPE VARCHAR(1000),
ALTER COLUMN cover_image_url TYPE VARCHAR(1000);

-- Also update other tables that might have long URLs
ALTER TABLE articles 
ALTER COLUMN cover_image_url TYPE VARCHAR(1000);

ALTER TABLE events 
ALTER COLUMN cover_image_url TYPE VARCHAR(1000);

ALTER TABLE training 
ALTER COLUMN cover_image_url TYPE VARCHAR(1000);

ALTER TABLE newsletters 
ALTER COLUMN cover_image_url TYPE VARCHAR(1000);

ALTER TABLE users 
ALTER COLUMN avatar_url TYPE VARCHAR(1000);
