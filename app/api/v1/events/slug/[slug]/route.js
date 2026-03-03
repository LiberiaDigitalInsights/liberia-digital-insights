import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/v1/events/slug/[slug] - Get single event by slug
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    if (!data)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    // Increment view count
    try {
      await supabase.rpc("increment_view_count", {
        table_name: "events",
        record_id: data.id,
      });
    } catch (rpcError) {
      console.warn("[api/events/slug] View count increment failed:", rpcError);
    }

    return NextResponse.json({ event: data });
  } catch (error) {
    console.error("[api/events/slug] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
