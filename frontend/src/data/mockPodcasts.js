export const mockPodcasts = [
  {
    id: 1,
    title: 'EP.01 Movement For Tech Liberia',
    description:
      'In this inaugural episode, we explore the growing tech movement in Liberia and discuss the challenges and opportunities facing the tech community.',
    duration: '41:18',
    date: 'Jun 18, Liberia Digital Insights Podcast',
    guest: 'Movement For Tech Liberia Team',
    image: '/LDI_favicon.png',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    links: {
      youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      spotify: 'https://open.spotify.com/show/example',
    },
    showNotes: [
      'Introduction to Liberia Digital Insights Podcast',
      'Overview of the tech ecosystem in Liberia',
      'Key initiatives driving tech growth',
      'Challenges and opportunities',
      'Upcoming events and resources',
    ],
  },
  {
    id: 2,
    title: 'EP.02 Startup Success Stories',
    description:
      'Hear from successful Liberian entrepreneurs about their journey, challenges, and advice for aspiring founders.',
    duration: '38:45',
    date: 'Jul 2, Liberia Digital Insights Podcast',
    guest: 'Various Startup Founders',
    image: '/LDI_favicon.png',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    links: {
      youtube: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
    },
    showNotes: [
      'Guest introductions',
      'Founding stories',
      'Key challenges faced',
      'Lessons learned',
      'Advice for new entrepreneurs',
    ],
  },
  {
    id: 3,
    title: 'EP.03 Digital Transformation in Liberia',
    description:
      'Exploring how digital technologies are transforming businesses and daily life in Liberia.',
    duration: '45:22',
    date: 'Jul 15, Liberia Digital Insights Podcast',
    guest: 'Tech Leaders Panel',
    image: '/LDI_favicon.png',
    audioUrl: null,
    showNotes: [
      'Digital transformation overview',
      'Industry case studies',
      'Implementation strategies',
      'Future outlook',
    ],
  },
];

export const generatePodcastGrid = (count = 6) => {
  const basePodcasts = [...mockPodcasts];
  return Array.from({ length: count }, (_, i) => {
    const base = basePodcasts[i % basePodcasts.length];
    return {
      ...base,
      id: i + 1,
      title: `EP.${String(i + 1).padStart(2, '0')} ${base.title.split(' - ')[1] || base.title}`,
    };
  });
};
