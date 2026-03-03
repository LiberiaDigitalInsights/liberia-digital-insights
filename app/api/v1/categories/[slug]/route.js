import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/v1/categories/[slug] - Get category by slug
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 },
        );
      }
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[api/categories/slug] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 },
    );
  }
}
