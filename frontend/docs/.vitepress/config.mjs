export default {
  title: 'Liberia Digital Insights',
  description: 'Project documentation',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/logo.svg',
      },
    ],
  ],
  themeConfig: {
    nav: [
      { text: 'Getting Started', link: '/GettingStarted' },
      { text: 'Design System', link: '/DesignSystem' },
      { text: 'Components', link: '/Components' },
      { text: 'Admin Guide', link: '/AdminGuide' },
      { text: 'Contributing', link: '/Contributing' },
      { text: 'Changelog', link: '/Changelog' },
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Overview', link: '/' },
          { text: 'Getting Started', link: '/GettingStarted' },
          { text: 'Contributing', link: '/Contributing' },
        ],
      },
      {
        text: 'Design',
        items: [
          { text: 'Design System', link: '/DesignSystem' },
          { text: 'Components', link: '/Components' },
        ],
      },
      {
        text: 'Admin',
        items: [{ text: 'Admin Guide', link: '/AdminGuide' }],
      },
      {
        text: 'Reference',
        items: [
          {
            text: 'Platform Overview',
            link: '/Liberia_Digital_Insights_Website_Documentation',
          },
          {
            text: 'Categories',
            link: '/Categories',
          },
          { text: 'Changelog', link: '/Changelog' },
        ],
      },
    ],
    // To enable Algolia DocSearch, fill in your credentials and uncomment below
    algolia: {
      appId: '0MG5COI1YB',
      apiKey: 'f2e7f19a73725c5920434ad0306702a9',
      indexName: 'liberia-digital-insights',
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/LiberiaDigitalInsights/liberia-digital-insights/',
      },
    ],
  },
};
