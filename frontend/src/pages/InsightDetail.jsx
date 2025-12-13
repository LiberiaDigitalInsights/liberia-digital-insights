import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { H1, H2 } from '../components/ui/Typography';
import ArticleCard from '../components/articles/ArticleCard';
import { Card, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import SEO from '../components/SEO';
import { useInsight, useInsights } from '../hooks/useBackendApi';
import ContentRenderer from '../components/ui/ContentRenderer';

export default function InsightDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Fetch insight by slug from backend
  const { data: insightData, loading: insightLoading, error: insightError } = useInsight(slug);
  const { data: relatedInsightsData, loading: relatedLoading } = useInsights({ limit: 3 });

  const insight = insightData?.insight;
  const relatedInsights = relatedInsightsData?.insights || [];

  // Loading state
  if (insightLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-32 bg-gray-200 rounded"></div>
          <div className="mb-4 h-12 w-3/4 bg-gray-200 rounded"></div>
          <div className="mb-8 h-64 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (insightError || !insight) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 text-center">
        <H1 className="mb-4 text-3xl font-bold">Insight Not Found</H1>
        <p className="mb-8 text-[var(--color-muted)]">
          The insight you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/insights"
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-brand-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-brand-600"
        >
          ← Back to Insights
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={insight.title}
        description={insight.excerpt || insight.title}
        image={insight.cover_image_url}
        type="article"
        author={insight.author?.name}
        tags={insight.tags}
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
          <span>{insight.category?.name || 'Insights'}</span>
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
              <Badge variant="solid">{insight.category.name}</Badge>
            </div>
          )}
          <H1 className="mb-4 text-3xl md:text-4xl font-bold">{insight.title}</H1>
          {insight.excerpt && (
            <p className="mb-6 text-xl text-[var(--color-muted)]">{insight.excerpt}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]">
            {insight.author?.name && <span>By {insight.author.name}</span>}
            {insight.published_at && <span>•</span>}
            {insight.published_at && (
              <span>{new Date(insight.published_at).toLocaleDateString()}</span>
            )}
            {insight.content && <span>•</span>}
            {insight.content && <span>{Math.ceil(insight.content.length / 1000)} min read</span>}
          </div>
        </header>

        {/* Image */}
        {insight.cover_image_url && (
          <div className="mb-8 overflow-hidden rounded-[var(--radius-lg)]">
            <img
              src={insight.cover_image_url}
              alt={insight.title}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        {/* Tags */}
        {insight.tags && insight.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {insight.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
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
        {relatedInsights.length > 0 && (
          <Card className="mb-12">
            <CardContent className="p-6">
              <H2 className="mb-4 text-lg font-semibold">Related Insights</H2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedLoading
                  ? // Loading skeleton for related insights
                    [1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-48 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))
                  : relatedInsights
                      .filter((related) => related.id !== insight.id)
                      .slice(0, 3)
                      .map((related) => (
                        <ArticleCard
                          key={related.id}
                          image={related.cover_image_url}
                          title={related.title}
                          category={related.category?.name || 'Insights'}
                          date={new Date(related.published_at).toLocaleDateString()}
                          readTime={Math.ceil(related.content.length / 1000) + ' min read'}
                          to={`/insight/${related.slug}`}
                        />
                      ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
