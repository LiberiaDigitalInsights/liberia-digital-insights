// Sitemap generation utility
export const generateSitemap = (baseUrl, routes) => {
  const currentDate = new Date().toISOString();

  const sitemapEntries = routes
    .map((route) => {
      const url = `${baseUrl}${route.path}`;
      const changefreq = route.changefreq || 'weekly';
      const priority = route.priority || '0.8';
      const lastmod = route.lastmod || currentDate;

      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;
};

// Define site routes with SEO metadata
export const siteRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.9' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/articles', changefreq: 'daily', priority: '0.9' },
  { path: '/insights', changefreq: 'daily', priority: '0.9' },
  { path: '/podcasts', changefreq: 'weekly', priority: '0.8' },
  { path: '/events', changefreq: 'weekly', priority: '0.8' },
  { path: '/gallery', changefreq: 'monthly', priority: '0.7' },
  { path: '/talent', changefreq: 'weekly', priority: '0.8' },
  { path: '/training-courses', changefreq: 'weekly', priority: '0.8' },
  { path: '/advertisement', changefreq: 'monthly', priority: '0.6' },
  { path: '/signup', changefreq: 'monthly', priority: '0.7' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
  { path: '/cookies', changefreq: 'yearly', priority: '0.3' },
  { path: '/categories', changefreq: 'weekly', priority: '0.8' },
];

// Generate robots.txt
export const generateRobotsTxt = (baseUrl) => {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Block admin areas
Disallow: /admin
Disallow: /api/
Disallow: /*.json$

# Allow specific bots
User-agent: Googlebot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

# Crawl delay for respectful crawling
Crawl-delay: 1`;
};

// Generate sitemap index for multiple sitemaps
export const generateSitemapIndex = (baseUrl, sitemaps) => {
  const sitemapEntries = sitemaps
    .map(
      (sitemap) => `
  <sitemap>
    <loc>${baseUrl}/${sitemap}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`,
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
};

// Dynamic sitemap generation for content
export const generateContentSitemap = (baseUrl, contentType, contentItems) => {
  const currentDate = new Date().toISOString();

  const contentEntries = contentItems
    .map((item) => {
      const url = `${baseUrl}/${contentType}/${item.slug || item.id}`;
      const lastmod = item.updatedAt || item.createdAt || currentDate;
      const changefreq = contentType === 'articles' ? 'weekly' : 'monthly';
      const priority = item.featured ? '0.9' : '0.7';

      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${contentEntries}
</urlset>`;
};

// Export function to create sitemaps
export const createSitemaps = (baseUrl, content = {}) => {
  const mainSitemap = generateSitemap(baseUrl, siteRoutes);

  const sitemaps = {
    'sitemap.xml': mainSitemap,
    'robots.txt': generateRobotsTxt(baseUrl),
  };

  // Add content sitemaps if content is provided
  if (content.articles && content.articles.length > 0) {
    sitemaps['sitemap-articles.xml'] = generateContentSitemap(
      baseUrl,
      'articles',
      content.articles,
    );
  }

  if (content.insights && content.insights.length > 0) {
    sitemaps['sitemap-insights.xml'] = generateContentSitemap(
      baseUrl,
      'insights',
      content.insights,
    );
  }

  if (content.podcasts && content.podcasts.length > 0) {
    sitemaps['sitemap-podcasts.xml'] = generateContentSitemap(
      baseUrl,
      'podcasts',
      content.podcasts,
    );
  }

  if (content.events && content.events.length > 0) {
    sitemaps['sitemap-events.xml'] = generateContentSitemap(baseUrl, 'events', content.events);
  }

  return sitemaps;
};

// SEO validation utilities
export const seoValidator = {
  // Check if URL is valid for sitemap
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Validate sitemap XML structure
  validateSitemap: (sitemapXml) => {
    const errors = [];

    if (!sitemapXml.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
      errors.push('Missing XML declaration');
    }

    if (!sitemapXml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
      errors.push('Missing or incorrect urlset namespace');
    }

    if (!sitemapXml.includes('</urlset>')) {
      errors.push('Missing closing urlset tag');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Check for common SEO issues
  checkSEOIssues: (routes) => {
    const issues = [];

    routes.forEach((route) => {
      if (!route.path || route.path === '/') return;

      if (!route.title) {
        issues.push(`Missing title for route: ${route.path}`);
      }

      if (!route.description) {
        issues.push(`Missing description for route: ${route.path}`);
      }

      if (route.description && route.description.length < 120) {
        issues.push(`Description too short for route: ${route.path}`);
      }

      if (route.description && route.description.length > 160) {
        issues.push(`Description too long for route: ${route.path}`);
      }
    });

    return issues;
  },
};
