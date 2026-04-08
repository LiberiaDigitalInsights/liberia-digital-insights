import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/gallery - Get all gallery items with pagination and filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "40");
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const offset = (page - 1) * limit;

    // Helper to check if a URL is a placeholder
    const isPlaceholder = (url) => {
      if (!url) return true;
      return url.includes("/LDI_favicon.png") || url.includes("placeholder");
    };

    // 1. Fetch from Gallery table
    let galleryQuery = supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (type && type.toLowerCase() !== "video") {
      galleryQuery = galleryQuery.eq("type", type.toLowerCase());
    }
    if (
      category &&
      category !== "all" &&
      category !== "Podcast" &&
      category !== "News" &&
      category !== "Insights"
    ) {
      galleryQuery = galleryQuery.eq("category", category);
    }
    if (search) {
      galleryQuery = galleryQuery.or(
        `title.ilike.%${search}%,description.ilike.%${search}%`,
      );
    }

    // 2. Fetch from Podcasts table
    let podcastQuery = supabase
      .from("podcasts")
      .select(
        "id, title, description, video_url, youtube_url, cover_image_url, created_at, tags",
      )
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(100);

    if (search) {
      podcastQuery = podcastQuery.or(
        `title.ilike.%${search}%,description.ilike.%${search}%`,
      );
    }

    // 3. Fetch from Articles table
    let articleQuery = supabase
      .from("articles")
      .select(
        "id, title, excerpt, cover_image_url, published_at, created_at, tags",
      )
      .eq("status", "published")
      .not("cover_image_url", "is", null)
      .order("published_at", { ascending: false })
      .limit(100);

    if (search) {
      articleQuery = articleQuery.or(
        `title.ilike.%${search}%,excerpt.ilike.%${search}%`,
      );
    }

    // 4. Fetch from Insights table
    let insightQuery = supabase
      .from("insights")
      .select(
        "id, title, excerpt, cover_image_url, published_at, created_at, tags",
      )
      .eq("status", "published")
      .not("cover_image_url", "is", null)
      .order("published_at", { ascending: false })
      .limit(100);

    if (search) {
      insightQuery = insightQuery.or(
        `title.ilike.%${search}%,excerpt.ilike.%${search}%`,
      );
    }

    const [galleryRes, podcastRes, articleRes, insightRes] = await Promise.all([
      galleryQuery,
      podcastQuery,
      articleQuery,
      insightQuery,
    ]);

    if (galleryRes.error) throw galleryRes.error;
    if (podcastRes.error) throw podcastRes.error;
    if (articleRes.error) throw articleRes.error;
    if (insightRes.error) throw insightRes.error;

    // TRANSFORM AND NORMALIZE

    // Gallery transformation
    const galleryItems = (galleryRes.data || [])
      .filter(
        (item) =>
          !isPlaceholder(item.url) && !isPlaceholder(item.thumbnail_url),
      )
      .map((item) => ({
        ...item,
        type: item.type?.toLowerCase() || "image",
        source: "Gallery",
        date: item.created_at,
      }));

    // Podcasts transformation
    const podcastItems = (podcastRes.data || [])
      .filter(
        (p) =>
          (p.video_url || p.youtube_url) && !isPlaceholder(p.cover_image_url),
      )
      .map((p) => ({
        id: `pod_${p.id}`,
        title: p.title,
        description: p.description,
        type: "video",
        url: p.video_url || p.youtube_url,
        thumbnail_url: p.cover_image_url,
        event_type: "podcast",
        event_id: p.id,
        category: "Podcast",
        source: "Podcast",
        tags: p.tags,
        date: p.created_at,
      }));

    // Articles transformation
    const articleItems = (articleRes.data || [])
      .filter((a) => !isPlaceholder(a.cover_image_url))
      .map((a) => ({
        id: `art_${a.id}`,
        title: a.title,
        description: a.excerpt,
        type: "image",
        url: a.cover_image_url,
        thumbnail_url: a.cover_image_url,
        category: "News",
        source: "News",
        tags: a.tags,
        date: a.published_at || a.created_at,
      }));

    // Insights transformation
    const insightItems = (insightRes.data || [])
      .filter((i) => !isPlaceholder(i.cover_image_url))
      .map((i) => ({
        id: `ins_${i.id}`,
        title: i.title,
        description: i.excerpt,
        type: "image",
        url: i.cover_image_url,
        thumbnail_url: i.cover_image_url,
        category: "Insights",
        source: "Insights",
        tags: i.tags,
        date: i.published_at || i.created_at,
      }));

    // MERGE AND FILTER

    let allItems = [
      ...galleryItems,
      ...podcastItems,
      ...articleItems,
      ...insightItems,
    ];

    // Final filtering based on type/category params if they are source-specific
    if (type && type.toLowerCase() === "video") {
      allItems = allItems.filter((item) => item.type === "video");
    } else if (type && type.toLowerCase() === "image") {
      allItems = allItems.filter((item) => item.type === "image");
    }

    if (category && category !== "all") {
      allItems = allItems.filter((item) => item.category === category);
    }

    // Sort by date descending
    allItems.sort((a, b) => new Date(b.date) - new Date(a.date));

    // PAGINATE
    const total = allItems.length;
    const paginatedItems = allItems.slice(offset, offset + limit);

    return NextResponse.json({
      items: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[api/gallery] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/v1/gallery - Create new gallery item (Admin/Editor)
async function postHandler(request) {
  try {
    const {
      title,
      description,
      type,
      url,
      thumbnail_url,
      event_type,
      event_id,
      category,
      tags,
      featured = false,
    } = await request.json();

    if (!title || !type || !url) {
      return NextResponse.json(
        { error: "Title, type, and URL are required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("gallery")
      .insert([
        {
          title,
          description,
          type: type.toLowerCase(),
          url,
          thumbnail_url,
          event_type,
          event_id,
          category,
          tags,
          featured,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[api/gallery] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const POST = withAuth(postHandler, ["admin", "editor"]);
