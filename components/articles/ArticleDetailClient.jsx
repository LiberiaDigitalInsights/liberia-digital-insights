"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { H1, H2, Muted } from "@/components/ui/Typography";
import NewsCard from "@/components/articles/NewsCard";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  useArticle,
  useArticles,
  usePodcasts,
  useEvents,
} from "@/hooks/useBackendApi";
import ContentRenderer from "@/components/ui/ContentRenderer";
import BookmarkButton from "@/components/ui/BookmarkButton";
import ShareButton from "@/components/ui/ShareButton";
import LazyImage from "@/components/LazyImage";
import PodcastWidget from "@/components/sidebar/PodcastWidget";
import EventsWidget from "@/components/sidebar/EventsWidget";
import NewsletterWidget from "@/components/sidebar/NewsletterWidget";
import AdSlot from "@/components/ads/AdSlot";

export default function ArticleDetailClient() {
  const { slug } = useParams();
  const router = useRouter();

  // Fetch article by slug from backend
  const {
    data: articleData,
    loading: articleLoading,
    error: articleError,
  } = useArticle(slug);
  const { data: relatedArticlesData, loading: relatedLoading } = useArticles({
    limit: 3,
  });
  const { data: podcastsData } = usePodcasts({ limit: 3 });
  const { data: eventsData } = useEvents({ limit: 3 });

  const article = articleData?.article;
  const relatedArticles = (relatedArticlesData?.articles || []).filter(
    (a) => a.id !== article?.id && a.slug !== slug,
  );

  // Loading state
  if (articleLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-32 bg-surface rounded"></div>
          <div className="mb-4 h-12 w-3/4 bg-surface rounded"></div>
          <div className="mb-8 h-64 bg-surface rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-surface rounded w-full"></div>
            <div className="h-4 bg-surface rounded w-full"></div>
            <div className="h-4 bg-surface rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (articleError || !article) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 text-center">
        <H1 className="mb-4 text-3xl font-bold">Article Not Found</H1>
        <p className="mb-8 text-muted">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-brand-600"
        >
          ← Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-text">
          Home
        </Link>
        {" / "}
        <Link href="/articles" className="hover:text-text">
          Articles
        </Link>
        {" / "}
        <span>{article.category?.name || "Uncategorized"}</span>
      </nav>

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-6 text-sm text-muted hover:text-text transition-colors duration-200"
      >
        ← Back
      </button>

      {/* Article Header */}
      <header className="mb-8">
        {article.category && (
          <div className="mb-4">
            <Badge variant="solid">{article.category.name}</Badge>
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <H1 className="mb-4 flex-1 text-3xl md:text-4xl font-bold">
            {article.title}
          </H1>
          <div className="flex items-center gap-2 mt-1">
            <ShareButton
              title={article.title}
              url={typeof window !== "undefined" ? window.location.href : ""}
            />
            <BookmarkButton
              contentId={article.id}
              contentType="article"
              size="lg"
            />
          </div>
        </div>
        {article.excerpt && (
          <p className="mb-6 text-xl text-muted">{article.excerpt}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
          <span>By {article.author?.name || "LDI Staff"}</span>
          {article.published_at && <span>•</span>}
          {article.published_at && (
            <span>{new Date(article.published_at).toLocaleDateString()}</span>
          )}
          {article.content && <span>•</span>}
          {article.content && (
            <span>{Math.ceil(article.content.length / 1000)} min read</span>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {article.cover_image_url && (
        <div className="mb-8 overflow-hidden rounded-lg aspect-video relative">
          <LazyImage
            src={article.cover_image_url}
            alt={article.title}
            className="h-full w-full"
            priority
          />
        </div>
      )}

      {/* Article Content */}
      <article className="mb-12 prose prose-invert max-w-none">
        {article.content ? (
          <ContentRenderer html={article.content} />
        ) : (
          <p className="text-muted">
            {article.excerpt || "No content available."}
          </p>
        )}
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-16 border-t border-border pt-12">
          <H2 className="mb-6 text-2xl font-bold">Related Articles</H2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {relatedLoading
              ? [1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-40 bg-surface rounded-3xl mb-4"></div>
                    <div className="h-4 bg-surface rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-surface rounded w-1/2"></div>
                  </div>
                ))
              : relatedArticles
                  .slice(0, 2)
                  .map((related) => (
                    <NewsCard
                      key={related.id}
                      id={related.id}
                      image={related.cover_image_url}
                      title={related.title}
                      excerpt={related.excerpt}
                      category={related.category?.name || "Technology"}
                      date={new Date(related.published_at).toLocaleDateString()}
                      readTime={Math.ceil(
                        (related.content?.length || 0) / 1000,
                      )}
                      href={`/article/${related.slug}`}
                      noBorder
                      compact
                      className="bg-surface/30"
                    />
                  ))}
          </div>
        </section>
      )}
    </div>
  );
}
