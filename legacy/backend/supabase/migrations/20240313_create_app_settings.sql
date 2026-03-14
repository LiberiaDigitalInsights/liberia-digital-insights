-- Create app_settings table for global platform configuration
CREATE TABLE IF NOT EXISTS app_settings (
  key VARCHAR(255) PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Policies
-- Admins can do everything
CREATE POLICY "Admins can do everything on app_settings" ON app_settings
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Editors can view settings
CREATE POLICY "Editors can view app_settings" ON app_settings
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'editor')
    )
  );

-- Insert default global settings if not exists
INSERT INTO app_settings (key, value)
VALUES ('global', '{
  "siteName": "Liberia Digital Insights",
  "siteDescription": "Digital innovation and technology insights from Liberia",
  "contactEmail": "contact@liberiadigitalinsights.com",
  "adminEmail": "admin@liberiadigitalinsights.com",
  "metaDescription": "Leading source for digital transformation and technology trends in Liberia.",
  "keywords": "technology, liberia, digital insights, innovation",
  "facebook": "https://facebook.com",
  "twitter": "https://twitter.com",
  "linkedin": "https://linkedin.com",
  "youtube": "https://youtube.com",
  "smtpHost": "smtp.gmail.com",
  "smtpPort": "587",
  "smtpSecure": true,
  "enableCaching": true,
  "imageOptimization": true,
  "analyticsTracking": true,
  "lazyLoading": true,
  "enable2FA": false,
  "sessionTimeout": 24,
  "maxLoginAttempts": 5
}'::jsonb)
ON CONFLICT (key) DO NOTHING;
