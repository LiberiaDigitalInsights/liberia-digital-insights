import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { H1, Muted } from './components/ui/Typography';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const ComponentsPage = lazy(() => import('./pages/Components'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Insights = lazy(() => import('./pages/Insights'));
const Podcasts = lazy(() => import('./pages/Podcasts'));
const PodcastDetail = lazy(() => import('./pages/PodcastDetail'));
const Articles = lazy(() => import('./pages/Articles'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Events = lazy(() => import('./pages/Events'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Advertisement = lazy(() => import('./pages/Advertisement'));
const Signup = lazy(() => import('./pages/Signup'));
const Talent = lazy(() => import('./pages/Talent'));
const Category = lazy(() => import('./pages/Category'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <Muted>Loading...</Muted>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/podcast/:id" element={<PodcastDetail />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/advertisement" element={<Advertisement />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/talent" element={<Talent />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
