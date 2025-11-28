import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { H1, H2, Muted } from '../components/ui/Typography';
import ArticleCard from '../components/articles/ArticleCard';
import { Card, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import SEO from '../components/SEO';
import { useArticle, useArticles } from '../hooks/useBackendApi';
import { FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';
import ContentRenderer from '../components/ui/ContentRenderer';

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Fetch article by slug from backend
  const { data: articleData, loading: articleLoading, error: articleError } = useArticle(slug);
  const { data: relatedArticlesData, loading: relatedLoading } = useArticles({ limit: 3 });
  
  const article = articleData?.article;
  const relatedArticles = relatedArticlesData?.articles || [];

  // Loading state
  if (articleLoading) {
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
  if (articleError || !article) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 text-center">
        <H1 className="mb-4 text-3xl font-bold">Article Not Found</H1>
        <p className="mb-8 text-[var(--color-muted)]">The article you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/articles"
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-brand-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-brand-600"
        >
          ← Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={article.title}
        description={article.excerpt || article.title}
        image={article.cover_image_url}
        type="article"
        author={article.author?.name}
        tags={article.tags}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[var(--color-muted)]">
          <Link to="/" className="hover:text-[var(--color-text)]">
            Home
          </Link>
          {' / '}
          <Link to="/articles" className="hover:text-[var(--color-text)]">
            Articles
          </Link>
          {' / '}
          <span>{article.category?.name || 'Uncategorized'}</span>
        </nav>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors duration-200"
        >
          ← Back
        </button>

        {/* Article Header */}
        <header className="mb-8">
          {article.category && (
            <div className="mb-4">
              <Badge variant="solid">{article.category.name}</Badge>
            </div>
          )}
          <H1 className="mb-4 text-3xl md:text-4xl font-bold">{article.title}</H1>
          {article.excerpt && (
            <p className="mb-6 text-xl text-[var(--color-muted)]">{article.excerpt}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]">
            {article.author?.name && <span>By {article.author.name}</span>}
            {article.published_at && <span>•</span>}
            {article.published_at && <span>{new Date(article.published_at).toLocaleDateString()}</span>}
            {article.content && <span>•</span>}
            {article.content && <span>{Math.ceil(article.content.length / 1000)} min read</span>}
          </div>
        </header>

        {/* Featured Image */}
        {article.cover_image_url && (
          <div className="mb-8 overflow-hidden rounded-[var(--radius-lg)]">
            <img src={article.cover_image_url} alt={article.title} className="h-auto w-full object-cover" />
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Article Content */}
        <article className="mb-12 prose prose-invert max-w-none">
          {article.content ? (
            <ContentRenderer html={article.content} />
          ) : (
            <p className="text-[var(--color-muted)]">
              {article.excerpt || 'No content available.'}
            </p>
          )}
        </article>

        {/* Share Section */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <H2 className="mb-4 text-lg font-semibold">Share this article</H2>
            <div className="flex gap-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-[var(--radius-md)] bg-blue-600 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-blue-700"
                aria-label="Share on Facebook"
              >
                <FaFacebookF /> Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-[var(--radius-md)] bg-sky-500 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-sky-600"
                aria-label="Share on Twitter"
              >
                <FaTwitter /> Twitter
              </a>
              <a
                href="#"
                className="flex items-center gap-2 rounded-[var(--radius-md)] bg-red-600 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-red-700"
                aria-label="Share"
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
              >
                <FaYoutube /> Copy Link
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section>
            <H2 className="mb-6 text-2xl font-bold">Related Articles</H2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedLoading ? (
                // Loading skeleton for related articles
                [1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))
              ) : (
                relatedArticles
                  .filter(related => related.id !== article.id)
                  .slice(0, 3)
                  .map((related) => (
                    <ArticleCard
                      key={related.id}
                      image={related.cover_image_url}
                      title={related.title}
                      category={related.category?.name || 'Uncategorized'}
                      date={new Date(related.published_at).toLocaleDateString()}
                      readTime={Math.ceil(related.content.length / 1000) + ' min read'}
                      to={`/article/${related.slug}`}
                    />
                  ))
              )}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
