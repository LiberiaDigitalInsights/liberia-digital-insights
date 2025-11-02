import React, { useEffect } from 'react';
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

function updateMetaTag(property, content) {
  const isProperty = property.startsWith('og:') || property.startsWith('article:');
  const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
  let element = document.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    if (isProperty) {
      element.setAttribute('property', property);
    } else {
      element.setAttribute('name', property);
    }
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function updateTitle(title) {
  document.title = title;
}

function updateCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

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
  const imageUrl = image ? new URL(metaImage, window.location.origin).href : new URL(DEFAULT_META.image, window.location.origin).href;

  useEffect(() => {
    // Update title
    updateTitle(fullTitle);

    // Primary Meta Tags
    updateMetaTag('title', fullTitle);
    updateMetaTag('description', metaDescription);
    if (author) updateMetaTag('author', author);
    if (tags) {
      const keywords = Array.isArray(tags) ? tags.join(', ') : tags;
      updateMetaTag('keywords', keywords);
    }

    // Open Graph / Facebook
    updateMetaTag('og:type', metaType);
    updateMetaTag('og:url', url);
    updateMetaTag('og:title', fullTitle);
    updateMetaTag('og:description', metaDescription);
    updateMetaTag('og:image', imageUrl);
    updateMetaTag('og:site_name', DEFAULT_META.siteName);

    if (publishedTime) updateMetaTag('article:published_time', publishedTime);
    if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime);
    if (tags && Array.isArray(tags)) {
      // Remove existing article:tag meta tags first
      document.querySelectorAll('meta[property="article:tag"]').forEach((el) => el.remove());
      tags.forEach((tag) => updateMetaTag('article:tag', tag));
    }

    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:url', url);
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', metaDescription);
    updateMetaTag('twitter:image', imageUrl);

    // Additional SEO
    updateCanonical(url);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('language', 'English');
    updateMetaTag('revisit-after', '7 days');
  }, [fullTitle, metaDescription, imageUrl, metaType, url, author, publishedTime, modifiedTime, tags]);

  return null;
}

