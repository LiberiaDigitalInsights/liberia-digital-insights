import { lazy, Suspense } from 'react';
import AuthGate from './components/auth/AuthGate';
import Skeleton from './components/ui/Skeleton';
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
const InsightDetail = lazy(() => import('./pages/InsightDetail'));
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
const Categories = lazy(() => import('./pages/Categories'));
const Tag = lazy(() => import('./pages/Tag'));
const TrainingCourses = lazy(() => import('./pages/TrainingCourses'));
const TrainingDetail = lazy(() => import('./pages/TrainingDetail'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Register = lazy(() => import('./pages/Register'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
function LoadingFallback() {
  return (
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
          <Route path="/insight/:id" element={<InsightDetail />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/podcast/:id" element={<PodcastDetail />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/advertisement" element={<Advertisement />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/training-courses" element={<TrainingCourses />} />
          <Route path="/training/:id" element={<TrainingDetail />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/talent" element={<Talent />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/tag/:slug" element={<Tag />} />
          <Route path="/hashtag/:slug" element={<Tag />} />
          <Route
            path="/admin"
            element={
              <AuthGate>
                <Admin />
              </AuthGate>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
