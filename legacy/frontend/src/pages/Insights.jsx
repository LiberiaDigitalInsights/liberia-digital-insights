import React from 'react';
import { H1, H2, Muted } from '../components/ui/Typography';
import Card from '../components/ui/Card';
import ArticleCard from '../components/articles/ArticleCard';
import FeaturedArticleRow from '../components/articles/FeaturedArticleRow';
import SEO from '../components/SEO';
import { useInsights, useCategories } from '../hooks/useBackendApi';
import { FaHashtag, FaLightbulb, FaBullhorn } from 'react-icons/fa';

export default function Insights() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  // Fetch real data from backend
  const { data: insightsData, loading: insightsLoading } = useInsights({ limit: 12 });
  const { data: categoriesData } = useCategories();

  const insights = insightsData?.insights || [];
  const categories = categoriesData?.data || [];

  // Filter insights based on selected category
  const filteredInsights =
    selectedCategory === 'all'
      ? insights
      : insights.filter((insight) => {
          const category = categories.find((cat) => cat.slug === selectedCategory);
          return category && insight.category_id === category.id;
        });

  const specialFeatures = [
    {
      icon: FaHashtag,
      title: '#InsightTechThursdays',
      description:
        'Weekly insights and tips from tech experts in Liberia. Every Thursday, we share valuable knowledge to help you grow in tech.',
      bgColor: 'bg-blue-500/20',
      iconColor: 'text-blue-500',
      cardBg: 'bg-blue-500/10',
    },
    {
      icon: FaLightbulb,
      title: 'Editorial Insights',
      description:
        "In-depth analysis and opinion pieces on technology trends, policies, and innovations shaping Liberia's digital landscape.",
      bgColor: 'bg-yellow-500/20',
      iconColor: 'text-yellow-500',
      cardBg: 'bg-yellow-500/10',
    },
    {
      icon: FaBullhorn,
      title: 'Industry Voices',
      description:
        'Thought leadership articles and perspectives from tech leaders, entrepreneurs, and innovators across Liberia.',
      bgColor: 'bg-green-500/20',
      iconColor: 'text-green-500',
      cardBg: 'bg-green-500/10',
    },
  ];

  return (
    <>
      <SEO />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <H1 className="mb-4">Editorial Insights</H1>
          <Muted className="mx-auto max-w-3xl text-lg">
            Discover in-depth analysis, expert opinions, and special editorial features covering
            technology, innovation, and digital transformation in Liberia.
          </Muted>
        </header>

        {/* Special Features */}
        <section className="mb-16">
          <H2 className="mb-8 text-center">Special Features</H2>
          <div className="grid gap-6 md:grid-cols-3">
            {specialFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className={`p-6 opacity-0 animate-slide-up ${feature.cardBg}`}
                  style={{ animationDelay: `${100 + idx * 100}ms` }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`rounded-full p-3 ${feature.bgColor}`}>
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-[var(--color-muted)]">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Featured #InsightTechThursdays */}
        <Card className="mb-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-4xl font-bold">#InsightTechThursdays</div>
                <div className="mb-6 text-xl font-semibold">
                  IF YOUR GITHUB IS EMPTY, YOU'RE INVISIBLE IN TECH.
                </div>
                <Muted>
                  Join us every Thursday for weekly tech insights, career tips, and expert advice
                  from Liberia's tech community.
                </Muted>
              </div>
            </div>
            <div className="opacity-0 animate-slide-up animation-delay-200">
              {insightsLoading ? (
                <div className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              ) : insights.length > 0 ? (
                <FeaturedArticleRow
                  index={1}
                  image={insights[0].cover_image_url}
                  title={insights[0].title}
                  excerpt={insights[0].excerpt || 'Weekly insights from tech experts in Liberia.'}
                  category="#InsightTechThursdays"
                  author={
                    insights[0].author?.name ||
                    'Stephen M. Parteh, IT Manager of Liberia Digital Insights'
                  }
                  date={new Date(insights[0].published_at).toLocaleDateString()}
                  readTime={Math.ceil(insights[0].content.length / 1000) + ' min read'}
                  to={`/insight/${insights[0].slug}`}
                />
              ) : (
                <div className="text-center text-[var(--color-muted)]">
                  No insights available yet.
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              selectedCategory === 'all'
                ? 'bg-brand-500 text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]'
            }`}
          >
            All Insights ({insights.length})
          </button>
          {categories.slice(0, 8).map((category) => {
            const count = insights.filter((i) => i.category_id === category.id).length;
            if (count === 0) return null;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.slug
                    ? 'bg-brand-500 text-white'
                    : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]'
                }`}
              >
                {category.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Articles Grid */}
        <section>
          <div className="mb-6 text-sm text-[var(--color-muted)]">
            Showing {filteredInsights.length}{' '}
            {filteredInsights.length === 1 ? 'insight' : 'insights'}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {insightsLoading ? (
              // Loading skeleton
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : filteredInsights.length > 0 ? (
              filteredInsights.map((insight, idx) => (
                <div
                  key={insight.id}
                  className="opacity-0 animate-slide-up"
                  style={{ animationDelay: `${100 + idx * 50}ms` }}
                >
                  <ArticleCard
                    image={insight.cover_image_url}
                    title={insight.title}
                    excerpt={insight.excerpt}
                    category={insight.category?.name || 'Insights'}
                    author={insight.author?.name}
                    date={new Date(insight.published_at).toLocaleDateString()}
                    readTime={Math.ceil(insight.content.length / 1000) + ' min read'}
                    to={`/insight/${insight.slug}`}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-[var(--color-muted)]">
                  {selectedCategory === 'all'
                    ? 'No insights available yet.'
                    : `No insights found in this category.`}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
