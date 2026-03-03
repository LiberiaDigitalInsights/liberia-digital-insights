import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// PUT /api/v1/newsletters/subscribers/[id] - Update subscriber (Admin/Editor)
async function putHandler(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data)
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 },
      );
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/newsletters/subscribers/id] PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/v1/newsletters/subscribers/[id] - Delete subscriber (Admin)
async function deleteHandler(request, { params }) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[api/newsletters/subscribers/id] DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const PUT = withAuth(putHandler, ["admin", "editor"]);
export const DELETE = withAuth(deleteHandler, ["admin"]);
