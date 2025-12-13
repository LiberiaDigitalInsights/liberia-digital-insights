import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, P } from '../ui';
import {
  FaEye,
  FaUsers,
  FaNewspaper,
  FaMicrophone,
  FaCalendar,
  FaBullhorn,
  FaLightbulb,
  FaGraduationCap,
  FaEnvelope,
  FaChartBar,
  FaCog,
} from 'react-icons/fa';

const AdminDashboard = ({ stats, setActiveTab }) => {
  const statCards = [
    {
      title: 'Total Articles',
      value: stats.articles || 0,
      icon: FaNewspaper,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Podcasts',
      value: stats.podcasts || 0,
      icon: FaMicrophone,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Events',
      value: stats.events || 0,
      icon: FaCalendar,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'positive',
    },
    {
      title: 'Total Users',
      value: '1,247',
      icon: FaUsers,
      color: 'bg-orange-500',
      change: '+23%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>
        <p className="text-[var(--color-muted)]">
          Welcome back! Here's what's happening with your site.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-muted)]">{stat.title}</p>
                    <p className="text-2xl font-bold text-[var(--color-text)]">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span
                        className={`text-sm font-medium ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-[var(--color-muted)]">from last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-[var(--color-text)]">New article published</span>
              <span className="text-xs text-[var(--color-muted)]">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-[var(--color-text)]">New user registration</span>
              <span className="text-xs text-[var(--color-muted)]">4 hours ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-[var(--color-text)]">Podcast uploaded</span>
              <span className="text-xs text-[var(--color-muted)]">6 hours ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-[var(--color-text)]">Event created</span>
              <span className="text-xs text-[var(--color-muted)]">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setActiveTab('articles')}
              className="p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface)] transition-colors cursor-pointer text-center"
            >
              <FaNewspaper className="w-6 h-6 text-brand-500 mb-2 mx-auto" />
              <p className="text-sm font-medium text-[var(--color-text)]">Articles</p>
            </button>
            <button
              onClick={() => setActiveTab('podcasts')}
              className="p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface)] transition-colors cursor-pointer text-center"
            >
              <FaMicrophone className="w-6 h-6 text-brand-500 mb-2 mx-auto" />
              <p className="text-sm font-medium text-[var(--color-text)]">Podcasts</p>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className="p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface)] transition-colors cursor-pointer text-center"
            >
              <FaCalendar className="w-6 h-6 text-brand-500 mb-2 mx-auto" />
              <p className="text-sm font-medium text-[var(--color-text)]">Events</p>
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className="p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface)] transition-colors cursor-pointer text-center"
            >
              <FaLightbulb className="w-6 h-6 text-brand-500 mb-2 mx-auto" />
              <p className="text-sm font-medium text-[var(--color-text)]">Insights</p>
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className="p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface)] transition-colors cursor-pointer text-center"
            >
              <FaGraduationCap className="w-6 h-6 text-brand-500 mb-2 mx-auto" />
              <p className="text-sm font-medium text-[var(--color-text)]">Training</p>
            </button>
            <button
              onClick={() => setActiveTab('newsletter')}
              className="p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface)] transition-colors cursor-pointer text-center"
            >
              <FaEnvelope className="w-6 h-6 text-brand-500 mb-2 mx-auto" />
              <p className="text-sm font-medium text-[var(--color-text)]">Newsletter</p>
            </button>
            <button
              onClick={() => setActiveTab('advertisements')}
              className="p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface)] transition-colors cursor-pointer text-center"
            >
              <FaBullhorn className="w-6 h-6 text-brand-500 mb-2 mx-auto" />
              <p className="text-sm font-medium text-[var(--color-text)]">Ads</p>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className="p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface)] transition-colors cursor-pointer text-center"
            >
              <FaChartBar className="w-6 h-6 text-brand-500 mb-2 mx-auto" />
              <p className="text-sm font-medium text-[var(--color-text)]">Analytics</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
