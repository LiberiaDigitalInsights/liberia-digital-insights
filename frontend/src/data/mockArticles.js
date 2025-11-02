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
  },
  {
    id: 2,
    title: 'They delivered an impressive pitch showcased their project prototype.',
    category: 'Entrepreneurship',
    author: '',
    date: 'February 17, 2025',
    readTime: 3,
    image: '/LDI_favicon.png',
  },
  {
    id: 3,
    title: 'They delivered an impressive pitch showcased their project prototype.',
    category: 'Digital Transformation',
    author: '',
    date: 'February 17, 2025',
    readTime: 3,
    image: '/LDI_favicon.png',
  },
  {
    id: 4,
    title: 'They delivered an impressive pitch showcased their project prototype.',
    category: 'E-Commerce',
    author: '',
    date: 'February 17, 2025',
    readTime: 3,
    image: '/LDI_favicon.png',
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
  }));
};
