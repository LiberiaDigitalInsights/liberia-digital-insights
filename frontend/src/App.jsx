import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ComponentsPage from './pages/Components';
import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';
import Podcasts from './pages/Podcasts';
import Articles from './pages/Articles';
import Advertisement from './pages/Advertisement';
import Signup from './pages/Signup';
import Category from './pages/Category';
import ArticleDetail from './pages/ArticleDetail';
import PodcastDetail from './pages/PodcastDetail';
import Events from './pages/Events';

function App() {
  return (
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
      <Route path="/advertisement" element={<Advertisement />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/category/:slug" element={<Category />} />
    </Routes>
  );
}

export default App;
