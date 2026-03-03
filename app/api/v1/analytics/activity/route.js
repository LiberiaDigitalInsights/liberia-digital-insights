import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/analytics/activity - Get recent activity (Admin/Editor)
async function getHandler() {
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
        detail: u.email,
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

    return NextResponse.json(recentActivity);
  } catch (error) {
    console.error("[api/analytics/activity] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 },
    );
  }
}

export const GET = withAuth(getHandler, ["admin", "editor"]);
