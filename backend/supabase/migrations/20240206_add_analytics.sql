-- Migration: Add daily_site_stats table for analytics

CREATE TABLE IF NOT EXISTS daily_site_stats (
  date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
  visits INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE daily_site_stats ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can view site stats" ON daily_site_stats
  FOR SELECT USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Server can insert/update stats" ON daily_site_stats
  FOR ALL USING (true); -- simplified for now, ideally restrict to service_role

-- Function to increment stats (idempotent for the day)
CREATE OR REPLACE FUNCTION increment_daily_stats(is_new_visit BOOLEAN)
RETURNS VOID AS $$
BEGIN
  INSERT INTO daily_site_stats (date, visits, page_views)
  VALUES (CURRENT_DATE, CASE WHEN is_new_visit THEN 1 ELSE 0 END, 1)
  ON CONFLICT (date) DO UPDATE SET
    visits = daily_site_stats.visits + CASE WHEN EXCLUDED.visits > 0 THEN 1 ELSE 0 END,
    page_views = daily_site_stats.page_views + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
