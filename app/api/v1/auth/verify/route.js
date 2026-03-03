import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

// POST /api/v1/auth/verify - Verify token and get user details
export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get fresh user details from DB
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, first_name, last_name, role, is_active")
      .eq("id", decoded.id || decoded.userId)
      .single();

    if (error || !user || !user.is_active) {
      return NextResponse.json(
        { error: "Invalid token or user inactive" },
        { status: 401 },
      );
    }

    return NextResponse.json({ valid: true, user });
  } catch (error) {
    console.error("[api/auth/verify] error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
