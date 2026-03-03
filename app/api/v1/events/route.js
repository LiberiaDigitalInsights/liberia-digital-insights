import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/events - List all events
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const upcoming = searchParams.get("upcoming") === "true";

    let query = supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (upcoming) {
      query = query.gte("date", new Date().toISOString());
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ events: data });
  } catch (error) {
    console.error("[api/events] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/v1/events - Create new event (Admin/Editor)
async function postHandler(request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("events")
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[api/events] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const POST = withAuth(postHandler, ["admin", "editor"]);
