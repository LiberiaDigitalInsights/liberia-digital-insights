import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/insights/[id] - Get single insight by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("insights")
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
      return NextResponse.json({ error: "Insight not found" }, { status: 404 });
    }

    // Increment view count
    try {
      await supabase.rpc("increment_view_count", {
        table_name: "insights",
        record_id: id,
      });
    } catch (rpcError) {
      console.warn("[api/insights/id] View count increment failed:", rpcError);
    }

    // Transform data for frontend parity
    const transformedInsight = {
      ...data,
      category: data.categories
        ? Array.isArray(data.categories)
          ? data.categories[0]
          : data.categories
        : null,
      categories: undefined,
    };

    return NextResponse.json(transformedInsight);
  } catch (error) {
    console.error("[api/insights/id] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/v1/insights/[id] - Update insight
async function putHandler(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updates = { ...body };

    if (updates.status === "published" && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("insights")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: "Insight not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/insights/id] PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/v1/insights/[id] - Delete insight
async function deleteHandler(request, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabase.from("insights").delete().eq("id", id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[api/insights/id] DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const PUT = withAuth(putHandler, ["admin", "editor"]);
export const DELETE = withAuth(deleteHandler, ["admin", "editor"]);
