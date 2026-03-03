import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/v1/advertisements/slug/[slug] - Get single advertisement by slug
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    const { data, error } = await supabase
      .from("advertisements")
      .select("*")
      .eq("slug", slug)
      .limit(1);

    if (error) {
      if (
        error.message?.includes("schema cache") ||
        error.code === "PGRST116"
      ) {
        return NextResponse.json(
          { error: "Advertisement not found" },
          { status: 404 },
        );
      }
      throw error;
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Advertisement not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ advertisement: data[0] });
  } catch (error) {
    console.error("[api/advertisements/slug] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
