import React from 'react';
import { useParams } from 'react-router-dom';
import { H1, Muted } from '../components/ui/Typography';
import ArticleCard from '../components/articles/ArticleCard';
import PodcastCard from '../components/podcasts/PodcastCard';
import SEO from '../components/SEO';
import { useArticles, usePodcasts, useCategories } from '../hooks/useBackendApi';
import { Tabs } from '../components/ui/Tabs';

export default function Category() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = React.useState('articles');

  // Fetch real data from backend
  const { data: articlesData, loading: articlesLoading } = useArticles({ limit: 20 });
  const { data: podcastsData, loading: podcastsLoading } = usePodcasts({ limit: 10 });
  const { data: categoriesData, loading: _categoriesLoading } = useCategories();

  const allArticles = articlesData?.articles || [];
  const allPodcasts = podcastsData?.podcasts || [];
  const categories = categoriesData?.data || [];

  // Find matching category by slug
  const matchedCategory = categories.find((cat) => cat.slug === slug);
  const categoryName =
    matchedCategory?.name ||
    decodeURIComponent(slug || '')
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  // Filter articles and podcasts by category
  const categoryArticles = matchedCategory
    ? allArticles.filter((article) => article.category_id === matchedCategory.id)
    : allArticles.filter(
        (article) => article.category?.name?.toLowerCase() === categoryName.toLowerCase(),
      );

  const categoryPodcasts = matchedCategory
    ? allPodcasts.filter((podcast) => podcast.category_id === matchedCategory.id)
    : allPodcasts.filter(
        (podcast) => podcast.category?.name?.toLowerCase() === categoryName.toLowerCase(),
      );

  const tabs = [
    {
      value: 'articles',
      label: `Articles (${categoryArticles.length})`,
      content: (
        <div>
          <div className="mb-6 text-sm text-[var(--color-muted)]">
            {categoryArticles.length > 0
              ? `Showing ${categoryArticles.length} ${categoryArticles.length === 1 ? 'article' : 'articles'} in ${categoryName}`
              : `No articles found in ${categoryName}`}
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
          ) : categoryArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoryArticles.map((article, idx) => (
                <div
                  key={article.id}
                  className="opacity-0 animate-slide-up"
                  style={{ animationDelay: `${100 + idx * 50}ms` }}
                >
                  <ArticleCard
                    image={article.cover_image_url}
                    title={article.title}
                    excerpt={article.excerpt}
                    category={article.category?.name || categoryName}
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
              ? `Showing ${categoryPodcasts.length} ${categoryPodcasts.length === 1 ? 'podcast' : 'podcasts'} in ${categoryName}`
              : `No podcasts found in ${categoryName}`}
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
          ) : categoryPodcasts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoryPodcasts.map((podcast, idx) => (
                <div
                  key={podcast.id}
                  className="opacity-0 animate-slide-up"
                  style={{ animationDelay: `${100 + idx * 50}ms` }}
                >
                  <PodcastCard
                    image={podcast.cover_image_url}
                    title={podcast.title}
                    description={podcast.description}
                    category={podcast.category?.name || categoryName}
                    duration={podcast.duration}
                    date={new Date(podcast.published_at).toLocaleDateString()}
                    to={`/podcast/${podcast.slug}`}
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
      <SEO title={`${categoryName} | Liberia Digital Insights`} />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Header */}
        <header className="mb-8">
          <H1 className="mb-4">{categoryName}</H1>
          <Muted className="text-lg">
            Explore articles and podcasts in the {categoryName} category.
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
