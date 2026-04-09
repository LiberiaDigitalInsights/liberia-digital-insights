import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/analytics/activity - Get recent activity (Admin/Editor)
async function getHandler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
    const type = searchParams.get("type") || "all";

    const fetchLimit = page * limit; // We fetch enough to find the items for the requested page

    const shouldFetch = (t) => type === "all" || type === t;

    const queries = [];
    const countQueries = [];

    if (shouldFetch("article")) {
      queries.push(
        supabase
          .from("articles")
          .select("id, title, status, created_at, published_at")
          .order("created_at", { ascending: false })
          .limit(fetchLimit),
      );
      countQueries.push(
        supabase.from("articles").select("*", { count: "exact", head: true }),
      );
    } else {
      queries.push(Promise.resolve({ data: [] }));
      countQueries.push(Promise.resolve({ count: 0 }));
    }

    if (shouldFetch("user")) {
      queries.push(
        supabase
          .from("users")
          .select("id, first_name, last_name, email, role, created_at")
          .order("created_at", { ascending: false })
          .limit(fetchLimit),
      );
      countQueries.push(
        supabase.from("users").select("*", { count: "exact", head: true }),
      );
    } else {
      queries.push(Promise.resolve({ data: [] }));
      countQueries.push(Promise.resolve({ count: 0 }));
    }

    if (shouldFetch("podcast")) {
      queries.push(
        supabase
          .from("podcasts")
          .select("id, title, guest, status, created_at")
          .order("created_at", { ascending: false })
          .limit(fetchLimit),
      );
      countQueries.push(
        supabase.from("podcasts").select("*", { count: "exact", head: true }),
      );
    } else {
      queries.push(Promise.resolve({ data: [] }));
      countQueries.push(Promise.resolve({ count: 0 }));
    }

    if (shouldFetch("event")) {
      queries.push(
        supabase
          .from("events")
          .select("id, title, status, date, created_at")
          .order("created_at", { ascending: false })
          .limit(fetchLimit),
      );
      countQueries.push(
        supabase.from("events").select("*", { count: "exact", head: true }),
      );
    } else {
      queries.push(Promise.resolve({ data: [] }));
      countQueries.push(Promise.resolve({ count: 0 }));
    }

    if (shouldFetch("insight")) {
      queries.push(
        supabase
          .from("insights")
          .select("id, title, status, created_at")
          .order("created_at", { ascending: false })
          .limit(fetchLimit),
      );
      countQueries.push(
        supabase.from("insights").select("*", { count: "exact", head: true }),
      );
    } else {
      queries.push(Promise.resolve({ data: [] }));
      countQueries.push(Promise.resolve({ count: 0 }));
    }

    const [results, counts] = await Promise.all([
      Promise.all(queries),
      Promise.all(countQueries),
    ]);

    const [articles, users, podcasts, events, insights] = results.map(
      (r) => r.data || [],
    );
    const totalCount = counts.reduce((acc, c) => acc + (c.count || 0), 0);

    // Normalize into a unified activity feed
    const activities = [
      ...articles.map((a) => ({
        id: `article-${a.id}`,
        type: "article",
        message:
          a.status === "published"
            ? "Article published"
            : "Article saved as draft",
        detail: a.title,
        meta: a.status,
        time: a.created_at,
        href: `/admin/articles/edit/${a.id}`,
      })),
      ...users.map((u) => ({
        id: `user-${u.id}`,
        type: "user",
        message: "New user registered",
        detail: `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email,
        meta: u.role,
        time: u.created_at,
        href: `/admin/users`,
      })),
      ...podcasts.map((p) => ({
        id: `podcast-${p.id}`,
        type: "podcast",
        message:
          p.status === "published"
            ? "Podcast episode published"
            : "Podcast episode drafted",
        detail: p.title,
        meta: p.guest || null,
        time: p.created_at,
        href: `/admin/podcasts/edit/${p.id}`,
      })),
      ...events.map((e) => ({
        id: `event-${e.id}`,
        type: "event",
        message: "Event created",
        detail: e.title,
        meta: e.status,
        time: e.created_at,
        href: `/admin/events/edit/${e.id}`,
      })),
      ...insights.map((i) => ({
        id: `insight-${i.id}`,
        type: "insight",
        message:
          i.status === "published" ? "Insight published" : "Insight drafted",
        detail: i.title,
        meta: i.status,
        time: i.created_at,
        href: `/admin/insights/edit/${i.id}`,
      })),
    ];

    // Sort by most recent
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    const offset = (page - 1) * limit;
    const paginated = activities.slice(offset, offset + limit);

    return NextResponse.json({
      activities: paginated,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("[api/analytics/activity] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 },
    );
  }
}

export const GET = withAuth(getHandler, ["admin", "editor"]);
