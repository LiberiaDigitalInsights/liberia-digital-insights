import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/users/[id] - Get specific user (Admin only)
async function getHandler(request, { params }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, email, first_name, last_name, role, is_active, created_at, last_login",
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/users/id] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/v1/users/[id] - Update user basics (Admin only)
async function putHandler(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { first_name, last_name } = body;

    const { data, error } = await supabase
      .from("users")
      .update({ first_name, last_name, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/users/id] PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/v1/users/[id] - Delete user (Admin only)
async function deleteHandler(request, { params }) {
  try {
    const { id } = await params;

    // Prevent self-deletion
    if (id === request.user.id) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 },
      );
    }

    // Nullify author_id in dependent tables
    const tablesToNullify = ["articles", "insights"];
    for (const table of tablesToNullify) {
      const { error: nullifyError } = await supabase
        .from(table)
        .update({ author_id: null })
        .eq("author_id", id);
      if (nullifyError)
        console.error(`Error nullifying author_id in ${table}:`, nullifyError);
    }

    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[api/users/id] DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ["admin"]);
export const PUT = withAuth(putHandler, ["admin"]);
export const DELETE = withAuth(deleteHandler, ["admin"]);
