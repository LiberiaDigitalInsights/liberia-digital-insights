import React from 'react';
import ArticleCard from '../components/articles/ArticleCard';
import PodcastWidget from '../components/sidebar/PodcastWidget';
import NewsletterWidget from '../components/sidebar/NewsletterWidget';
import EventsWidget from '../components/sidebar/EventsWidget';
import { H2 } from '../components/ui/Typography';
import SEO from '../components/SEO';
import { mockArticles, generateArticleGrid } from '../data/mockArticles';

const Home = () => {
  const featured = mockArticles[0];
  const articleGrid = generateArticleGrid(12);

  return (
    <>
      <SEO />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_350px]">
        {/* Main content */}
        <main className="space-y-12">
          {/* Featured Technology Section */}
          <section className="animate-fade-in">
            <H2 className="mb-6 text-2xl font-bold">Technology</H2>
            <div className="opacity-0 animate-slide-up animation-delay-100">
              <ArticleCard
                image={featured.image}
                title={featured.title}
                excerpt={featured.excerpt}
                category={featured.category}
                author={featured.author}
                date={featured.date}
                readTime={featured.readTime}
                featured
              />
            </div>
          </section>

          {/* Article Grid */}
          <section className="animate-fade-in">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articleGrid.slice(0, 12).map((article, idx) => (
                <div
                  key={article.id}
                  className="opacity-0 animate-slide-up"
                  style={{ animationDelay: `${100 + idx * 50}ms` }}
                >
                  <ArticleCard
                    image={article.image}
                    title={article.title}
                    category={article.category}
                    date={article.date}
                    readTime={article.readTime}
                    to={`/article/${article.id}`}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* InsightTechThursdays Section */}
          <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 animate-fade-in">
            <div className="flex items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-10 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <div className="text-center">
                <div className="mb-4 text-3xl font-bold">#InsightTechThursdays</div>
                <div className="text-lg font-semibold">
                  IF YOUR GITHUB IS EMPTY, YOU'RE INVISIBLE IN TECH.
                </div>
              </div>
            </div>
            <div className="opacity-0 animate-slide-up animation-delay-200">
              <ArticleCard
                image={featured.image}
                title={featured.title}
                excerpt={featured.excerpt}
                category={featured.category}
                author="#InsightTechThursday Stephen M. Parteh, IT Manager of Liberia Digital Insights"
                date={featured.date}
                readTime={featured.readTime}
              />
            </div>
          </section>

          {/* Latest News */}
          <section className="animate-fade-in">
            <H2 className="mb-6 text-2xl font-bold">LATEST NEWS</H2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articleGrid.slice(0, 12).map((article, idx) => (
                <div
                  key={`latest-${article.id}`}
                  className="opacity-0 animate-slide-up"
                  style={{ animationDelay: `${100 + idx * 50}ms` }}
                >
                  <ArticleCard
                    image={article.image}
                    title={article.title}
                    category={article.category}
                    date={article.date}
                    readTime={article.readTime}
                    to={`/article/${article.id}`}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Podcast Interviews Section */}
          <section className="grid grid-cols-1 gap-8 lg:grid-cols-3 animate-fade-in">
            <div className="flex items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-10 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <div className="text-center">
                <div className="mb-4 text-xl font-bold">LIBERIA DIGITAL INSIGHTS</div>
                <div className="mb-2 text-lg font-semibold">VIDEO INTERVIEW</div>
                <div className="text-sm text-[var(--color-muted)]">STREAMING LIVE</div>
                <div className="text-sm text-[var(--color-muted)]">DATE</div>
              </div>
            </div>
            <div className="opacity-0 animate-slide-up animation-delay-100">
              <ArticleCard
                image={featured.image}
                title={featured.title}
                excerpt={featured.excerpt}
                category={featured.category}
                author="Obediah Jallah, Project Lead - EdenTek"
                date={featured.date}
                readTime={featured.readTime}
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <div className="text-center text-sm">VIDEO INTERVIEW</div>
              </div>
              <div className="opacity-0 animate-slide-up animation-delay-200">
                <ArticleCard
                  image={featured.image}
                  title={featured.title}
                  excerpt={featured.excerpt}
                  category={featured.category}
                  author="Obediah Jallah"
                  date={featured.date}
                  readTime={featured.readTime}
                />
              </div>
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div className="opacity-0 animate-fade-in animation-delay-100">
            <PodcastWidget />
          </div>
          <div className="opacity-0 animate-fade-in animation-delay-200">
            <NewsletterWidget />
          </div>
          <div className="opacity-0 animate-fade-in animation-delay-300">
            <EventsWidget />
          </div>
          {/* Advertisement placeholder */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center text-sm text-[var(--color-muted)] transition-all duration-300 hover:shadow-lg">
            Advertisement
          </div>
        </aside>
      </div>
    </div>
    </>
  );
};

export default Home;
