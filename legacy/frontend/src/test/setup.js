// Vitest global setup for JSDOM
import '@testing-library/jest-dom/vitest';

// matchMedia polyfill
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {}, // deprecated but some libs call it
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

// IntersectionObserver polyfill (no-op)
if (typeof globalThis !== 'undefined' && typeof globalThis.IntersectionObserver === 'undefined') {
  class MockIntersectionObserver {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  globalThis.IntersectionObserver = MockIntersectionObserver;
}

// visibilityState default
try {
  if (typeof document !== 'undefined' && !('visibilityState' in document)) {
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
  }
} catch {
  /* empty */
}

// window.prompt safe stub to avoid TipTap link prompt issues in tests
if (typeof window !== 'undefined' && typeof window.prompt !== 'function') {
  window.prompt = () => null;
}
