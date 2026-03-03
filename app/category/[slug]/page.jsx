"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { H1, Muted } from "@/components/ui/Typography";
import ArticleCard from "@/components/articles/ArticleCard";
import { useArticles, useCategories } from "@/hooks/useBackendApi";
import { MotionGrid, MotionItem } from "@/components/ui/MotionWrapper";

export default function CategoryDetailPage() {
  const { slug } = useParams();
  const { data: categoriesData } = useCategories();
  const category = categoriesData?.categories?.find((c) => c.slug === slug) || {
    name: slug,
    description: "",
  };

  const { data: articlesData, loading } = useArticles({
    category: slug,
    limit: 40,
  });
  const articles = articlesData?.articles || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <nav className="mb-8 text-sm text-muted flex gap-2 font-bold uppercase tracking-widest bg-brand-500/5 px-4 py-2 rounded-full w-fit">
        <Link href="/" className="hover:text-brand-500 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/categories"
          className="hover:text-brand-500 transition-colors"
        >
          Categories
        </Link>
        <span>/</span>
        <span className="text-brand-500">{category.name}</span>
      </nav>

      <header className="mb-12">
        <H1 className="mb-4 text-4xl md:text-6xl font-black tracking-tight">
          {category.name}
        </H1>
        <Muted className="text-lg max-w-2xl">
          {category.description ||
            `Explore our latest articles and insights in the ${category.name} category.`}
        </Muted>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="animate-pulse h-64 bg-surface rounded-xl"
            ></div>
          ))}
        </div>
      ) : articles.length > 0 ? (
        <MotionGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <MotionItem key={article.id}>
              <ArticleCard
                image={article.cover_image_url}
                title={article.title}
                category={article.category?.name || "Uncategorized"}
                date={new Date(article.published_at).toLocaleDateString()}
                readTime={Math.ceil((article.content?.length || 0) / 1000)}
                href={`/article/${article.slug}`}
              />
            </MotionItem>
          ))}
        </MotionGrid>
      ) : (
        <div className="py-20 text-center text-muted font-medium italic border-2 border-dashed border-border rounded-2xl">
          No articles found in this category yet.
        </div>
      )}
    </div>
  );
}
