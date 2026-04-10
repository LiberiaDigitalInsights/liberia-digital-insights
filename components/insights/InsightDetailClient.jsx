"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { H1, H2 } from "@/components/ui/Typography";
import Badge from "@/components/ui/Badge";
import NewsCard from "@/components/articles/NewsCard";
import {
  useInsight,
  useInsights,
  usePodcasts,
  useEvents,
} from "@/hooks/useBackendApi";
import ContentRenderer from "@/components/ui/ContentRenderer";
import LazyImage from "@/components/LazyImage";
import BookmarkButton from "@/components/ui/BookmarkButton";
import ShareButton from "@/components/ui/ShareButton";
import { stripHtml } from "@/lib/text";

import PodcastWidget from "@/components/sidebar/PodcastWidget";
import EventsWidget from "@/components/sidebar/EventsWidget";
import NewsletterWidget from "@/components/sidebar/NewsletterWidget";
import AdSlot from "@/components/ads/AdSlot";
import ReadingProgressBar from "@/components/ui/ReadingProgressBar";
import TableOfContents from "@/components/articles/TableOfContents";
import { calculateReadTime, extractHeadings } from "@/lib/reading";
import { FaClock, FaUser } from "react-icons/fa";

export default function InsightDetailClient() {
  const { slug } = useParams();
  const router = useRouter();

  const {
    data: insightData,
    loading: insightLoading,
    error: insightError,
  } = useInsight(slug);
  const insight = insightData?.insight;

  const { data: relatedData, loading: relatedLoading } = useInsights({
    limit: 6,
    category: insight?.category?.slug,
  });

  const { data: podcastsData } = usePodcasts({ limit: 3 });
  const { data: eventsData } = useEvents({ limit: 3 });

  const headings = extractHeadings(insight?.content);
  const readTime = calculateReadTime(insight?.content);

  const relatedInsights = (relatedData?.insights || []).filter(
    (i) => i.id !== insight?.id && i.slug !== slug,
  );

  if (insightLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-surface rounded" />
          <div className="h-12 w-3/4 bg-surface rounded" />
          <div className="h-64 bg-surface rounded" />
          <div className="h-4 w-full bg-surface rounded" />
          <div className="h-4 w-3/4 bg-surface rounded" />
        </div>
      </div>
    );
  }

  if (insightError || !insight) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 text-center">
        <H1 className="mb-4 text-3xl font-bold">Insight Not Found</H1>
        <p className="mb-8 text-muted">
          The insight you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-brand-600"
        >
          ← Back to Insights
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_350px]">
        {/* Main Content */}
        <div>
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-muted">
            <Link href="/" className="hover:text-text">
              Home
            </Link>
            {" / "}
            <Link href="/insights" className="hover:text-text">
              Insights
            </Link>
            {" / "}
            <span>{insight.category?.name || "Insights"}</span>
          </nav>

          {/* Back */}
          <button
            onClick={() => router.back()}
            className="mb-6 text-sm text-muted hover:text-text transition-colors duration-200"
          >
            ← Back
          </button>

          {/* Header */}
          <header className="mb-8">
            {insight.category && (
              <div className="mb-4">
                <Badge variant="solid">{insight.category.name}</Badge>
              </div>
            )}
            <div className="flex items-start justify-between gap-4">
              <H1 className="mb-4 flex-1 text-3xl md:text-4xl font-bold leading-tight">
                {insight.title}
              </H1>
              <div className="flex items-center gap-2 mt-1">
                <ShareButton
                  title={insight.title}
                  url={
                    typeof window !== "undefined" ? window.location.href : ""
                  }
                />
                <BookmarkButton
                  contentId={insight.id}
                  contentType="insight"
                  size="lg"
                />
              </div>
            </div>
            {insight.excerpt && (
              <p className="mb-6 text-xl text-muted leading-relaxed">
                {stripHtml(insight.excerpt)}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-widest text-muted">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500">
                  <FaUser className="text-[10px]" />
                </div>
                <span>By {insight.author?.name || "LDI Staff"}</span>
              </div>
              <div className="flex items-center gap-2 transition-colors hover:text-brand-500">
                <FaClock className="text-brand-500/50" />
                <span>{readTime} min read</span>
              </div>
              {insight.published_at && (
                <div className="flex items-center gap-2 text-muted/60">
                  <span>
                    {new Date(insight.published_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
              )}
            </div>
          </header>

          <ReadingProgressBar />

          {/* Featured Image */}
          {insight.cover_image_url && (
            <div className="mb-10 overflow-hidden rounded-3xl aspect-video relative shadow-2xl">
              <LazyImage
                src={insight.cover_image_url}
                alt={insight.title}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <article className="mb-12 prose prose-invert prose-brand max-w-none text-justify lg:text-left selection:bg-brand-500/30">
            {insight.content ? (
              <ContentRenderer html={insight.content} />
            ) : (
              <p className="text-muted italic">
                {insight.excerpt || "No content available for this insight."}
              </p>
            )}
          </article>

          {/* Bottom Actions */}
          <div className="py-10 border-y border-border/50 flex flex-col md:flex-row items-center justify-between gap-6 bg-brand-500/5 rounded-[2rem] px-10">
            <div className="space-y-2 text-center md:text-left">
              <h4 className="font-black italic text-3xl tracking-tighter text-text">
                Did this insight help you?
              </h4>
              <p className="text-sm text-muted font-medium">
                Spread the knowledge with your professional network.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ShareButton
                title={insight.title}
                url={typeof window !== "undefined" ? window.location.href : ""}
                className="scale-125"
              />
              <BookmarkButton
                contentId={insight.id}
                contentType="insight"
                size="lg"
              />
            </div>
          </div>

          {/* Read Next Section */}
          {relatedInsights.length > 0 && (
            <div className="mt-12 p-8 rounded-3xl bg-brand-500/5 border border-brand-500/10 flex items-center justify-between gap-6 group">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-500 mb-2 block">
                  Next Insight
                </span>
                <Link
                  href={`/insight/${relatedInsights[0].slug}`}
                  className="block"
                >
                  <h4 className="text-xl font-black italic tracking-tight text-text group-hover:text-brand-500 transition-colors line-clamp-1">
                    {relatedInsights[0].title}
                  </h4>
                  <p className="text-sm text-muted mt-1 line-clamp-1 font-medium">
                    {stripHtml(relatedInsights[0].excerpt || "")}
                  </p>
                </Link>
              </div>
              <Link
                href={`/insight/${relatedInsights[0].slug}`}
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

          {/* Related Insights */}
          {relatedInsights.length > 0 && (
            <section className="mt-16 border-t border-border pt-12">
              <H2 className="mb-6 text-2xl font-bold">Related Insights</H2>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                {relatedLoading
                  ? [1, 2].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse rounded-3xl bg-surface/30 p-5 border border-border/10 space-y-4"
                      >
                        <div className="aspect-2/1 rounded-2xl bg-surface" />
                        <div className="h-4 w-3/4 bg-surface rounded" />
                        <div className="h-3 w-1/2 bg-surface rounded" />
                      </div>
                    ))
                  : relatedInsights
                      .slice(0, 2)
                      .map((related) => (
                        <NewsCard
                          key={related.id}
                          id={related.id}
                          image={related.cover_image_url}
                          title={related.title}
                          excerpt={related.excerpt}
                          category={related.category?.name || "Insights"}
                          date={new Date(
                            related.published_at,
                          ).toLocaleDateString()}
                          readTime={Math.ceil(
                            (related.content?.length || 0) / 1000,
                          )}
                          href={`/insight/${related.slug}`}
                          noBorder
                          compact
                          className="bg-surface/30"
                        />
                      ))}
              </div>
            </section>
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
    </div>
  );
}
