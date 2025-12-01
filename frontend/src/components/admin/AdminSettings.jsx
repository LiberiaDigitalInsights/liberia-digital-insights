import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea } from '../ui';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Settings</h1>
        <p className="text-[var(--color-muted)]">Manage your site configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Site Name
              </label>
              <Input defaultValue="Liberia Digital Insights" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Site Description
              </label>
              <Textarea defaultValue="Your gateway to Liberia's digital transformation" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Contact Email
              </label>
              <Input defaultValue="contact@liberiadigitalinsights.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Admin Email
              </label>
              <Input defaultValue="admin@liberiadigitalinsights.com" />
            </div>
          </CardContent>
        </Card>

        {/* Performance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Enable Caching</p>
                <p className="text-xs text-[var(--color-muted)]">Improve page load times</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-500">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Image Optimization</p>
                <p className="text-xs text-[var(--color-muted)]">Auto-optimize uploaded images</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-500">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Analytics Tracking</p>
                <p className="text-xs text-[var(--color-muted)]">Enable user analytics</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Lazy Loading</p>
                <p className="text-xs text-[var(--color-muted)]">Load images as needed</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-500">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Meta Description
              </label>
              <Textarea
                defaultValue="Your premier destination for technology news, insights, and innovation stories from Liberia and beyond."
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Keywords
              </label>
              <Input defaultValue="technology, liberia, digital transformation, innovation" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Google Analytics ID
              </label>
              <Input placeholder="G-XXXXXXXXXX" />
            </div>
          </CardContent>
        </Card>

        {/* Social Media Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Facebook
              </label>
              <Input defaultValue="https://facebook.com/LiberiaDigitalInsights" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Twitter/X
              </label>
              <Input defaultValue="https://x.com/LiberiaDigitalInsights" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                LinkedIn
              </label>
              <Input defaultValue="https://linkedin.com/company/LiberiaDigitalInsights" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                YouTube
              </label>
              <Input defaultValue="https://youtube.com/@LiberiaDigitalInsights" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>Save Settings</Button>
      </div>
    </div>
  );
};

export default AdminSettings;
