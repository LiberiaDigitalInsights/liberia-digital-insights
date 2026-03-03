import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/training - Get all training courses
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    const offset = (page - 1) * limit;

    let query = supabase
      .from("training")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq("status", status);
    if (type) query = query.eq("type", type);

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,instructor.ilike.%${search}%`,
      );
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({
      training: data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("[api/training] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/v1/training - Create new training course (Admin/Editor)
async function postHandler(request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      cover_image_url,
      type,
      duration,
      instructor,
      max_students,
      start_date,
      end_date,
      status = "upcoming",
    } = body;

    const { data, error } = await supabase
      .from("training")
      .insert([
        {
          title,
          slug,
          description,
          cover_image_url,
          type,
          duration,
          instructor,
          max_students,
          start_date,
          end_date,
          status,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[api/training] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const POST = withAuth(postHandler, ["admin", "editor"]);
