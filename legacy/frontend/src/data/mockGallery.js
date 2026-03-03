export const mockGallery = [
  {
    id: 1,
    type: 'image',
    url: '/LDI_favicon.png',
    thumbnail: '/LDI_favicon.png',
    title: 'Orange Summer Challenge 2024',
    event: 'Orange Summer Challenge',
    category: 'Hackathon',
    date: '2024-07-15',
  },
  {
    id: 2,
    type: 'image',
    url: '/LDI_favicon.png',
    thumbnail: '/LDI_favicon.png',
    title: 'Team Eden Presentation',
    event: 'Orange Summer Challenge',
    category: 'Hackathon',
    date: '2024-07-16',
  },
  {
    id: 3,
    type: 'image',
    url: '/LDI_favicon.png',
    thumbnail: '/LDI_favicon.png',
    title: 'Investors Meeting',
    event: 'Orange Summer Challenge',
    category: 'Hackathon',
    date: '2024-07-17',
  },
  {
    id: 4,
    type: 'image',
    url: '/LDI_favicon.png',
    thumbnail: '/LDI_favicon.png',
    title: 'DIGITECH EXPO Setup',
    event: 'DIGITECH EXPO 2024',
    category: 'Expo',
    date: '2024-08-10',
  },
  {
    id: 5,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=example',
    thumbnail: '/LDI_favicon.png',
    title: 'Monrovia Tech Summit Opening',
    event: 'Monrovia Tech Submit 2024',
    category: 'Conference',
    date: '2024-09-05',
  },
  {
    id: 6,
    type: 'image',
    url: '/LDI_favicon.png',
    thumbnail: '/LDI_favicon.png',
    title: 'Panel Discussion',
    event: 'Monrovia Tech Submit 2024',
    category: 'Conference',
    date: '2024-09-06',
  },
  {
    id: 7,
    type: 'image',
    url: '/LDI_favicon.png',
    thumbnail: '/LDI_favicon.png',
    title: 'MTN Hackathon Participants',
    event: 'MTN HACKATON 2024',
    category: 'Hackathon',
    date: '2024-06-20',
  },
  {
    id: 8,
    type: 'image',
    url: '/LDI_favicon.png',
    thumbnail: '/LDI_favicon.png',
    title: 'Women in Tech Meetup',
    event: 'Women in Tech Liberia Meetup',
    category: 'Meetup',
    date: '2024-05-28',
  },
  {
    id: 9,
    type: 'image',
    url: '/LDI_favicon.png',
    thumbnail: '/LDI_favicon.png',
    title: 'Startup Pitch Night',
    event: 'Liberia Startup Pitch Night',
    category: 'Pitch Event',
    date: '2024-04-15',
  },
];

export const getGalleryByEvent = (eventName) =>
  mockGallery.filter((item) => item.event === eventName);

export const getGalleryByCategory = (category) =>
  mockGallery.filter((item) => item.category === category);

export const getAllEvents = () => [...new Set(mockGallery.map((item) => item.event))];

export const getAllCategories = () => [...new Set(mockGallery.map((item) => item.category))];
