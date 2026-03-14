import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST /api/v1/newsletters/unsubscribe - Unsubscribe a user
export async function POST(request) {
  try {
    const { id, email } = await request.json();

    if (!id && !email) {
      return NextResponse.json(
        { error: "Subscriber ID or email is required" },
        { status: 400 },
      );
    }

    let query = supabase.from("newsletter_subscribers").update({
      status: "unsubscribed",
      unsubscribed_at: new Date().toISOString(),
    });

    if (id) {
      query = query.eq("id", id);
    } else {
      query = query.eq("email", email);
    }

    const { data, error } = await query.select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "You have been successfully unsubscribed.",
    });
  } catch (error) {
    console.error("[api/newsletters/unsubscribe] POST error:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe: " + error.message },
      { status: 500 },
    );
  }
}
