import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/v1/categories - List all categories
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) throw error;

    return NextResponse.json({
      data,
      pagination: { total: data.length },
    });
  } catch (error) {
    console.error("[api/categories] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
