import React from "react";
import InsightDetailClient from "@/components/insights/InsightDetailClient";
import { supabase } from "@/lib/supabase";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { data: insight } = await supabase
    .from("insights")
    .select("title, excerpt, cover_image_url")
    .eq("slug", slug)
    .single();

  if (!insight) {
    return {
      title: "Insight Not Found",
    };
  }

  return {
    title: insight.title,
    description:
      insight.excerpt ||
      "Unlock digital intelligence with Liberia Digital Insights.",
    openGraph: {
      title: insight.title,
      description: insight.excerpt,
      images: insight.cover_image_url ? [insight.cover_image_url] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: insight.title,
      description: insight.excerpt,
      images: insight.cover_image_url ? [insight.cover_image_url] : [],
    },
  };
}

export default function InsightPage() {
  return <InsightDetailClient />;
}
