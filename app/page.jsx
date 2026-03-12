"use client";

import React, { Suspense } from "react";
import { MotionGrid, MotionItem } from "@/components/ui/MotionWrapper";
import {
  useArticles,
  usePodcasts,
  useEvents,
  useInsights,
} from "@/hooks/useBackendApi";
import Button from "@/components/ui/Button";
import AdSlot from "@/components/ads/AdSlot";
import NewsletterWidget from "@/components/sidebar/NewsletterWidget";
import EventsWidget from "@/components/sidebar/EventsWidget";
import NewsCard from "@/components/articles/NewsCard";
import SectionHeading from "@/components/ui/SectionHeading";
import VideoShowcase from "@/components/articles/VideoShowcase";
import SocialBanner from "@/components/ui/SocialBanner";
import LazyImage from "@/components/LazyImage";

function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 space-y-20 animate-pulse">
      {/* Hero Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
        <div className="h-[500px] bg-surface rounded-2xl" />
        <div className="space-y-10">
          <div className="h-64 bg-surface rounded-2xl" />
          <div className="h-64 bg-surface rounded-2xl" />
        </div>
      </div>
      {/* Section Skeleton */}
      <div className="space-y-8">
        <div className="h-10 bg-surface rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-surface rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function HomeContent() {
  // Fetch real data from backend
  const { data: articlesData, loading: articlesLoading } = useArticles({
    limit: 20,
  });
  const { data: featuredData } = useArticles({
    featured: "true",
    limit: 4,
  });
  const { data: podcastsData, loading: podcastsLoading } = usePodcasts({
    limit: 10,
  });
  const { data: eventsData, loading: eventsLoading } = useEvents({ limit: 4 });
  const { data: insightsData, loading: insightsLoading } = useInsights({
    limit: 6,
  });

  // Extract data from backend responses
  const articles = articlesData?.articles || [];
  const featuredPool = featuredData?.articles || [];
  const podcasts = podcastsData?.podcasts || [];
  const events = eventsData?.events || [];
  const insights = insightsData?.insights || [];

  // 1. Hero Section
  const mainFeatured = articles[0];
  const sideArticles = articles.slice(1, 3);

  // 2. Technology Section
  const techArticles = articles.slice(3, 9);

  // 3. Featured Insight (#TechTalkThursday)
  const mainInsight = insights[0] || articles[9];

  // 4. Editor's Choice - Use pool if available, fallback to articles
  const editorsChoice =
    featuredPool.length > 0 ? featuredPool : articles.slice(10, 14);

  // 5. In Case You Missed It - Use insights[1:4], fallback to articles
  const missedIt =
    insights.length > 1 ? insights.slice(1, 5) : articles.slice(14, 18);

  // 6. Latest News (Everything else)
  const latestNews = articles.slice(6, 20);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-16 space-y-20 mb-20">
      {/* Hero Section - Magazine Style Horizontal */}
      <section className="space-y-12">
        {mainFeatured && (
          <NewsCard
            id={mainFeatured.id}
            image={mainFeatured.cover_image_url}
            title={mainFeatured.title}
            excerpt={mainFeatured.excerpt}
            author={mainFeatured.author}
            category={mainFeatured.category?.name || "Technology"}
            date={new Date(mainFeatured.published_at).toLocaleDateString()}
            readTime={Math.ceil((mainFeatured.content?.length || 0) / 1000)}
            href={`/article/${mainFeatured.slug}`}
            horizontal
            noBorder
            className="min-h-[450px]"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sideArticles.map((article) => (
            <NewsCard
              key={article.id}
              id={article.id}
              image={article.cover_image_url}
              title={article.title}
              excerpt={article.excerpt}
              category={article.category?.name || "Technology"}
              date={new Date(article.published_at).toLocaleDateString()}
              readTime={Math.ceil((article.content?.length || 0) / 1000)}
              href={`/article/${article.slug}`}
              noBorder
              className="bg-surface/50"
            />
          ))}
          <div className="md:col-span-2 lg:col-span-1">
            <AdSlot position="top" />
          </div>
        </div>
      </section>

      {/* #TECHNOLOGY Section */}
      <section>
        <SectionHeading subtitle="Innovation & Digital Transformation">
          Technology
        </SectionHeading>
        {techArticles.length > 0 ? (
          <MotionGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {techArticles.map((article) => (
              <NewsCard
                key={article.id}
                id={article.id}
                image={article.cover_image_url}
                title={article.title}
                excerpt={article.excerpt}
                category={article.category?.name || "Technology"}
                date={new Date(article.published_at).toLocaleDateString()}
                readTime={Math.ceil((article.content?.length || 0) / 1000)}
                href={`/article/${article.slug}`}
                noBorder
                className="bg-surface/30 hover:bg-surface/50 transition-colors"
              />
            ))}
          </MotionGrid>
        ) : (
          <div className="h-40 flex items-center justify-center border border-border/10 rounded-3xl bg-surface/10">
            <p className="text-muted text-sm italic">
              More technology stories coming soon...
            </p>
          </div>
        )}
      </section>

      {/* #TECHTALKTHURSDAY Featured Callout */}
      {mainInsight && (
        <section className="bg-surface border border-border/50 rounded-3xl p-10 md:p-20 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-1 w-12 bg-brand-500 rounded-full" />
                <span className="text-sm font-bold tracking-widest text-brand-500 uppercase">
                  Featured Insight
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-8">
                #TechTalk<span className="text-brand-500">Thursday</span>
              </h2>
              <h3 className="text-xl md:text-2xl font-semibold mb-6 leading-snug text-text">
                {mainInsight.title}
              </h3>
              <p className="text-muted text-base mb-10 font-normal leading-relaxed">
                {mainInsight.excerpt}
              </p>
              <Button
                as="a"
                href={`/${mainInsight.content ? "article" : "insight"}/${mainInsight.slug}`}
                variant="solid"
                className="px-10 py-4 rounded-xl font-bold uppercase tracking-wider text-sm"
              >
                Read Full Story
              </Button>
            </div>
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/5 group">
              <LazyImage
                src={mainInsight.cover_image_url}
                alt={mainInsight.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </section>
      )}

      {/* Split Split Editor's Choice vs Missed It */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <SectionHeading subtitle="Our top picks this week">
            Editor's Choice
          </SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
            {editorsChoice.length > 0 ? (
              editorsChoice.map((article) => (
                <NewsCard
                  key={`editor-${article.id}`}
                  id={article.id}
                  image={article.cover_image_url}
                  title={article.title}
                  excerpt={article.excerpt}
                  category={article.category?.name || "Featured"}
                  date={new Date(article.published_at).toLocaleDateString()}
                  href={`/article/${article.slug}`}
                  noBorder
                  className="bg-surface/30"
                />
              ))
            ) : (
              <div className="col-span-full h-40 flex items-center justify-center border border-border/10 rounded-3xl bg-surface/10">
                <p className="text-muted text-sm italic">
                  Selection updated weekly...
                </p>
              </div>
            )}
          </div>
        </div>
        <div>
          <SectionHeading subtitle="Deep dives you might have missed">
            In Case You Missed It
          </SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
            {missedIt.length > 0 ? (
              missedIt.map((item) => (
                <NewsCard
                  key={`missed-${item.id}`}
                  id={item.id}
                  image={item.cover_image_url}
                  title={item.title}
                  excerpt={item.excerpt}
                  category={item.category?.name || "Insight"}
                  date={new Date(item.published_at).toLocaleDateString()}
                  href={`/${item.content && !item.slug.includes("insight") ? "article" : "insight"}/${item.slug}`}
                  noBorder
                  className="bg-surface/30"
                />
              ))
            ) : (
              <div className="col-span-full h-40 flex items-center justify-center border border-border/10 rounded-3xl bg-surface/10">
                <p className="text-muted text-sm italic">
                  More deep dives coming soon...
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video Interviews (Dark Section) */}
      <VideoShowcase videos={podcasts} loading={podcastsLoading} />

      {/* Latest News Grid with Sidebar */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
        <main>
          <SectionHeading subtitle="Current affairs and updates">
            Latest News
          </SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {latestNews.length > 0 ? (
              latestNews.map((article) => (
                <NewsCard
                  key={`latest-${article.id}`}
                  id={article.id}
                  image={article.cover_image_url}
                  title={article.title}
                  excerpt={article.excerpt}
                  category={article.category?.name || "News"}
                  date={new Date(article.published_at).toLocaleDateString()}
                  readTime={Math.ceil((article.content?.length || 0) / 1000)}
                  href={`/article/${article.slug}`}
                  noBorder
                  className="bg-surface/30"
                />
              ))
            ) : (
              <div className="col-span-full h-60 flex items-center justify-center border border-border/10 rounded-3xl bg-surface/10">
                <p className="text-muted text-sm italic">
                  Loading latest stories...
                </p>
              </div>
            )}
          </div>
          <div className="mt-12 text-center">
            <Button
              variant="outline"
              className="px-12 py-4 rounded-xl font-semibold border-2"
            >
              Load More Stories
            </Button>
          </div>
        </main>

        <aside className="space-y-12">
          <NewsletterWidget />
          <EventsWidget events={events} loading={eventsLoading} />
          <AdSlot position="sidebar" />
          <div className="bg-linear-to-br from-brand-600 to-brand-800 p-10 rounded-3xl text-white shadow-xl">
            <h4 className="text-xl font-extrabold tracking-tight mb-3">
              Join Our Community
            </h4>
            <p className="text-sm opacity-90 mb-8 font-medium leading-relaxed">
              Get exclusive technology insights and news delivered directly to
              your inbox weekly.
            </p>
            <a
              href="/register"
              className="block w-full text-center py-4 bg-white text-brand-600 rounded-xl font-bold text-sm tracking-wide shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              SIGN UP FREE
            </a>
          </div>
        </aside>
      </section>

      {/* Social Banner */}
      <SocialBanner />
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
