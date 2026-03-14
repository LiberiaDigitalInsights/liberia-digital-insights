import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/newsletters/[id] - Get single newsletter (Admin/Editor)
async function getHandler(request, { params }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("newsletters")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data)
      return NextResponse.json(
        { error: "Newsletter not found" },
        { status: 404 },
      );
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/newsletters/id] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/v1/newsletters/[id] - Update newsletter (Admin/Editor)
async function putHandler(request, { params }) {
  try {
    const { id } = await params;
    const updates = await request.json();

    if (updates.status === "sent" && !updates.sent_date) {
      updates.sent_date = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("newsletters")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data)
      return NextResponse.json(
        { error: "Newsletter not found" },
        { status: 404 },
      );
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/newsletters/id] PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/v1/newsletters/[id] - Delete newsletter (Admin)
async function deleteHandler(request, { params }) {
  try {
    const { id } = await params;
    const { error } = await supabase.from("newsletters").delete().eq("id", id);
    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[api/newsletters/id] DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ["admin", "editor"]);
export const PUT = withAuth(putHandler, ["admin", "editor"]);
export const DELETE = withAuth(deleteHandler, ["admin", "editor"]);
