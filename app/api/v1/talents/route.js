import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/talents - Get all talents (with filtering/pagination)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const offset = (page - 1) * limit;

    let query = supabase
      .from("talents")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (
      category &&
      category !== "All" &&
      category !== "undefined" &&
      category !== "null"
    ) {
      query = query.eq("category", category);
    }

    if (status && status !== "undefined" && status !== "null") {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query;

    if (error) {
      if (
        error.message?.includes("schema cache") ||
        error.code === "PGRST116"
      ) {
        return NextResponse.json({
          talents: [],
          pagination: { page, limit, total: 0, pages: 0 },
        });
      }
      throw error;
    }

    return NextResponse.json({
      talents: data || [],
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("[api/talents] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/v1/talents - Public talent submission
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      role,
      bio,
      category,
      links,
      avatar_url,
      status = "published", // Default to published as in legacy, though usually submissions are 'pending'
      skills,
      experience,
      location,
      availability,
    } = body;

    const { data, error } = await supabase
      .from("talents")
      .insert([
        {
          name,
          slug,
          role,
          bio,
          category,
          links,
          avatar_url,
          status,
          skills,
          experience,
          location,
          availability,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Note: Legacy used emailService.sendTalentSubmissionNotification(data)
    // We will port emailService later or use a different mechanism.
    // For now, we proceed as the record is created.

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[api/talents] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
