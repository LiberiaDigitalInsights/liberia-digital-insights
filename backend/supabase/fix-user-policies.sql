-- Fix User Table RLS Policies for Registration
-- Run this in your Supabase SQL Editor

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own registration" ON users;
DROP POLICY IF EXISTS "Allow anonymous registration" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Admins can do everything" ON users;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can view uploaded files" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads for testing" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete uploaded files" ON storage.objects;

-- Simple policies for testing
CREATE POLICY "Allow anonymous registration" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- For now, disable RLS on users table to allow registration
-- Re-enable later when we have proper auth flow
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Create simple storage policies
CREATE POLICY "Anyone can view uploaded files" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Allow uploads for testing" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'uploads');
