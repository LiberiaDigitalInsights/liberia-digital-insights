import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/v1/gallery/podcasts - Get all podcasts that have gallery items
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("event_id")
      .eq("event_type", "podcast")
      .not("event_id", "is", null);

    if (error) throw error;

    const podcastIds = [...new Set(data.map((item) => item.event_id))];
    if (podcastIds.length === 0) return NextResponse.json([]);

    const { data: podcastData, error: podcastError } = await supabase
      .from("podcasts")
      .select("id, title, slug")
      .in("id", podcastIds);

    if (podcastError) throw podcastError;
    return NextResponse.json(podcastData || []);
  } catch (error) {
    console.error("[api/gallery/podcasts] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
