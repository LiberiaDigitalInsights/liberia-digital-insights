export const mockEvents = [
  {
    id: 1,
    title: 'Orange Summer Challenge 2nd Edition',
    description:
      'The second edition of the Orange Summer Challenge brings together innovators and tech enthusiasts for a week of competition and learning.',
    date: '2025-07-15',
    endDate: '2025-07-22',
    location: 'Monrovia, Liberia',
    image: '/LDI_favicon.png',
    category: 'Hackathon',
    registrationUrl: '#',
    status: 'upcoming',
    isPast: false,
  },
  {
    id: 2,
    title: 'DIGITECH EXPO 2025 AI CHALLENGE',
    description:
      'Explore the future of AI in Liberia at this premier tech expo featuring workshops, panels, and networking opportunities.',
    date: '2025-08-10',
    endDate: '2025-08-12',
    location: 'Monrovia, Liberia',
    image: '/LDI_favicon.png',
    category: 'Expo',
    registrationUrl: '#',
    status: 'upcoming',
    isPast: false,
  },
  {
    id: 3,
    title: 'Monrovia Tech Submit 2025',
    description:
      "Annual tech summit bringing together industry leaders, startups, and policymakers to discuss Liberia's digital future.",
    date: '2025-09-05',
    endDate: '2025-09-07',
    location: 'Monrovia, Liberia',
    image: '/LDI_favicon.png',
    category: 'Conference',
    registrationUrl: '#',
    status: 'upcoming',
    isPast: false,
  },
  {
    id: 4,
    title: 'MTN HACKATON 2025',
    description:
      'Join the MTN Hackathon for a chance to build innovative solutions and compete for prizes.',
    date: '2025-06-20',
    endDate: '2025-06-22',
    location: 'Monrovia, Liberia',
    image: '/LDI_favicon.png',
    category: 'Hackathon',
    registrationUrl: '#',
    status: 'past',
    isPast: true,
  },
  {
    id: 5,
    title: 'Women in Tech Liberia Meetup',
    description:
      'Monthly meetup for women in technology to network, share experiences, and support each other.',
    date: '2025-05-28',
    endDate: '2025-05-28',
    location: 'Monrovia, Liberia',
    image: '/LDI_favicon.png',
    category: 'Meetup',
    registrationUrl: '#',
    status: 'past',
    isPast: true,
  },
  {
    id: 6,
    title: 'Liberia Startup Pitch Night',
    description:
      'Local startups pitch their ideas to investors and receive feedback from experienced entrepreneurs.',
    date: '2025-04-15',
    endDate: '2025-04-15',
    location: 'Monrovia, Liberia',
    image: '/LDI_favicon.png',
    category: 'Pitch Event',
    registrationUrl: '#',
    status: 'past',
    isPast: true,
  },
];

export const getUpcomingEvents = () =>
  mockEvents.filter((e) => !e.isPast).sort((a, b) => new Date(a.date) - new Date(b.date));

export const getPastEvents = () =>
  mockEvents.filter((e) => e.isPast).sort((a, b) => new Date(b.date) - new Date(a.date));

export const formatEventDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatEventDateRange = (startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if dates are valid
    if (isNaN(start.getTime())) {
      return 'Invalid date';
    }

    if (!endDate || isNaN(end.getTime()) || startDate === endDate) {
      return formatEventDate(startDate);
    }

    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  } catch {
    return 'Invalid date';
  }
};
