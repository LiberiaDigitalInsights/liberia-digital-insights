import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { signToken } from "@/lib/auth";

// POST /api/v1/auth/register-invite - Register user via invitation
export async function POST(request) {
  try {
    const { token, first_name, last_name, password } = await request.json();

    if (!token || !first_name || !last_name || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 1. Verify token again on server
    const { data: invite, error: fetchError } = await supabase
      .from("invitations")
      .select("*")
      .eq("token", token)
      .single();

    if (fetchError || !invite) {
      return NextResponse.json(
        { error: "Invalid invitation" },
        { status: 404 },
      );
    }

    if (invite.accepted_at) {
      return NextResponse.json(
        { error: "Invitation already used" },
        { status: 400 },
      );
    }

    if (new Date(invite.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Invitation expired" },
        { status: 400 },
      );
    }

    // 2. Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 3. Create user in public.users table (Using the role from invitation)
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert([
        {
          email: invite.email,
          password_hash,
          first_name,
          last_name,
          role: invite.role,
          is_active: true,
        },
      ])
      .select("id, email, first_name, last_name, role")
      .single();

    if (userError) throw userError;

    // 4. Mark invitation as accepted
    await supabase
      .from("invitations")
      .update({ accepted_at: new Date().toISOString() })
      .eq("id", invite.id);

    // 5. Generate JWT token
    const jwtToken = signToken({
      id: user.id,
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 6. Log Audit
    const { logAudit, getClientIp } = await import("@/lib/audit");
    await logAudit({
      action: "REGISTER_VIA_INVITE",
      targetType: "user",
      targetId: user.id,
      actorId: user.id, // The user themselves
      ipAddress: getClientIp(request),
      metadata: { invite_id: invite.id },
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        token: jwtToken,
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[api/auth/register-invite] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
