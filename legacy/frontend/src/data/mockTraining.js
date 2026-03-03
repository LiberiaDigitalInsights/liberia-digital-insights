export const mockTrainings = [
  {
    id: 1,
    title: 'Full-Stack Web Development Bootcamp',
    summary: 'Hands-on training covering React, Node.js, and databases.',
    date: 'Dec 10, 2025',
    duration: '5 days',
    location: 'Monrovia, Liberia',
    image: '/LDI_favicon.png',
    category: 'Training',
    registrationUrl: '/register?type=training&id=1',
  },
  {
    id: 2,
    title: 'Data Analytics with Python',
    summary: 'Practical data analysis using pandas, NumPy, and visualization.',
    date: 'Jan 12, 2026',
    duration: '3 days',
    location: 'Virtual',
    modality: 'Online',
    image: '/LDI_favicon.png',
    category: 'Training',
    registrationUrl: '/register?type=training&id=2',
  },
  {
    id: 3,
    title: 'Cybersecurity Essentials',
    summary: 'Learn core security concepts, threats, and best practices.',
    date: 'Feb 20, 2026',
    duration: '2 days',
    location: 'Monrovia, Liberia',
    modality: 'In-person',
    image: '/LDI_favicon.png',
    category: 'Training',
    registrationUrl: '/register?type=training&id=3',
  },
  {
    id: 4,
    title: 'Digital Marketing Fundamentals',
    summary: 'SEO, content strategy, and social media marketing basics.',
    date: 'Mar 22, 2026',
    duration: '2 days',
    location: 'Online',
    modality: 'Online',
    image: '/LDI_favicon.png',
    category: 'Training',
    registrationUrl: '/register?type=training&id=4',
  },
];

export const mockCourses = [
  {
    id: 1,
    title: 'Foundations of Cybersecurity',
    summary: 'Learn core security concepts, threats, and best practices.',
    date: 'Self-paced',
    duration: '6 weeks',
    location: 'Online',
    modality: 'Self-paced',
    image: '/LDI_favicon.png',
    category: 'Course',
    registrationUrl: '/register?type=course&id=1',
  },
  {
    id: 2,
    title: 'Intro to Product Management',
    summary: 'Discovery, roadmapping, and delivery fundamentals.',
    date: 'Cohort starts Feb 2026',
    duration: '4 weeks',
    location: 'Hybrid',
    modality: 'Hybrid',
    image: '/LDI_favicon.png',
    category: 'Course',
    registrationUrl: '/register?type=course&id=2',
  },
  {
    id: 3,
    title: 'Mobile App Development with React Native',
    summary: 'Build cross-platform mobile apps using React Native and Expo.',
    date: 'Mar 15, 2026',
    duration: '4 weeks',
    location: 'Hybrid',
    modality: 'Hybrid',
    image: '/LDI_favicon.png',
    category: 'Course',
    registrationUrl: '/register?type=course&id=3',
  },
  {
    id: 4,
    title: 'Cloud Computing Fundamentals',
    summary: 'Introduction to AWS, Azure, and cloud deployment strategies.',
    date: 'Apr 5, 2026',
    duration: '3 days',
    location: 'Online',
    modality: 'In-person',
    image: '/LDI_favicon.png',
    category: 'Course',
    registrationUrl: '/register?type=course&id=4',
  },
];

export const pastTrainings = [
  {
    id: 101,
    title: 'Intro to Web Accessibility',
    summary: 'A practical intro to building accessible web apps.',
    date: 'Jul 2025',
    duration: '1 day',
    location: 'Monrovia, Liberia',
    modality: 'In-person',
    image: '/LDI_favicon.png',
    category: 'Training',
  },
];

export const pastCourses = [
  {
    id: 201,
    title: 'UI Design Fundamentals',
    summary: 'Visual design, layout, and components best practices.',
    date: 'Jun 2025',
    duration: '4 weeks',
    location: 'Online',
    modality: 'Online',
    image: '/LDI_favicon.png',
    category: 'Course',
  },
];

export const getPastTrainings = () => pastTrainings;
export const getPastCourses = () => pastCourses;
export const getUpcomingTrainings = () => mockTrainings;
export const getUpcomingCourses = () => mockCourses;
