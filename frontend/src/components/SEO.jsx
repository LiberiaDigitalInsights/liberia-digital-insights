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
      'Learn about Liberia Digital Insights, our mission, vision, values, and the team behind Liberia\'s leading technology news platform.',
  },
  '/contact': {
    title: 'Contact Us | Liberia Digital Insights',
    description:
      'Get in touch with Liberia Digital Insights. Have questions, suggestions, or want to collaborate? We\'d love to hear from you.',
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
      'Reach Liberia\'s tech community through Liberia Digital Insights. Explore advertising packages and opportunities.',
  },
  '/signup': {
    title: 'Subscribe | Liberia Digital Insights',
    description:
      'Subscribe to our newsletter for weekly tech news, insights, podcasts, and exclusive event invitations.',
  },
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

      {/* Additional SEO */}
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
    </Helmet>
  );
}

