# Liberia Digital Insights Docs

[![Build](https://img.shields.io/badge/build-passing-success)](https://github.com/LiberiaDigitalInsights/liberia-digital-insights/actions)
[![Docs](https://img.shields.io/badge/docs-vitepress-3eaf7c)](./)
[![Coverage](https://img.shields.io/badge/coverage-vitest_v8-informational)](./)
[![License](https://img.shields.io/badge/license-unknown-lightgrey)](https://github.com/LiberiaDigitalInsights/liberia-digital-insights)

Welcome to the project documentation. Use the sidebar to navigate.

## Quick Links

- Getting Started: [/GettingStarted](./GettingStarted.md)
- Design System: [/DesignSystem](./DesignSystem.md)
- Components: [/Components](./Components.md)
- Admin Guide: [/AdminGuide](./AdminGuide.md)
- Platform Overview: [/Liberia_Digital_Insights_Website_Documentation](./Liberia_Digital_Insights_Website_Documentation.md)
- Categories: [Categories doc](./Categories.md)

## Search

Site search can be enabled via Algolia DocSearch. Configure in `.vitepress/config.mjs` under `themeConfig.algolia`.

```js
// .vitepress/config.mjs
export default {
  themeConfig: {
    // algolia: {
    //   appId: '<APP_ID>',
    //   apiKey: '<SEARCH_API_KEY>',
    //   indexName: '<INDEX_NAME>',
    // },
  },
};
```
