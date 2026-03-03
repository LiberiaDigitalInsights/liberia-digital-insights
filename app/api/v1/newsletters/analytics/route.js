import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/newsletters/analytics - Get newsletter analytics (Admin/Editor)
async function getHandler() {
  try {
    const { data: subscribers, error: subscribersError } = await supabase
      .from("newsletter_subscribers")
      .select("status, subscribed_at, unsubscribed_at");

    if (subscribersError) throw subscribersError;

    const totalSubscribers = subscribers.length;
    const activeSubscribers = subscribers.filter(
      (s) => s.status === "active",
    ).length;
    const unsubscribedSubscribers = subscribers.filter(
      (s) => s.status === "unsubscribed",
    ).length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSubscriptions = subscribers.filter(
      (s) => new Date(s.subscribed_at) >= thirtyDaysAgo,
    ).length;

    const recentUnsubscriptions = subscribers.filter(
      (s) => s.unsubscribed_at && new Date(s.unsubscribed_at) >= thirtyDaysAgo,
    ).length;

    const { data: newsletters, error: newslettersError } = await supabase
      .from("newsletters")
      .select("status, sent_date, subscriber_count");

    if (newslettersError) throw newslettersError;

    const sentNewsletters = newsletters.filter(
      (n) => n.status === "sent",
    ).length;
    const draftNewsletters = newsletters.filter(
      (n) => n.status === "draft",
    ).length;
    const scheduledNewsletters = newsletters.filter(
      (n) => n.status === "scheduled",
    ).length;

    const totalRecipients = newsletters.reduce(
      (sum, n) => sum + (n.subscriber_count || 0),
      0,
    );

    return NextResponse.json({
      subscribers: {
        total: totalSubscribers,
        active: activeSubscribers,
        unsubscribed: unsubscribedSubscribers,
        recentSubscriptions,
        recentUnsubscriptions,
        growthRate:
          totalSubscribers > 0
            ? ((recentSubscriptions / totalSubscribers) * 100).toFixed(1)
            : 0,
      },
      newsletters: {
        total: newsletters.length,
        sent: sentNewsletters,
        drafts: draftNewsletters,
        scheduled: scheduledNewsletters,
        totalRecipients,
      },
      metrics: {
        averageSubscribersPerNewsletter:
          sentNewsletters > 0
            ? Math.round(totalRecipients / sentNewsletters)
            : 0,
        unsubscribeRate:
          totalSubscribers > 0
            ? ((unsubscribedSubscribers / totalSubscribers) * 100).toFixed(1)
            : 0,
      },
    });
  } catch (error) {
    console.error("[api/newsletters/analytics] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ["admin", "editor"]);
