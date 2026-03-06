import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  talentQuerySchema,
  talentSubmissionSchema,
} from "@/lib/schemas/content";

// GET /api/v1/talents - Get all talents (with filtering/pagination)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const result = talentQuerySchema.safeParse(queryParams);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.format() },
        { status: 400 },
      );
    }

    const { page, limit, category, status } = result.data;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("talents")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    if (status) {
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
        pages: Math.ceil((count || 0) / limit),
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

    const result = talentSubmissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 },
      );
    }

    const {
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
    } = result.data;

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

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[api/talents] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
