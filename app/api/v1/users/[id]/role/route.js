import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// PUT /api/v1/users/[id]/role - Update user role (Admin only)
async function putHandler(request, { params }) {
  try {
    const { id } = await params;
    const { role } = await request.json();
    const validRoles = ["admin", "editor", "moderator", "viewer", "user"];

    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role provided" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("users")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Log the update
    const { logAudit, getClientIp } = await import("@/lib/audit");
    await logAudit({
      action: "UPDATE_USER_ROLE",
      targetType: "user",
      targetId: id,
      actorId: request.user.id,
      ipAddress: getClientIp(request),
      metadata: { new_role: role },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/users/id/role] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const PUT = withAuth(putHandler, ["admin"]);
