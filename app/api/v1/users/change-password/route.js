import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";
import bcrypt from "bcryptjs";

// PUT /api/v1/users/change-password - Change own password
async function putHandler(request) {
  try {
    const { currentPassword, newPassword } = await request.json();
    const userId = request.user.id;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current and new passwords are required" },
        { status: 400 },
      );
    }

    // Get current user and password hash
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("password_hash")
      .eq("id", userId)
      .single();

    if (fetchError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect current password" },
        { status: 401 },
      );
    }

    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("[api/users/change-password] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const PUT = withAuth(putHandler); // withAuth defaults to authenticated access
