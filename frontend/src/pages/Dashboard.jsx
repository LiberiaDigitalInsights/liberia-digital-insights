import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl p-6">
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
            <div className="text-3xl font-bold">128</div>
            <div className="text-xs text-[var(--color-muted)]">+12% vs last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4,203</div>
            <div className="text-xs text-[var(--color-muted)]">+3% vs last week</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">7</div>
              <Badge variant="warning">Needs attention</Badge>
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
            <CardTitle>Traffic (Placeholder)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)]" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

