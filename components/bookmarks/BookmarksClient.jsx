"use client";

import React, { useState } from "react";
import { H1, Muted } from "@/components/ui/Typography";
import { useBookmarks, useAuth } from "@/hooks/useBackendApi";
import ArticleCard from "@/components/articles/ArticleCard";
import { FaBookmark, FaRegFrown } from "react-icons/fa";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { motion } from "framer-motion";

export default function BookmarksClient() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const {
    data,
    loading: bookmarksLoading,
    refetch,
  } = useBookmarks({
    resolve: "true",
    content_type: activeTab === "all" ? undefined : activeTab,
  });

  const bookmarks = data?.bookmarks || [];

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-12 w-48 bg-surface rounded"></div>
          <div className="mx-auto h-6 w-64 bg-surface rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <FaBookmark className="mx-auto mb-6 text-6xl text-muted/30" />
        <H1 className="mb-4">Private Collection</H1>
        <p className="mb-8 text-muted">
          Please log in to view and manage your bookmarked content.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-8 py-3 text-white font-bold transition-all hover:bg-brand-600 shadow-xl shadow-brand-500/20"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500">
          <FaBookmark className="text-3xl" />
        </div>
        <H1 className="mb-2 text-4xl font-extrabold tracking-tight">
          My Collection
        </H1>
        <p className="text-muted">
          Your saved articles, events, and insights across the platform.
        </p>
      </header>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-12">
        <div className="flex justify-center">
          <TabsList className="bg-surface border border-border">
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="article">Articles</TabsTrigger>
            <TabsTrigger value="event">Events</TabsTrigger>
            <TabsTrigger value="insight">Insights</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-8">
          {bookmarksLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse h-[400px] bg-surface rounded-xl"
                ></div>
              ))}
            </div>
          ) : bookmarks.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {bookmarks.map((bookmark) => {
                const { content, content_type } = bookmark;
                if (!content) return null;

                // Map content back to ArticleCard props
                return (
                  <ArticleCard
                    key={bookmark.id}
                    id={content.id}
                    title={content.title}
                    excerpt={content.excerpt}
                    image={content.cover_image_url}
                    category={
                      content_type === "article"
                        ? "Article"
                        : content_type === "event"
                          ? "Event"
                          : "Insight"
                    }
                    date={new Date(
                      content.published_at || content.date,
                    ).toLocaleDateString()}
                    href={`/${content_type}/${content.slug}`}
                    className="h-full"
                  />
                );
              })}
            </motion.div>
          ) : (
            <div className="py-20 text-center bg-surface/30 rounded-3xl border border-dashed border-border/50">
              <FaRegFrown className="mx-auto mb-4 text-5xl text-muted/20" />
              <h3 className="text-xl font-bold mb-2">No bookmarks found</h3>
              <p className="text-muted mb-8 max-w-md mx-auto">
                You haven't saved any{" "}
                {activeTab === "all" ? "content" : activeTab + "s"} yet. Browse
                the platform to build your collection!
              </p>
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 rounded-full border border-brand-500 text-brand-500 px-6 py-2 font-semibold transition-all hover:bg-brand-500 hover:text-white"
              >
                Start Exploring
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
