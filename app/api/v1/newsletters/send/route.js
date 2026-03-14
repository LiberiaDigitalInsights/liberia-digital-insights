import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";
import { sendEmail } from "@/lib/email";
import { wrapNewsletter } from "@/lib/newsletter_template";

// POST /api/v1/newsletters/send - Dispatch newsletter to all active subscribers
async function postHandler(request) {
  try {
    const { newsletter_id, limit, subscriber_ids } = await request.json();

    if (!newsletter_id) {
      return NextResponse.json(
        { error: "Newsletter ID is required" },
        { status: 400 },
      );
    }

    // 1. Fetch newsletter details
    const { data: newsletter, error: fetchError } = await supabase
      .from("newsletters")
      .select("*")
      .eq("id", newsletter_id)
      .single();

    if (fetchError || !newsletter) {
      return NextResponse.json(
        { error: "Newsletter not found" },
        { status: 404 },
      );
    }

    // 2. Fetch active subscribers
    let query = supabase
      .from("newsletter_subscribers")
      .select("id, email")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    // Filter by specific IDs if provided
    if (Array.isArray(subscriber_ids) && subscriber_ids.length > 0) {
      query = query.in("id", subscriber_ids);
    } else if (limit && parseInt(limit) > 0) {
      // Fallback to limit if no specific IDs are provided
      query = query.limit(parseInt(limit));
    }

    const { data: subscribers, error: subError } = await query;

    if (subError) throw subError;

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: "No active subscribers found" },
        { status: 400 },
      );
    }

    console.log(
      `[api/newsletters/send] Sending "${newsletter.subject}" to ${subscribers.length} subscribers...`,
    );

    // 3. Send emails
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.CORS_ORIGIN ||
      "http://localhost:3000";

    const sendPromises = subscribers.map((sub) => {
      const unsubLink = `${siteUrl}/newsletter/unsubscribe?id=${sub.id}`;

      return sendEmail({
        to: sub.email,
        subject: newsletter.subject,
        html: wrapNewsletter(
          newsletter.content,
          newsletter.subject,
          "Liberia Digital Insights",
          unsubLink,
          siteUrl,
        ),
        settings: {
          siteName: "Liberia Digital Insights",
        },
      }).catch((err) => {
        console.error(`Failed to send newsletter to ${sub.email}:`, err);
        return null;
      });
    });

    const results = await Promise.all(sendPromises);
    const successCount = results.filter((r) => r !== null).length;

    // 4. Update newsletter status
    const { error: updateError } = await supabase
      .from("newsletters")
      .update({
        status: "sent",
        sent_date: new Date().toISOString(),
        subscriber_count: successCount,
      })
      .eq("id", newsletter_id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: `Newsletter sent successfully to ${successCount} subscribers.`,
      recipientCount: successCount,
    });
  } catch (error) {
    console.error("[api/newsletters/send] error:", error);
    return NextResponse.json(
      { error: "Failed to dispatch newsletter: " + error.message },
      { status: 500 },
    );
  }
}

export const POST = withAuth(postHandler, ["admin", "editor"]);
