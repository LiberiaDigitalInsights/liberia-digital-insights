export const mockArticles = [
  {
    id: 1,
    title:
      'Today, #TeamEden, winners of the Orange Summer Challenge 2024, had the privilege of meeting with investors from the U.S. Embassy.',
    excerpt:
      'They delivered an impressive pitch, faced insightful questions, and received commendation from investors, leading to potential partnership opportunities.',
    category: 'Technology',
    author: 'Liberia Digital Insights',
    date: 'February 17, 2025',
    readTime: 3,
    image: '/LDI_favicon.png',
    featured: true,
    tags: ['InsightTechThursdays'],
  },
  {
    id: 2,
    title: 'They delivered an impressive pitch showcased their project prototype.',
    category: 'Entrepreneurship',
    author: '',
    date: 'February 17, 2025',
    readTime: 3,
    image: '/LDI_favicon.png',
    tags: ['VideoInterview'],
  },
  {
    id: 3,
    title: 'They delivered an impressive pitch showcased their project prototype.',
    category: 'Digital Transformation',
    author: '',
    date: 'February 17, 2025',
    readTime: 3,
    image: '/LDI_favicon.png',
    tags: ['InsightTechThursdays'],
  },
  {
    id: 4,
    title: 'They delivered an impressive pitch showcased their project prototype.',
    category: 'E-Commerce',
    author: '',
    date: 'February 17, 2025',
    readTime: 3,
    image: '/LDI_favicon.png',
    tags: ['VideoInterview'],
  },
];

// Generate multiple articles for grid
export const generateArticleGrid = (count = 12) => {
  const categories = ['Technology', 'Entrepreneurship', 'Digital Transformation', 'E-Commerce'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: 'They delivered an impressive pitch showcased their project prototype.',
    category: categories[i % categories.length],
    date: 'February 17, 2025',
    readTime: 3,
    image: '/LDI_favicon.png',
    tags: i % 2 === 0 ? ['InsightTechThursdays'] : ['VideoInterview'],
  }));
};

// Tag-based filters
export const filterByTag = (items, tag) =>
  items.filter((it) => Array.isArray(it.tags) && it.tags.includes(tag));

// Dedicated datasets (can be replaced with real data sources later)
export const mockInsightTechThursdays = Array.from({ length: 8 }, (_, i) => ({
  id: 100 + i,
  title: `#InsightTechThursdays Topic ${i + 1}`,
  category: 'InsightTechThursdays',
  date: 'February 17, 2025',
  readTime: 3,
  image: '/LDI_favicon.png',
  tags: ['InsightTechThursdays'],
}));

export const mockVideoInterviews = Array.from({ length: 6 }, (_, i) => ({
  id: 200 + i,
  title: `Video Interview ${i + 1}`,
  category: 'Video Interview',
  date: 'February 17, 2025',
  readTime: 4,
  image: '/LDI_favicon.png',
  author: 'Liberia Digital Insights',
  tags: ['VideoInterview'],
}));

// Getters with count and graceful fallbacks
export const getInsightTechThursdays = (count = 6) => {
  // prefer dedicated dataset; if not enough, top up from tagged articles or generator
  const base = [...mockInsightTechThursdays];
  if (base.length >= count) return base.slice(0, count);
  const tagged = filterByTag(mockArticles, 'InsightTechThursdays');
  let combined = [...base, ...tagged];
  if (combined.length >= count) return combined.slice(0, count);
  const gen = filterByTag(generateArticleGrid(count * 2), 'InsightTechThursdays');
  combined = [...combined, ...gen];
  return combined.slice(0, count);
};

export const getVideoInterviews = (count = 3) => {
  const base = [...mockVideoInterviews];
  if (base.length >= count) return base.slice(0, count);
  const tagged = filterByTag(mockArticles, 'VideoInterview');
  let combined = [...base, ...tagged];
  if (combined.length >= count) return combined.slice(0, count);
  const gen = filterByTag(generateArticleGrid(count * 2), 'VideoInterview');
  combined = [...combined, ...gen];
  return combined.slice(0, count);
};
