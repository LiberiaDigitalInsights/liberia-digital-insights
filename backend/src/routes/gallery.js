import { Router } from "express";
import { supabase } from "../supabaseClient.js";

const router = Router();

// GET /v1/gallery - Get all gallery items with pagination and filtering
router.get("/", async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      type, 
      event, 
      category,
      search 
    } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("gallery")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) {
      query = query.eq("type", type);
    }

    if (event) {
      query = query.eq("event_type", "event").eq("event_id", event);
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // Manually fetch related events and podcasts
    const eventIds = [...new Set(data.filter(item => item.event_type === 'event' && item.event_id).map(item => item.event_id))];
    const podcastIds = [...new Set(data.filter(item => item.event_type === 'podcast' && item.event_id).map(item => item.event_id))];

    let events = [];
    let podcasts = [];

    if (eventIds.length > 0) {
      const { data: eventData } = await supabase
        .from("events")
        .select("id, title, slug")
        .in("id", eventIds);
      events = eventData || [];
    }

    if (podcastIds.length > 0) {
      const { data: podcastData } = await supabase
        .from("podcasts")
        .select("id, title, slug")
        .in("id", podcastIds);
      podcasts = podcastData || [];
    }

    // Combine the data
    const itemsWithData = data.map(item => {
      const result = { ...item };
      
      if (item.event_type === 'event' && item.event_id) {
        result.events = events.find(event => event.id === item.event_id) || null;
      } else if (item.event_type === 'podcast' && item.event_id) {
        result.podcasts = podcasts.find(podcast => podcast.id === item.event_id) || null;
      }
      
      return result;
    });

    res.json({
      items: itemsWithData,
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

// GET /v1/gallery/events - Get all events that have gallery items
router.get("/events", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("event_id")
      .eq("event_type", "event")
      .not("event_id", "is", null);

    if (error) throw error;

    // Get unique event IDs
    const eventIds = [...new Set(data.map(item => item.event_id))];
    
    if (eventIds.length === 0) {
      return res.json([]);
    }

    // Fetch the actual events
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("id, title, slug")
      .in("id", eventIds);

    if (eventError) throw eventError;
    
    res.json(eventData || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /v1/gallery/podcasts - Get all podcasts that have gallery items
router.get("/podcasts", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("event_id")
      .eq("event_type", "podcast")
      .not("event_id", "is", null);

    if (error) throw error;

    // Get unique podcast IDs
    const podcastIds = [...new Set(data.map(item => item.event_id))];
    
    if (podcastIds.length === 0) {
      return res.json([]);
    }

    // Fetch the actual podcasts
    const { data: podcastData, error: podcastError } = await supabase
      .from("podcasts")
      .select("id, title, slug")
      .in("id", podcastIds);

    if (podcastError) throw podcastError;
    
    res.json(podcastData || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /v1/gallery/categories - Get all unique categories
router.get("/categories", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("category")
      .not("category", "is", null);

    if (error) throw error;

    const categories = [...new Set(data.map(item => item.category).filter(Boolean))];
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /v1/gallery/:id - Get single gallery item
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Gallery item not found" });
    }

    // Manually fetch related event or podcast
    if (data.event_type === 'event' && data.event_id) {
      const { data: eventData } = await supabase
        .from("events")
        .select("id, title, slug")
        .eq("id", data.event_id)
        .single();
      data.events = eventData;
    } else if (data.event_type === 'podcast' && data.event_id) {
      const { data: podcastData } = await supabase
        .from("podcasts")
        .select("id, title, slug")
        .eq("id", data.event_id)
        .single();
      data.podcasts = podcastData;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /v1/gallery - Create new gallery item
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      type, // 'image' or 'video'
      url,
      thumbnail_url,
      event_type, // 'event' or 'podcast'
      event_id,
      category,
      tags,
      featured = false
    } = req.body;

    // Validate required fields
    if (!title || !type || !url) {
      return res.status(400).json({ 
        error: "Title, type, and URL are required" 
      });
    }

    if (!['image', 'video'].includes(type)) {
      return res.status(400).json({ 
        error: "Type must be 'image' or 'video'" 
      });
    }

    if (event_type && !['event', 'podcast'].includes(event_type)) {
      return res.status(400).json({ 
        error: "Event type must be 'event' or 'podcast'" 
      });
    }

    // Create gallery item
    const { data, error } = await supabase
      .from("gallery")
      .insert([{
        title,
        description,
        type,
        url,
        thumbnail_url,
        event_type,
        event_id,
        category,
        tags,
        featured
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /v1/gallery/:id - Update gallery item
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.created_at;

    const { data, error } = await supabase
      .from("gallery")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Gallery item not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /v1/gallery/:id - Delete gallery item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
