import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/events/[id] - Get event by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    // Increment view count
    try {
      await supabase.rpc("increment_view_count", {
        table_name: "events",
        record_id: id,
      });
    } catch (rpcError) {
      console.warn("[api/events/id] View count increment failed:", rpcError);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/events/id] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/v1/events/[id] - Update event
async function putHandler(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from("events")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/events/id] PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/v1/events/[id] - Delete event
async function deleteHandler(request, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[api/events/id] DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const PUT = withAuth(putHandler, ["admin", "editor"]);
export const DELETE = withAuth(deleteHandler, ["admin", "editor"]);
