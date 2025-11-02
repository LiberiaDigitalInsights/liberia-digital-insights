import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { H1, H2, Muted } from '../components/ui/Typography';
import ArticleCard from '../components/articles/ArticleCard';
import { Card, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { mockArticles, generateArticleGrid } from '../data/mockArticles';
import { FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = mockArticles.find((a) => a.id === Number(id)) || mockArticles[0];
  const relatedArticles = generateArticleGrid(3);

  return (
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
        <span>{article.category}</span>
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
            <Badge variant="solid">{article.category}</Badge>
          </div>
        )}
        <H1 className="mb-4 text-3xl md:text-4xl font-bold">{article.title}</H1>
        {article.excerpt && (
          <p className="mb-6 text-xl text-[var(--color-muted)]">{article.excerpt}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]">
          {article.author && <span>{article.author}</span>}
          {article.date && <span>•</span>}
          {article.date && <span>{article.date}</span>}
          {article.readTime && <span>•</span>}
          {article.readTime && <span>{article.readTime} min read</span>}
        </div>
      </header>

      {/* Featured Image */}
      {article.image && (
        <div className="mb-8 overflow-hidden rounded-[var(--radius-lg)]">
          <img src={article.image} alt={article.title} className="h-auto w-full object-cover" />
        </div>
      )}

      {/* Article Content */}
      <article className="mb-12 prose prose-invert max-w-none">
        <div className="space-y-6 text-[var(--color-text)]">
          <p className="text-lg leading-relaxed">
            Today, #TeamEden, winners of the Orange Summer Challenge 2024, had the privilege of
            meeting with investors from the U.S. Embassy. They delivered an impressive pitch, faced
            insightful questions, and received commendation from investors, leading to potential
            partnership opportunities.
          </p>
          <p className="leading-relaxed">
            The meeting highlighted the growing tech ecosystem in Liberia and the importance of
            supporting innovative startups. Team Eden's presentation showcased their technical
            expertise and business acumen, leaving a strong impression on the potential investors.
          </p>
          <p className="leading-relaxed">
            This interaction opens doors for further discussions and potential funding opportunities
            that could significantly impact Liberia's digital transformation journey.
          </p>
        </div>
      </article>

      {/* Share Section */}
      <Card className="mb-12">
        <CardContent className="p-6">
          <H2 className="mb-4 text-lg font-semibold">Share this article</H2>
          <div className="flex gap-4">
            <a
              href="#"
              className="flex items-center gap-2 rounded-[var(--radius-md)] bg-blue-600 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-blue-700"
              aria-label="Share on Facebook"
            >
              <FaFacebookF /> Facebook
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-[var(--radius-md)] bg-sky-500 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-sky-600"
              aria-label="Share on Twitter"
            >
              <FaTwitter /> Twitter
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-[var(--radius-md)] bg-red-600 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-red-700"
              aria-label="Share on YouTube"
            >
              <FaYoutube /> Share
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Related Articles */}
      <section>
        <H2 className="mb-6 text-2xl font-bold">Related Articles</H2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedArticles.map((related) => (
            <ArticleCard
              key={related.id}
              image={related.image}
              title={related.title}
              category={related.category}
              date={related.date}
              readTime={related.readTime}
              to={`/article/${related.id}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
