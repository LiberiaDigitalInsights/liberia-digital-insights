import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// DELETE /api/v1/bookmarks/[id] - Remove a bookmark
async function deleteHandler(request, { params }) {
  try {
    const { id } = await params;
    const userId = request.user.id;

    // Check if bookmark belongs to user
    const { data: bookmark, error: findError } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (findError || !bookmark) {
      return NextResponse.json(
        { error: "Bookmark not found or access denied" },
        { status: 404 },
      );
    }

    const { error: deleteError } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("[api/bookmarks] DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const DELETE = withAuth(deleteHandler);
