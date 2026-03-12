"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import NewsCard from "@/components/articles/NewsCard";
import SectionHeading from "@/components/ui/SectionHeading";
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
  const categories = categoriesData?.data || [];
  const articles = articlesData?.articles || [];
  const pagination = articlesData?.pagination || { total: 0, pages: 1 };
  const totalPages = pagination.pages || 1;

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
        <div className="mb-8 flex flex-wrap gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-24 bg-surface rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl bg-surface/30 p-5 space-y-4 border border-border/10"
            >
              <div className="aspect-video rounded-2xl bg-surface" />
              <div className="h-4 w-3/4 bg-surface rounded" />
              <div className="h-3 w-1/2 bg-surface rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Category Filters */}
      <div className="mb-10 flex flex-wrap gap-2">
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
      <p className="mb-8 text-sm text-muted">
        Showing {articles.length} of {pagination.total || 0} articles
        {category !== "all" && ` in "${category}"`}
      </p>

      {/* Articles Grid */}
      <MotionGrid className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.length > 0 ? (
          articles.map((article, index) => {
            const isThirdArticle = (index + 1) % 4 === 0;
            return (
              <React.Fragment key={article.id}>
                <MotionItem>
                  <NewsCard
                    id={article.id}
                    image={article.cover_image_url}
                    title={article.title}
                    excerpt={article.excerpt}
                    category={article.category?.name || "Technology"}
                    author={article.author}
                    date={new Date(article.published_at).toLocaleDateString()}
                    readTime={Math.ceil((article.content?.length || 0) / 1000)}
                    href={`/article/${article.slug}`}
                    noBorder
                    className="bg-surface/30 h-full"
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
          <div className="col-span-full py-16 text-center text-muted">
            <p className="text-lg font-medium">No articles found.</p>
            <p className="mt-2 text-sm opacity-60">
              Try selecting a different category.
            </p>
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
      {/* Page Header */}
      <header className="mb-12">
        <SectionHeading
          subtitle="Explore our collection of tech insights, stories, and analysis"
          align="left"
        >
          Articles
        </SectionHeading>
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
