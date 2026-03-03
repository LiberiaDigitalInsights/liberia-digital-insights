import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/v1/insights/slug/[slug] - Get single insight by slug
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    const { data, error } = await supabase
      .from("insights")
      .select(
        `
        *,
        categories(name, slug),
        users(first_name, last_name, email)
      `,
      )
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: "Insight not found" }, { status: 404 });
    }

    // Increment view count
    try {
      await supabase.rpc("increment_view_count", {
        table_name: "insights",
        record_id: data.id,
      });
    } catch (rpcError) {
      console.warn(
        "[api/insights/slug] View count increment failed:",
        rpcError,
      );
    }

    // Transform data for frontend parity
    const transformedInsight = {
      ...data,
      category: data.categories
        ? Array.isArray(data.categories)
          ? data.categories[0]
          : data.categories
        : null,
      categories: undefined,
    };

    return NextResponse.json({ insight: transformedInsight });
  } catch (error) {
    console.error("[api/insights/slug] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
