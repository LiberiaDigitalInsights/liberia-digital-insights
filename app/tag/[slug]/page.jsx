"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { H1, Muted } from "@/components/ui/Typography";
import ArticleCard from "@/components/articles/ArticleCard";
import PodcastCard from "@/components/podcasts/PodcastCard";
import { useArticles, usePodcasts } from "@/hooks/useBackendApi";
import { Tabs } from "@/components/ui/Tabs";
import { MotionGrid, MotionItem } from "@/components/ui/MotionWrapper";

function toDisplayTag(slug = "") {
  const s = String(slug).replace(/^#/, "").trim();
  if (!s) return "";
  return s
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");
}

export default function TagPage() {
  const { slug } = useParams();
  const tagKey = String(slug || "").toLowerCase();
  const tagDisplay = toDisplayTag(tagKey);
  const [activeTab, setActiveTab] = React.useState("articles");

  const { data: articlesData, loading: articlesLoading } = useArticles({
    limit: 40,
  });
  const { data: podcastsData, loading: podcastsLoading } = usePodcasts({
    limit: 20,
  });

  const allArticles = articlesData?.articles || [];
  const allPodcasts = podcastsData?.podcasts || [];

  const taggedArticles = allArticles.filter(
    (a) =>
      Array.isArray(a.tags) &&
      a.tags.some((t) => String(t).toLowerCase() === tagKey),
  );

  const taggedPodcasts = allPodcasts.filter(
    (p) =>
      Array.isArray(p.tags) &&
      p.tags.some((t) => String(t).toLowerCase() === tagKey),
  );

  const tabs = [
    {
      value: "articles",
      label: `Articles (${taggedArticles.length})`,
      content: (
        <div>
          {articlesLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse h-64 bg-surface rounded-xl"
                ></div>
              ))}
            </div>
          ) : taggedArticles.length > 0 ? (
            <MotionGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {taggedArticles.map((article) => (
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
              No articles found with this tag.
            </div>
          )}
        </div>
      ),
    },
    {
      value: "podcasts",
      label: `Podcasts (${taggedPodcasts.length})`,
      content: (
        <div>
          {podcastsLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="animate-pulse h-64 bg-surface rounded-xl"
                ></div>
              ))}
            </div>
          ) : taggedPodcasts.length > 0 ? (
            <MotionGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {taggedPodcasts.map((podcast) => (
                <MotionItem key={podcast.id}>
                  <PodcastCard
                    id={podcast.id}
                    title={podcast.title}
                    description={podcast.description}
                    duration={podcast.duration}
                    date={new Date(podcast.published_at).toLocaleDateString()}
                    guest={podcast.author?.name}
                    image={podcast.cover_image_url}
                    href={`/podcast/${podcast.slug}`}
                  />
                </MotionItem>
              ))}
            </MotionGrid>
          ) : (
            <div className="py-20 text-center text-muted font-medium italic border-2 border-dashed border-border rounded-2xl">
              No podcasts found with this tag.
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <nav className="mb-8 text-sm text-muted flex gap-2 font-bold uppercase tracking-widest bg-brand-500/5 px-4 py-2 rounded-full w-fit">
        <Link href="/" className="hover:text-brand-500 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-brand-500">#{tagDisplay}</span>
      </nav>

      <header className="mb-12">
        <H1 className="mb-4 text-5xl md:text-7xl font-black italic tracking-tighter text-brand-500">
          #{tagDisplay.toUpperCase()}
        </H1>
        <Muted className="text-xl">Content tagged with #{tagDisplay}</Muted>
      </header>

      <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} />
    </div>
  );
}
