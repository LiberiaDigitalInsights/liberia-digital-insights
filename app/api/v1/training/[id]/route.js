import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/training/[id] - Get single training course
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("training")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data)
      return NextResponse.json(
        { error: "Training course not found" },
        { status: 404 },
      );

    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/training/id] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/v1/training/[id] - Update training course (Admin/Editor)
async function putHandler(request, { params }) {
  try {
    const { id } = await params;
    const updates = await request.json();

    const { data, error } = await supabase
      .from("training")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data)
      return NextResponse.json(
        { error: "Training course not found" },
        { status: 404 },
      );

    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/training/id] PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/v1/training/[id] - Delete training course (Admin)
async function deleteHandler(request, { params }) {
  try {
    const { id } = await params;
    const { error } = await supabase.from("training").delete().eq("id", id);
    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[api/training/id] DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const PUT = withAuth(putHandler, ["admin", "editor"]);
export const DELETE = withAuth(deleteHandler, ["admin"]);
