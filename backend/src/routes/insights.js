import { Router } from "express";
import { supabase } from "../supabaseClient.js";

const router = Router();

// GET /v1/insights - Get all insights
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "published", category, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("insights")
      .select(`
        *,
        categories(name, slug),
        users(first_name, last_name, email)
      `, { count: "exact" })
      .eq("status", status)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq("categories.slug", category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      insights: data,
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

// GET /v1/insights/slug/:slug - Get single insight by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from("insights")
      .select(`
        *,
        categories(name, slug),
        users(first_name, last_name, email)
      `)
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Insight not found" });
    }

    // Increment view count
    await supabase.rpc("increment_view_count", { table_name: "insights", record_id: data.id });

    res.json({ insight: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /v1/insights/:id - Get single insight
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("insights")
      .select(`
        *,
        categories(name, slug),
        users(first_name, last_name, email)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Insight not found" });
    }

    // Increment view count
    await supabase.rpc("increment_view_count", { table_name: "insights", record_id: id });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /v1/insights - Create new insight
router.post("/", async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      cover_image_url,
      category_id,
      author_id,
      status = "draft",
      tags,
      published_at,
    } = req.body;

    const { data, error } = await supabase
      .from("insights")
      .insert([
        {
          title,
          slug,
          excerpt,
          content,
          cover_image_url,
          category_id,
          author_id,
          status,
          tags,
          published_at: status === "published" ? published_at || new Date().toISOString() : null,
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

// PUT /v1/insights/:id - Update insight
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.status === "published" && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("insights")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Insight not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /v1/insights/:id - Delete insight
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("insights").delete().eq("id", id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
