import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/v1/gallery/categories - Get all unique categories
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("category")
      .not("category", "is", null);

    if (error) throw error;

    const categories = [
      ...new Set([
        ...data.map((item) => item.category).filter(Boolean),
        "Podcast",
        "News",
        "Insights",
      ]),
    ];
    return NextResponse.json(categories);
  } catch (error) {
    console.error("[api/gallery/categories] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
