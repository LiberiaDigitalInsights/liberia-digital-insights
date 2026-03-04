"use client";

import React, { Suspense } from "react";
import { MotionGrid, MotionItem } from "@/components/ui/MotionWrapper";
import { useArticles, usePodcasts, useEvents } from "@/hooks/useBackendApi";
import { H1, H2, Muted } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import FeaturedArticleRow from "@/components/articles/FeaturedArticleRow";
import ArticleCard from "@/components/articles/ArticleCard";
import AdSlot from "@/components/ads/AdSlot";
import PodcastWidget from "@/components/sidebar/PodcastWidget";
import NewsletterWidget from "@/components/sidebar/NewsletterWidget";
import EventsWidget from "@/components/sidebar/EventsWidget";

function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 animate-pulse">
      <div className="h-64 bg-surface rounded-2xl mb-12" />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_350px]">
        <div className="space-y-12">
          <div className="h-10 bg-surface rounded w-1/4" />
          <div className="h-80 bg-surface rounded" />
          <div className="h-10 bg-surface rounded w-1/4" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-surface rounded" />
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <div className="h-64 bg-surface rounded" />
          <div className="h-64 bg-surface rounded" />
        </div>
      </div>
    </div>
  );
}

function HomeContent() {
  // Fetch real data from backend
  const { data: articlesData, loading: articlesLoading } = useArticles({
    limit: 12,
  });
  const { data: podcastsData, loading: podcastsLoading } = usePodcasts({
    limit: 3,
  });
  const { data: eventsData, loading: eventsLoading } = useEvents({ limit: 3 });

  // Extract data from backend responses
  const articles = articlesData?.articles || [];
  const featured = articles[0];
  const latestArticles = articles.slice(0, 12);
  const podcasts = podcastsData?.podcasts || [];
  const events = eventsData?.events || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* Hero */}
      <section className="mb-10">
        <MotionItem className="rounded-2xl border border-border bg-gradient-to-br from-surface to-brand-500/5 p-8 md:p-16 text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl animate-pulse" />
          <div className="relative z-10">
            <H1 className="mb-4 text-4xl font-black tracking-tighter md:text-6xl text-text leading-tight uppercase italic">
              Liberia's home for <br className="hidden md:block" />
              <span className="text-brand-500">tech news</span> and insights
            </H1>
            <Muted className="mx-auto mb-10 max-w-2xl text-lg md:text-xl font-medium leading-relaxed">
              Stories, analysis, and interviews from Liberia’s growing
              technology ecosystem.
            </Muted>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="solid"
                as="a"
                href="/insights"
                className="px-10 py-4 text-lg font-bold shadow-xl shadow-brand-500/20"
              >
                Explore Insights
              </Button>
              <Button
                variant="secondary"
                as="a"
                href="/subscribe"
                className="px-10 py-4 text-lg font-bold"
              >
                Newsletter
              </Button>
            </div>
          </div>
        </MotionItem>
      </section>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_350px]">
        {/* Main content */}
        <main className="space-y-16">
          {/* Featured Technology Section */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <H2 className="text-3xl font-black uppercase tracking-tighter italic">
                Technology
              </H2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div>
              {featured ? (
                <MotionItem>
                  <FeaturedArticleRow
                    index={0}
                    id={featured.id}
                    image={featured.cover_image_url}
                    title={featured.title}
                    excerpt={featured.excerpt}
                    category={featured.category?.name || "Technology"}
                    author={featured.author?.name || "Admin"}
                    date={new Date(featured.published_at).toLocaleDateString()}
                    readTime={
                      Math.ceil((featured.content?.length || 0) / 1000) +
                      " min read"
                    }
                    href={`/article/${featured.slug}`}
                  />
                </MotionItem>
              ) : articlesLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-64 bg-surface rounded-lg"></div>
                  <div className="h-6 bg-surface rounded w-3/4"></div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted italic font-medium">
                  No featured articles available
                </div>
              )}
            </div>
          </section>

          {/* Inline Advertisement */}
          <AdSlot position="inline" />

          {/* Article Grid */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <H2 className="text-3xl font-black uppercase tracking-tighter italic">
                Latest stories
              </H2>
              <div className="h-px flex-1 bg-border" />
            </div>
            {articlesLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-surface rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : (
              <MotionGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {latestArticles.map((article) => (
                  <MotionItem key={article.id}>
                    <ArticleCard
                      id={article.id}
                      image={article.cover_image_url}
                      title={article.title}
                      category={article.category?.name || "Uncategorized"}
                      date={new Date(article.published_at).toLocaleDateString()}
                      readTime={Math.ceil(
                        (article.content?.length || 0) / 1000,
                      )}
                      href={`/article/${article.slug}`}
                    />
                  </MotionItem>
                ))}
              </MotionGrid>
            )}
          </section>

          {/* Insights / News Section */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <H2 className="text-3xl font-black uppercase tracking-tighter italic text-brand-500">
                Member Insights
              </H2>
              <div className="h-px flex-1 bg-brand-500/20" />
            </div>
            <MotionGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestArticles.slice(0, 6).map((article) => (
                <MotionItem key={`news-${article.id}`}>
                  <ArticleCard
                    id={article.id}
                    image={article.cover_image_url}
                    title={article.title}
                    category={article.category?.name || "News"}
                    date={new Date(article.published_at).toLocaleDateString()}
                    readTime={Math.ceil((article.content?.length || 0) / 1000)}
                    href={`/article/${article.slug}`}
                  />
                </MotionItem>
              ))}
            </MotionGrid>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
          <MotionItem>
            <PodcastWidget podcasts={podcasts} loading={podcastsLoading} />
          </MotionItem>
          <MotionItem>
            <NewsletterWidget loading={false} />
          </MotionItem>
          <MotionItem>
            <EventsWidget events={events} loading={eventsLoading} />
          </MotionItem>
          <MotionItem>
            <AdSlot position="sidebar" />
          </MotionItem>
        </aside>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
