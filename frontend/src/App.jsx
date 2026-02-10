import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { backendApi } from './services/backendApi';
import AuthGate from './components/auth/AuthGate';
import Skeleton from './components/ui/Skeleton';
import ScrollToTop from './components/ScrollToTop';
import { H1, Muted } from './components/ui/Typography';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiePage from './pages/CookiePage';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const ComponentsPage = lazy(() => import('./pages/Components'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Insights = lazy(() => import('./pages/Insights'));
const InsightDetail = lazy(() => import('./pages/InsightDetail'));
const Podcasts = lazy(() => import('./pages/Podcasts'));
const PodcastDetail = lazy(() => import('./pages/PodcastDetail'));
const Articles = lazy(() => import('./pages/Articles'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Events = lazy(() => import('./pages/Events'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Advertisement = lazy(() => import('./pages/Advertisement'));
const Subscribe = lazy(() => import('./pages/Subscribe'));
const Talent = lazy(() => import('./pages/Talent'));
const Category = lazy(() => import('./pages/Category'));
const Categories = lazy(() => import('./pages/Categories'));
const Tag = lazy(() => import('./pages/Tag'));
const TrainingCourses = lazy(() => import('./pages/TrainingCourses'));
const TrainingDetail = lazy(() => import('./pages/TrainingDetail'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Register = lazy(() => import('./pages/Register'));
const Unsubscribe = lazy(() => import('./pages/Unsubscribe'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from './components/ui/PageTransition';

// Loading fallback component
function LoadingFallback() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_350px]">
          <main className="space-y-8">
            <section>
              <Skeleton className="mb-4 h-6 w-40" />
              <Skeleton className="h-56 w-full" />
            </section>
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </section>
          </main>
          <aside className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}

function App() {
  const location = useLocation();

  useEffect(() => {
    // Determine if this is a "new" visit (basic check via session storage)
    const isNewSession = !sessionStorage.getItem('visited_session');
    if (isNewSession) {
      sessionStorage.setItem('visited_session', 'true');
    }

    // Track the visit
    backendApi.analytics.trackVisit(isNewSession).catch((err) => {
      console.error('Analytics tracking failed:', err);
    });
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/about"
              element={
                <PageTransition>
                  <About />
                </PageTransition>
              }
            />
            <Route
              path="/contact"
              element={
                <PageTransition>
                  <Contact />
                </PageTransition>
              }
            />
            <Route
              path="/components"
              element={
                <PageTransition>
                  <ComponentsPage />
                </PageTransition>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              }
            />
            <Route
              path="/insights"
              element={
                <PageTransition>
                  <Insights />
                </PageTransition>
              }
            />
            <Route
              path="/insight/:slug"
              element={
                <PageTransition>
                  <InsightDetail />
                </PageTransition>
              }
            />
            <Route
              path="/podcasts"
              element={
                <PageTransition>
                  <Podcasts />
                </PageTransition>
              }
            />
            <Route
              path="/podcast/:slug"
              element={
                <PageTransition>
                  <PodcastDetail />
                </PageTransition>
              }
            />
            <Route
              path="/articles"
              element={
                <PageTransition>
                  <Articles />
                </PageTransition>
              }
            />
            <Route
              path="/article/:slug"
              element={
                <PageTransition>
                  <ArticleDetail />
                </PageTransition>
              }
            />
            <Route
              path="/events"
              element={
                <PageTransition>
                  <Events />
                </PageTransition>
              }
            />
            <Route
              path="/event/:slug"
              element={
                <PageTransition>
                  <EventDetail />
                </PageTransition>
              }
            />
            <Route
              path="/gallery"
              element={
                <PageTransition>
                  <Gallery />
                </PageTransition>
              }
            />
            <Route
              path="/advertisement"
              element={
                <PageTransition>
                  <Advertisement />
                </PageTransition>
              }
            />
            <Route
              path="/subscribe"
              element={
                <PageTransition>
                  <Subscribe />
                </PageTransition>
              }
            />
            <Route
              path="/training-courses"
              element={
                <PageTransition>
                  <TrainingCourses />
                </PageTransition>
              }
            />
            <Route
              path="/training/:id"
              element={
                <PageTransition>
                  <TrainingDetail />
                </PageTransition>
              }
            />
            <Route
              path="/course/:id"
              element={
                <PageTransition>
                  <CourseDetail />
                </PageTransition>
              }
            />
            <Route
              path="/register"
              element={
                <PageTransition>
                  <Register />
                </PageTransition>
              }
            />
            <Route
              path="/unsubscribe"
              element={
                <PageTransition>
                  <Unsubscribe />
                </PageTransition>
              }
            />
            <Route
              path="/talent"
              element={
                <PageTransition>
                  <Talent />
                </PageTransition>
              }
            />
            <Route
              path="/category/:slug"
              element={
                <PageTransition>
                  <Category />
                </PageTransition>
              }
            />
            <Route
              path="/categories"
              element={
                <PageTransition>
                  <Categories />
                </PageTransition>
              }
            />
            <Route
              path="/tag/:slug"
              element={
                <PageTransition>
                  <Tag />
                </PageTransition>
              }
            />
            <Route
              path="/hashtag/:slug"
              element={
                <PageTransition>
                  <Tag />
                </PageTransition>
              }
            />
            <Route
              path="/admin"
              element={
                <AuthGate>
                  <PageTransition>
                    <Admin />
                  </PageTransition>
                </AuthGate>
              }
            />
            <Route
              path="/privacy"
              element={
                <PageTransition>
                  <PrivacyPage />
                </PageTransition>
              }
            />
            <Route
              path="/terms"
              element={
                <PageTransition>
                  <TermsPage />
                </PageTransition>
              }
            />
            <Route
              path="/cookies"
              element={
                <PageTransition>
                  <CookiePage />
                </PageTransition>
              }
            />
            <Route
              path="*"
              element={
                <PageTransition>
                  <NotFound />
                </PageTransition>
              }
            />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  );
}

export default App;
