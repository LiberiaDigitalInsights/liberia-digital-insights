import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/podcasts - List all podcasts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const { data, error } = await supabase
      .from("podcasts")
      .select(
        `
        *,
        categories(name, slug)
      `,
      )
      .order("published_at", { ascending: false })
      .limit(limit);

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

    return NextResponse.json({ podcasts: transformedData });
  } catch (error) {
    console.error("[api/podcasts] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/v1/podcasts - Create new podcast (Admin/Editor)
async function postHandler(request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("podcasts")
      .insert([body])
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
