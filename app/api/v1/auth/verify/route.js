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

    if (error) {
      console.error("[api/auth/verify] DB error:", error);
      // Check for timeout or connectivity issues (Supabase specific error codes or fetch errors)
      const isConnectionError =
        error.message?.includes("fetch failed") ||
        error.message?.includes("timeout") ||
        error.code === "PGRST301" || // Supabase timeout/overload
        error.code === "57P01"; // Database is shutting down (Supabase maintenance)

      if (isConnectionError) {
        return NextResponse.json(
          {
            error: "Database connection timeout. Please try again.",
            details: error.message,
          },
          { status: 503 },
        );
      }

      return NextResponse.json(
        { error: "Invalid token or user not found" },
        { status: 401 },
      );
    }

    if (!user || !user.is_active) {
      return NextResponse.json(
        { error: "User inactive or account disabled" },
        { status: 401 },
      );
    }

    return NextResponse.json({ valid: true, user });
  } catch (error) {
    console.error("[api/auth/verify] Catch error:", error);
    // Distinguish between JWT decode error and others
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return NextResponse.json(
        { error: "Session expired or invalid" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: "Authentication service unavailable" },
      { status: 500 },
    );
  }
}
