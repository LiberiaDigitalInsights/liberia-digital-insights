import React from 'react';
import { H1, H2, Muted } from '../components/ui/Typography';
import Card from '../components/ui/Card';
import ArticleCard from '../components/articles/ArticleCard';
import SEO from '../components/SEO';
import { generateArticleGrid } from '../data/mockArticles';
import { CATEGORIES } from '../constants/categories';
import { FaHashtag, FaLightbulb, FaBullhorn } from 'react-icons/fa';

export default function Insights() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const articles = generateArticleGrid(12);

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

  const filteredArticles =
    selectedCategory === 'all'
      ? articles
      : articles.filter((article) => article.category === selectedCategory);

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
              <ArticleCard
                image={articles[0].image}
                title={articles[0].title}
                excerpt={articles[0].excerpt || 'Weekly insights from tech experts in Liberia.'}
                category="#InsightTechThursdays"
                author="Stephen M. Parteh, IT Manager of Liberia Digital Insights"
                date={articles[0].date}
                readTime={articles[0].readTime}
                to={`/article/${articles[0].id}`}
              />
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
            All Insights ({articles.length})
          </button>
          {CATEGORIES.slice(0, 8).map((category) => {
            const count = articles.filter((a) => a.category === category).length;
            if (count === 0) return null;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-brand-500 text-white'
                    : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]'
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>

        {/* Articles Grid */}
        <section>
          <div className="mb-6 text-sm text-[var(--color-muted)]">
            Showing {filteredArticles.length}{' '}
            {filteredArticles.length === 1 ? 'article' : 'articles'}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article, idx) => (
                <div
                  key={article.id}
                  className="opacity-0 animate-slide-up"
                  style={{ animationDelay: `${100 + idx * 50}ms` }}
                >
                  <ArticleCard
                    image={article.image}
                    title={article.title}
                    excerpt={article.excerpt}
                    category={article.category}
                    author={article.author}
                    date={article.date}
                    readTime={article.readTime}
                    to={`/article/${article.id}`}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-[var(--color-muted)]">
                No articles found in this category.
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
