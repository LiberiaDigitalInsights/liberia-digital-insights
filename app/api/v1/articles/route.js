import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";
import {
  articleQuerySchema,
  articleSubmissionSchema,
} from "@/lib/schemas/content";

// GET /api/v1/articles - List articles with pagination and filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const result = articleQuerySchema.safeParse(queryParams);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.format() },
        { status: 400 },
      );
    }

    const { page, limit, status, category, tag, search } = result.data;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("articles")
      .select(
        `
        *,
        categories(name, slug),
        users(first_name, last_name, email, role)
      `,
        { count: "exact" },
      )
      .eq("status", status || "published")
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq("categories.slug", category);
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
    const transformedData = data.map((article) => {
      // Find the user data (handles both array and object responses)
      const userData = Array.isArray(article.users)
        ? article.users[0]
        : article.users;

      return {
        ...article,
        category: article.categories
          ? Array.isArray(article.categories)
            ? article.categories[0]
            : article.categories
          : null,
        author: {
          name:
            `${userData?.first_name || ""} ${userData?.last_name || ""}`.trim() ||
            "LDI Staff",
          role: userData?.role || "Editor",
          email: userData?.email || null,
        },
        categories: undefined,
        users: undefined,
      };
    });

    return NextResponse.json({
      articles: transformedData,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit),
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

    const result = articleSubmissionSchema.safeParse(body);
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
