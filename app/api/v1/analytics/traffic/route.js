import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/analytics/traffic - Get daily traffic stats (Admin/Editor)
async function getHandler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("daily_site_stats")
      .select("date, visits, page_views")
      .gte("date", startDate.toISOString().split("T")[0])
      .order("date", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error("[api/analytics/traffic] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch traffic stats" },
      { status: 500 },
    );
  }
}

export const GET = withAuth(getHandler, ["admin", "editor"]);
