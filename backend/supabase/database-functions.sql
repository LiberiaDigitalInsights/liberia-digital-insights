-- Database Functions for Liberia Digital Insights
-- Run these SQL commands in your Supabase SQL Editor after creating tables

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(table_name TEXT, record_id UUID)
RETURNS void AS $$
BEGIN
  IF table_name = 'articles' THEN
    UPDATE articles SET view_count = view_count + 1 WHERE id = record_id;
  ELSIF table_name = 'insights' THEN
    UPDATE insights SET view_count = view_count + 1 WHERE id = record_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique slug (optional helper)
CREATE OR REPLACE FUNCTION generate_unique_slug(base_title TEXT, table_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  slug TEXT;
  counter INTEGER := 1;
BEGIN
  base_slug := lower(trim(regexp_replace(base_title, '[^a-z0-9\s-]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  slug := base_slug;
  
  LOOP
    IF table_name = 'articles' THEN
      IF NOT EXISTS (SELECT 1 FROM articles WHERE slug = slug) THEN
        RETURN slug;
      END IF;
    ELSIF table_name = 'insights' THEN
      IF NOT EXISTS (SELECT 1 FROM insights WHERE slug = slug) THEN
        RETURN slug;
      END IF;
    ELSIF table_name = 'podcasts' THEN
      IF NOT EXISTS (SELECT 1 FROM podcasts WHERE slug = slug) THEN
        RETURN slug;
      END IF;
    ELSIF table_name = 'events' THEN
      IF NOT EXISTS (SELECT 1 FROM events WHERE slug = slug) THEN
        RETURN slug;
      END IF;
    ELSIF table_name = 'training' THEN
      IF NOT EXISTS (SELECT 1 FROM training WHERE slug = slug) THEN
        RETURN slug;
      END IF;
    ELSIF table_name = 'newsletters' THEN
      IF NOT EXISTS (SELECT 1 FROM newsletters WHERE slug = slug) THEN
        RETURN slug;
      END IF;
    END IF;
    
    slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_view_count TO authenticated, anon;
GRANT EXECUTE ON FUNCTION generate_unique_slug TO authenticated, anon;

-- TEMPORARY: Allow uploads without authentication for testing
-- Remove this policy once authentication is implemented
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
CREATE POLICY "Allow uploads for testing" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'uploads'
  );

-- Also allow viewing uploaded files by anyone
DROP POLICY IF EXISTS "Anyone can view uploaded files" ON storage.objects;
CREATE POLICY "Anyone can view uploaded files" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');
