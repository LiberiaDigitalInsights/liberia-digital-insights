import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { H1, H2 } from '../components/ui/Typography';
import ArticleCard from '../components/articles/ArticleCard';
import { Card, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import SEO from '../components/SEO';
import { mockArticles, generateArticleGrid } from '../data/mockArticles';
import ContentRenderer from '../components/ui/ContentRenderer';

export default function InsightDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const insight = mockArticles.find((a) => a.id === Number(id)) || mockArticles[0];
  const related = generateArticleGrid(3);

  return (
    <>
      <SEO
        title={insight.title}
        description={insight.excerpt || insight.title}
        image={insight.image}
        type="article"
        author={insight.author}
        tags={[insight.category]}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[var(--color-muted)]">
          <Link to="/" className="hover:text-[var(--color-text)]">
            Home
          </Link>
          {' / '}
          <Link to="/insights" className="hover:text-[var(--color-text)]">
            Insights
          </Link>
          {' / '}
          <span>{insight.category}</span>
        </nav>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors duration-200"
        >
          ← Back
        </button>

        {/* Header */}
        <header className="mb-8">
          {insight.category && (
            <div className="mb-4">
              <Badge variant="solid">{insight.category}</Badge>
            </div>
          )}
          <H1 className="mb-4 text-3xl md:text-4xl font-bold">{insight.title}</H1>
          {insight.excerpt && (
            <p className="mb-6 text-xl text-[var(--color-muted)]">{insight.excerpt}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]">
            {insight.author && <span>{insight.author}</span>}
            {insight.date && <span>•</span>}
            {insight.date && <span>{insight.date}</span>}
            {insight.readTime && <span>•</span>}
            {insight.readTime && <span>{insight.readTime} min read</span>}
          </div>
        </header>

        {/* Image */}
        {insight.image && (
          <div className="mb-8 overflow-hidden rounded-[var(--radius-lg)]">
            <img src={insight.image} alt={insight.title} className="h-auto w-full object-cover" />
          </div>
        )}

        {/* Content */}
        <article className="mb-12 prose prose-invert max-w-none">
          {insight.content ? (
            <ContentRenderer html={insight.content} />
          ) : (
            <p className="text-[var(--color-muted)]">
              {insight.excerpt || 'No content available.'}
            </p>
          )}
        </article>

        {/* Related */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <H2 className="mb-4 text-lg font-semibold">Related Insights</H2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ArticleCard
                  key={r.id}
                  image={r.image}
                  title={r.title}
                  category={r.category}
                  date={r.date}
                  readTime={r.readTime}
                  to={`/insight/${r.id}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
