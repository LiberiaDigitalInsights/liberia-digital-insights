import React from "react";
import CategoryDetailClient from "@/components/categories/CategoryDetailClient";
import { supabase } from "@/lib/supabase";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { data: categories } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .single();

  const name = categories?.name || slug;
  const description =
    categories?.description ||
    `Explore our latest articles and insights in the ${name} category.`;

  return {
    title: name,
    description: description,
    openGraph: {
      title: `${name} | Liberia Digital Insights`,
      description: description,
    },
  };
}

export default function CategoryPage() {
  return <CategoryDetailClient />;
}
