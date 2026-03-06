import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";
import {
  podcastQuerySchema,
  podcastSubmissionSchema,
} from "@/lib/schemas/content";

// GET /api/v1/podcasts - List all podcasts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const result = podcastQuerySchema.safeParse(queryParams);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.format() },
        { status: 400 },
      );
    }

    const { page, limit, status, category, search } = result.data;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("podcasts")
      .select(
        `
        *,
        categories(name, slug)
      `,
        { count: "exact" },
      )
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq("categories.slug", category);
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // Transform data for frontend parity
    const transformedData = data.map((podcast) => ({
      ...podcast,
      category: podcast.categories
        ? Array.isArray(podcast.categories)
          ? podcast.categories[0]
          : podcast.categories
        : null,
      categories: undefined,
    }));

    return NextResponse.json({
      podcasts: transformedData,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("[api/podcasts] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/v1/podcasts - Create new podcast (Admin/Editor)
async function postHandler(request) {
  try {
    const body = await request.json();

    const result = podcastSubmissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("podcasts")
      .insert([result.data])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[api/podcasts] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const POST = withAuth(postHandler, ["admin", "editor"]);
