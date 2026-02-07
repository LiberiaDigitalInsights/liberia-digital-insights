import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea, Badge } from '../ui';
import {
  FaSave,
  FaUndo,
  FaCog,
  FaGlobe,
  FaChartBar,
  FaSearch,
  FaImages,
  FaRocket,
} from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { backendApi } from '../../services/backendApi';

const AdminSettings = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Liberia Digital Insights',
    siteDescription: "Your gateway to Liberia's digital transformation",
    contactEmail: 'contact@liberiadigitalinsights.com',
    adminEmail: 'admin@liberiadigitalinsights.com',

    // Performance Settings
    enableCaching: true,
    imageOptimization: true,
    analyticsTracking: false,
    lazyLoading: true,

    // SEO Settings
    metaDescription:
      'Your premier destination for technology news, insights, and innovation stories from Liberia and beyond.',
    keywords: 'technology, liberia, digital transformation, innovation',
    googleAnalyticsId: '',

    // Social Media Settings
    facebook: 'https://facebook.com/LiberiaDigitalInsights',
    twitter: 'https://x.com/LiberiaDigitalInsights',
    linkedin: 'https://linkedin.com/company/LiberiaDigitalInsights',
    youtube: 'https://youtube.com/@LiberiaDigitalInsights',

    // Email Settings
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    smtpSecure: true,

    // Theme Settings
    primaryColor: '#3b82f6',
    accentColor: '#10b981',
    darkMode: false,

    // Security Settings
    enable2FA: false,
    sessionTimeout: '24',
    maxLoginAttempts: '5',
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Handle toggle switches
  const handleToggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
    setHasChanges(true);
  };

  // Save settings
  const handleSave = async () => {
    setLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('adminSettings', JSON.stringify(settings));

      // Here you would also save to backend API
      // await backendApi.settings.update(settings);

      showToast({
        title: 'Settings Saved',
        description: 'Your settings have been saved successfully.',
        variant: 'success',
      });

      setHasChanges(false);
    } catch {
      showToast({
        title: 'Error',
        description: 'Failed to save settings.',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      const defaultSettings = {
        siteName: 'Liberia Digital Insights',
        siteDescription: "Your gateway to Liberia's digital transformation",
        contactEmail: 'contact@liberiadigitalinsights.com',
        adminEmail: 'admin@liberiadigitalinsights.com',
        enableCaching: true,
        imageOptimization: true,
        analyticsTracking: false,
        lazyLoading: true,
        metaDescription:
          'Your premier destination for technology news, insights, and innovation stories from Liberia and beyond.',
        keywords: 'technology, liberia, digital transformation, innovation',
        googleAnalyticsId: '',
        facebook: 'https://facebook.com/LiberiaDigitalInsights',
        twitter: 'https://x.com/LiberiaDigitalInsights',
        linkedin: 'https://linkedin.com/company/LiberiaDigitalInsights',
        youtube: 'https://youtube.com/@LiberiaDigitalInsights',
        smtpHost: '',
        smtpPort: '587',
        smtpUser: '',
        smtpPassword: '',
        smtpSecure: true,
        primaryColor: '#3b82f6',
        accentColor: '#10b981',
        darkMode: false,
        enable2FA: false,
        sessionTimeout: '24',
        maxLoginAttempts: '5',
      };

      setSettings(defaultSettings);
      setHasChanges(true);

      showToast({
        title: 'Settings Reset',
        description: 'Settings have been reset to defaults. Save to apply.',
        variant: 'info',
      });
    }
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-[var(--color-text)]">{label}</p>
        <p className="text-xs text-[var(--color-muted)]">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-brand-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const PasswordChangeSection = () => {
    const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
    const [passLoading, setPassLoading] = useState(false);

    const handlePasswordChange = async (e) => {
      e.preventDefault();
      if (passData.new !== passData.confirm) {
        showToast({ title: 'Error', description: 'New passwords do not match', variant: 'error' });
        return;
      }
      if (passData.new.length < 6) {
        showToast({
          title: 'Error',
          description: 'Password must be at least 6 characters',
          variant: 'error',
        });
        return;
      }

      setPassLoading(true);
      try {
        await backendApi.users.changePassword(passData.current, passData.new);
        showToast({
          title: 'Success',
          description: 'Password updated successfully',
          variant: 'success',
        });
        setPassData({ current: '', new: '', confirm: '' });
      } catch (err) {
        showToast({
          title: 'Error',
          description: err.message || 'Failed to update password',
          variant: 'error',
        });
      } finally {
        setPassLoading(false);
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaRocket /> Account Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <p className="text-sm text-[var(--color-muted)] mb-4">
              Update your password to secure your account.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <Input
                type="password"
                value={passData.current}
                onChange={(e) => setPassData({ ...passData, current: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <Input
                type="password"
                value={passData.new}
                onChange={(e) => setPassData({ ...passData, new: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <Input
                type="password"
                value={passData.confirm}
                onChange={(e) => setPassData({ ...passData, confirm: e.target.value })}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={passLoading}
              className="w-full bg-brand-500 hover:bg-brand-600"
            >
              {passLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Settings</h1>
          <p className="text-[var(--color-muted)]">Manage your account and site configuration</p>
        </div>
        {isAdmin && (
          <div className="flex gap-3">
            {hasChanges && <Badge className="bg-yellow-100 text-yellow-700">Unsaved Changes</Badge>}
            <Button variant="subtle" onClick={handleReset} className="flex items-center gap-2">
              <FaUndo />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || !hasChanges}
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600"
            >
              <FaSave />
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Always show Password Change */}
        <PasswordChangeSection />

        {/* Site Settings - Admin Only */}
        {isAdmin && (
          <>
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaCog />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Site Name
                  </label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    placeholder="Enter site name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Site Description
                  </label>
                  <Textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                    placeholder="Enter site description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Contact Email
                  </label>
                  <Input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="contact@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Admin Email
                  </label>
                  <Input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                    placeholder="admin@example.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Performance Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaRocket />
                  Performance Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ToggleSwitch
                  checked={settings.enableCaching}
                  onChange={() => handleToggle('enableCaching')}
                  label="Enable Caching"
                  description="Improve page load times"
                />
                <ToggleSwitch
                  checked={settings.imageOptimization}
                  onChange={() => handleToggle('imageOptimization')}
                  label="Image Optimization"
                  description="Auto-optimize uploaded images"
                />
                <ToggleSwitch
                  checked={settings.analyticsTracking}
                  onChange={() => handleToggle('analyticsTracking')}
                  label="Analytics Tracking"
                  description="Enable user analytics"
                />
                <ToggleSwitch
                  checked={settings.lazyLoading}
                  onChange={() => handleToggle('lazyLoading')}
                  label="Lazy Loading"
                  description="Load images as needed"
                />
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaSearch />
                  SEO Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Meta Description
                  </label>
                  <Textarea
                    value={settings.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    placeholder="Enter meta description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Keywords
                  </label>
                  <Input
                    value={settings.keywords}
                    onChange={(e) => handleInputChange('keywords', e.target.value)}
                    placeholder="technology, liberia, innovation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Google Analytics ID
                  </label>
                  <Input
                    value={settings.googleAnalyticsId}
                    onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Media Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaGlobe />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Facebook
                  </label>
                  <Input
                    value={settings.facebook}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/page"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Twitter/X
                  </label>
                  <Input
                    value={settings.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    placeholder="https://x.com/handle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    LinkedIn
                  </label>
                  <Input
                    value={settings.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/page"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    YouTube
                  </label>
                  <Input
                    value={settings.youtube}
                    onChange={(e) => handleInputChange('youtube', e.target.value)}
                    placeholder="https://youtube.com/channel"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Email Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    SMTP Host
                  </label>
                  <Input
                    value={settings.smtpHost}
                    onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                    placeholder="smtp.example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    SMTP Port
                  </label>
                  <Input
                    value={settings.smtpPort}
                    onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                    placeholder="587"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    SMTP User
                  </label>
                  <Input
                    value={settings.smtpUser}
                    onChange={(e) => handleInputChange('smtpUser', e.target.value)}
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    SMTP Password
                  </label>
                  <Input
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
                <ToggleSwitch
                  checked={settings.smtpSecure}
                  onChange={() => handleToggle('smtpSecure')}
                  label="Use TLS/SSL"
                  description="Enable secure connection"
                />
              </CardContent>
            </Card>

            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Primary Color
                  </label>
                  <Input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Accent Color
                  </label>
                  <Input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => handleInputChange('accentColor', e.target.value)}
                  />
                </div>
                <ToggleSwitch
                  checked={settings.darkMode}
                  onChange={() => handleToggle('darkMode')}
                  label="Dark Mode"
                  description="Enable dark theme"
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
