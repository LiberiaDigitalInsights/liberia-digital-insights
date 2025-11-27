import { Router } from "express";
import { supabase } from "../supabaseClient.js";

const router = Router();

// GET /v1/newsletters - Get all newsletters
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("newsletters")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(`subject.ilike.%${search}%,preview.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      newsletters: data,
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

// GET /v1/newsletters/:id - Get single newsletter
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("newsletters")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Newsletter not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /v1/newsletters - Create new newsletter
router.post("/", async (req, res) => {
  try {
    const {
      subject,
      preview,
      content,
      cover_image_url,
      scheduled_date,
      status = "draft",
    } = req.body;

    const { data, error } = await supabase
      .from("newsletters")
      .insert([
        {
          subject,
          preview,
          content,
          cover_image_url,
          scheduled_date,
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

// PUT /v1/newsletters/:id - Update newsletter
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If marking as sent, set sent_date
    if (updates.status === "sent" && !updates.sent_date) {
      updates.sent_date = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("newsletters")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Newsletter not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /v1/newsletters/:id - Delete newsletter
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("newsletters").delete().eq("id", id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
