import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import SidebarLayout from '../components/layouts/SidebarLayout';
import TrafficChart from '../components/charts/TrafficChart';

import { backendApi } from '../services/backendApi';

export default function Dashboard() {
  const [traffic, setTraffic] = React.useState(null);
  const [stats, setStats] = React.useState({
    articles: 0,
    subscribers: 0,
    pendingReviews: 0,
  });
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [trafficData, statsData] = await Promise.all([
          backendApi.analytics.getTraffic(30),
          backendApi.analytics.getStats(),
        ]);
        setTraffic(trafficData.data);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SidebarLayout
      sidebarTitle="LDI Admin"
      items={[
        {
          title: 'Content',
          links: [
            { to: '/dashboard', label: 'Overview' },
            { to: '/components', label: 'Components' },
          ],
        },
        {
          title: 'Users',
          links: [
            { to: '/about', label: 'About' },
            { to: '/contact', label: 'Contact' },
          ],
        },
      ]}
    >
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-2">
          <Button>New Article</Button>
          <Button variant="outline">Invite</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-9 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            ) : (
              <div className="text-3xl font-bold">{stats.articles}</div>
            )}
            <div className="text-xs text-(--color-muted)">Total published articles</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-9 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            ) : (
              <div className="text-3xl font-bold">{stats.subscribers.toLocaleString()}</div>
            )}
            <div className="text-xs text-[var(--color-muted)]">Active newsletter subscribers</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {loading ? (
                <div className="h-9 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              ) : (
                <div className="text-3xl font-bold">{stats.pendingReviews}</div>
              )}
              {stats.pendingReviews > 0 && <Badge variant="warning">Needs attention</Badge>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <Table
              columns={[
                { key: 'title', header: 'Title' },
                { key: 'author', header: 'Author' },
                { key: 'status', header: 'Status' },
              ]}
              data={[
                { title: 'Tech in Liberia 2025', author: 'S. Johnson', status: 'Published' },
                { title: 'Startup Spotlight', author: 'J. Doe', status: 'Draft' },
                { title: 'Policy Update', author: 'A. Mensah', status: 'Review' },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="text-sm text-red-500">{error}</div>}
            {!traffic && !error && (
              <div className="h-48 animate-pulse rounded-(--radius-md) bg-[color-mix(in_oklab,var(--color-surface),white_6%)]" />
            )}
            {traffic && <TrafficChart data={traffic} height={192} />}
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
