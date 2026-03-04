import React from "react";
import ArticleDetailClient from "@/components/articles/ArticleDetailClient";
import { supabase } from "@/lib/supabase";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { data: article } = await supabase
    .from("articles")
    .select("title, excerpt, cover_image_url")
    .eq("slug", slug)
    .single();

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: article.title,
    description:
      article.excerpt ||
      "Read more about this article on Liberia Digital Insights.",
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.cover_image_url ? [article.cover_image_url] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.cover_image_url ? [article.cover_image_url] : [],
    },
  };
}

export default function ArticlePage() {
  return <ArticleDetailClient />;
}
