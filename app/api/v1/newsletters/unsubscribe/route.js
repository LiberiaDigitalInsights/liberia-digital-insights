import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { unsubscribeSchema } from "@/lib/schemas/newsletter";

// POST /api/v1/newsletters/unsubscribe - Public newsletter unsubscription
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input
    const validated = unsubscribeSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 },
      );
    }

    const { token } = validated.data;

    // Find subscriber by token
    const { data: subscriber, error: findError } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("unsubscribe_token", token)
      .single();

    if (findError || !subscriber) {
      return NextResponse.json(
        { error: "Invalid unsubscribe token" },
        { status: 404 },
      );
    }

    if (subscriber.status === "unsubscribed") {
      return NextResponse.json(
        { error: "Already unsubscribed" },
        { status: 400 },
      );
    }

    // Update status to unsubscribed
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscriber.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: "Successfully unsubscribed from newsletter",
      subscriber: data,
    });
  } catch (error) {
    console.error("[api/newsletters/unsubscribe] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
