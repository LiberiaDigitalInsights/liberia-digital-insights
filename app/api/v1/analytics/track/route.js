import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST /api/v1/analytics/track - Track a visit (Public)
export async function POST(request) {
  try {
    const { isNewVisit } = await request.json();

    // Call the database function to increment stats
    const { error } = await supabase.rpc("increment_daily_stats", {
      is_new_visit: !!isNewVisit,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/analytics/track] POST error:", error);
    return NextResponse.json(
      { error: "Failed to track visit" },
      { status: 500 },
    );
  }
}
