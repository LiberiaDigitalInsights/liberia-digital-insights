-- Add missing fields to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS registration_url TEXT,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS time TIME,
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN events.registration_url IS 'External URL for event registration';
COMMENT ON COLUMN events.end_date IS 'End date for multi-day events';
COMMENT ON COLUMN events.time IS 'Start time for the event';
COMMENT ON COLUMN events.price IS 'Event ticket price';

-- Update existing events with default values
UPDATE events SET 
  price = 0,
  time = '09:00:00'
WHERE price IS NULL OR time IS NULL;
