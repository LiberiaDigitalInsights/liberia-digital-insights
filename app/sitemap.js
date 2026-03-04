import { supabase } from "@/lib/supabase";

export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://liberiadigitalinsights.com";

  // Fixed routes
  const routes = [
    "",
    "/articles",
    "/events",
    "/insights",
    "/gallery",
    "/about",
    "/contact",
    "/talent",
    "/training",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic routes
  const [articles, events, insights] = await Promise.all([
    supabase.from("articles").select("slug, updated_at"),
    supabase.from("events").select("slug, updated_at"),
    supabase.from("insights").select("slug, updated_at"),
  ]);

  const articleRoutes = (articles.data || []).map((a) => ({
    url: `${baseUrl}/article/${a.slug}`,
    lastModified: new Date(a.updated_at),
    priority: 0.6,
  }));

  const eventRoutes = (events.data || []).map((e) => ({
    url: `${baseUrl}/event/${e.slug}`,
    lastModified: new Date(e.updated_at),
    priority: 0.6,
  }));

  const insightRoutes = (insights.data || []).map((i) => ({
    url: `${baseUrl}/insight/${i.slug}`,
    lastModified: new Date(i.updated_at),
    priority: 0.6,
  }));

  return [...routes, ...articleRoutes, ...eventRoutes, ...insightRoutes];
}
