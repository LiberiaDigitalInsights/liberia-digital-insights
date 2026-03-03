-- Seed Data for Liberia Digital Insights
-- Run this in your Supabase SQL Editor after creating the schema

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Technology', 'technology', 'Latest in technology and digital innovation'),
('Business', 'business', 'Business insights and market analysis'),
('Innovation', 'innovation', 'Innovation trends and case studies'),
('Digital Transformation', 'digital-transformation', 'Digital transformation strategies'),
('Leadership', 'leadership', 'Leadership and management insights');

-- Insert sample articles
INSERT INTO articles (
  title, slug, excerpt, content, cover_image_url, category_id, author_id, status, tags, published_at
) VALUES
(
  'The Future of AI in African Business',
  'future-of-ai-in-african-business',
  'Exploring how artificial intelligence is transforming business landscapes across Africa.',
  '<h2>The AI Revolution in Africa</h2><p>Artificial intelligence is no longer a futuristic concept; it''s a present-day reality that''s reshaping how African businesses operate.</p>',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'technology'),
  (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1),
  'published',
  ARRAY['AI', 'Technology', 'Business', 'Africa'],
  NOW()
),
(
  'Digital Banking Revolution in Liberia',
  'digital-banking-revolution-liberia',
  'How mobile banking and digital payments are transforming financial services in Liberia.',
  '<h2>The Digital Banking Transformation</h2><p>Liberia is experiencing a remarkable transformation in its banking sector, driven by mobile technology.</p>',
  'https://images.unsplash.com/photo-1563986768494-8dee0e561f93?w=800&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'business'),
  (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1),
  'published',
  ARRAY['Banking', 'Fintech', 'Liberia', 'Digital'],
  NOW()
);

-- Insert sample insights
INSERT INTO insights (
  title, slug, excerpt, content, cover_image_url, category_id, author_id, status, tags, published_at
) VALUES
(
  '5G Deployment: Opportunities for African Markets',
  '5g-deployment-opportunities-african-markets',
  'Analyzing the potential impact of 5G technology on African economies and businesses.',
  '<h2>The 5G Opportunity</h2><p>The rollout of 5G technology presents unprecedented opportunities for African markets.</p>',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'technology'),
  (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1),
  'published',
  ARRAY['5G', 'Technology', 'Telecom', 'Africa'],
  NOW()
),
(
  'Blockchain Technology in African Supply Chains',
  'blockchain-technology-african-supply-chains',
  'How blockchain is improving transparency and efficiency in African supply chain management.',
  '<h2>Blockchain Revolution</h2><p>Blockchain technology is transforming supply chain management across Africa.</p>',
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'innovation'),
  (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1),
  'published',
  ARRAY['Blockchain', 'Supply Chain', 'Technology', 'Africa'],
  NOW()
);

-- Insert sample podcasts
INSERT INTO podcasts (
  title, slug, description, audio_url, transcript, youtube_url, spotify_url, apple_podcasts_url,
  cover_image_url, duration, episode_number, season_number, status, published_at
) VALUES
(
  'Tech Talk Africa: Episode 1',
  'tech-talk-africa-episode-1',
  'Exploring the latest technology trends and innovations across the African continent.',
  'https://example.com/audio/tech-talk-africa-ep1.mp3',
  'Welcome to Tech Talk Africa, your weekly dose of technology insights from across the continent.',
  'https://youtube.com/watch?v=example1',
  'https://spotify.com/episode/example1',
  'https://podcasts.apple.com/example1',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=800&fit=crop',
  '45:30',
  1,
  1,
  'published',
  NOW()
),
(
  'Digital Innovation Leaders: Episode 2',
  'digital-innovation-leaders-episode-2',
  'Interview with leading entrepreneurs driving digital transformation in Africa.',
  'https://example.com/audio/digital-innovation-leaders-ep2.mp3',
  'In this episode, we sit down with Sarah Johnson, CEO of Innovate Africa.',
  'https://youtube.com/watch?v=example2',
  'https://spotify.com/episode/example2',
  'https://podcasts.apple.com/example2',
  'https://images.unsplash.com/photo-1590602847861-35e3d822bc86?w=800&h=800&fit=crop',
  '38:15',
  2,
  1,
  'published',
  NOW()
);

