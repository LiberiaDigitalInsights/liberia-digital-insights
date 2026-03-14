import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/analytics/stats - Get aggregate dashboard stats (Admin/Editor)
async function getHandler() {
  try {
    const queries = [
      {
        name: "articles",
        query: supabase
          .from("articles")
          .select("*", { count: "exact", head: true }),
      },
      {
        name: "subscribers",
        query: supabase
          .from("newsletter_subscribers")
          .select("*", { count: "exact", head: true }),
      },
      {
        name: "pendingReviews",
        query: supabase
          .from("articles")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
      },
      {
        name: "podcasts",
        query: supabase
          .from("podcasts")
          .select("*", { count: "exact", head: true }),
      },
      {
        name: "events",
        query: supabase
          .from("events")
          .select("*", { count: "exact", head: true }),
      },
      {
        name: "users",
        query: supabase
          .from("users")
          .select("*", { count: "exact", head: true }),
      },
    ];

    const results = await Promise.allSettled(queries.map((q) => q.query));

    const stats = {};
    results.forEach((result, index) => {
      const qName = queries[index].name;
      if (result.status === "fulfilled") {
        const { count, error } = result.value;
        if (error) {
          console.error(`[api/analytics/stats] Error in ${qName}:`, error);
          stats[qName] = 0; // Fallback
        } else {
          stats[qName] = count || 0;
        }
      } else {
        console.error(
          `[api/analytics/stats] Promise rejected for ${qName}:`,
          result.reason,
        );
        stats[qName] = 0; // Fallback
      }
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[api/analytics/stats] Global GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats", details: error.message },
      { status: 500 },
    );
  }
}

export const GET = withAuth(getHandler, ["admin", "editor"]);
