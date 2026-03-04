import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";
import { eventQuerySchema, eventSubmissionSchema } from "@/lib/schemas/content";

// GET /api/v1/events - List all events
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const result = eventQuerySchema.safeParse(queryParams);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.format() },
        { status: 400 },
      );
    }

    const { limit, upcoming, page } = result.data;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("events")
      .select("*", { count: "exact" })
      .order("date", { ascending: true })
      .range(offset, offset + limit - 1);

    if (upcoming) {
      query = query.gte("date", new Date().toISOString());
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      events: data || [],
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("[api/events] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/v1/events - Create new event (Admin/Editor)
async function postHandler(request) {
  try {
    const body = await request.json();

    const result = eventSubmissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("events")
      .insert([result.data])
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
