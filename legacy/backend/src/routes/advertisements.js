import { Router } from "express";
import { supabase } from "../supabaseClient.js";

const router = Router();

// GET /v1/advertisements - Get all advertisements
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("advertisements")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    if (type) {
      query = query.eq("type", type);
    }

    const { data, error, count } = await query;

    if (error) {
      // If table doesn't exist, return empty results
      if (error.message?.includes('schema cache') || error.code === 'PGRST116') {
        return res.json({
          advertisements: [],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            pages: 0,
          },
        });
      }
      throw error;
    }

    res.json({
      advertisements: data || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /v1/advertisements/slug/:slug - Get single advertisement by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from("advertisements")
      .select("*")
      .eq("slug", slug)
      .limit(1);

    if (error) {
      // If table doesn't exist, return 404
      if (error.message?.includes('schema cache') || error.code === 'PGRST116') {
        return res.status(404).json({ error: "Advertisement not found" });
      }
      throw error;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    res.json({ advertisement: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /v1/advertisements/:id - Get single advertisement
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("advertisements")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /v1/advertisements - Create new advertisement
router.post("/", async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      type,
      image_url,
      target_url,
      start_date,
      end_date,
      status = "active",
      metadata,
    } = req.body;

    const { data, error } = await supabase
      .from("advertisements")
      .insert([
        {
          title,
          slug,
          description,
          type,
          image_url,
          target_url,
          start_date,
          end_date,
          status,
          metadata,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /v1/advertisements/:id - Update advertisement
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("advertisements")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /v1/advertisements/:id - Delete advertisement
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("advertisements")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /v1/advertisements/seed - Seed advertisements table
router.post("/seed", async (req, res) => {
  try {
    console.log("🌱 Seeding advertisements...");

    const { data, error } = await supabase
      .from("advertisements")
      .upsert([
        {
          title: "Basic Banner Ad",
          slug: "basic-banner-ad",
          description: "Standard leaderboard banner advertisement",
          type: "banner",
          image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=728&h=90&fit=crop",
          target_url: "https://example.com",
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          status: "active",
          metadata: { size: "728x90", format: "PNG" }
        },
        {
          title: "Premium Sidebar Ad",
          slug: "premium-sidebar-ad",
          description: "Large sidebar advertisement placement",
          type: "sidebar",
          image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=250&fit=crop",
          target_url: "https://example.com",
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
          status: "active",
          metadata: { size: "300x250", format: "PNG" }
        },
        {
          title: "Featured Homepage Ad",
          slug: "featured-homepage-ad",
          description: "Premium homepage advertisement placement",
          type: "featured",
          image_url: "https://images.unsplash.com/photo-1553867515-3973b5986c3d?w=1200&h=300&fit=crop",
          target_url: "https://example.com",
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
          status: "active",
          metadata: { size: "1200x300", format: "PNG" }
        }
      ])
      .select();

    if (error) {
      console.error("❌ Advertisements seeding error:", error);
      return res.status(500).json({ error: "Failed to seed advertisements", details: error });
    }

    console.log(`✅ Inserted ${data.length} advertisements`);

    res.json({ 
      message: "Advertisements seeded successfully!",
      count: data.length,
      advertisements: data
    });

  } catch (error) {
    console.error("❌ Seeding error:", error);
    res.status(500).json({ error: "Seeding failed", details: error.message });
  }
});

export default router;
