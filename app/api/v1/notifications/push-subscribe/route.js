import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyAuth } from "@/lib/apiAuth";

/**
 * Handles browser push subscription registration.
 * POST /api/v1/notifications/push-subscribe
 */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscription, action } = await req.json();

    if (action === "subscribe") {
      if (!subscription || !subscription.endpoint) {
        return NextResponse.json(
          { error: "Invalid subscription" },
          { status: 400 },
        );
      }

      // Upsert the subscription for this user
      // We use the endpoint as a unique identifier for the subscription
      const { error } = await supabase.from("push_subscriptions").upsert(
        {
          user_id: auth.user.id,
          subscription: subscription,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "subscription->>endpoint" }, // Need to ensure the DB supports this or just use a simpler upsert if needed
      );

      // Fallback if the complex upsert fails: check if exists, then insert/update
      if (error) {
        console.warn(
          "[PushSubscribe] Upsert failed, trying manual check:",
          error.message,
        );
        const { data: existing } = await supabase
          .from("push_subscriptions")
          .select("id")
          .eq("subscription->>endpoint", subscription.endpoint)
          .single();

        if (existing) {
          await supabase
            .from("push_subscriptions")
            .update({
              user_id: auth.user.id,
              subscription,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        } else {
          await supabase
            .from("push_subscriptions")
            .insert({ user_id: auth.user.id, subscription });
        }
      }

      return NextResponse.json({ success: true });
    }

    if (action === "unsubscribe") {
      if (!subscription?.endpoint) {
        return NextResponse.json(
          { error: "Invalid subscription" },
          { status: 400 },
        );
      }

      await supabase
        .from("push_subscriptions")
        .delete()
        .eq("subscription->>endpoint", subscription.endpoint);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[PushSubscribe] API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
