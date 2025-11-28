import React from 'react';
import ArticleCard from '../components/articles/ArticleCard';
import FeaturedArticleRow from '../components/articles/FeaturedArticleRow';
import PodcastWidget from '../components/sidebar/PodcastWidget';
import NewsletterWidget from '../components/sidebar/NewsletterWidget';
import EventsWidget from '../components/sidebar/EventsWidget';
import AdSlot from '../components/ads/AdSlot';
import { H1, H2, Muted } from '../components/ui/Typography';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';
import { useArticles, usePodcasts, useEvents, useNewsletters } from '../hooks/useBackendApi';

const Home = () => {
  // Fetch real data from backend
  const { data: articlesData, loading: articlesLoading } = useArticles({ limit: 12 });
  const { data: podcastsData, loading: podcastsLoading } = usePodcasts({ limit: 3 });
  const { data: eventsData, loading: eventsLoading } = useEvents({ limit: 3 });
  const { data: newslettersData, loading: newslettersLoading } = useNewsletters({ limit: 3 });

  // Extract data from backend responses
  const articles = articlesData?.articles || [];
  const featured = articles[0];
  const latestArticles = articles.slice(0, 12);
  const podcasts = podcastsData?.podcasts || [];
  const events = eventsData?.events || [];
  const newsletters = newslettersData?.newsletters || [];

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
                {featured ? (
                  <FeaturedArticleRow
                    index={0}
                    image={featured.cover_image_url}
                    title={featured.title}
                    excerpt={featured.excerpt}
                    category={featured.category?.name || 'Technology'}
                    author={featured.author?.name || 'Admin'}
                    date={new Date(featured.published_at).toLocaleDateString()}
                    readTime={Math.ceil(featured.content.length / 1000) + ' min read'}
                    to={`/article/${featured.slug}`}
                  />
                ) : (
                  articlesLoading ? (
                    <div className="animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No featured articles available
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Inline Advertisement */}
            <section className="animate-fade-in">
              <AdSlot position="inline" className="opacity-0 animate-fade-in animation-delay-200" />
            </section>

            {/* Article Grid */}
            <section className="animate-fade-in">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {latestArticles.map((article, idx) => (
                  <div
                    key={article.id}
                    className="opacity-0 animate-slide-up"
                    style={{ animationDelay: `${100 + idx * 50}ms` }}
                  >
                    <ArticleCard
                      image={article.cover_image_url}
                      title={article.title}
                      category={article.category?.name || 'Uncategorized'}
                      date={new Date(article.published_at).toLocaleDateString()}
                      readTime={Math.ceil(article.content.length / 1000) + ' min read'}
                      to={`/article/${article.slug}`}
                    />
                  </div>
                ))}
              </div>
              {articlesLoading && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* InsightTechThursdays Section */}
            <section className="animate-fade-in">
              <H2 className="mb-6 text-2xl font-bold">INSIGHT TECH THURSDAYS</H2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {latestArticles.slice(0, 6).map((article, idx) => (
                  <div
                    key={`itt-${article.id}`}
                    className="opacity-0 animate-slide-up"
                    style={{ animationDelay: `${100 + idx * 50}ms` }}
                  >
                    <ArticleCard
                      image={article.cover_image_url}
                      title={article.title}
                      category={article.category?.name || 'Insights'}
                      date={new Date(article.published_at).toLocaleDateString()}
                      readTime={Math.ceil(article.content.length / 1000) + ' min read'}
                      to={`/article/${article.slug}`}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Latest News */}
            <section className="animate-fade-in">
              <H2 className="mb-6 text-2xl font-bold">LATEST NEWS</H2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {latestArticles.slice(6, 18).map((article, idx) => (
                  <div
                    key={`latest-${article.id}`}
                    className="opacity-0 animate-slide-up"
                    style={{ animationDelay: `${100 + idx * 50}ms` }}
                  >
                    <ArticleCard
                      image={article.cover_image_url}
                      title={article.title}
                      category={article.category?.name || 'News'}
                      date={new Date(article.published_at).toLocaleDateString()}
                      readTime={Math.ceil(article.content.length / 1000) + ' min read'}
                      to={`/article/${article.slug}`}
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
                {podcasts.slice(0, 2).map((podcast, idx) => (
                  <div
                    key={`video-${podcast.id}`}
                    className="opacity-0 animate-slide-up"
                    style={{ animationDelay: `${100 + idx * 50}ms` }}
                  >
                    <ArticleCard
                      image={podcast.cover_image_url}
                      title={podcast.title}
                      category={podcast.category?.name || 'Podcast'}
                      date={new Date(podcast.published_at).toLocaleDateString()}
                      readTime={podcast.duration}
                      to={`/podcast/${podcast.slug}`}
                    />
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <div className="opacity-0 animate-fade-in animation-delay-100">
              <PodcastWidget podcasts={podcasts} loading={podcastsLoading} />
            </div>
            <div className="opacity-0 animate-fade-in animation-delay-200">
              <NewsletterWidget newsletters={newsletters} loading={newslettersLoading} />
            </div>
            <div className="opacity-0 animate-fade-in animation-delay-300">
              <EventsWidget events={events} loading={eventsLoading} />
            </div>
            {/* Advertisements */}
            <AdSlot position="sidebar" className="opacity-0 animate-fade-in animation-delay-400" />
          </aside>
        </div>
      </div>
    </>
  );
};

export default Home;
