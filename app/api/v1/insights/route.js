import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";
import {
  insightQuerySchema,
  insightSubmissionSchema,
} from "@/lib/schemas/content";

// GET /api/v1/insights - List insights with pagination and filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const result = insightQuerySchema.safeParse(queryParams);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.format() },
        { status: 400 },
      );
    }

    const { page, limit, status, category, tag, search } = result.data;
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
      .eq("status", status || "published")
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      // Resolve slug → category ID first, then filter by category_id
      const { data: categoryData, error: catError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .single();

      if (catError || !categoryData) {
        return NextResponse.json({
          insights: [],
          pagination: { page, limit, total: 0, pages: 0 },
        });
      }

      query = query.eq("category_id", categoryData.id);
    }

    if (tag) {
      query = query.contains("tags", [tag]);
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
        pages: Math.ceil((count || 0) / limit),
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

    const result = insightSubmissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 },
      );
    }

    const {
      title,
      slug,
      excerpt,
      content,
      cover_image_url,
      category_id,
      author_id,
      status,
      tags,
      published_at,
    } = result.data;

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
