import React from 'react';
import ArticleCard from '../components/articles/ArticleCard';
import FeaturedArticleRow from '../components/articles/FeaturedArticleRow';
import PodcastWidget from '../components/sidebar/PodcastWidget';
import NewsletterWidget from '../components/sidebar/NewsletterWidget';
import EventsWidget from '../components/sidebar/EventsWidget';
import { H1, H2, Muted } from '../components/ui/Typography';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';
import {
  mockArticles,
  generateArticleGrid,
  getInsightTechThursdays,
  getVideoInterviews,
} from '../data/mockArticles';

const Home = () => {
  const featured = mockArticles[0];
  const LATEST_NEWS_COUNT = 12;
  const ITT_COUNT = 6;
  const VIDEO_COUNT = 3;
  const articleGrid = generateArticleGrid(LATEST_NEWS_COUNT);
  const ittItems = getInsightTechThursdays(ITT_COUNT);
  const videoItems = getVideoInterviews(VIDEO_COUNT);

  return (
    <>
      <SEO />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Hero */}
        <section className="mb-10 animate-fade-in">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:p-12 text-center">
            <H1 className="mb-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              Liberia's home for tech news and insights
            </H1>
            <Muted className="mx-auto mb-6 max-w-2xl text-base md:text-lg">
              Stories, analysis, and interviews from Liberia’s growing technology ecosystem.
            </Muted>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button as="a" href="/insights" variant="solid">
                Explore Insights
              </Button>
              <Button as="a" href="/signup" variant="secondary">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_350px]">
          {/* Main content */}
          <main className="space-y-12">
            {/* Featured Technology Section */}
            <section className="animate-fade-in">
              <H2 className="mb-6 text-2xl font-bold">Technology</H2>
              <div className="opacity-0 animate-slide-up animation-delay-100">
                <FeaturedArticleRow
                  index={0}
                  image={featured.image}
                  title={featured.title}
                  excerpt={featured.excerpt}
                  category={featured.category}
                  author={featured.author}
                  date={featured.date}
                  readTime={featured.readTime}
                  to={`/article/${featured.id}`}
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
            <section className="animate-fade-in">
              <H2 className="mb-6 text-2xl font-bold">INSIGHT TECH THURSDAYS</H2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ittItems.map((article, idx) => (
                  <div
                    key={`itt-${article.id}`}
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

            {/* Video Interviews */}
            <section className="animate-fade-in">
              <H2 className="mb-6 text-2xl font-bold">VIDEO INTERVIEWS</H2>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="flex items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-10 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                  <div className="text-center">
                    <div className="mb-4 text-xl font-bold">LIBERIA DIGITAL INSIGHTS</div>
                    <div className="mb-2 text-lg font-semibold">VIDEO INTERVIEW</div>
                    <div className="text-sm text-[var(--color-muted)]">STREAMING LIVE</div>
                    <div className="text-sm text-[var(--color-muted)]">DATE</div>
                  </div>
                </div>
                {videoItems.map((video, idx) => (
                  <div
                    key={`video-${video.id}`}
                    className="opacity-0 animate-slide-up"
                    style={{ animationDelay: `${100 + idx * 50}ms` }}
                  >
                    <ArticleCard
                      image={video.image}
                      title={video.title}
                      category={video.category}
                      date={video.date}
                      readTime={video.readTime}
                      to={`/article/${video.id}`}
                    />
                  </div>
                ))}
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
