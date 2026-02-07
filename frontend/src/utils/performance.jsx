import React, { useState, useRef, useEffect } from 'react';

// Lazy loading image component
const LazyImage = ({ src, alt, className = '', placeholder = '/placeholder.jpg', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const node = imgRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px',
      },
    );

    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}

      {/* Actual image */}
      {isInView && (
        <img
          src={hasError ? placeholder : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          {...props}
        />
      )}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const performanceMonitor = {
  // Measure page load time
  measurePageLoad: () => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0];
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      console.log(`Page load time: ${loadTime}ms`);
      return loadTime;
    }
    return null;
  },

  // Measure component render time
  measureRender: (componentName, fn) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${componentName} render time: ${end - start}ms`);
    return result;
  },

  // Track memory usage
  getMemoryUsage: () => {
    if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
      const memory = window.performance.memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      };
    }
    return null;
  },

  // Log performance metrics
  logMetrics: () => {
    const loadTime = performanceMonitor.measurePageLoad();
    const memory = performanceMonitor.getMemoryUsage();

    console.log('Performance Metrics:', {
      loadTime: loadTime ? `${loadTime}ms` : 'N/A',
      memory: memory ? `${memory.used}/${memory.total}MB` : 'N/A',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
    });
  },
};

// eslint-disable-next-line react-refresh/only-export-components
export const optimizeImage = (src, options = {}) => {
  const { width, height, quality = 80, format = 'auto' } = options;

  // If it's already an optimized URL, return as-is
  if (src.includes('?') && src.includes('w=')) {
    return src;
  }

  // Basic image optimization (in production, you'd use a CDN like Cloudinary, Imgix, etc.)
  const params = new URLSearchParams();
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  params.append('q', quality);
  params.append('f', format);

  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}${params.toString()}`;
};

// eslint-disable-next-line react-refresh/only-export-components
export const preloadResource = (href, as, type = null) => {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const preloadCriticalImages = (imageUrls) => {
  imageUrls.forEach((src) => {
    preloadResource(src, 'image');
  });
};

// eslint-disable-next-line react-refresh/only-export-components
export const loadComponent = (importFn) => {
  return React.lazy(() => {
    return importFn().then((module) => ({
      default: module.default,
    }));
  });
};

// eslint-disable-next-line react-refresh/only-export-components
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// eslint-disable-next-line react-refresh/only-export-components
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export default LazyImage;
