import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/insights - List insights with pagination and filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "published";
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const offset = (page - 1) * limit;

    let query = supabase
      .from("insights")
      .select(
        `
        *,
        categories(name, slug),
        users(first_name, last_name, email)
      `,
        { count: "exact" },
      )
      .eq("status", status)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq("categories.slug", category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // Transform data for frontend parity
    const transformedData = data.map((insight) => ({
      ...insight,
      category: insight.categories
        ? Array.isArray(insight.categories)
          ? insight.categories[0]
          : insight.categories
        : null,
      categories: undefined,
    }));

    return NextResponse.json({
      insights: transformedData,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("[api/insights] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/v1/insights - Create new insight
async function postHandler(request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      cover_image_url,
      category_id,
      author_id,
      status = "draft",
      tags,
      published_at,
    } = body;

    const finalAuthorId = author_id || request.user?.id;

    const { data, error } = await supabase
      .from("insights")
      .insert([
        {
          title,
          slug,
          excerpt,
          content,
          cover_image_url,
          category_id,
          author_id: finalAuthorId,
          status,
          tags,
          published_at:
            status === "published"
              ? published_at || new Date().toISOString()
              : null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[api/insights] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const POST = withAuth(postHandler, ["admin", "editor"]);
