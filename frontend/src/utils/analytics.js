import React, { useEffect, useState } from 'react';

// Analytics tracking utility
export const analytics = {
  // Initialize Google Analytics
  init: (trackingId) => {
    if (typeof window !== 'undefined' && !window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', trackingId, {
        anonymize_ip: true,
        cookie_flags: 'SameSite=Lax;Secure',
      });
    }
  },

  // Track page view
  pageview: (path) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path,
      });
    }
  },

  // Track custom events
  event: (action, category = 'General', label = '', value = 0) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  },

  // Track user engagement
  engagement: (type, target) => {
    analytics.event('engagement', 'User Interaction', `${type}: ${target}`);
  },

  // Track newsletter signup
  newsletterSignup: (source = 'footer') => {
    analytics.event('newsletter_signup', 'Lead Generation', source);
  },

  // Track content interactions
  contentInteraction: (contentType, contentId, action = 'view') => {
    analytics.event('content_interaction', 'Content', `${action}: ${contentType}`, contentId);
  },

  // Track social media clicks
  socialClick: (platform) => {
    analytics.event('social_click', 'Social Media', platform);
  },

  // Track search queries
  search: (query, resultsCount = 0) => {
    analytics.event('search', 'Site Search', query, resultsCount);
  },

  // Track form submissions
  formSubmit: (formName) => {
    analytics.event('form_submit', 'Forms', formName);
  },

  // Track file downloads
  download: (filename, category = 'Downloads') => {
    analytics.event('download', category, filename);
  },

  // Track video plays
  videoPlay: (videoTitle, videoId) => {
    analytics.event('video_play', 'Video', `${videoTitle} (${videoId})`);
  },

  // Track podcast plays
  podcastPlay: (podcastTitle, podcastId) => {
    analytics.event('podcast_play', 'Podcast', `${podcastTitle} (${podcastId})`);
  },

  // Track external link clicks
  externalLink: (url) => {
    analytics.event('external_link', 'Outbound', url);
  },
};

// Performance monitoring
export const performanceAnalytics = {
  // Track Core Web Vitals
  trackWebVitals: () => {
    if (typeof window !== 'undefined' && 'web-vital' in window) {
      // This would integrate with web-vitals library
      // For now, we'll use basic performance timing
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const loadTime = entry.loadEventEnd - entry.fetchStart;
            analytics.event('page_load_time', 'Performance', 'Page Load', Math.round(loadTime));
          }
        }
      });
      observer.observe({ entryTypes: ['navigation'] });
    }
  },

  // Track scroll depth
  trackScrollDepth: () => {
    if (typeof window !== 'undefined') {
      let maxScroll = 0;
      const thresholds = [25, 50, 75, 90, 100];

      const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY;
        const scrollPercentage = Math.round((scrollPosition / scrollHeight) * 100);

        if (scrollPercentage > maxScroll) {
          maxScroll = scrollPercentage;

          thresholds.forEach((threshold) => {
            if (scrollPercentage >= threshold) {
              analytics.event('scroll_depth', 'Engagement', `${threshold}%`, threshold);
            }
          });
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  },

  // Track time on page
  trackTimeOnPage: () => {
    if (typeof window !== 'undefined') {
      const startTime = Date.now();

      const handlePageUnload = () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        analytics.event('time_on_page', 'Engagement', 'Time Spent', timeSpent);
      };

      window.addEventListener('beforeunload', handlePageUnload);
      return () => window.removeEventListener('beforeunload', handlePageUnload);
    }
  },
};

// User behavior tracking
export const behaviorAnalytics = {
  // Track mouse movements for heatmaps
  trackMouseMovements: () => {
    if (typeof window !== 'undefined') {
      let moveCount = 0;
      const handleMouseMove = () => {
        moveCount++;
        if (moveCount % 100 === 0) {
          analytics.event('mouse_movement', 'User Behavior', 'Movement Count', moveCount);
        }
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  },

  // Track click patterns
  trackClicks: () => {
    if (typeof window !== 'undefined') {
      const handleClick = (event) => {
        const target = event.target;
        const tagName = target.tagName.toLowerCase();
        const className = target.className;
        const id = target.id;

        analytics.event('click', 'User Behavior', `${tagName} (${className || id || 'unnamed'})`);
      };

      document.addEventListener('click', handleClick, { passive: true });
      return () => document.removeEventListener('click', handleClick);
    }
  },

  // Track form interactions
  trackFormInteractions: () => {
    if (typeof window !== 'undefined') {
      const handleFormFocus = (event) => {
        const formName = event.target.form?.name || event.target.form?.id || 'unnamed_form';
        const fieldName = event.target.name || event.target.id || 'unnamed_field';
        analytics.event('form_focus', 'Forms', `${formName}: ${fieldName}`);
      };

      document.addEventListener('focus', handleFormFocus, true);
      return () => document.removeEventListener('focus', handleFormFocus, true);
    }
  },
};

// Analytics Hook
export const useAnalytics = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize analytics
    const trackingId = 'GA_MEASUREMENT_ID'; // Replace with actual GA4 measurement ID

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    script.onload = () => {
      analytics.init(trackingId);
      setIsInitialized(true);

      // Start performance tracking
      performanceAnalytics.trackWebVitals();

      // Start behavior tracking
      const cleanupScroll = performanceAnalytics.trackScrollDepth();
      const cleanupTime = performanceAnalytics.trackTimeOnPage();
      const cleanupMouse = behaviorAnalytics.trackMouseMovements();
      const cleanupClicks = behaviorAnalytics.trackClicks();
      const cleanupForms = behaviorAnalytics.trackFormInteractions();

      return () => {
        cleanupScroll?.();
        cleanupTime?.();
        cleanupMouse?.();
        cleanupClicks?.();
        cleanupForms?.();
      };
    };

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return { isInitialized, analytics };
};

// Analytics Provider Component
export const AnalyticsProvider = ({ children }) => {
  const { isInitialized } = useAnalytics();

  useEffect(() => {
    if (isInitialized) {
      // Track initial page view
      analytics.pageview(window.location.pathname);
    }
  }, [isInitialized]);

  return children;
};

// Custom hooks for specific analytics
export const usePageAnalytics = (pageName) => {
  useEffect(() => {
    if (pageName) {
      analytics.event('page_view', 'Page Navigation', pageName);
    }
  }, [pageName]);
};

export const useContentAnalytics = (contentType, contentId) => {
  const trackView = () => {
    analytics.contentInteraction(contentType, contentId, 'view');
  };

  const trackShare = (platform) => {
    analytics.event('content_share', 'Content', `${contentType}: ${platform}`, contentId);
  };

  const trackBookmark = () => {
    analytics.event('content_bookmark', 'Content', `${contentType}: bookmark`, contentId);
  };

  return { trackView, trackShare, trackBookmark };
};

export const useFormAnalytics = (formName) => {
  const trackStart = () => {
    analytics.event('form_start', 'Forms', formName);
  };

  const trackSubmit = (success = true) => {
    analytics.event('form_submit', 'Forms', `${formName}: ${success ? 'success' : 'error'}`);
  };

  const trackFieldError = (fieldName) => {
    analytics.event('form_error', 'Forms', `${formName}: ${fieldName}`);
  };

  return { trackStart, trackSubmit, trackFieldError };
};

export default analytics;
