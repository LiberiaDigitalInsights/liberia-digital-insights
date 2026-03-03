import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/analytics/stats - Get aggregate dashboard stats (Admin/Editor)
async function getHandler() {
  try {
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

    return NextResponse.json({
      articles: articlesCount || 0,
      subscribers: subscribersCount || 0,
      pendingReviews: pendingCount || 0,
      podcasts: podcastsCount || 0,
      events: eventsCount || 0,
      users: usersCount || 0,
    });
  } catch (error) {
    console.error("[api/analytics/stats] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 },
    );
  }
}

export const GET = withAuth(getHandler, ["admin", "editor"]);
