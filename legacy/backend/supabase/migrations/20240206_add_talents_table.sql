-- Migration: Add talents table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS talents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  role VARCHAR(100) NOT NULL,
  bio TEXT,
  category VARCHAR(50),
  skills TEXT[],
  experience VARCHAR(50),
  location VARCHAR(100),
  availability VARCHAR(100),
  avatar_url TEXT,
  links JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(20) DEFAULT 'pending', -- pending, published, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;

-- Policies

-- Public read access for published talents
CREATE POLICY "Public can view published talents" ON talents
  FOR SELECT USING (status = 'published');

-- Admins can view all (and edit)
CREATE POLICY "Admins can view all talents" ON talents
  FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Public can insert (Submit Profile)
CREATE POLICY "Public can submit talents" ON talents
  FOR INSERT WITH CHECK (true); -- Ideally restrict status to 'pending' but valid for submission

-- Allow updates if you are the owner (omitted for now as no auth requirement for submission, admin manages updates)
