import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const AdminAnalytics = () => {
  const pageViewsData = [
    { name: 'Mon', views: 4000 },
    { name: 'Tue', views: 3000 },
    { name: 'Wed', views: 5000 },
    { name: 'Thu', views: 4500 },
    { name: 'Fri', views: 6000 },
    { name: 'Sat', views: 3500 },
    { name: 'Sun', views: 3000 },
  ];

  const trafficSourcesData = [
    { name: 'Direct', value: 35, fill: '#3B82F6' },
    { name: 'Social', value: 25, fill: '#10B981' },
    { name: 'Search', value: 20, fill: '#F59E0B' },
    { name: 'Referral', value: 15, fill: '#8B5CF6' },
    { name: 'Other', value: 5, fill: '#6B7280' },
  ];

  const stats = [
    { title: 'Page Views', value: '45.2K', change: '+12%' },
    { title: 'Unique Visitors', value: '12.8K', change: '+8%' },
    { title: 'Avg. Session', value: '3:42', change: '-5%' },
    { title: 'Bounce Rate', value: '32.4%', change: '-3%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Analytics</h1>
        <p className="text-[var(--color-muted)]">
          Monitor your site performance and user engagement
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div>
                <p className="text-sm font-medium text-[var(--color-muted)]">{stat.title}</p>
                <p className="text-2xl font-bold text-[var(--color-text)]">{stat.value}</p>
                <p
                  className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change} from last month
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Views (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pageViewsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={trafficSourcesData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {trafficSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {trafficSourcesData.map((source, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: source.fill }}
                    ></div>
                    <span className="text-[var(--color-text)]">{source.name}</span>
                  </div>
                  <span className="text-[var(--color-muted)]">{source.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
