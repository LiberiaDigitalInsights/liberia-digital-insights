-- Create notifications table for real-time admin alerts
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL means broadcast to all admins
  type TEXT NOT NULL, -- 'SYSTEM', 'CONTENT', 'USER', 'SECURITY'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Optimize for unread counts and recent notification lookups
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Enable Realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
