# Liberia Digital Insights Docs

[![Build](https://img.shields.io/badge/build-passing-success)](https://github.com/LiberiaDigitalInsights/liberia-digital-insights/actions)
[![Docs](https://img.shields.io/badge/docs-vitepress-3eaf7c)](./)
[![Coverage](https://img.shields.io/badge/coverage-vitest_v8-informational)](./)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/LiberiaDigitalInsights/liberia-digital-insights)

Welcome to the comprehensive documentation for Liberia Digital Insights - a modern digital platform empowering Liberia's technology landscape through content management, community engagement, and professional development.

## 🚀 Platform Overview

Liberia Digital Insights is a full-stack web application featuring:

- **📰 Content Management**: Articles, insights, podcasts, events, training courses, and newsletters
- **🎙️ Multimedia Support**: Audio podcasts with transcripts, video content, and image galleries
- **📅 Event Management**: Tech events, workshops, conferences, and networking opportunities
- **🎓 Professional Development**: Training courses and certification programs
- **👥 Community Features**: User profiles, comments, subscriptions, and talent directory
- **🔧 Admin Dashboard**: Comprehensive content management and analytics
- **📊 Analytics**: Engagement tracking and performance metrics

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Express.js, Supabase (PostgreSQL), JWT Authentication
- **Documentation**: VitePress
- **Testing**: Vitest, React Testing Library
- **Development**: ESLint, Prettier, Concurrently

## 📚 Documentation Sections

### Getting Started
- [Setup Guide](./GettingStarted.md) - Installation and configuration
- [Contributing](./Contributing.md) - Development guidelines
- [Changelog](./Changelog.md) - Version history and updates

### Design & Development
- [Design System](./DesignSystem.md) - UI components and styling guidelines
- [Components](./Components.md) - Reusable component library
- [Categories](./Categories.md) - Content categorization system

### Platform Features
- [Admin Guide](./AdminGuide.md) - Admin panel documentation
- [Platform Overview](./Liberia_Digital_Insights_Website_Documentation.md) - Complete feature documentation

## 🌐 Live Services

When running locally:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Documentation**: http://localhost:5174
- **API Health Check**: http://localhost:5000/health

## Quick Links

- Getting Started: [/GettingStarted](./GettingStarted.md)
- Design System: [/DesignSystem](./DesignSystem.md)
- Components: [/Components](./Components.md)
- Admin Guide: [/AdminGuide](./AdminGuide.md)
- Platform Overview: [/Liberia_Digital_Insights_Website_Documentation](./Liberia_Digital_Insights_Website_Documentation.md)
- Categories: [Categories doc](./Categories.md)

## 🔍 Search

The documentation includes a powerful local search feature that indexes all content. You can:

- **Search by keyword**: Type any term to find relevant documentation
- **Use keyboard shortcuts**: Press `Ctrl+K` (or `Cmd+K` on Mac) to open search
- **Real-time results**: Search results appear as you type
- **Quick navigation**: Use arrow keys to navigate search results
- **Highlight matching**: Search terms are highlighted in results

### Search Tips

- Use specific terms like "API", "gallery", or "authentication"
- Search for component names like "Button" or "Modal"
- Look for feature names like "Content Management" or "Gallery System"
- Try searching for error messages or technical terms
- Use partial words - search will find matches automatically

### Search Configuration

Search is configured in `.vitepress/config.mjs` under `themeConfig.search`:

```js
// .vitepress/config.mjs
export default {
  themeConfig: {
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
                resetButtonTitle: 'Clear search'
              }
            }
          }
        }
      }
    },
  },
};
```

The local search provider indexes all markdown files and provides fast, reliable search functionality without requiring external services.
