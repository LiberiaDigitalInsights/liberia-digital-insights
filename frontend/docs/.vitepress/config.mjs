export default {
  title: 'Liberia Digital Insights',
  description: 'Comprehensive documentation for Liberia Digital Insights platform',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/LDI_favicon.png',
      },
    ],
  ],
  themeConfig: {
    nav: [
      { text: 'Getting Started', link: '/GettingStarted' },
      { text: 'Design System', link: '/DesignSystem' },
      { text: 'Components', link: '/Components' },
      { text: 'Admin Guide', link: '/AdminGuide' },
      { text: 'API Reference', link: '/API-Reference' },
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
          { text: 'Changelog', link: '/Changelog' },
        ],
      },
      {
        text: 'Development',
        items: [
          { text: 'Project Structure', link: '/Project-Structure' },
          { text: 'Environment Setup', link: '/Environment-Setup' },
          { text: 'Development Workflow', link: '/Development-Workflow' },
        ],
      },
      {
        text: 'Design & UI',
        items: [
          { text: 'Design System', link: '/DesignSystem' },
          { text: 'Components', link: '/Components' },
          { text: 'UI Guidelines', link: '/UI-Guidelines' },
        ],
      },
      {
        text: 'Features',
        items: [
          { text: 'Content Management', link: '/Content-Management' },
          { text: 'Gallery System', link: '/Gallery-System' },
          { text: 'Event Management', link: '/Event-Management' },
          { text: 'Podcast System', link: '/Podcast-System' },
          { text: 'Training Courses', link: '/Training-Courses' },
          { text: 'Talent Directory', link: '/Talent-Directory' },
          { text: 'Newsletter System', link: '/Newsletter-System' },
        ],
      },
      {
        text: 'Admin',
        items: [
          { text: 'Admin Guide', link: '/AdminGuide' },
          { text: 'User Management', link: '/User-Management' },
          { text: 'Analytics', link: '/Analytics' },
        ],
      },
      {
        text: 'API Reference',
        items: [
          { text: 'API Overview', link: '/API-Reference' },
          { text: 'Authentication', link: '/Authentication' },
          { text: 'Endpoints', link: '/API-Endpoints' },
          { text: 'Error Handling', link: '/Error-Handling' },
        ],
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
          { text: 'Database Schema', link: '/Database-Schema' },
          { text: 'Deployment', link: '/Deployment' },
        ],
      },
    ],
    // Local search configuration (more reliable)
    search: {
      provider: 'local',
      options: {
        locales: {
          en: {
            translations: {
              button: {
                buttonText: 'Search Documentation',
                buttonAriaLabel: 'Search Documentation'
              },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Clear search',
                resetButtonAriaLabel: 'Clear search',
                footer: {
                  selectText: 'to select',
                  selectKeyAriaLabel: 'to select',
                  navigateText: 'to navigate',
                  navigateUpKeyAriaLabel: 'to navigate up',
                  navigateDownKeyAriaLabel: 'to navigate down',
                  closeText: 'to close'
                }
              }
            }
          }
        }
      }
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/LiberiaDigitalInsights/liberia-digital-insights/',
      },
    ],
    footer: {
      message: 'Built with ❤️ for Liberia\'s Digital Future',
      copyright: `Copyright © ${new Date().getFullYear()} Liberia Digital Insights Team`,
    },
  },
};
