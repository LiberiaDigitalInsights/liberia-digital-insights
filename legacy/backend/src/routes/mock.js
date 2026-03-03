import express from "express";

const router = express.Router();

// Mock data for testing
const mockCategories = [
  { id: 1, name: "Technology", slug: "technology", description: "Latest in technology and digital innovation" },
  { id: 2, name: "Business", slug: "business", description: "Business insights and market analysis" },
  { id: 3, name: "Innovation", slug: "innovation", description: "Innovation trends and case studies" },
  { id: 4, name: "Digital Transformation", slug: "digital-transformation", description: "Digital transformation strategies" },
  { id: 5, name: "Leadership", slug: "leadership", description: "Leadership and management insights" }
];

const mockArticles = [
  {
    id: 1,
    title: "The Future of AI in African Business",
    slug: "future-of-ai-in-african-business",
    excerpt: "Exploring how artificial intelligence is transforming business landscapes across Africa.",
    content: "<h2>The AI Revolution in Africa</h2><p>Artificial intelligence is reshaping African business landscapes.</p>",
    cover_image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    category_id: 1,
    category: { id: 1, name: "Technology", slug: "technology" },
    author_id: 1,
    author: { id: 1, name: "Admin", email: "admin@ldi.com" },
    status: "published",
    tags: ["AI", "Business", "Africa"],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Digital Transformation in Liberia",
    slug: "digital-transformation-liberia",
    excerpt: "How Liberia is embracing digital technologies to drive economic growth.",
    content: "<h2>Liberia's Digital Journey</h2><p>Liberia is undergoing significant digital transformation.</p>",
    cover_image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    category_id: 1,
    category: { id: 1, name: "Technology", slug: "technology" },
    author_id: 1,
    author: { id: 1, name: "Admin", email: "admin@ldi.com" },
    status: "published",
    tags: ["Digital", "Liberia", "Transformation"],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Innovation in African Tech Startups",
    slug: "innovation-african-tech-startups",
    excerpt: "A look at innovative tech startups emerging across Africa.",
    content: "<h2>African Startup Innovation</h2><p>Tech startups across Africa are driving innovation.</p>",
    cover_image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    category_id: 3,
    category: { id: 3, name: "Innovation", slug: "innovation" },
    author_id: 1,
    author: { id: 1, name: "Admin", email: "admin@ldi.com" },
    status: "published",
    tags: ["Innovation", "Startups", "Africa", "Tech"],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    title: "Mobile Banking Revolution in West Africa",
    slug: "mobile-banking-revolution-west-africa",
    excerpt: "How mobile banking is transforming financial services across West Africa.",
    content: "<h2>Mobile Banking Transformation</h2><p>West Africa is leading the mobile banking revolution.</p>",
    cover_image_url: "https://images.unsplash.com/photo-1563986768494-4eba27dcfae4?w=800&h=400&fit=crop",
    category_id: 2,
    category: { id: 2, name: "Business", slug: "business" },
    author_id: 1,
    author: { id: 1, name: "Admin", email: "admin@ldi.com" },
    status: "published",
    tags: ["Banking", "Mobile", "West Africa", "Finance"],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    title: "Leadership in Digital Era",
    slug: "leadership-digital-era",
    excerpt: "Modern leadership strategies for the digital transformation age.",
    content: "<h2>Digital Leadership</h2><p>Leadership strategies are evolving in the digital era.</p>",
    cover_image_url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop",
    category_id: 5,
    category: { id: 5, name: "Leadership", slug: "leadership" },
    author_id: 1,
    author: { id: 1, name: "Admin", email: "admin@ldi.com" },
    status: "published",
    tags: ["Leadership", "Digital", "Management", "Strategy"],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 6,
    title: "E-commerce Growth in Africa",
    slug: "ecommerce-growth-africa",
    excerpt: "The rapid expansion of e-commerce platforms across the African continent.",
    content: "<h2>E-commerce Expansion</h2><p>Africa's e-commerce sector is experiencing rapid growth.</p>",
    cover_image_url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
    category_id: 2,
    category: { id: 2, name: "Business", slug: "business" },
    author_id: 1,
    author: { id: 1, name: "Admin", email: "admin@ldi.com" },
    status: "published",
    tags: ["E-commerce", "Africa", "Business", "Growth"],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 7,
    title: "Blockchain Technology in Liberia",
    slug: "blockchain-technology-liberia",
    excerpt: "Exploring blockchain applications and potential in Liberia's digital economy.",
    content: "<h2>Blockchain in Liberia</h2><p>Blockchain technology offers new opportunities for Liberia.</p>",
    cover_image_url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
    category_id: 4,
    category: { id: 4, name: "Digital Transformation", slug: "digital-transformation" },
    author_id: 1,
    author: { id: 1, name: "Admin", email: "admin@ldi.com" },
    status: "published",
    tags: ["Blockchain", "Liberia", "Technology", "Innovation"],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 8,
    title: "EdTech Solutions for African Schools",
    slug: "edtech-solutions-african-schools",
    excerpt: "How educational technology is transforming learning across African schools.",
    content: "<h2>EdTech Transformation</h2><p>Educational technology is revolutionizing African schools.</p>",
    cover_image_url: "https://images.unsplash.com/photo-1581291518857-6e9ab6d5e8e4?w=800&h=400&fit=crop",
    category_id: 1,
    category: { id: 1, name: "Technology", slug: "technology" },
    author_id: 1,
    author: { id: 1, name: "Admin", email: "admin@ldi.com" },
    status: "published",
    tags: ["EdTech", "Education", "Africa", "Technology"],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockPodcasts = [
  {
    id: 1,
    title: "Movement For Tech Liberia",
    slug: "movement-for-tech-liberia",
    description: "Exploring the technology movement in Liberia and its impact on society.",
    episode_number: 1,
    duration: "41:18",
    cover_image_url: "https://images.unsplash.com/photo-1478737918686-7d5cda5c6935?w=800&h=400&fit=crop",
    audio_url: "https://example.com/audio/episode1.mp3",
    author_id: 1,
    author: { id: 1, name: "Admin", email: "admin@ldi.com" },
    status: "published",
    tags: ["Liberia", "Technology", "Movement"],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Digital Innovation in Africa",
    slug: "digital-innovation-africa",
    description: "A deep dive into digital innovation trends across the African continent.",
    episode_number: 2,
    duration: "35:42",
    cover_image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    audio_url: "https://example.com/audio/episode2.mp3",
    author_id: 1,
    author: { id: 1, name: "Admin", email: "admin@ldi.com" },
    status: "published",
    tags: ["Africa", "Innovation", "Digital", "Technology"],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Startup Stories from West Africa",
    slug: "startup-stories-west-africa",
    description: "Inspiring stories from startup founders across West Africa.",
    episode_number: 3,
    duration: "28:55",
    cover_image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    audio_url: "https://example.com/audio/episode3.mp3",
    author_id: 1,
    author: { id: 1, name: "Admin", email: "admin@ldi.com" },
    status: "published",
    tags: ["Startups", "West Africa", "Entrepreneurship", "Stories"],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock categories endpoint
router.get("/categories", (req, res) => {
  res.json({ 
    data: mockCategories,
    pagination: { total: mockCategories.length }
  });
});

// Mock articles endpoint
router.get("/articles", (req, res) => {
  const { page = 1, limit = 12, category } = req.query;
  let filteredArticles = mockArticles;
  
  if (category && category !== 'all') {
    filteredArticles = mockArticles.filter(article => 
      article.category.slug === category
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedArticles,
    pagination: {
      total: filteredArticles.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredArticles.length / limit)
    }
  });
});

// Mock single article endpoint
router.get("/articles/:slug", (req, res) => {
  const { slug } = req.params;
  const article = mockArticles.find(a => a.slug === slug);
  
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }
  
  res.json({ data: article });
});

// Mock podcasts endpoint
router.get("/podcasts", (req, res) => {
  const { limit = 3 } = req.query;
  const limitedPodcasts = mockPodcasts.slice(0, parseInt(limit));
  
  res.json({
    data: limitedPodcasts,
    pagination: { total: mockPodcasts.length }
  });
});

// Mock podcast by slug endpoint
router.get("/podcasts/slug/:slug", (req, res) => {
  const { slug } = req.params;
  
  // Forward to database route since mock doesn't have individual podcast data
  res.status(404).json({ error: "Podcast not found" });
});

// Mock events endpoint
router.get("/events", (req, res) => {
  const mockEvents = [
    {
      id: 1,
      title: "Liberia Tech Summit 2024",
      slug: "liberia-tech-summit-2024",
      description: "Annual technology summit bringing together innovators and entrepreneurs.",
      start_date: "2024-12-15T09:00:00Z",
      end_date: "2024-12-17T18:00:00Z",
      location: "Monrovia, Liberia",
      cover_image_url: "https://images.unsplash.com/photo-1540575137065-7a9e7e1a41f5?w=800&h=400&fit=crop",
      organizer_id: 1,
      status: "published",
      tags: ["Tech", "Summit", "Liberia", "Innovation"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      title: "Digital Innovation Workshop",
      slug: "digital-innovation-workshop",
      description: "Hands-on workshop for digital transformation strategies.",
      start_date: "2024-11-20T10:00:00Z",
      end_date: "2024-11-20T16:00:00Z",
      location: "Virtual",
      cover_image_url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=400&fit=crop",
      organizer_id: 1,
      status: "published",
      tags: ["Workshop", "Digital", "Innovation", "Virtual"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  res.json({
    data: mockEvents,
    pagination: { total: mockEvents.length }
  });
});

// Mock newsletters endpoint
router.get("/newsletters", (req, res) => {
  const mockNewsletters = [
    {
      id: 1,
      title: "Weekly Tech Digest - November 2024",
      slug: "weekly-tech-digest-november-2024",
      subject: "Latest in African Tech and Innovation",
      content: "<h2>This Week in Tech</h2><p>Top stories from African tech ecosystem...</p>",
      cover_image_url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop",
      author_id: 1,
      status: "published",
      tags: ["Tech", "Weekly", "Digest", "Africa"],
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      title: "Innovation Spotlight - Liberia",
      slug: "innovation-spotlight-liberia",
      subject: "Celebrating Liberian Innovation",
      content: "<h2>Liberian Innovators</h2><p>Featuring amazing stories from Liberia...</p>",
      cover_image_url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=400&fit=crop",
      author_id: 1,
      status: "published",
      tags: ["Innovation", "Liberia", "Spotlight", "Stories"],
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  res.json({
    data: mockNewsletters,
    pagination: { total: mockNewsletters.length }
  });
});

// Mock advertisements endpoint
router.get("/advertisements", (req, res) => {
  const mockAdvertisements = [
    {
      id: "1",
      title: "Basic Banner Ad",
      slug: "basic-banner-ad",
      description: "Standard leaderboard banner advertisement",
      type: "banner",
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=728&h=90&fit=crop",
      target_url: "https://example.com",
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      metadata: { size: "728x90", format: "PNG" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "2",
      title: "Premium Sidebar Ad",
      slug: "premium-sidebar-ad",
      description: "Large sidebar advertisement placement",
      type: "sidebar",
      image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=250&fit=crop",
      target_url: "https://example.com",
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      metadata: { size: "300x250", format: "PNG" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  res.json({
    advertisements: mockAdvertisements,
    pagination: { total: mockAdvertisements.length }
  });
});

// Mock advertisement slug endpoint
router.get("/advertisements/slug/:slug", (req, res) => {
  const { slug } = req.params;
  const mockAdvertisements = [
    {
      id: "1",
      title: "Basic Banner Ad",
      slug: "basic-banner-ad",
      description: "Standard leaderboard banner advertisement",
      type: "banner",
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=728&h=90&fit=crop",
      target_url: "https://example.com",
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      metadata: { size: "728x90", format: "PNG" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "2",
      title: "Premium Sidebar Ad",
      slug: "premium-sidebar-ad",
      description: "Large sidebar advertisement placement",
      type: "sidebar",
      image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=250&fit=crop",
      target_url: "https://example.com",
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      metadata: { size: "300x250", format: "PNG" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  const advertisement = mockAdvertisements.find(ad => ad.slug === slug);
  
  if (!advertisement) {
    return res.status(404).json({ error: "Advertisement not found" });
  }
  
  res.json({ advertisement });
});

export default router;
