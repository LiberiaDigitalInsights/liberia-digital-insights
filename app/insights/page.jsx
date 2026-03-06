"use client";

import React from "react";
import { H1, H2, Muted } from "@/components/ui/Typography";
import Card from "@/components/ui/Card";
import ArticleCard from "@/components/articles/ArticleCard";
import FeaturedArticleRow from "@/components/articles/FeaturedArticleRow";
import { useInsights, useCategories } from "@/hooks/useBackendApi";
import { FaHashtag, FaLightbulb, FaBullhorn } from "react-icons/fa";

export default function InsightsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  // Fetch real data from backend (currently stubbed)
  const { data: insightsData, loading: insightsLoading } = useInsights({
    limit: 12,
  });
  const { data: categoriesData } = useCategories();

  const insights = insightsData?.insights || [];
  const categories = categoriesData?.data || [];

  // Filter insights based on selected category
  const filteredInsights =
    selectedCategory === "all"
      ? insights
      : insights.filter(
          (insight) => insight.category?.slug === selectedCategory,
        );

  const specialFeatures = [
    {
      icon: FaHashtag,
      title: "#InsightTechThursdays",
      description:
        "Weekly insights and tips from tech experts in Liberia. Every Thursday, we share valuable knowledge to help you grow in tech.",
      bgColor: "bg-blue-500/20",
      iconColor: "text-blue-500",
      cardBg: "bg-blue-500/5",
    },
    {
      icon: FaLightbulb,
      title: "Editorial Insights",
      description:
        "In-depth analysis and opinion pieces on technology trends, policies, and innovations shaping Liberia's digital landscape.",
      bgColor: "bg-yellow-500/20",
      iconColor: "text-yellow-500",
      cardBg: "bg-yellow-500/5",
    },
    {
      icon: FaBullhorn,
      title: "Industry Voices",
      description:
        "Thought leadership articles and perspectives from tech leaders, entrepreneurs, and innovators across Liberia.",
      bgColor: "bg-green-500/20",
      iconColor: "text-green-500",
      cardBg: "bg-green-500/5",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <header className="mb-12 text-center">
        <H1 className="mb-4">Editorial Insights</H1>
        <Muted className="mx-auto max-w-3xl text-lg">
          Discover in-depth analysis, expert opinions, and special editorial
          features covering technology, innovation, and digital transformation
          in Liberia.
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
                <p className="text-sm text-muted">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Featured #InsightTechThursdays */}
      <Card className="mb-16 bg-gradient-to-r from-blue-500/5 to-purple-500/5 p-8 border-none shadow-sm">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex items-center justify-center">
            <div className="text-center md:text-left">
              <div className="mb-4 text-3xl font-bold tracking-tight text-text">
                #InsightTechThursdays
              </div>
              <div className="mb-6 text-xl font-semibold text-text">
                IF YOUR GITHUB IS EMPTY, YOU'RE INVISIBLE IN TECH.
              </div>
              <Muted className="mb-8 block">
                Join us every Thursday for weekly tech insights, career tips,
                and expert advice from Liberia's tech community.
              </Muted>
            </div>
          </div>
          <div className="opacity-0 animate-slide-up animation-delay-200">
            {insightsLoading ? (
              <div className="animate-pulse">
                <div className="h-64 bg-surface rounded"></div>
              </div>
            ) : insights.length > 0 ? (
              <FeaturedArticleRow
                index={1}
                image={insights[0].cover_image_url}
                title={insights[0].title}
                excerpt={
                  insights[0].excerpt ||
                  "Weekly insights from tech experts in Liberia."
                }
                category="#InsightTechThursdays"
                author={insights[0].author?.name || "Stephen M. Parteh"}
                date={new Date(insights[0].published_at).toLocaleDateString()}
                readTime={
                  Math.ceil((insights[0].content?.length || 0) / 1000) +
                  " min read"
                }
                href={`/insight/${insights[0].slug}`}
              />
            ) : (
              <div className="text-center text-muted">
                No insights available yet.
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
            selectedCategory === "all"
              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
              : "bg-surface text-text hover:bg-brand-500/10"
          }`}
        >
          All Insights ({insights.length})
        </button>
        {categories.map((category) => {
          const count = insights.filter(
            (i) => i.category?.slug === category.slug,
          ).length;
          if (count === 0 && selectedCategory !== category.slug) return null;
          return (
            <button
              key={category.slug}
              onClick={() => setSelectedCategory(category.slug)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.slug
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                  : "bg-surface text-text hover:bg-brand-500/10"
              }`}
            >
              {category.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Insights Grid */}
      <section>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {insightsLoading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-surface rounded mb-4"></div>
                <div className="h-4 bg-surface rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-surface rounded w-1/2"></div>
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
                  category={insight.category?.name || "Insights"}
                  author={insight.author?.name}
                  date={new Date(insight.published_at).toLocaleDateString()}
                  readTime={Math.ceil((insight.content?.length || 0) / 1000)}
                  href={`/insight/${insight.slug}`}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted">
                {selectedCategory === "all"
                  ? "No insights available yet."
                  : `No insights found in this category.`}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
