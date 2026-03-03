import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// PATCH /api/v1/users/[id]/status - Enable/Disable user (Admin only)
async function patchHandler(request, { params }) {
  try {
    const { id } = await params;
    const { is_active } = await request.json();

    if (typeof is_active !== "boolean") {
      return NextResponse.json(
        { error: "is_active must be a boolean" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("users")
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/users/id/status] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const PATCH = withAuth(patchHandler, ["admin"]);
