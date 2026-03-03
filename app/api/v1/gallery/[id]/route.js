import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/gallery/[id] - Get single gallery item
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data)
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 },
      );

    // Manually fetch related event or podcast (parity with legacy)
    if (data.event_type === "event" && data.event_id) {
      const { data: eventData } = await supabase
        .from("events")
        .select("id, title, slug")
        .eq("id", data.event_id)
        .single();
      data.events = eventData;
    } else if (data.event_type === "podcast" && data.event_id) {
      const { data: podcastData } = await supabase
        .from("podcasts")
        .select("id, title, slug")
        .eq("id", data.event_id)
        .single();
      data.podcasts = podcastData;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/gallery/id] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/v1/gallery/[id] - Update gallery item (Admin/Editor)
async function putHandler(request, { params }) {
  try {
    const { id } = await params;
    const updates = await request.json();

    // Remove immutable fields
    delete updates.id;
    delete updates.created_at;

    const { data, error } = await supabase
      .from("gallery")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data)
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 },
      );

    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/gallery/id] PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/v1/gallery/[id] - Delete gallery item (Admin)
async function deleteHandler(request, { params }) {
  try {
    const { id } = await params;
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[api/gallery/id] DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const PUT = withAuth(putHandler, ["admin", "editor"]);
export const DELETE = withAuth(deleteHandler, ["admin"]);
