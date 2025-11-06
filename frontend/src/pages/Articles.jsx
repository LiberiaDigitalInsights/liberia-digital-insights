import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { H1 } from '../components/ui/Typography';
import ArticleCard from '../components/articles/ArticleCard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';
import { CATEGORIES } from '../constants/categories';
import { generateArticleGrid } from '../data/mockArticles';

export default function Articles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const page = Number(searchParams.get('page')) || 1;

  const allArticles = generateArticleGrid(24);
  const filteredArticles =
    category === 'all'
      ? allArticles
      : allArticles.filter((a) => a.category.toLowerCase() === category.toLowerCase());

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  const handleCategoryChange = (cat) => {
    setSearchParams({ category: cat, page: '1' });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ category, page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEO />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Header */}
        <header className="mb-8">
          <H1 className="mb-4 text-3xl font-bold">Articles</H1>
          <p className="text-lg text-[var(--color-muted)]">
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
                : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]'
            }`}
          >
            All
          </button>
          {CATEGORIES.slice(0, 8).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat.toLowerCase())}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                category === cat.toLowerCase()
                  ? 'bg-brand-500 text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-[var(--color-muted)]">
          Showing {paginatedArticles.length} of {filteredArticles.length} articles
          {category !== 'all' && ` in ${category}`}
        </div>

        {/* Articles Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedArticles.length > 0 ? (
            paginatedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                image={article.image}
                title={article.title}
                category={article.category}
                date={article.date}
                readTime={article.readTime}
                to={`/article/${article.id}`}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-[var(--color-muted)]">
              No articles found in this category.
            </div>
          )}
        </div>

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
