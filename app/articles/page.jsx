"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { H1 } from "@/components/ui/Typography";
import ArticleCard from "@/components/articles/ArticleCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import AdSlot from "@/components/ads/AdSlot";
import { useArticles, useCategories } from "@/hooks/useBackendApi";
import { MotionGrid, MotionItem } from "@/components/ui/MotionWrapper";

function ArticlesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") || "all";
  const page = Number(searchParams.get("page")) || 1;

  const {
    data: articlesData,
    loading,
    error,
  } = useArticles({
    page,
    limit: 12,
    ...(category !== "all" && { category }),
  });

  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.categories || [];
  const articles = articlesData?.articles || [];
  const pagination = articlesData?.pagination || { total: 0, totalPages: 1 };
  const totalPages = pagination.totalPages || 1;

  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", cat);
    params.set("page", "1");
    router.push(`/articles?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/articles?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="mb-8 h-8 w-48 bg-surface rounded"></div>
        <div className="mb-8 h-4 w-96 bg-surface rounded"></div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-surface rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
            category === "all"
              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
              : "bg-surface text-text hover:bg-brand-500/10"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => handleCategoryChange(cat.slug)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              category === cat.slug
                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                : "bg-surface text-text hover:bg-brand-500/10"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="mb-6 text-sm text-muted">
        Showing {articles.length} of {pagination.total || 0} articles
        {category !== "all" && ` in ${category}`}
      </div>

      {/* Articles Grid */}
      <MotionGrid className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.length > 0 ? (
          articles.map((article, index) => {
            const isThirdArticle = (index + 1) % 4 === 0;
            return (
              <React.Fragment key={article.id}>
                <MotionItem>
                  <ArticleCard
                    image={article.cover_image_url}
                    title={article.title}
                    category={article.category?.name || "Uncategorized"}
                    date={new Date(article.published_at).toLocaleDateString()}
                    readTime={Math.ceil((article.content?.length || 0) / 1000)}
                    href={`/article/${article.slug}`}
                  />
                </MotionItem>
                {isThirdArticle && index < articles.length - 1 && (
                  <div className="col-span-full py-4">
                    <AdSlot position="inline" />
                  </div>
                )}
              </React.Fragment>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-muted">
            No articles found in this category.
          </div>
        )}
      </MotionGrid>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "solid" : "outline"}
              size="sm"
              onClick={() => handlePageChange(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <header className="mb-8">
        <H1 className="mb-4 text-3xl font-bold">Articles</H1>
        <p className="text-lg text-muted">
          Explore our collection of tech insights, stories, and analysis
        </p>
      </header>

      <Suspense
        fallback={
          <div className="text-center py-12 text-muted">
            Loading articles...
          </div>
        }
      >
        <ArticlesContent />
      </Suspense>
    </div>
  );
}
