import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/v1/articles/slug/[slug] - Get single article by slug
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        categories(name, slug),
        users(first_name, last_name, email)
      `,
      )
      .eq("slug", slug)
      .limit(1);

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const article = data[0];

    // Increment view count using RCP (Remote Procedure Call)
    // Legacy used increment_view_count RPC
    try {
      await supabase.rpc("increment_view_count", {
        table_name: "articles",
        record_id: article.id,
      });
    } catch (rpcError) {
      console.warn(
        "[api/articles/slug] View count increment failed:",
        rpcError,
      );
    }

    // Transform data for frontend parity
    const transformedArticle = {
      ...article,
      category: article.categories
        ? Array.isArray(article.categories)
          ? article.categories[0]
          : article.categories
        : null,
      categories: undefined,
    };

    return NextResponse.json({ article: transformedArticle });
  } catch (error) {
    console.error("[api/articles/slug] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
