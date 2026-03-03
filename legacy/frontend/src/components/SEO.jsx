import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const DEFAULT_META = {
  title: 'Liberia Digital Insights | Technology News & Innovation',
  description:
    'Your premier destination for technology news, insights, and innovation stories from Liberia and beyond. Stay updated with tech trends, podcasts, events, and more.',
  image: '/LDI_favicon.png',
  type: 'website',
  siteName: 'Liberia Digital Insights',
  siteUrl: 'https://liberiadigitalinsights.com',
};

const ROUTE_META = {
  '/': {
    title: 'Home | Liberia Digital Insights',
    description:
      'Your premier destination for technology news, insights, and innovation stories from Liberia and beyond.',
  },
  '/about': {
    title: 'About Us | Liberia Digital Insights',
    description:
      "Learn about Liberia Digital Insights, our mission, vision, values, and the team behind Liberia's leading technology news platform.",
  },
  '/contact': {
    title: 'Contact Us | Liberia Digital Insights',
    description:
      "Get in touch with Liberia Digital Insights. Have questions, suggestions, or want to collaborate? We'd love to hear from you.",
  },
  '/articles': {
    title: 'Articles | Liberia Digital Insights',
    description:
      'Browse our latest technology articles covering startups, digital transformation, innovation, and tech trends in Liberia.',
  },
  '/podcasts': {
    title: 'Podcasts | Liberia Digital Insights',
    description:
      'Listen to interviews, insights, and discussions about tech in Liberia. Featuring tech leaders, entrepreneurs, and innovators.',
  },
  '/events': {
    title: 'Events | Liberia Digital Insights',
    description:
      'Discover tech events, hackathons, conferences, and meetups in Liberia. Stay updated with upcoming and past events.',
  },
  '/gallery': {
    title: 'Gallery | Liberia Digital Insights',
    description:
      'Photos and videos from our events, interviews, and community gatherings. Explore our visual content collection.',
  },
  '/insights': {
    title: 'Editorial Insights | Liberia Digital Insights',
    description:
      'Discover in-depth analysis, expert opinions, and special editorial features covering technology and innovation in Liberia.',
  },
  '/advertisement': {
    title: 'Advertising Opportunities | Liberia Digital Insights',
    description:
      "Reach Liberia's tech community through Liberia Digital Insights. Explore advertising packages and opportunities.",
  },
  '/signup': {
    title: 'Subscribe | Liberia Digital Insights',
    description:
      'Subscribe to our newsletter for weekly tech news, insights, podcasts, and exclusive event invitations.',
  },
  '/privacy': {
    title: 'Privacy Policy | Liberia Digital Insights',
    description:
      'Learn how Liberia Digital Insights protects your privacy and handles your data responsibly.',
  },
  '/terms': {
    title: 'Terms of Service | Liberia Digital Insights',
    description: 'Read our terms of service and user agreement for Liberia Digital Insights.',
  },
  '/cookies': {
    title: 'Cookie Policy | Liberia Digital Insights',
    description: 'Understand how Liberia Digital Insights uses cookies and tracking technologies.',
  },
  '/talent': {
    title: 'Talent Hub | Liberia Digital Insights',
    description: "Connect with Liberia's tech talent. Find opportunities and showcase your skills.",
  },
  '/training-courses': {
    title: 'Training & Courses | Liberia Digital Insights',
    description:
      'Enhance your skills with our technology training courses and workshops in Liberia.',
  },
};

