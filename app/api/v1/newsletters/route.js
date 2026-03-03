import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth, optionalAuth } from "@/lib/apiAuth";

// GET /api/v1/newsletters - List all newsletters (Public/Admin/Editor)
async function getHandler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const offset = (page - 1) * limit;

    // Check if user is admin/editor for full access
    const isAdmin =
      request.user && ["admin", "editor"].includes(request.user.role);

    let query = supabase.from("newsletters").select("*", { count: "exact" });

    // Public users can only see 'sent' newsletters
    if (!isAdmin) {
      query = query.eq("status", "sent");
      // Optionally exclude content for public list to save bandwidth
      query = query.select(
        "id, subject, preview, cover_image_url, sent_date, subscriber_count, created_at",
      );
    } else if (status) {
      query = query.eq("status", status);
    }

    query = query
      .order(isAdmin ? "created_at" : "sent_date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search)
      query = query.or(`subject.ilike.%${search}%,preview.ilike.%${search}%`);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({
      newsletters: data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("[api/newsletters] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/v1/newsletters - Create new newsletter (Admin/Editor)
async function postHandler(request) {
  try {
    const body = await request.json();
    const {
      subject,
      preview,
      content,
      cover_image_url,
      scheduled_date,
      status = "draft",
    } = body;

    const { data, error } = await supabase
      .from("newsletters")
      .insert([
        {
          subject,
          preview,
          content,
          cover_image_url,
          scheduled_date,
          status,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[api/newsletters] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = optionalAuth(getHandler);
export const POST = withAuth(postHandler, ["admin", "editor"]);
