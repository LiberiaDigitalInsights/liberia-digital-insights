-- Gallery Table Schema for Liberia Digital Insights
-- Run this in your Supabase SQL Editor before running the seed data

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  event_type VARCHAR(20) CHECK (event_type IN ('event', 'podcast')),
  event_id UUID,
  category VARCHAR(100),
  tags TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: Foreign key constraints are handled at the application level
-- since PostgreSQL doesn't support conditional foreign keys based on another column
-- The event_id can reference either events.id or podcasts.id depending on event_type

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_type ON gallery(type);
CREATE INDEX IF NOT EXISTS idx_gallery_event_type ON gallery(event_type);
CREATE INDEX IF NOT EXISTS idx_gallery_event_id ON gallery(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_featured ON gallery(featured);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_tags ON gallery USING GIN(tags);

-- Add RLS (Row Level Security) policies
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (everyone can view gallery items)
CREATE POLICY "Gallery items are viewable by everyone" ON gallery
  FOR SELECT USING (true);

-- Policy for authenticated users to create gallery items
CREATE POLICY "Authenticated users can create gallery items" ON gallery
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for admins and editors to update gallery items
CREATE POLICY "Admins and editors can update gallery items" ON gallery
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND 
    (auth.jwt() ->> 'role' IN ('admin', 'editor'))
  );

-- Policy for admins to delete gallery items
CREATE POLICY "Admins can delete gallery items" ON gallery
  FOR DELETE USING (
    auth.role() = 'authenticated' AND 
    auth.jwt() ->> 'role' = 'admin'
  );

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_gallery_updated_at
  BEFORE UPDATE ON gallery
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE gallery IS 'Gallery items including images and videos from events and podcasts';
COMMENT ON COLUMN gallery.title IS 'Title of the gallery item';
COMMENT ON COLUMN gallery.description IS 'Description of the gallery item';
COMMENT ON COLUMN gallery.type IS 'Type of media: image or video';
COMMENT ON COLUMN gallery.url IS 'URL to the full-size image or video';
COMMENT ON COLUMN gallery.thumbnail_url IS 'URL to the thumbnail image';
COMMENT ON COLUMN gallery.event_type IS 'Type of associated event: event or podcast';
COMMENT ON COLUMN gallery.event_id IS 'ID of the associated event or podcast';
COMMENT ON COLUMN gallery.category IS 'Category for organizing gallery items';
COMMENT ON COLUMN gallery.tags IS 'Array of tags for filtering and search';
COMMENT ON COLUMN gallery.featured IS 'Whether this item should be featured prominently';
