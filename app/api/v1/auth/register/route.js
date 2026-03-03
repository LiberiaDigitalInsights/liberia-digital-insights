import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { registerSchema } from "@/lib/schemas/auth";

// POST /api/v1/auth/register - Register new user
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input using Zod
    const validated = registerSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 },
      );
    }

    const {
      email,
      password,
      first_name,
      last_name,
      role = "user",
    } = validated.data;

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

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          password_hash,
          first_name,
          last_name,
          role,
        },
      ])
      .select("id, email, first_name, last_name, role, created_at")
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[api/auth/register] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
