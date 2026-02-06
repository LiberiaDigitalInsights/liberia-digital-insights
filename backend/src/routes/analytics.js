import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// GET /traffic - Get daily traffic stats
router.get("/traffic", async (req, res) => {
  try {
    // Determine date range (default 30 days)
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch stats from daily_site_stats
    const { data, error } = await supabase
      .from("daily_site_stats")
      .select("date, visits, page_views")
      .gte("date", startDate.toISOString().split("T")[0])
      .order("date", { ascending: true });

    if (error) throw error;

    // Fill in missing days with zeros if necessary (optional, handled by frontend usually)
    // For now, return raw data
    res.json({ data: data || [] });
  } catch (error) {
    console.error("Error fetching traffic stats:", error);
    res.status(500).json({ error: "Failed to fetch traffic stats" });
  }
});

// GET /stats - Get aggregate dashboard stats
router.get("/stats", async (req, res) => {
  try {
    // Run parallel queries for counts
    const [
      { count: articlesCount, error: articlesError },
      { count: subscribersCount, error: subscribersError },
      { count: pendingCount, error: pendingError },
      { count: podcastsCount, error: podcastsError },
      { count: eventsCount, error: eventsError },
      { count: usersCount, error: usersError },
    ] = await Promise.all([
      supabase.from("articles").select("*", { count: "exact", head: true }),
      supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase.from("podcasts").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("users").select("*", { count: "exact", head: true }),
    ]);

    if (articlesError) throw articlesError;
    if (subscribersError) throw subscribersError;
    if (pendingError) throw pendingError;

    res.json({
      articles: articlesCount || 0,
      subscribers: subscribersCount || 0,
      pendingReviews: pendingCount || 0,
      podcasts: podcastsCount || 0,
      events: eventsCount || 0,
      users: usersCount || 0,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

// POST /track - Track a visit (simple implementation)
router.post("/track", async (req, res) => {
  try {
    const { isNewVisit } = req.body;

    // Call the database function to increment stats
    const { error } = await supabase.rpc("increment_daily_stats", {
      is_new_visit: !!isNewVisit,
    });

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error("Error tracking visit:", error);
    res.status(500).json({ error: "Failed to track visit" });
  }
});

// GET /activity - Get recent activity
router.get("/activity", async (req, res) => {
  try {
    const limit = 5;

    // Run parallel queries for recent items
    const [
      { data: articles, error: articlesError },
      { data: users, error: usersError },
      { data: podcasts, error: podcastsError },
      { data: events, error: eventsError },
    ] = await Promise.all([
      supabase
        .from("articles")
        .select("id, title, created_at")
        .order("created_at", { ascending: false })
        .limit(limit),
      supabase
        .from("users")
        .select("id, first_name, last_name, email, created_at")
        .order("created_at", { ascending: false })
        .limit(limit),
      supabase
        .from("podcasts")
        .select("id, title, created_at")
        .order("created_at", { ascending: false })
        .limit(limit),
      supabase
        .from("events")
        .select("id, title, created_at")
        .order("created_at", { ascending: false })
        .limit(limit),
    ]);

    if (articlesError) throw articlesError;
    // Users might fail if RLS prevents reading, but proceed if possible

    // Normalize and combine
    const activities = [
      ...(articles || []).map((a) => ({
        type: "article",
        message: "New article published",
        detail: a.title,
        time: a.created_at,
      })),
      ...(users || []).map((u) => ({
        type: "user",
        message: "New user registration",
        detail: u.email, // or name
        time: u.created_at,
      })),
      ...(podcasts || []).map((p) => ({
        type: "podcast",
        message: "Podcast uploaded",
        detail: p.title,
        time: p.created_at,
      })),
      ...(events || []).map((e) => ({
        type: "event",
        message: "Event created",
        detail: e.title,
        time: e.created_at,
      })),
    ];

    // Sort by time desc and take top 5
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const recentActivity = activities.slice(0, 5);

    res.json(recentActivity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

export default router;
