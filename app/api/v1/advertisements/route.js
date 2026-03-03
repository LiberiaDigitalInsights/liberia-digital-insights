import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/advertisements - Get all advertisements
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const offset = (page - 1) * limit;

    let query = supabase
      .from("advertisements")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq("status", status);
    if (type) query = query.eq("type", type);

    const { data, error, count } = await query;

    if (error) {
      if (
        error.message?.includes("schema cache") ||
        error.code === "PGRST116"
      ) {
        return NextResponse.json({
          advertisements: [],
          pagination: { page, limit, total: 0, pages: 0 },
        });
      }
      throw error;
    }

    return NextResponse.json({
      advertisements: data || [],
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("[api/advertisements] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/v1/advertisements - Create new advertisement (Admin/Editor)
async function postHandler(request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      type,
      image_url,
      target_url,
      start_date,
      end_date,
      status = "active",
      metadata,
    } = body;

    const { data, error } = await supabase
      .from("advertisements")
      .insert([
        {
          title,
          slug,
          description,
          type,
          image_url,
          target_url,
          start_date,
          end_date,
          status,
          metadata,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[api/advertisements] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const POST = withAuth(postHandler, ["admin", "editor"]);
