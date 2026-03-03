-- Seed Categories for Liberia Digital Insights
-- This script inserts categories from the Categories.md documentation
-- Uses INSERT ... ON CONFLICT to avoid duplicates

INSERT INTO categories (name, slug, description) VALUES
  ('Technology', 'technology', 'News and insights on digital tools, gadgets, and IT developments.'),
  ('Entrepreneurship', 'entrepreneurship', 'Focused on startups, small business tips, and inspiring success stories.'),
  ('Digital Transformation', 'digital-transformation', 'Covers how businesses and individuals in Liberia are adopting digital solutions.'),
  ('E-Commerce', 'e-commerce', 'Topics on online shopping, digital payments, and online businesses in Liberia.'),
  ('Telecommunications', 'telecommunications', 'News on internet services, telecom providers (like Starlink, Orange, and MTN), and infrastructure updates.'),
  ('Education & Digital Literacy', 'education-digital-literacy', 'Topics on improving digital skills, online education platforms, and tech courses available in Liberia.'),
  ('AI & Innovation', 'ai-innovation', 'Articles and discussions about Artificial Intelligence, emerging tech, and innovative projects.'),
  ('Social Media Trends', 'social-media-trends', 'Insights on social media usage in Liberia, trends, and effective online branding.'),
  ('Cybersecurity', 'cybersecurity', 'Topics covering data privacy, online safety, and best practices for digital security.'),
  ('Gaming & Entertainment', 'gaming-entertainment', 'Focused on gaming culture, digital entertainment, and related events.'),
  ('Business & Digital Economy', 'business-digital-economy', 'Updates on Liberia''s digital economy and its impact on traditional business models.'),
  ('Tech Policies & Governance', 'tech-policies-governance', 'Covers policies and regulations affecting technology and telecommunications in Liberia.'),
  ('Women in Tech', 'women-in-tech', 'Highlighting contributions and success stories of women in Liberia''s tech ecosystem.'),
  ('Startup Success Stories', 'startup-success-stories', 'Inspiring stories and achievements of Liberian startups and entrepreneurs.'),
  ('Events & Hackathons', 'events-hackathons', 'Information on upcoming events, competitions, and opportunities in the tech industry.'),
  ('Opinion & Editorials', 'opinion-editorials', 'Expert opinions and editorials about technology and its impact on Liberia.'),
  ('HealthTech', 'healthtech', 'Articles on technology''s role in improving healthcare delivery in Liberia.'),
  ('Environment & Sustainability in Tech', 'environment-sustainability-tech', 'Exploring tech''s impact on the environment and sustainable solutions.'),
  ('Tech for Social Good', 'tech-social-good', 'Stories about how technology is improving communities and social conditions in Liberia.')
ON CONFLICT (name) DO NOTHING;

-- Verify the categories were inserted
SELECT 
  id,
  name,
  slug,
  LEFT(description, 50) || '...' as description_preview,
  created_at
FROM categories 
ORDER BY name;
