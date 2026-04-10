import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/v1/search?q=...&types=articles,podcasts,events,insights&limit=5
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const typesParam =
      searchParams.get("types") || "articles,podcasts,events,insights";
    const limit = Math.min(parseInt(searchParams.get("limit") || "5", 10), 20);

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const types = typesParam.split(",").map((t) => t.trim());
    const searchTerm = `%${q}%`;

    const queries = [];

    if (types.includes("articles")) {
      queries.push(
        supabase
          .from("articles")
          .select(
            "id, title, slug, excerpt, category, status, published_at, cover_image_url",
          )
          .eq("status", "published")
          .or(
            `title.ilike.${searchTerm},excerpt.ilike.${searchTerm},content.ilike.${searchTerm}`,
          )
          .order("published_at", { ascending: false })
          .limit(limit)
          .then(({ data }) =>
            (data || []).map((r) => ({
              ...r,
              _type: "article",
              href: `/articles/${r.slug}`,
            })),
          ),
      );
    }

    if (types.includes("podcasts")) {
      queries.push(
        supabase
          .from("podcasts")
          .select(
            "id, title, slug, description, status, published_at, thumbnail_url",
          )
          .eq("status", "published")
          .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
          .order("published_at", { ascending: false })
          .limit(limit)
          .then(({ data }) =>
            (data || []).map((r) => ({
              ...r,
              _type: "podcast",
              href: `/podcasts/${r.slug}`,
            })),
          ),
      );
    }

    if (types.includes("events")) {
      queries.push(
        supabase
          .from("events")
          .select(
            "id, title, slug, description, status, date, cover_image_url, location",
          )
          .not("status", "eq", "archived")
          .or(
            `title.ilike.${searchTerm},description.ilike.${searchTerm},location.ilike.${searchTerm}`,
          )
          .order("date", { ascending: false })
          .limit(limit)
          .then(({ data }) =>
            (data || []).map((r) => ({
              ...r,
              _type: "event",
              href: `/events/${r.slug}`,
            })),
          ),
      );
    }

    if (types.includes("insights")) {
      queries.push(
        supabase
          .from("insights")
          .select(
            "id, title, slug, excerpt, status, published_at, cover_image_url",
          )
          .eq("status", "published")
          .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
          .order("published_at", { ascending: false })
          .limit(limit)
          .then(({ data }) =>
            (data || []).map((r) => ({
              ...r,
              _type: "insight",
              href: `/insights/${r.slug}`,
            })),
          ),
      );
    }

    const settled = await Promise.allSettled(queries);
    const results = settled
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => r.value)
      // Sort by recency across all types
      .sort((a, b) => {
        const da = new Date(a.published_at || a.date || 0);
        const db = new Date(b.published_at || b.date || 0);
        return db - da;
      });

    return NextResponse.json({ results, query: q });
  } catch (error) {
    console.error("[api/search] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
