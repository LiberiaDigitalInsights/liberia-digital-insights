import React from 'react';
import { useParams } from 'react-router-dom';
import { H1, Muted } from '../components/ui/Typography';
import ArticleCard from '../components/articles/ArticleCard';
import PodcastCard from '../components/podcasts/PodcastCard';
import SEO from '../components/SEO';
import { useArticles, usePodcasts } from '../hooks/useBackendApi';
import { Tabs } from '../components/ui/Tabs';

function toDisplayTag(slug = '') {
  const s = String(slug).replace(/^#/, '').trim();
  if (!s) return '';
  // Convert to TitleCase without dashes
  return s
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
    .join('');
}

export default function Tag() {
  const { slug } = useParams();
  const tagKey = String(slug || '').toLowerCase();
  const tagDisplay = toDisplayTag(tagKey);
  const [activeTab, setActiveTab] = React.useState('articles');

  // Fetch real data from backend
  const { data: articlesData, loading: articlesLoading } = useArticles({ limit: 24 });
  const { data: podcastsData, loading: podcastsLoading } = usePodcasts({ limit: 12 });
  
  const allArticles = articlesData?.articles || [];
  const allPodcasts = podcastsData?.podcasts || [];

  // Filter articles and podcasts by tag
  const taggedArticles = allArticles.filter(
    (a) => Array.isArray(a.tags) && a.tags.some((t) => String(t).toLowerCase() === tagKey),
  );

  const taggedPodcasts = allPodcasts.filter(
    (p) => Array.isArray(p.tags) && p.tags.some((t) => String(t).toLowerCase() === tagKey),
  );

  const tabs = [
    {
      value: 'articles',
      label: `Articles (${taggedArticles.length})`,
      content: (
        <div>
          <div className="mb-6 text-sm text-[var(--color-muted)]">
            {taggedArticles.length > 0
              ? `Showing ${taggedArticles.length} ${taggedArticles.length === 1 ? 'article' : 'articles'} tagged with #${tagDisplay}`
              : `No articles found tagged with #${tagDisplay}`}
          </div>
          {articlesLoading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : taggedArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {taggedArticles.map((article, idx) => (
                <div
                  key={article.id}
                  className="opacity-0 animate-slide-up"
                  style={{ animationDelay: `${100 + idx * 50}ms` }}
                >
                  <ArticleCard
                    image={article.cover_image_url}
                    title={article.title}
                    excerpt={article.excerpt}
                    category={article.category?.name || 'Uncategorized'}
                    author={article.author?.name}
                    date={new Date(article.published_at).toLocaleDateString()}
                    readTime={Math.ceil(article.content.length / 1000) + ' min read'}
                    to={`/article/${article.slug}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-[var(--color-muted)]">
              No articles available for this tag yet.
            </div>
          )}
        </div>
      ),
    },
    {
      value: 'podcasts',
      label: `Podcasts (${taggedPodcasts.length})`,
      content: (
        <div>
          <div className="mb-6 text-sm text-[var(--color-muted)]">
            {taggedPodcasts.length > 0
              ? `Showing ${taggedPodcasts.length} ${taggedPodcasts.length === 1 ? 'podcast' : 'podcasts'} for #${tagDisplay}`
              : `No podcasts found for #${tagDisplay}`}
          </div>
          {podcastsLoading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : taggedPodcasts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {taggedPodcasts.map((podcast, idx) => (
                <div
                  key={podcast.id}
                  className="opacity-0 animate-slide-up"
                  style={{ animationDelay: `${100 + idx * 50}ms` }}
                >
                  <PodcastCard
                    image={podcast.cover_image_url}
                    title={podcast.title}
                    description={podcast.description}
                    category={podcast.category?.name || 'Uncategorized'}
                    duration={podcast.duration}
                    date={new Date(podcast.published_at).toLocaleDateString()}
                    to={`/podcast/${podcast.slug}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-[var(--color-muted)]">
              No podcasts available for this tag yet.
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <SEO title={`#${tagDisplay} | Liberia Digital Insights`} />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <header className="mb-8">
          <H1 className="mb-4">#{tagDisplay}</H1>
          <Muted className="text-lg">Explore content for the #{tagDisplay} tag.</Muted>
        </header>

        <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} className="mb-8" />

        <nav className="mb-6 text-sm text-[var(--color-muted)]">
          <a href="/" className="hover:text-[var(--color-text)]">
            Home
          </a>{' '}
          <span className="mx-2">/</span>
          <span className="text-[var(--color-text)]">#{tagDisplay}</span>
        </nav>
      </div>
    </>
  );
}
