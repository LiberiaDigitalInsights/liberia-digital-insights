import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyAuth } from "@/lib/apiAuth";

/**
 * GET /api/v1/admin/search?q=...
 * Admin-only internal search for command palette.
 */
export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth || auth.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const limit = 6;

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = `%${q}%`;
    const queries = [];

    // 1. Articles (All status)
    queries.push(
      supabase
        .from("articles")
        .select("id, title, slug, status")
        .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .limit(limit)
        .then(({ data }) =>
          (data || []).map((r) => ({
            ...r,
            _type: "article",
            label: r.title,
            description: `Article (${r.status})`,
            href: `/admin/articles`,
          })),
        ),
    );

    // 2. Users (Name/Email)
    queries.push(
      supabase
        .from("users")
        .select("id, email, first_name, last_name, role")
        .or(
          `first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm}`,
        )
        .limit(limit)
        .then(({ data }) =>
          (data || []).map((r) => ({
            ...r,
            _type: "user",
            label:
              `${r.first_name || ""} ${r.last_name || ""}`.trim() || r.email,
            description: `User (${r.role})`,
            href: `/admin/users`,
          })),
        ),
    );

    // 3. Insights
    queries.push(
      supabase
        .from("insights")
        .select("id, title, slug, status")
        .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
        .limit(limit)
        .then(({ data }) =>
          (data || []).map((r) => ({
            ...r,
            _type: "insight",
            label: r.title,
            description: `Insight (${r.status})`,
            href: `/admin/insights`,
          })),
        ),
    );

    // 4. Podcasts
    queries.push(
      supabase
        .from("podcasts")
        .select("id, title, slug, status")
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(limit)
        .then(({ data }) =>
          (data || []).map((r) => ({
            ...r,
            _type: "podcast",
            label: r.title,
            description: `Podcast (${r.status})`,
            href: `/admin/podcasts`,
          })),
        ),
    );

    // 5. Events
    queries.push(
      supabase
        .from("events")
        .select("id, title, slug, status")
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(limit)
        .then(({ data }) =>
          (data || []).map((r) => ({
            ...r,
            _type: "event",
            label: r.title,
            description: `Event (${r.status})`,
            href: `/admin/events`,
          })),
        ),
    );

    const settled = await Promise.allSettled(queries);
    const results = settled
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => r.value);

    return NextResponse.json({ results });
  } catch (err) {
    console.error("[AdminSearch] GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
