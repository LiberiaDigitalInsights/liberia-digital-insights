import React, { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

export const metadata = {
  title: "Search | Liberia Digital Insights",
  description:
    "Search across all articles, podcasts, events, and insights on the LDI platform.",
};

function SearchFallback() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20 animate-pulse space-y-8">
      <div className="h-12 bg-muted/30 rounded-2xl w-1/2" />
      <div className="h-14 bg-muted/20 rounded-2xl" />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchPageClient />
    </Suspense>
  );
}
