import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/articles/[id] - Get single article by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        categories(name, slug),
        users(first_name, last_name, email)
      `,
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Increment view count
    try {
      await supabase.rpc("increment_view_count", {
        table_name: "articles",
        record_id: id,
      });
    } catch (rpcError) {
      console.warn("[api/articles/id] View count increment failed:", rpcError);
    }

    // Transform data for frontend parity
    const transformedArticle = {
      ...data,
      category: data.categories
        ? Array.isArray(data.categories)
          ? data.categories[0]
          : data.categories
        : null,
      categories: undefined,
    };

    return NextResponse.json(transformedArticle);
  } catch (error) {
    console.error("[api/articles/id] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/v1/articles/[id] - Update article
async function putHandler(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updates = { ...body };

    // If publishing and no published_at, set it
    if (updates.status === "published" && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("articles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/articles/id] PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/v1/articles/[id] - Delete article
async function deleteHandler(request, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[api/articles/id] DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const PUT = withAuth(putHandler, ["admin", "editor"]);
export const DELETE = withAuth(deleteHandler, ["admin", "editor"]);
