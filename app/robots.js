export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL || "https://liberiadigitalinsights.com"}/sitemap.xml`,
  };
}
