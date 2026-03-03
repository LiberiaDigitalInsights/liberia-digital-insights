import React from 'react';
import ArticleCard from './ArticleCard';

export default function FeaturedArticleRow({ index = 0, ...props }) {
  const featuredReverse = index % 2 === 1;
  return <ArticleCard featured featuredReverse={featuredReverse} {...props} />;
}
