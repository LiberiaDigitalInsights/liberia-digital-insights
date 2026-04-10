import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/v1/invitations/verify?token=... - Verify invitation token
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // Find invitation
    const { data: invite, error } = await supabase
      .from("invitations")
      .select("email, role, expires_at, accepted_at")
      .eq("token", token)
      .single();

    if (error || !invite) {
      return NextResponse.json(
        { error: "Invalid invitation link" },
        { status: 404 },
      );
    }

    // Check if already used
    if (invite.accepted_at) {
      return NextResponse.json(
        { error: "This invitation has already been used" },
        { status: 400 },
      );
    }

    // Check if expired
    if (new Date(invite.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "This invitation link has expired" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      email: invite.email,
      role: invite.role,
    });
  } catch (error) {
    console.error("[api/invitations/verify] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