// Generate JSON-LD structured data
const generateStructuredData = (meta, url, imageUrl) => {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': meta.type === 'article' ? 'Article' : 'WebPage',
    name: meta.title,
    description: meta.description,
    url: url,
    image: imageUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Liberia Digital Insights',
      url: DEFAULT_META.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${DEFAULT_META.siteUrl}/LDI_favicon.png`,
      },
      sameAs: [
        'https://facebook.com/LiberiaDigitalInsights',
        'https://twitter.com/LiberiaDigitalInsights',
        'https://linkedin.com/company/LiberiaDigitalInsights',
        'https://youtube.com/@LiberiaDigitalInsights',
      ],
    },
  };

  // Add article-specific fields
  if (meta.type === 'article') {
    baseSchema.datePublished = meta.publishedTime;
    baseSchema.dateModified = meta.modifiedTime || meta.publishedTime;
    baseSchema.author = {
      '@type': 'Organization',
      name: meta.author || 'Liberia Digital Insights',
    };
    if (meta.tags && Array.isArray(meta.tags)) {
      baseSchema.keywords = meta.tags.join(', ');
    }
  }

  return baseSchema;
};

// Generate breadcrumb schema
const generateBreadcrumbSchema = (pathname) => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Home', url: DEFAULT_META.siteUrl }];

  let currentPath = '';
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const routeMeta = ROUTE_META[currentPath];
    if (routeMeta) {
      breadcrumbs.push({
        name: routeMeta.title.replace(' | Liberia Digital Insights', ''),
        url: `${DEFAULT_META.siteUrl}${currentPath}`,
      });
    }
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
};

export default function SEO({
  title,
  description,
  image,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  tags,
  schemaData,
}) {
  const location = useLocation();
  const routeMeta = ROUTE_META[location.pathname] || {};
  const metaTitle = title || routeMeta.title || DEFAULT_META.title;
  const metaDescription = description || routeMeta.description || DEFAULT_META.description;
  const metaImage = image || DEFAULT_META.image;
  const metaType = type || DEFAULT_META.type;

  // Build full title with site name
  const fullTitle = metaTitle.includes(DEFAULT_META.siteName)
    ? metaTitle
    : `${metaTitle} | ${DEFAULT_META.siteName}`;

  const url = `${window.location.origin}${location.pathname}`;
  const imageUrl = image
    ? new URL(metaImage, window.location.origin).href
    : new URL(DEFAULT_META.image, window.location.origin).href;

  const keywords = tags ? (Array.isArray(tags) ? tags.join(', ') : tags) : undefined;

  // Generate structured data
  const structuredData =
    schemaData ||
    generateStructuredData(
      {
        title: fullTitle,
        description: metaDescription,
        type: metaType,
        author,
        publishedTime,
        modifiedTime,
        tags,
      },
      url,
      imageUrl,
    );

  const breadcrumbData = generateBreadcrumbSchema(location.pathname);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      {author && <meta name="author" content={author} />}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={metaType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={DEFAULT_META.siteName} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {tags &&
        Array.isArray(tags) &&
        tags.map((tag, idx) => <meta key={idx} property="article:tag" content={tag} />)}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@LiberiaDigitalInsights" />
      <meta name="twitter:creator" content="@LiberiaDigitalInsights" />

      {/* Additional SEO */}
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="geo.region" content="LR" />
      <meta name="geo.placename" content="Monrovia, Liberia" />
      <meta name="ICBM" content="6.2916; -10.7607" />

      {/* Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://liberiadigitalinsights.com" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//connect.facebook.net" />
      <link rel="dns-prefetch" href="//platform.twitter.com" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>

      {/* Breadcrumb Schema */}
      {location.pathname !== '/' && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbData)}</script>
      )}

      {/* Organization Schema for homepage */}
      {location.pathname === '/' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Liberia Digital Insights',
            url: DEFAULT_META.siteUrl,
            logo: `${DEFAULT_META.siteUrl}/LDI_favicon.png`,
            description: DEFAULT_META.description,
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'LR',
              addressLocality: 'Monrovia',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+231-XXX-XXXX',
              contactType: 'customer service',
              email: 'contact@liberiadigitalinsights.com',
            },
            sameAs: [
              'https://facebook.com/LiberiaDigitalInsights',
              'https://twitter.com/LiberiaDigitalInsights',
              'https://linkedin.com/company/LiberiaDigitalInsights',
              'https://youtube.com/@LiberiaDigitalInsights',
            ],
          })}
        </script>
      )}

      {/* Website Schema for homepage */}
      {location.pathname === '/' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Liberia Digital Insights',
            url: DEFAULT_META.siteUrl,
            description: DEFAULT_META.description,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${DEFAULT_META.siteUrl}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Liberia Digital Insights',
            },
          })}
        </script>
      )}
    </Helmet>
  );
}
