import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// GET /api/v1/users - List all users (Admin only)
async function getHandler() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, email, first_name, last_name, role, is_active, created_at, last_login",
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/users] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/v1/users - Create new user and send invitation (Admin only)
async function postHandler(request) {
  try {
    const body = await request.json();
    const { email, first_name, last_name, role = "editor" } = body;
    const validRoles = ["admin", "editor", "moderator", "viewer", "user"];

    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role provided" },
        { status: 400 },
      );
    }

    if (!email || !first_name || !last_name) {
      return NextResponse.json(
        { error: "Email, first name, and last name are required" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    // Generate temporary password
    const tempPassword = crypto.randomBytes(6).toString("hex");
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(tempPassword, saltRounds);

    // Create user
    const { data: user, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          password_hash,
          first_name,
          last_name,
          role,
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // TODO: Trigger invitation email (asynchronously)
    // Legacy used emailService.sendInvitationEmail(user, tempPassword);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("[api/users] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ["admin"]);
export const POST = withAuth(postHandler, ["admin"]);
