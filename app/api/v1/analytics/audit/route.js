import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/analytics/audit - Get audit logs (Admin only)
async function getHandler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
    const action = searchParams.get("action") || "all";
    const actorId = searchParams.get("actor_id") || "all";

    const offset = (page - 1) * limit;

    let query = supabase
      .from("audit_logs")
      .select(
        `
        *,
        actor:users!actor_id (
          id,
          first_name,
          last_name,
          email
        )
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (action !== "all") {
      query = query.eq("action", action);
    }

    if (actorId !== "all") {
      query = query.eq("actor_id", actorId);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      logs: data || [],
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("[api/analytics/audit] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 },
    );
  }
}

export const GET = withAuth(getHandler, ["admin"]);
