export const mockTalents = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Designer',
    bio: 'Product designer focused on accessible, inclusive UX.',
    links: { website: 'https://example.com/sarah', twitter: 'https://twitter.com/sarah' },
    category: 'Design',
  },
  {
    id: 2,
    name: 'James Doe',
    role: 'Engineer',
    bio: 'Fullstack engineer building performant web apps.',
    links: { github: 'https://github.com/james' },
    category: 'Engineering',
  },
  {
    id: 3,
    name: 'A. Mensah',
    role: 'Product',
    bio: 'Product manager shaping strategy and outcomes.',
    links: { linkedin: 'https://linkedin.com/in/mensah' },
    category: 'Product',
  },
];

export const getTalentCategories = () => ['All', 'Design', 'Engineering', 'Product'];
