import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { H1 } from '../components/ui/Typography';
import ArticleCard from '../components/articles/ArticleCard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';
import AdSlot from '../components/ads/AdSlot';
import { useArticles, useCategories } from '../hooks/useBackendApi';

export default function Articles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const page = Number(searchParams.get('page')) || 1;

  // Fetch real data from backend
  const {
    data: articlesData,
    loading,
    error,
  } = useArticles({
    page,
    limit: 12,
    ...(category !== 'all' && { category }),
  });

  const { data: categoriesData } = useCategories();

  // Handle loading and error states
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="animate-pulse">
          <div className="mb-8 h-8 w-48 bg-gray-200 rounded"></div>
          <div className="mb-8 h-4 w-96 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Articles</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Extract articles and pagination from backend response
  const articles = articlesData?.articles || [];
  const pagination = articlesData?.pagination || {};
  const totalPages = pagination.totalPages || 1;

  // Get categories for filters
  const categories = categoriesData?.data || [];

  const handleCategoryChange = (cat) => {
    setSearchParams({ category: cat, page: '1' });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ category, page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="Articles - Liberia Digital Insights"
        description="Explore our collection of tech insights, stories, and analysis from Liberia and across Africa"
      />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Header */}
        <header className="mb-8">
          <H1 className="mb-4 text-3xl font-bold">Articles</H1>
          <p className="text-lg text-muted">
            Explore our collection of tech insights, stories, and analysis
          </p>
        </header>
        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              category === 'all'
                ? 'bg-brand-500 text-white'
                : 'bg-surface text-text hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]'
            }`}
          >
            All
          </button>
          {categories.slice(0, 8).map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                category === cat.slug
                  ? 'bg-brand-500 text-white'
                  : 'bg-surface text-text hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        {/* Results count */}
        <div className="mb-6 text-sm text-muted">
          Showing {articles.length} of {pagination.total || 0} articles
          {category !== 'all' && ` in ${category}`}
        </div>
        {/* Inline Advertisement */}
        <div className="mb-8">
          <AdSlot position="inline" className="opacity-0 animate-fade-in" />
        </div>
        import {(MotionGrid, MotionItem)} from '../components/ui/MotionWrapper';
        {/* Articles Grid */}
        <MotionGrid className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.length > 0 ? (
            articles.map((article, index) => {
              const isThirdArticle = (index + 1) % 3 === 0;
              return (
                <React.Fragment key={article.id}>
                  <MotionItem>
                    <ArticleCard
                      image={article.cover_image_url}
                      title={article.title}
                      category={article.category?.name || 'Uncategorized'}
                      date={new Date(article.published_at).toLocaleDateString()}
                      readTime={Math.ceil(article.content.length / 1000) + ' min read'}
                      tags={article.tags || []}
                      to={`/article/${article.slug}`}
                    />
                  </MotionItem>
                  {isThirdArticle && index < articles.length - 1 && (
                    <div className="col-span-full">
                      <AdSlot position="inline" className="opacity-0 animate-fade-in" />
                    </div>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-muted">
              No articles found in this category.
            </div>
          )}
        </MotionGrid>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? 'solid' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
