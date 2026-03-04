import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";
import { bookmarkSchema, bookmarkQuerySchema } from "@/lib/schemas/content";

// GET /api/v1/bookmarks - Get all bookmarks for the current user
async function getHandler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const result = bookmarkQuerySchema.safeParse(queryParams);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.format() },
        { status: 400 },
      );
    }

    const { page, limit, content_type, resolve } = result.data;
    const userId = request.user.id;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("bookmarks")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (content_type) {
      query = query.eq("content_type", content_type);
    }

    const { data: bookmarks, error, count } = await query;

    if (error) throw error;

    // Resolve content details if requested
    let resolvedBookmarks = bookmarks || [];
    if (resolve === "true" && bookmarks?.length > 0) {
      const articleIds = bookmarks
        .filter((b) => b.content_type === "article")
        .map((b) => b.content_id);
      const eventIds = bookmarks
        .filter((b) => b.content_type === "event")
        .map((b) => b.content_id);
      const insightIds = bookmarks
        .filter((b) => b.content_type === "insight")
        .map((b) => b.content_id);

      const [articles, events, insights] = await Promise.all([
        articleIds.length > 0
          ? supabase
              .from("articles")
              .select("id, title, slug, cover_image_url, excerpt, published_at")
              .in("id", articleIds)
          : { data: [] },
        eventIds.length > 0
          ? supabase
              .from("events")
              .select("id, title, slug, cover_image_url, excerpt, date")
              .in("id", eventIds)
          : { data: [] },
        insightIds.length > 0
          ? supabase
              .from("insights")
              .select("id, title, slug, cover_image_url, excerpt, published_at")
              .in("id", insightIds)
          : { data: [] },
      ]);

      const contentMap = {
        article: Object.fromEntries(
          (articles.data || []).map((a) => [a.id, a]),
        ),
        event: Object.fromEntries((events.data || []).map((e) => [e.id, e])),
        insight: Object.fromEntries(
          (insights.data || []).map((i) => [i.id, i]),
        ),
      };

      resolvedBookmarks = bookmarks.map((b) => ({
        ...b,
        content: contentMap[b.content_type][b.content_id] || null,
      }));
    }

    return NextResponse.json({
      bookmarks: resolvedBookmarks,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("[api/bookmarks] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/v1/bookmarks - Create a new bookmark
async function postHandler(request) {
  try {
    const body = await request.json();
    const userId = request.user.id;

    const result = bookmarkSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 },
      );
    }

    const { content_id, content_type } = result.data;

    // Check if bookmark already exists
    const { data: existing } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", userId)
      .eq("content_id", content_id)
      .eq("content_type", content_type)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Content already bookmarked" },
        { status: 409 },
      );
    }

    const { data, error } = await supabase
      .from("bookmarks")
      .insert([
        {
          user_id: userId,
          content_id,
          content_type,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[api/bookmarks] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
