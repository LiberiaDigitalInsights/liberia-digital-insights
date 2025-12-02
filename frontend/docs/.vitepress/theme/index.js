// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // Add any app enhancements here
    console.log('Documentation theme loaded')
  }
}
