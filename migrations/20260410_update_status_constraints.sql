-- Update status constraints for all content tables to support Archiving and Pending states

DO $$ 
BEGIN
    -- Articles
    ALTER TABLE IF EXISTS articles DROP CONSTRAINT IF EXISTS articles_status_check;
    ALTER TABLE IF EXISTS articles ADD CONSTRAINT articles_status_check CHECK (status IN ('draft', 'published', 'archived', 'pending'));

    -- Podcasts
    ALTER TABLE IF EXISTS podcasts DROP CONSTRAINT IF EXISTS podcasts_status_check;
    ALTER TABLE IF EXISTS podcasts ADD CONSTRAINT podcasts_status_check CHECK (status IN ('draft', 'published', 'archived', 'pending'));

    -- Events
    ALTER TABLE IF EXISTS events DROP CONSTRAINT IF EXISTS events_status_check;
    ALTER TABLE IF EXISTS events ADD CONSTRAINT events_status_check CHECK (status IN ('draft', 'published', 'archived', 'pending', 'upcoming', 'completed'));

    -- Insights
    ALTER TABLE IF EXISTS insights DROP CONSTRAINT IF EXISTS insights_status_check;
    ALTER TABLE IF EXISTS insights ADD CONSTRAINT insights_status_check CHECK (status IN ('draft', 'published', 'archived', 'pending'));
END $$;
