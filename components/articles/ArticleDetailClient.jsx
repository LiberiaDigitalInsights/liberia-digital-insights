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
import ReadingProgressBar from "@/components/ui/ReadingProgressBar";
import TableOfContents from "@/components/articles/TableOfContents";
import { calculateReadTime, extractHeadings } from "@/lib/reading";
import { FaClock, FaUser, FaTag } from "react-icons/fa";
import { cn } from "@/lib/cn";

export default function ArticleDetailClient() {
  const { slug } = useParams();
  const router = useRouter();

  // Fetch article by slug from backend
  const {
    data: articleData,
    loading: articleLoading,
    error: articleError,
  } = useArticle(slug);
  const article = articleData?.article;

  const { data: relatedArticlesData, loading: relatedLoading } = useArticles({
    limit: 6,
    category: article?.category?.slug,
  });
  const { data: podcastsData } = usePodcasts({ limit: 3 });
  const { data: eventsData } = useEvents({ limit: 3 });

  const headings = extractHeadings(article?.content);
  const readTime = calculateReadTime(article?.content);

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
          <p className="mb-6 text-xl text-muted text-justify leading-relaxed">
            {article.excerpt}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-widest text-muted">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500">
              <FaUser className="text-[10px]" />
            </div>
            <span>{article.author?.name || "LDI Staff"}</span>
          </div>
          <div className="flex items-center gap-2 transition-colors hover:text-brand-500">
            <FaClock className="text-brand-500/50" />
            <span>{readTime} min read</span>
          </div>
          {article.published_at && (
            <div className="flex items-center gap-2 text-muted/60">
              <span>
                {new Date(article.published_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </header>

      <ReadingProgressBar />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_280px]">
        <div>
          {/* Featured Image */}
          {article.cover_image_url && (
            <div className="mb-10 overflow-hidden rounded-3xl aspect-video relative shadow-2xl">
              <LazyImage
                src={article.cover_image_url}
                alt={article.title}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          )}

          {/* Article Content */}
          <article className="mb-12 prose prose-invert prose-brand max-w-none text-justify lg:text-left selection:bg-brand-500/30">
            {article.content ? (
              <ContentRenderer html={article.content} />
            ) : (
              <p className="text-muted italic">
                {article.excerpt || "No content available."}
              </p>
            )}
          </article>

          {/* Bottom Share & Actions */}
          <div className="py-8 border-y border-border/50 flex flex-col md:flex-row items-center justify-between gap-6 bg-surface/30 rounded-3xl px-8">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="font-black italic text-lg text-text">
                Enjoyed this article?
              </h4>
              <p className="text-sm text-muted font-medium">
                Share it with your network and join the conversation.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted mr-2">
                Share via
              </span>
              <ShareButton
                title={article.title}
                url={typeof window !== "undefined" ? window.location.href : ""}
                className="scale-110"
              />
              <BookmarkButton
                contentId={article.id}
                contentType="article"
                size="lg"
              />
            </div>
          </div>

          {/* Read Next Section */}
          {relatedArticles.length > 0 && (
            <div className="mt-12 p-8 rounded-3xl bg-brand-500/5 border border-brand-500/10 flex items-center justify-between gap-6 group">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-500 mb-2 block">
                  Read Next
                </span>
                <Link
                  href={`/article/${relatedArticles[0].slug}`}
                  className="block"
                >
                  <h4 className="text-xl font-black italic tracking-tight text-text group-hover:text-brand-500 transition-colors line-clamp-1">
                    {relatedArticles[0].title}
                  </h4>
                  <p className="text-sm text-muted mt-1 line-clamp-1 font-medium">
                    {relatedArticles[0].excerpt}
                  </p>
                </Link>
              </div>
              <Link
                href={`/article/${relatedArticles[0].slug}`}
                className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-12">
          {headings.length > 0 && (
            <div className="sticky top-28">
              <TableOfContents headings={headings} />
            </div>
          )}

          <div className={cn("space-y-10", headings.length > 0 && "lg:pt-8")}>
            <PodcastWidget podcasts={podcastsData?.podcasts || []} />
            <NewsletterWidget />
            <EventsWidget events={eventsData?.events || []} />
            <AdSlot position="sidebar" />
          </div>
        </aside>
      </div>

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
