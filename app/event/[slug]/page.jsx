import React from "react";
import EventDetailClient from "@/components/events/EventDetailClient";
import { supabase } from "@/lib/supabase";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { data: event } = await supabase
    .from("events")
    .select("title, description, cover_image_url")
    .eq("slug", slug)
    .single();

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  // Strip HTML for description
  const cleanDescription =
    event.description?.replace(/<[^>]*>?/gm, "").substring(0, 160) ||
    "Join us for this exciting event.";

  return {
    title: event.title,
    description: cleanDescription,
    openGraph: {
      title: event.title,
      description: cleanDescription,
      images: event.cover_image_url ? [event.cover_image_url] : [],
      type: "article", // Next.js suggests 'article' for events/blog posts
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: cleanDescription,
      images: event.cover_image_url ? [event.cover_image_url] : [],
    },
  };
}

export default function EventPage() {
  return <EventDetailClient />;
}
