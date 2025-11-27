import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import ToastViewport from './components/ui/Toast.jsx';
import { AnalyticsProvider } from './utils/analytics.js';
import { performanceMonitor } from './utils/performance.jsx';

// Initialize performance monitoring
performanceMonitor.logMetrics();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <ToastProvider>
            <AnalyticsProvider>
              <BrowserRouter>
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:m-4 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black"
                >
                  Skip to content
                </a>
                <Navbar />
                <main id="main-content" className="outline-none focus:outline-none">
                  <App />
                </main>
                <Footer />
                <ToastViewport />
              </BrowserRouter>
            </AnalyticsProvider>
          </ToastProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
