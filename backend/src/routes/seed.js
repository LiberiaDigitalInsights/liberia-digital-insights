import express from "express";
import { supabase } from "../supabaseClient.js";
import { verifyToken, authorize } from "../middleware/rbacMiddleware.js";

const router = express.Router();

// Seed database with sample data (Admin only)
router.post("/", verifyToken, authorize(["admin"]), async (req, res) => {
  try {
    console.log("🌱 Starting database seeding...");

    // Insert categories
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .upsert([
        {
          name: "Technology",
          slug: "technology",
          description: "Latest in technology and digital innovation",
        },
        {
          name: "Business",
          slug: "business",
          description: "Business insights and market analysis",
        },
        {
          name: "Innovation",
          slug: "innovation",
          description: "Innovation trends and case studies",
        },
        {
          name: "Digital Transformation",
          slug: "digital-transformation",
          description: "Digital transformation strategies",
        },
        {
          name: "Leadership",
          slug: "leadership",
          description: "Leadership and management insights",
        },
      ])
      .select();

    if (catError) {
      console.error("❌ Categories error:", catError);
      return res
        .status(500)
        .json({ error: "Failed to seed categories", details: catError });
    }

    console.log(`✅ Inserted ${categories.length} categories`);

    // Get the first category ID for articles
    const techCategory = categories.find((c) => c.slug === "technology");
    const categoryId = techCategory?.id || categories[0]?.id;

    // Insert sample articles
    const { data: articles, error: artError } = await supabase
      .from("articles")
      .upsert([
        {
          title: "The Future of AI in African Business",
          slug: "future-of-ai-in-african-business",
          excerpt:
            "Exploring how artificial intelligence is transforming business landscapes across Africa.",
          content: `<h2>The AI Revolution in Africa</h2>
          <p>Artificial intelligence is no longer a futuristic concept; it's a present-day reality that's reshaping how African businesses operate.</p>
          <h3>Key Applications</h3>
          <ul>
            <li><strong>Fintech:</strong> AI-powered fraud detection and credit scoring</li>
            <li><strong>Agriculture:</strong> Predictive analytics for crop management</li>
            <li><strong>Healthcare:</strong> Diagnostic tools and treatment recommendations</li>
          </ul>`,
          cover_image_url:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
          category_id: categoryId,
          author_id: 1,
          status: "published",
          tags: ["AI", "Business", "Africa", "Technology"],
          published_at: new Date().toISOString(),
        },
        {
          title: "Digital Transformation in Liberia",
          slug: "digital-transformation-liberia",
          excerpt:
            "How Liberia is embracing digital technologies to drive economic growth and innovation.",
          content: `<h2>Liberia's Digital Journey</h2>
          <p>Liberia is undergoing a significant digital transformation, with technology playing a crucial role in various sectors.</p>
          <h3>Key Initiatives</h3>
          <ul>
            <li><strong>Education:</strong> Digital learning platforms and tools</li>
            <li><strong>Healthcare:</strong> Telemedicine and health information systems</li>
            <li><strong>Finance:</strong> Mobile banking and digital payments</li>
          </ul>`,
          cover_image_url:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
          category_id: categoryId,
          author_id: 1,
          status: "published",
          tags: ["Digital", "Liberia", "Transformation", "Technology"],
          published_at: new Date().toISOString(),
        },
      ])
      .select();

    if (artError) {
      console.error("❌ Articles error:", artError);
      return res
        .status(500)
        .json({ error: "Failed to seed articles", details: artError });
    }

    console.log(`✅ Inserted ${articles.length} articles`);

    // Insert sample podcasts
    const { data: podcasts, error: podError } = await supabase
      .from("podcasts")
      .upsert([
        {
          title: "Movement For Tech Liberia",
          slug: "movement-for-tech-liberia",
          description:
            "Exploring the technology movement in Liberia and its impact on society.",
          episode_number: 1,
          duration: "41:18",
          cover_image_url:
            "https://images.unsplash.com/photo-1478737918686-7d5cda5c6935?w=800&h=400&fit=crop",
          audio_url: "https://example.com/audio/episode1.mp3",
          author_id: 1,
          status: "published",
          tags: ["Liberia", "Technology", "Movement", "Society"],
          published_at: new Date().toISOString(),
        },
      ])
      .select();

    if (podError) {
      console.error("❌ Podcasts error:", podError);
      return res
        .status(500)
        .json({ error: "Failed to seed podcasts", details: podError });
    }

    console.log(`✅ Inserted ${podcasts.length} podcasts`);

    // Insert advertisements
    const { data: advertisements, error: advError } = await supabase
      .from("advertisements")
      .upsert([
        {
          title: "Basic Banner Ad",
          slug: "basic-banner-ad",
          description: "Standard leaderboard banner advertisement",
          type: "banner",
          image_url:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=728&h=90&fit=crop",
          target_url: "https://example.com",
          start_date: new Date().toISOString(),
          end_date: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 30 days from now
          status: "active",
          metadata: { size: "728x90", format: "PNG" },
        },
        {
          title: "Premium Sidebar Ad",
          slug: "premium-sidebar-ad",
          description: "Large sidebar advertisement placement",
          type: "sidebar",
          image_url:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=250&fit=crop",
          target_url: "https://example.com",
          start_date: new Date().toISOString(),
          end_date: new Date(
            Date.now() + 60 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 60 days from now
          status: "active",
          metadata: { size: "300x250", format: "PNG" },
        },
      ])
      .select();

    if (advError) {
      console.error("❌ Advertisements error:", advError);
      return res
        .status(500)
        .json({ error: "Failed to seed advertisements", details: advError });
    }

    console.log(`✅ Inserted ${advertisements.length} advertisements`);

    res.json({
      message: "Database seeded successfully!",
      data: {
        categories: categories.length,
        articles: articles.length,
        podcasts: podcasts.length,
        advertisements: advertisements.length,
      },
    });
  } catch (error) {
    console.error("❌ Seeding error:", error);
    res.status(500).json({ error: "Seeding failed", details: error.message });
  }
});

export default router;
