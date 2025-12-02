// Enhanced search functionality for VitePress
export function enhanceSearch() {
  // Wait for DOM to be ready
  if (typeof document === 'undefined') return;
  
  // Custom search enhancements
  const enhanceDocSearch = () => {
    // Add custom search filters
    const originalSearch = window.docsearch;
    
    if (originalSearch) {
      // Enhance search with custom filters
      window.docsearch = {
        ...originalSearch,
        // Add custom search parameters
        searchParameters: {
          ...originalSearch.searchParameters,
          // Add filters for better results
          facetFilters: ['version:v1', 'type:documentation'],
          // Boost recent content
          optionalFilters: ['date:>2024-01-01'],
          // Configure highlighting
          attributesToHighlight: ['title', 'content', 'hierarchy.lvl1'],
          // Configure snippet length
          attributesToSnippet: ['content:50'],
          // Configure number of results
          hitsPerPage: 20
        }
      };
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchButton = document.querySelector('.VPDocSearchButton');
        if (searchButton) {
          searchButton.click();
        }
      }
      
      // Escape to close search
      if (e.key === 'Escape') {
        const closeButton = document.querySelector('.DocSearch-Cancel');
        if (closeButton) {
          closeButton.click();
        }
      }
    });
    
    // Add search result enhancements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // Enhance search results
              enhanceSearchResults(node);
            }
          });
        }
      });
    });
    
    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };
  
  // Enhance individual search results
  const enhanceSearchResults = (container) => {
    // Add result type indicators
    const hitElements = container.querySelectorAll('.DocSearch-Hit');
    hitElements.forEach((hit) => {
      const link = hit.querySelector('a');
      if (link && !link.querySelector('.result-type')) {
        // Determine result type from URL
        const url = link.getAttribute('href');
        let type = 'Documentation';
        let icon = '📄';
        
        if (url.includes('/API-')) {
          type = 'API Reference';
          icon = '🔧';
        } else if (url.includes('/GettingStarted')) {
          type = 'Guide';
          icon = '🚀';
        } else if (url.includes('/Gallery-')) {
          type = 'Feature';
          icon = '🖼️';
        } else if (url.includes('/Content-')) {
          type = 'Feature';
          icon = '📝';
        } else if (url.includes('/Project-')) {
          type = 'Development';
          icon = '🏗️';
        } else if (url.includes('/Environment-')) {
          type = 'Development';
          icon = '⚙️';
        } else if (url.includes('/Development-')) {
          type = 'Development';
          icon = '🔄';
        } else if (url.includes('/UI-')) {
          type = 'Design';
          icon = '🎨';
        }
        
        // Add type indicator
        const typeIndicator = document.createElement('span');
        typeIndicator.className = 'result-type';
        typeIndicator.innerHTML = `${icon} ${type}`;
        typeIndicator.style.cssText = `
          font-size: 11px;
          color: var(--vp-c-text-2);
          background: var(--vp-c-bg-alt);
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 8px;
        `;
        
        // Find the title element and append type indicator
        const titleElement = link.querySelector('.DocSearch-Hit-title, .DocSearch-Hit-text');
        if (titleElement) {
          titleElement.appendChild(typeIndicator);
        }
      }
    });
    
    // Add search highlighting
    const searchInput = container.querySelector('.DocSearch-Input');
    if (searchInput && !searchInput.hasAttribute('data-enhanced')) {
      searchInput.setAttribute('data-enhanced', 'true');
      
      // Add placeholder animation
      const placeholders = [
        'Search documentation...',
        'Type "API" for API reference...',
        'Try "gallery" for gallery docs...',
        'Search for "content management"...',
        'Look for "setup" instructions...'
      ];
      
      let placeholderIndex = 0;
      searchInput.addEventListener('focus', () => {
        const rotatePlaceholder = () => {
          searchInput.placeholder = placeholders[placeholderIndex];
          placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        };
        
        rotatePlaceholder();
        const interval = setInterval(rotatePlaceholder, 3000);
        
        searchInput.addEventListener('blur', () => {
          clearInterval(interval);
          searchInput.placeholder = placeholders[0];
        }, { once: true });
      });
    }
  };
  
  // Initialize enhancements when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceDocSearch);
  } else {
    enhanceDocSearch();
  }
}

// Export for use in theme
export default enhanceSearch;
