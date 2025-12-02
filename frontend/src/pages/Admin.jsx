import React, { useState } from 'react';
import SEO from '../components/SEO';
import { H1 } from '../components/ui/Typography';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTabs from '../components/admin/AdminTabs';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminArticles from '../components/admin/AdminArticles';
import AdminPodcasts from '../components/admin/AdminPodcasts';
import AdminEvents from '../components/admin/AdminEvents';
import AdminTalent from '../components/admin/AdminTalent';
import AdminTraining from '../components/admin/AdminTraining';
import AdminAnalytics from '../components/admin/AdminAnalytics';
import AdminSettings from '../components/admin/AdminSettings';
import AdminInsights from '../components/admin/AdminInsights';
import AdminAdvertisements from '../components/admin/AdminAdvertisements';
import AdminNewsletter from '../components/admin/AdminNewsletter';
import AdminGallery from '../components/admin/AdminGallery';
import { generateArticleGrid } from '../data/mockArticles';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [role, setRole] = useState('viewer');

  // Initialize role from localStorage
  React.useEffect(() => {
    setRole(localStorage.getItem('auth_role') || 'viewer');
  }, []);

  const canEdit = role === 'admin' || role === 'editor';

  // Initialize mock data
  const [articles] = useState(() =>
    generateArticleGrid(18).map((a, i) => ({
      ...a,
      status: i % 3 === 0 ? 'draft' : 'published',
      scheduledAt: '',
    })),
  );

  const [podcasts] = useState(() =>
    generateArticleGrid(8).map((a, i) => ({
      id: a.id + 1000,
      title: `Podcast #${i + 1}: ${a.title}`,
      category: 'Podcast',
      status: i % 2 ? 'draft' : 'published',
      scheduledAt: '',
      image: a.image,
      date: a.date,
      duration: `${20 + (i % 4) * 10} min`,
    })),
  );

  const [insights] = useState(() =>
    generateArticleGrid(10).map((a, i) => ({
      id: a.id + 2000,
      title: `Insight: ${a.title}`,
      category: ['Technology', 'Innovation', 'Digital Transformation', 'Business', 'Strategy'][
        i % 5
      ],
      status: i % 4 === 0 ? 'draft' : i % 4 === 1 ? 'pending' : 'published',
      scheduledAt: '',
      image: a.image,
      date: a.date,
      excerpt: a.excerpt,
      author: ['Dr. Sarah Johnson', 'Michael Chen', 'Emma Williams', 'James Brown', 'Lisa Davis'][
        i % 5
      ],
    })),
  );

  const [advertisements] = useState(() => [
    {
      id: 1,
      name: 'Tech Summit 2024 Banner',
      client: 'Tech Corp International',
      type: 'banner',
      status: 'active',
      impressions: 15420,
      clicks: 892,
    },
    {
      id: 2,
      name: 'Digital Innovation Sidebar',
      client: 'Innovation Labs',
      type: 'sidebar',
      status: 'active',
      impressions: 8934,
      clicks: 445,
    },
    {
      id: 3,
      name: 'Startup Week Popup',
      client: 'Startup Hub',
      type: 'popup',
      status: 'paused',
      impressions: 5678,
      clicks: 234,
    },
    {
      id: 4,
      name: 'Business Conference Native',
      client: 'Business Network',
      type: 'native',
      status: 'expired',
      impressions: 3456,
      clicks: 123,
    },
  ]);

  const [newsletters] = useState(() => [
    {
      id: 1,
      subject: 'Weekly Tech Digest: AI Innovations',
      preview: 'Latest developments in artificial intelligence and machine learning...',
      status: 'sent',
      sentDate: '2024-03-15',
      opens: 8547,
      clicks: 1092,
    },
    {
      id: 2,
      subject: 'Digital Transformation Trends',
      preview: 'How businesses are adapting to the digital age...',
      status: 'scheduled',
      sentDate: '2024-03-20',
      opens: 0,
      clicks: 0,
    },
    {
      id: 3,
      subject: 'Startup Ecosystem Update',
      preview: 'Latest news from the Liberian startup scene...',
      status: 'draft',
      sentDate: null,
      opens: 0,
      clicks: 0,
    },
    {
      id: 4,
      subject: 'Tech Event Recap',
      preview: 'Highlights from our recent technology summit...',
      status: 'sent',
      sentDate: '2024-03-10',
      opens: 6234,
      clicks: 892,
    },
  ]);

  // Stats for dashboard
  const stats = {
    articles: articles.length,
    insights: insights.length,
    podcasts: podcasts.length,
    events: 5,
    users: 1247,
    advertisements: advertisements.length,
    newsletters: newsletters.length,
  };

  // Tab configuration
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'articles', label: 'Articles' },
    { id: 'insights', label: 'Insights' },
    { id: 'podcasts', label: 'Podcasts' },
    { id: 'events', label: 'Events' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'talents', label: 'Talent Hub' },
    { id: 'training', label: 'Training' },
    { id: 'advertisements', label: 'Advertisements' },
    { id: 'newsletter', label: 'Newsletter' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
  ];

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard stats={stats} setActiveTab={setActiveTab} />;
      case 'articles':
        return <AdminArticles articles={articles} canEdit={canEdit} />;
      case 'insights':
        return <AdminInsights insights={insights} canEdit={canEdit} />;
      case 'podcasts':
        return <AdminPodcasts podcasts={podcasts} canEdit={canEdit} />;
      case 'events':
        return <AdminEvents canEdit={canEdit} />;
      case 'gallery':
        return <AdminGallery canEdit={canEdit} />;
      case 'talents':
        return <AdminTalent />;
      case 'training':
        return <AdminTraining canEdit={canEdit} />;
      case 'advertisements':
        return <AdminAdvertisements advertisements={advertisements} canEdit={canEdit} />;
      case 'newsletter':
        return <AdminNewsletter newsletters={newsletters} canEdit={canEdit} />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard stats={stats} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      <SEO title="Admin Panel" description="Manage your Liberia Digital Insights website" />

      <div className="min-h-screen bg-[var(--color-background)]">
        <div className="flex h-screen">
          {/* Sidebar */}
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header with Tabs */}
            <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <H1>Admin Panel</H1>
                    <p className="text-[var(--color-muted)]">
                      Manage your Liberia Digital Insights website
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        role === 'admin'
                          ? 'bg-red-100 text-red-700'
                          : role === 'editor'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto p-6">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </>
  );
}
