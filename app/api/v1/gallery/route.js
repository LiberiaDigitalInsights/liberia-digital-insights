import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/gallery - Get all gallery items with pagination and filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type");
    const event = searchParams.get("event");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const offset = (page - 1) * limit;

    let query = supabase
      .from("gallery")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) query = query.eq("type", type);
    if (event) query = query.eq("event_type", "event").eq("event_id", event);
    if (category) query = query.eq("category", category);

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    // Manually fetch related events and podcasts (parity with legacy)
    const eventIds = [
      ...new Set(
        data
          .filter((item) => item.event_type === "event" && item.event_id)
          .map((item) => item.event_id),
      ),
    ];
    const podcastIds = [
      ...new Set(
        data
          .filter((item) => item.event_type === "podcast" && item.event_id)
          .map((item) => item.event_id),
      ),
    ];

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
    const itemsWithData = data.map((item) => {
      const result = { ...item };
      if (item.event_type === "event" && item.event_id) {
        result.events = events.find((e) => e.id === item.event_id) || null;
      } else if (item.event_type === "podcast" && item.event_id) {
        result.podcasts = podcasts.find((p) => p.id === item.event_id) || null;
      }
      return result;
    });

    return NextResponse.json({
      items: itemsWithData,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
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
          type,
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
