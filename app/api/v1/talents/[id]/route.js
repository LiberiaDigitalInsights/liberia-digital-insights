import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/talents/[id] - Get single talent
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("talents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data)
      return NextResponse.json({ error: "Talent not found" }, { status: 404 });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/talents/id] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/v1/talents/[id] - Update talent (Admin/Editor)
async function putHandler(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updateData = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("talents")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data)
      return NextResponse.json({ error: "Talent not found" }, { status: 404 });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/talents/id] PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/v1/talents/[id] - Delete talent (Admin)
async function deleteHandler(request, { params }) {
  try {
    const { id } = await params;
    const { error } = await supabase.from("talents").delete().eq("id", id);
    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[api/talents/id] DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const PUT = withAuth(putHandler, ["admin", "editor"]);
export const DELETE = withAuth(deleteHandler, ["admin"]);
