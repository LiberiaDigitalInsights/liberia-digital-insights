import React from 'react';
import { useParams } from 'react-router-dom';
import { H1, Muted } from '../components/ui/Typography';
import ArticleCard from '../components/articles/ArticleCard';
import PodcastCard from '../components/podcasts/PodcastCard';
import SEO from '../components/SEO';
import { generateArticleGrid } from '../data/mockArticles';
import { mockPodcasts } from '../data/mockPodcasts';
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

  const allArticles = generateArticleGrid(24);
  const taggedArticles = allArticles.filter(
    (a) => Array.isArray(a.tags) && a.tags.some((t) => String(t).toLowerCase() === tagKey),
  );

  const taggedPodcasts = mockPodcasts.filter(
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
              ? `Showing ${taggedArticles.length} ${taggedArticles.length === 1 ? 'article' : 'articles'} for #${tagDisplay}`
              : `No articles found for #${tagDisplay}`}
          </div>
          {taggedArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {taggedArticles.map((article, idx) => (
                <div
                  key={article.id}
                  className="opacity-0 animate-slide-up"
                  style={{ animationDelay: `${100 + idx * 50}ms` }}
                >
                  <ArticleCard
                    image={article.image}
                    title={article.title}
                    excerpt={article.excerpt}
                    category={article.category}
                    author={article.author}
                    date={article.date}
                    readTime={article.readTime}
                    to={`/article/${article.id}`}
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
          {taggedPodcasts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {taggedPodcasts.map((podcast, idx) => (
                <div
                  key={podcast.id}
                  className="opacity-0 animate-slide-up"
                  style={{ animationDelay: `${100 + idx * 50}ms` }}
                >
                  <PodcastCard
                    image={podcast.image}
                    title={podcast.title}
                    description={podcast.description}
                    category={podcast.category}
                    duration={podcast.duration}
                    date={podcast.date}
                    to={`/podcast/${podcast.id}`}
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

        <Tabs tabs={tabs} value={tabs[0].value} onChange={() => {}} className="mb-8" />

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
