import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { subscribeSchema } from "@/lib/schemas/newsletter";
import crypto from "crypto";

// POST /api/v1/newsletters/subscribe - Public newsletter subscription
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input using Zod
    const validated = subscribeSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 },
      );
    }

    const { email, name, company, org, position } = validated.data;

    // Check if user already subscribed
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("email", email)
      .single();

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 409 },
      );
    }

    // Generate unsubscribe token
    const unsubscribeToken = crypto.randomBytes(32).toString("hex");

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert([
        {
          name,
          email,
          company,
          org,
          position,
          subscribed_at: new Date().toISOString(),
          status: "active",
          unsubscribe_token: unsubscribeToken,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // TODO: Trigger welcome email in a non-blocking way
    // In Next.js we might use an Edge Function or a separate background job
    // for production, but for now we follow the "non-blocking" spirit.

    return NextResponse.json(
      {
        message: "Successfully subscribed to newsletter",
        subscriber: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[api/newsletters/subscribe] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
