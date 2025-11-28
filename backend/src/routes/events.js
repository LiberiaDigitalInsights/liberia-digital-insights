import { Router } from "express";
import { supabase } from "../supabaseClient.js";

const router = Router();

// GET /v1/events - Get all events
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("events")
      .select("*", { count: "exact" })
      .order("date", { ascending: true })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      events: data,
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

// GET /v1/events/slug/:slug - Get single event by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .limit(1);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ event: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /v1/events/:id - Get single event
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /v1/events - Create new event
router.post("/", async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      cover_image_url,
      date,
      location,
      category,
      max_attendees,
      status = "upcoming",
    } = req.body;

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          title,
          slug,
          description,
          cover_image_url,
          date,
          location,
          category,
          max_attendees,
          status,
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

// PUT /v1/events/:id - Update event
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from("events")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /v1/events/:id - Delete event
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
