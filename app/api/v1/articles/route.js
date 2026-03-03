import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/articles - List articles with pagination and filtering
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
      .from("articles")
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
    const transformedData = data.map((article) => ({
      ...article,
      category: article.categories
        ? Array.isArray(article.categories)
          ? article.categories[0]
          : article.categories
        : null,
      categories: undefined,
    }));

    return NextResponse.json({
      articles: transformedData,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("[api/articles] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/v1/articles - Create new article (Auth required)
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

    // Use current user ID as author if not provided (and if user is authenticated)
    const finalAuthorId = author_id || request.user?.id;

    const { data, error } = await supabase
      .from("articles")
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
    console.error("[api/articles] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Export the protected POST handler
export const POST = withAuth(postHandler, ["admin", "editor"]);
