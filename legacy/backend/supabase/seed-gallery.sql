-- Gallery Seed Data for Liberia Digital Insights
-- Run this in your Supabase SQL Editor after creating the schema and other seed data

-- Insert sample gallery items linked to events and podcasts
INSERT INTO gallery (
  title, description, type, url, thumbnail_url, event_type, event_id, category, tags, featured, created_at
) VALUES
-- Event Gallery Items
(
  'Africa Tech Summit 2024 - Opening Ceremony',
  'The grand opening of Africa Tech Summit 2024 with keynote speakers and VIP guests.',
  'image',
  'https://images.unsplash.com/photo-1540575137025-6a3a5464a1e9?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1540575137025-6a3a5464a1e9?w=400&h=300&fit=crop',
  'event',
  (SELECT id FROM events WHERE slug = 'africa-tech-summit-2024'),
  'Conference',
  ARRAY['summit', 'opening', 'keynote', 'tech'],
  true,
  NOW()
),
(
  'Africa Tech Summit 2024 - Panel Discussion',
  'Expert panel discussing the future of technology in Africa.',
  'image',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop',
  'event',
  (SELECT id FROM events WHERE slug = 'africa-tech-summit-2024'),
  'Conference',
  ARRAY['panel', 'discussion', 'experts', 'future'],
  false,
  NOW()
),
(
  'Africa Tech Summit 2024 - Networking Session',
  'Attendees networking and building connections during the summit.',
  'image',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c06c4?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c06c4?w=400&h=300&fit=crop',
  'event',
  (SELECT id FROM events WHERE slug = 'africa-tech-summit-2024'),
  'Conference',
  ARRAY['networking', 'connections', 'community'],
  false,
  NOW()
),
(
  'Africa Tech Summit 2024 - Highlights Video',
  'Official highlights video showcasing the best moments from Africa Tech Summit 2024.',
  'video',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://images.unsplash.com/photo-1540575137025-6a3a5464a1e9?w=400&h=300&fit=crop',
  'event',
  (SELECT id FROM events WHERE slug = 'africa-tech-summit-2024'),
  'Conference',
  ARRAY['highlights', 'video', 'recap'],
  true,
  NOW()
),

-- Startup Pitch Night Gallery Items
(
  'Startup Pitch Night - Winner Announcement',
  'The winning team celebrating their victory at Startup Pitch Night.',
  'image',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
  'event',
  (SELECT id FROM events WHERE slug = 'startup-pitch-night'),
  'Pitch Event',
  ARRAY['winner', 'celebration', 'pitch', 'startup'],
  true,
  NOW()
),
(
  'Startup Pitch Night - Team Presentation',
  'One of the startup teams presenting their innovative idea to the judges.',
  'image',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
  'event',
  (SELECT id FROM events WHERE slug = 'startup-pitch-night'),
  'Pitch Event',
  ARRAY['presentation', 'innovation', 'judges'],
  false,
  NOW()
),

-- Podcast Gallery Items
(
  'Tech Talk Africa - Episode 1 Thumbnail',
  'Official thumbnail for Tech Talk Africa Episode 1 featuring AI discussion.',
  'image',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
  'podcast',
  (SELECT id FROM podcasts WHERE slug = 'tech-talk-africa-episode-1'),
  'Podcast',
  ARRAY['thumbnail', 'tech-talk', 'episode-1'],
  false,
  NOW()
),
(
  'Tech Talk Africa - Episode 1 Behind the Scenes',
  'Behind the scenes footage from the recording of Tech Talk Africa Episode 1.',
  'video',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
  'podcast',
  (SELECT id FROM podcasts WHERE slug = 'tech-talk-africa-episode-1'),
  'Podcast',
  ARRAY['behind-the-scenes', 'recording', 'bts'],
  false,
  NOW()
),
(
  'Tech Talk Africa - Episode 2 Studio Setup',
  'Studio setup and preparation for recording Tech Talk Africa Episode 2.',
  'image',
  'https://images.unsplash.com/photo-1590602817864-4c9c5ec9ce5e?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1590602817864-4c9c5ec9ce5e?w=400&h=300&fit=crop',
  'podcast',
  (SELECT id FROM podcasts WHERE slug = 'tech-talk-africa-episode-2'),
  'Podcast',
  ARRAY['studio', 'setup', 'preparation'],
  false,
  NOW()
),

-- Innovation Workshop Gallery Items
(
  'Innovation Workshop - Group Activity',
  'Participants working together on an innovation exercise during the workshop.',
  'image',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
  'event',
  (SELECT id FROM events WHERE slug = 'innovation-workshop'),
  'Workshop',
  ARRAY['workshop', 'collaboration', 'innovation'],
  false,
  NOW()
),
(
  'Innovation Workshop - Presentation',
  'Workshop facilitator presenting innovation methodologies to participants.',
  'image',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
  'event',
  (SELECT id FROM events WHERE slug = 'innovation-workshop'),
  'Workshop',
  ARRAY['presentation', 'facilitator', 'methodology'],
  false,
  NOW()
),

-- Additional Gallery Items without event/podcast links
(
  'Team Building Activity',
  'LDI team building activity at a local outdoor venue.',
  'image',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
  NULL,
  NULL,
  'Team Building',
  ARRAY['team', 'building', 'activity', 'outdoor'],
  false,
  NOW()
),
(
  'Office Tour - New Space',
  'Tour of our new office space in Monrovia.',
  'video',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://images.unsplash.com/photo-1497366754085-fcff917b2c25?w=400&h=300&fit=crop',
  NULL,
  NULL,
  'Office',
  ARRAY['office', 'tour', 'new-space', 'monrovia'],
  false,
  NOW()
),
(
  'Community Outreach - Local School',
  'LDI team conducting technology workshop at a local school.',
  'image',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop',
  NULL,
  NULL,
  'Community',
  ARRAY['outreach', 'education', 'school', 'workshop'],
  true,
  NOW()
),
(
  'Guest Lecture - University Visit',
  'Guest lecture on digital transformation at University of Liberia.',
  'image',
  'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
  NULL,
  NULL,
  'Education',
  ARRAY['lecture', 'university', 'education', 'digital'],
  false,
  NOW()
),
(
  'Product Launch - New App',
  'Launch event for our new mobile application.',
  'image',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
  NULL,
  NULL,
  'Product Launch',
  ARRAY['launch', 'app', 'mobile', 'product'],
  true,
  NOW()
),
(
  'Awards Ceremony 2024',
  'Annual awards ceremony recognizing outstanding contributors.',
  'image',
  'https://images.unsplash.com/photo-1511792444207-f6fba0843497?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1511792444207-f6fba0843497?w=400&h=300&fit=crop',
  NULL,
  NULL,
  'Awards',
  ARRAY['awards', 'ceremony', 'recognition', '2024'],
  false,
  NOW()
);

-- Update the gallery items count for statistics
-- This will help populate the gallery with meaningful content for testing
DO $$
DECLARE
  gallery_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO gallery_count FROM gallery;
  RAISE NOTICE 'Gallery seed completed. Total gallery items: %', gallery_count;
END $$;
