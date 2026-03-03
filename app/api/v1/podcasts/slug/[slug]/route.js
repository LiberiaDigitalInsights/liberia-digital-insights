import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/v1/podcasts/slug/[slug] - Get single podcast by slug
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    const { data, error } = await supabase
      .from("podcasts")
      .select(`
        *,
        categories(name, slug)
      `)
      .eq("slug", slug)
      .limit(1);

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
    }

    const podcast = data[0];

    // Increment view count
    try {
      await supabase.rpc("increment_view_count", { 
        table_name: "podcasts", 
        record_id: podcast.id 
      });
    } catch (rpcError) {
      console.warn("[api/podcasts/slug] View count increment failed:", rpcError);
    }

    // Transform data for frontend parity
    const transformedPodcast = {
      ...podcast,
      category: podcast.categories ? (Array.isArray(podcast.categories) ? podcast.categories[0] : podcast.categories) : null,
      categories: undefined
    };

    return NextResponse.json({ podcast: transformedPodcast });
  } catch (error) {
    console.error("[api/podcasts/slug] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
