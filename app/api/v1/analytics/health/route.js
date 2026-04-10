import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/analytics/health - Platform health metrics (Admin only)
async function getHandler() {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoIso = thirtyDaysAgo.toISOString();

    // Run all queries in parallel
    const [
      articleStats,
      podcastStats,
      eventStats,
      insightStats,
      userStats,
      newUsersResult,
      activeUsersResult,
      pendingArticles,
      archivedContent,
      newsletterStats,
      auditLogsRecent,
      invitationStats,
    ] = await Promise.allSettled([
      // Article status breakdown
      supabase.from("articles").select("status"),
      // Podcast status breakdown
      supabase.from("podcasts").select("status"),
      // Event status breakdown
      supabase.from("events").select("status"),
      // Insight status breakdown
      supabase.from("insights").select("status"),
      // Total users
      supabase.from("users").select("*", { count: "exact", head: true }),
      // New users in last 30 days
      supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgoIso),
      // Active users (logged in within 30 days)
      supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("last_login", thirtyDaysAgoIso),
      // Pending review count
      supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      // Total archived content (across all tables)
      Promise.all([
        supabase
          .from("articles")
          .select("*", { count: "exact", head: true })
          .eq("status", "archived"),
        supabase
          .from("podcasts")
          .select("*", { count: "exact", head: true })
          .eq("status", "archived"),
        supabase
          .from("insights")
          .select("*", { count: "exact", head: true })
          .eq("status", "archived"),
        supabase
          .from("events")
          .select("*", { count: "exact", head: true })
          .eq("status", "archived"),
      ]),
      // Newsletter subscribers
      supabase.from("newsletter_subscribers").select("status"),
      // Recent audit logs (last 30 days)
      supabase
        .from("audit_logs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgoIso),
      // Pending invitations
      supabase.from("invitations").select("accepted_at, expires_at"),
    ]);

    // Helper to get count from settled result
    const getCount = (settled) => {
      if (settled.status === "fulfilled") return settled.value?.count || 0;
      return 0;
    };

    // Helper to get data from settled result
    const getData = (settled) => {
      if (settled.status === "fulfilled") return settled.value?.data || [];
      return [];
    };

    // Status breakdown helper
    const statusBreakdown = (data) => {
      return data.reduce((acc, row) => {
        acc[row.status] = (acc[row.status] || 0) + 1;
        return acc;
      }, {});
    };

    // Process content status breakdowns
    const articles = statusBreakdown(getData(articleStats));
    const podcasts = statusBreakdown(getData(podcastStats));
    const events = statusBreakdown(getData(eventStats));
    const insights = statusBreakdown(getData(insightStats));

    // Process archived content
    let totalArchived = 0;
    if (archivedContent.status === "fulfilled") {
      for (const res of archivedContent.value) {
        totalArchived += res.count || 0;
      }
    }

    // Process newsletter stats
    const newsletterData = getData(newsletterStats);
    const newsletterBreakdown = statusBreakdown(newsletterData);

    // Process invitation stats
    const invitationData = getData(invitationStats);
    const pendingInvites = invitationData.filter(
      (i) => !i.accepted_at && new Date(i.expires_at) > now,
    ).length;
    const expiredInvites = invitationData.filter(
      (i) => !i.accepted_at && new Date(i.expires_at) <= now,
    ).length;
    const acceptedInvites = invitationData.filter(
      (i) => !!i.accepted_at,
    ).length;

    return NextResponse.json({
      generatedAt: now.toISOString(),
      content: {
        articles: {
          total: Object.values(articles).reduce((a, b) => a + b, 0),
          ...articles,
        },
        podcasts: {
          total: Object.values(podcasts).reduce((a, b) => a + b, 0),
          ...podcasts,
        },
        events: {
          total: Object.values(events).reduce((a, b) => a + b, 0),
          ...events,
        },
        insights: {
          total: Object.values(insights).reduce((a, b) => a + b, 0),
          ...insights,
        },
        totalArchived,
      },
      users: {
        total: getCount(userStats),
        newLast30Days: getCount(newUsersResult),
        activeLast30Days: getCount(activeUsersResult),
      },
      moderation: {
        pendingReviews: getCount(pendingArticles),
      },
      newsletter: {
        total: newsletterData.length,
        active: newsletterBreakdown["active"] || 0,
        unsubscribed: newsletterBreakdown["unsubscribed"] || 0,
      },
      invitations: {
        pending: pendingInvites,
        expired: expiredInvites,
        accepted: acceptedInvites,
        total: invitationData.length,
      },
      auditActivity: {
        eventsLast30Days: getCount(auditLogsRecent),
      },
    });
  } catch (error) {
    console.error("[api/analytics/health] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ["admin"]);
