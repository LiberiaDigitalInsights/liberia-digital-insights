import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { signToken } from "@/lib/auth";
import { loginSchema } from "@/lib/schemas/auth";

// POST /api/v1/auth/login - Login user
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input using Zod
    const validated = loginSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 },
      );
    }

    const { email, password } = validated.data;

    // Find user
    const { data: user, error } = await supabase
      .from("users")
      .select(
        "id, email, password_hash, first_name, last_name, role, is_active",
      )
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { error: "Account is disabled" },
        { status: 401 },
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Update last login (non-blocking)
    supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", user.id)
      .then(({ error }) => {
        if (error) console.error("Failed to update last login:", error);
      });

    // Generate JWT token
    const token = signToken({
      id: user.id,
      userId: user.id, // For compatibility
      email: user.email,
      role: user.role,
    });

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("[api/auth/login] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