-- Insert sample events
INSERT INTO events (
  title, slug, description, cover_image_url, date, location, category, max_attendees, status
) VALUES
(
  'Africa Tech Summit 2024',
  'africa-tech-summit-2024',
  'Annual gathering of tech leaders, innovators, and investors from across Africa and beyond.',
  'https://images.unsplash.com/photo-1540575137025-6a3a5464a1e9?w=800&h=400&fit=crop',
  '2024-06-15',
  'Monrovia, Liberia',
  'Conference',
  500,
  'upcoming'
),
(
  'Digital Marketing Workshop',
  'digital-marketing-workshop',
  'Hands-on workshop for businesses looking to enhance their digital marketing strategies.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
  '2024-05-20',
  'Virtual',
  'Workshop',
  100,
  'upcoming'
),
(
  'Startup Pitch Night',
  'startup-pitch-night',
  'Monthly event where startups pitch their ideas to investors and mentors.',
  'https://images.unsplash.com/photo-1553867515-3973b5986c3d?w=800&h=400&fit=crop',
  '2024-04-28',
  'Monrovia, Liberia',
  'Networking',
  150,
  'upcoming'
);

-- Insert sample training courses
INSERT INTO training (
  title, slug, description, cover_image_url, type, duration, instructor, max_students,
  start_date, end_date, status
) VALUES
(
  'Digital Marketing Fundamentals',
  'digital-marketing-fundamentals',
  'Comprehensive course covering the essentials of digital marketing for modern businesses.',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop',
  'course',
  '6 weeks',
  'Dr. Michael Chen',
  30,
  '2024-05-01',
  '2024-06-12',
  'upcoming'
),
(
  'Web Development Bootcamp',
  'web-development-bootcamp',
  'Intensive bootcamp for aspiring web developers covering modern technologies and best practices.',
  'https://images.unsplash.com/photo-1517183328658-6df75fbe76e6?w=800&h=400&fit=crop',
  'training',
  '8 weeks',
  'Sarah Williams',
  25,
  '2024-06-03',
  '2024-07-29',
  'upcoming'
),
(
  'Business Strategy Workshop',
  'business-strategy-workshop',
  'Two-day intensive workshop on strategic planning and business development.',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
  'workshop',
  '2 days',
  'Prof. James Mitchell',
  40,
  '2024-05-15',
  '2024-05-16',
  'upcoming'
);

-- Insert sample newsletters
INSERT INTO newsletters (
  subject, preview, content, cover_image_url, scheduled_date, status
) VALUES
(
  'Weekly Tech Digest: AI Innovations in Africa',
  'This week we explore how AI is transforming healthcare, agriculture, and finance across the African continent.',
  '<h2>AI Innovations Across Africa</h2><p>Welcome to this week''s Tech Digest! We''re excited to share some groundbreaking developments in AI.</p>',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop',
  NOW() + INTERVAL '1 day',
  'draft'
),
(
  'Business Insights: Digital Transformation Success Stories',
  'Learn how Liberian companies are successfully implementing digital transformation strategies.',
  '<h2>Digital Transformation Success Stories</h2><p>In this edition, we highlight inspiring stories from Liberian businesses.</p>',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop',
  NOW() + INTERVAL '2 days',
  'draft'
);

-- Update view counts for testing
UPDATE articles SET view_count = floor(random() * 1000) + 50 WHERE view_count = 0;
UPDATE insights SET view_count = floor(random() * 500) + 25 WHERE view_count = 0;

-- Set some current attendees for events
UPDATE events SET current_attendees = floor(max_attendees * 0.3) WHERE current_attendees = 0;

-- Set some current students for training
UPDATE training SET current_students = floor(max_students * 0.4) WHERE current_students = 0;
