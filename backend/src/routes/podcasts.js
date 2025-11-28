import { Router } from "express";
import { supabase } from "../supabaseClient.js";

const router = Router();

// GET /v1/podcasts - Get all podcasts
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "published", search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("podcasts")
      .select("*", { count: "exact" })
      .eq("status", status)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      podcasts: data,
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

// GET /v1/podcasts/slug/:slug - Get single podcast by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from("podcasts")
      .select("*")
      .eq("slug", slug)
      .limit(1);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Podcast not found" });
    }

    res.json({ podcast: data[0] });
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /v1/podcasts/:id - Get single podcast
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("podcasts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Podcast not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /v1/podcasts - Create new podcast
router.post("/", async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      audio_url,
      transcript,
      video_url,
      youtube_url,
      facebook_url,
      spotify_url,
      apple_podcasts_url,
      cover_image_url,
      duration,
      episode_number,
      season_number,
      status = "draft",
      published_at,
    } = req.body;

    const { data, error } = await supabase
      .from("podcasts")
      .insert([
        {
          title,
          slug,
          description,
          audio_url,
          transcript,
          video_url,
          youtube_url,
          facebook_url,
          spotify_url,
          apple_podcasts_url,
          cover_image_url,
          duration,
          episode_number,
          season_number,
          status,
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

// PUT /v1/podcasts/:id - Update podcast
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.status === "published" && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("podcasts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Podcast not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /v1/podcasts/:id - Delete podcast
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("podcasts").delete().eq("id", id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
