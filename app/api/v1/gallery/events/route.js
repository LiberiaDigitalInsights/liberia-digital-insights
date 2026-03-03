import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/v1/gallery/events - Get all events that have gallery items
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("event_id")
      .eq("event_type", "event")
      .not("event_id", "is", null);

    if (error) throw error;

    const eventIds = [...new Set(data.map((item) => item.event_id))];
    if (eventIds.length === 0) return NextResponse.json([]);

    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("id, title, slug")
      .in("id", eventIds);

    if (eventError) throw eventError;
    return NextResponse.json(eventData || []);
  } catch (error) {
    console.error("[api/gallery/events] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
