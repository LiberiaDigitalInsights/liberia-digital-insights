"use client";

import React from "react";
import Link from "next/link";
import { H1, Muted } from "@/components/ui/Typography";
import { useCategories } from "@/hooks/useBackendApi";
import { MotionGrid, MotionItem } from "@/components/ui/MotionWrapper";
import Card from "@/components/ui/Card";

export default function CategoriesPage() {
  const { data: categoriesData, loading, error } = useCategories();
  const categories = categoriesData?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <header className="mb-12 text-center">
        <H1 className="mb-4">Discover by Topic</H1>
        <Muted className="text-lg mx-auto max-w-2xl">
          Explore our wide range of technical content organized by category.
          From programming and AI to digital marketing and entrepreneurship.
        </Muted>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="animate-pulse h-32 bg-surface rounded-xl"
            ></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 font-bold bg-red-500/5 rounded-2xl border border-red-500/20">
          {error}
        </div>
      ) : (
        <MotionGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <MotionItem key={category.slug}>
              <Link href={`/category/${category.slug}`}>
                <Card className="p-6 h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-border/50 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full -mr-12 -mt-12 group-hover:bg-brand-500/10 transition-colors" />
                  <h3 className="text-xl font-extrabold text-text mb-3 group-hover:text-brand-500 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2 leading-relaxed">
                    {category.description ||
                      `Articles and insights relating to ${category.name}.`}
                  </p>
                  <div className="mt-6 flex items-center text-xs font-bold text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Articles →
                  </div>
                </Card>
              </Link>
            </MotionItem>
          ))}
        </MotionGrid>
      )}
    </div>
  );
}
