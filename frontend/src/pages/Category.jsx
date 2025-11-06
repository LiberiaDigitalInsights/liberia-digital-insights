import React from 'react';
import { useParams } from 'react-router-dom';
import { H1, Muted } from '../components/ui/Typography';
import ArticleCard from '../components/articles/ArticleCard';
import PodcastCard from '../components/podcasts/PodcastCard';
import SEO from '../components/SEO';
import { generateArticleGrid } from '../data/mockArticles';
import { mockPodcasts } from '../data/mockPodcasts';
import { CATEGORIES } from '../constants/categories';
import { Tabs } from '../components/ui/Tabs';

export default function Category() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = React.useState('articles');

  const categoryName = decodeURIComponent(slug || '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Find matching category (case-insensitive)
  const matchedCategory =
    CATEGORIES.find((cat) => cat.toLowerCase().replace(/\s+/g, '-') === slug?.toLowerCase()) ||
    categoryName;

  const allArticles = generateArticleGrid(20);
  const categoryArticles = allArticles.filter(
    (article) => article.category.toLowerCase() === matchedCategory.toLowerCase(),
  );

  const categoryPodcasts = mockPodcasts.filter(
    (podcast) =>
      podcast.category?.toLowerCase() === matchedCategory.toLowerCase() ||
      podcast.tags?.some((tag) => tag.toLowerCase() === matchedCategory.toLowerCase()),
  );

  const tabs = [
    {
      value: 'articles',
      label: `Articles (${categoryArticles.length})`,
      content: (
        <div>
          <div className="mb-6 text-sm text-[var(--color-muted)]">
            {categoryArticles.length > 0
              ? `Showing ${categoryArticles.length} ${categoryArticles.length === 1 ? 'article' : 'articles'} in ${matchedCategory}`
              : `No articles found in ${matchedCategory}`}
          </div>
          {categoryArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoryArticles.map((article, idx) => (
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
              No articles available in this category yet.
            </div>
          )}
        </div>
      ),
    },
    {
      value: 'podcasts',
      label: `Podcasts (${categoryPodcasts.length})`,
      content: (
        <div>
          <div className="mb-6 text-sm text-[var(--color-muted)]">
            {categoryPodcasts.length > 0
              ? `Showing ${categoryPodcasts.length} ${categoryPodcasts.length === 1 ? 'podcast' : 'podcasts'} in ${matchedCategory}`
              : `No podcasts found in ${matchedCategory}`}
          </div>
          {categoryPodcasts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoryPodcasts.map((podcast, idx) => (
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
              No podcasts available in this category yet.
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <SEO title={`${matchedCategory} | Liberia Digital Insights`} />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Header */}
        <header className="mb-8">
          <H1 className="mb-4">{matchedCategory}</H1>
          <Muted className="text-lg">
            Explore articles and podcasts in the {matchedCategory} category.
          </Muted>
        </header>

        {/* Tabs */}
        <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} className="mb-8" />

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[var(--color-muted)]">
          <a href="/" className="hover:text-[var(--color-text)]">
            Home
          </a>{' '}
          <span className="mx-2">/</span>
          <span className="text-[var(--color-text)]">{matchedCategory}</span>
        </nav>
      </div>
    </>
  );
}
