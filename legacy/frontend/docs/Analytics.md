# Analytics

## 📊 Overview

The Analytics system provides comprehensive data insights and reporting capabilities for Liberia Digital Insights. It tracks user behavior, content performance, engagement metrics, and business KPIs to help administrators make data-driven decisions.

## ✨ Key Features

- **Real-time Dashboard**: Live metrics and KPI tracking
- **Content Analytics**: Article, podcast, and event performance metrics
- **User Analytics**: User behavior, engagement, and retention analysis
- **Traffic Analytics**: Website traffic, sources, and user flow analysis
- **Conversion Tracking**: Goal completion and conversion funnel analysis
- **Custom Reports**: Configurable reports and data exports
- **Trend Analysis**: Historical data trends and predictions
- **Segmentation**: Advanced user and content segmentation

## 🏗️ Architecture

### Frontend Components

```md
src/components/analytics/
├── Dashboard.jsx # Main analytics dashboard
├── MetricCard.jsx # Individual metric display
├── ChartContainer.jsx # Chart wrapper component
├── DateRangePicker.jsx # Date range selection
├── ReportBuilder.jsx # Custom report builder
├── ExportModal.jsx # Data export interface
├── SegmentationPanel.jsx # User/content segmentation
└── AnalyticsSettings.jsx # Analytics configuration
```

### Backend API

```
backend/src/routes/analytics.js     # Analytics endpoints
backend/src/services/analytics.js    # Analytics business logic
backend/src/models/metrics.js        # Metrics data model
backend/src/utils/aggregation.js     # Data aggregation utilities
```

## 📈 Analytics Dashboard

### Main Dashboard Component

```jsx
// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import MetricCard from './MetricCard';
import ChartContainer from './ChartContainer';
import DateRangePicker from './DateRangePicker';
import TrafficChart from '../charts/TrafficChart';
import EngagementChart from '../charts/EngagementChart';
import ContentPerformanceChart from '../charts/ContentPerformanceChart';

function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  });
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState('all');

  const { getDashboardMetrics, getTrafficData, getEngagementData } = useAnalytics();

  useEffect(() => {
    loadDashboardData();
  }, [dateRange, selectedSegment]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [metricsData, trafficData, engagementData] = await Promise.all([
        getDashboardMetrics(dateRange, selectedSegment),
        getTrafficData(dateRange, selectedSegment),
        getEngagementData(dateRange, selectedSegment),
      ]);

      setMetrics({
        overview: metricsData,
        traffic: trafficData,
        engagement: engagementData,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>

        <div className="flex items-center space-x-4">
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="all">All Users</option>
            <option value="new">New Users</option>
            <option value="returning">Returning Users</option>
            <option value="premium">Premium Users</option>
          </select>

          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {metrics && (
        <div className="space-y-6">
          {/* Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Page Views"
              value={metrics.overview.page_views.toLocaleString()}
              change={metrics.overview.page_views_change}
              changeType="percentage"
              icon="eye"
              trend={metrics.overview.page_views_trend}
            />

            <MetricCard
              title="Unique Visitors"
              value={metrics.overview.unique_visitors.toLocaleString()}
              change={metrics.overvisitors_change}
              changeType="percentage"
              icon="users"
              trend={metrics.overview.visitors_trend}
            />

            <MetricCard
              title="Avg. Session Duration"
              value={metrics.overview.avg_session_duration}
              change={metrics.overview.duration_change}
              changeType="percentage"
              icon="clock"
              trend={metrics.overview.duration_trend}
            />

            <MetricCard
              title="Bounce Rate"
              value={`${metrics.overview.bounce_rate}%`}
              change={metrics.overview.bounce_rate_change}
              changeType="percentage"
              icon="chart-line"
              trend={metrics.overview.bounce_rate_trend}
              inverse={true}
            />
          </div>

          {/* Traffic Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer title="Traffic Sources" subtitle="Where your visitors come from">
              <TrafficChart data={metrics.traffic.sources} />
            </ChartContainer>

            <ChartContainer title="Page Views Over Time" subtitle="Daily page view trends">
              <TrafficChart data={metrics.traffic.daily} type="line" />
            </ChartContainer>
          </div>

          {/* Content Performance */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Content Performance</h3>
            <ContentPerformanceChart data={metrics.engagement.content} />
          </div>

          {/* User Engagement */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartContainer title="Top Pages">
              <EngagementChart data={metrics.engagement.top_pages} type="table" />
            </ChartContainer>

            <ChartContainer title="Device Categories">
              <EngagementChart data={metrics.engagement.devices} type="pie" />
            </ChartContainer>

            <ChartContainer title="Geographic Distribution">
              <EngagementChart data={metrics.engagement.geography} type="map" />
            </ChartContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsDashboard;
```

### Metric Card Component

```jsx
// MetricCard.jsx
import React from 'react';
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from '@heroicons/react/24/outline';

function MetricCard({
  title,
  value,
  change,
  changeType = 'absolute',
  icon,
  trend,
  inverse = false,
}) {
  const getChangeColor = (changeValue) => {
    if (inverse) {
      return changeValue > 0
        ? 'text-red-600'
        : changeValue < 0
          ? 'text-green-600'
          : 'text-gray-500';
    }
    return changeValue > 0 ? 'text-green-600' : changeValue < 0 ? 'text-red-600' : 'text-gray-500';
  };

  const getChangeIcon = (changeValue) => {
    if (changeValue > 0) return TrendingUpIcon;
    if (changeValue < 0) return TrendingDownIcon;
    return MinusIcon;
  };

  const formatChange = (changeValue, type) => {
    if (type === 'percentage') {
      return `${Math.abs(changeValue)}%`;
    }
    return Math.abs(changeValue).toLocaleString();
  };

  const ChangeIcon = getChangeIcon(change);
  const changeColor = getChangeColor(change);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>

        <div className="p-3 bg-gray-50 rounded-full">
          {icon && (
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
          )}
        </div>
      </div>

      <div className="flex items-center mt-4">
        <ChangeIcon className={`h-4 w-4 ${changeColor} mr-1`} />
        <span className={`text-sm font-medium ${changeColor}`}>
          {formatChange(change, changeType)} from last period
        </span>
      </div>

      {trend && (
        <div className="mt-2">
          <div className="h-8">
            <svg viewBox="0 0 100 30" className="w-full h-full">
              <polyline
                fill="none"
                stroke={change > 0 ? '#10b981' : change < 0 ? '#ef4444' : '#6b7280'}
                strokeWidth="2"
                points={trend
                  .map((point, index) => `${index * (100 / (trend.length - 1))},${30 - point * 25}`)
                  .join(' ')}
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default MetricCard;
```

## 🔧 Analytics Hook

```javascript
// hooks/useAnalytics.js
import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDashboardMetrics = useCallback(async (dateRange, segment = 'all') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/analytics/dashboard', {
        params: {
          start_date: dateRange.start.toISOString(),
          end_date: dateRange.end.toISOString(),
          segment,
        },
      });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Failed to fetch dashboard metrics');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTrafficData = useCallback(async (dateRange, segment = 'all') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/analytics/traffic', {
        params: {
          start_date: dateRange.start.toISOString(),
          end_date: dateRange.end.toISOString(),
          segment,
        },
      });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Failed to fetch traffic data');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getEngagementData = useCallback(async (dateRange, segment = 'all') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/analytics/engagement', {
        params: {
          start_date: dateRange.start.toISOString(),
          end_date: dateRange.end.toISOString(),
          segment,
        },
      });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Failed to fetch engagement data');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getContentAnalytics = useCallback(async (contentType, dateRange) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/analytics/content/${contentType}`, {
        params: {
          start_date: dateRange.start.toISOString(),
          end_date: dateRange.end.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Failed to fetch content analytics');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserAnalytics = useCallback(async (dateRange, filters = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/analytics/users', {
        params: {
          start_date: dateRange.start.toISOString(),
          end_date: dateRange.end.toISOString(),
          ...filters,
        },
      });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Failed to fetch user analytics');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateReport = useCallback(async (reportConfig) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/analytics/reports', reportConfig);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Failed to generate report');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportData = useCallback(async (exportConfig) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/analytics/export', exportConfig, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', exportConfig.filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return response.data;
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Failed to export data');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getDashboardMetrics,
    getTrafficData,
    getEngagementData,
    getContentAnalytics,
    getUserAnalytics,
    generateReport,
    exportData,
  };
};
```

## 🗄️ Analytics Data Models

### Page View Event

```javascript
{
  id: "uuid",
  event_type: "page_view",
  timestamp: "2024-01-15T10:30:00Z",
  user_id: "uuid",
  session_id: "uuid",
  url: "/articles/getting-started-with-react",
  referrer: "https://google.com",
  user_agent: "Mozilla/5.0...",
  ip_address: "192.168.1.1",
  country: "Liberia",
  city: "Monrovia",
  device: {
    type: "desktop",
    os: "Windows",
    browser: "Chrome",
    version: "120.0"
  },
  properties: {
    page_title: "Getting Started with React",
    content_type: "article",
    content_id: "uuid"
  }
}
```

### Engagement Event

```javascript
{
  id: "uuid",
  event_type: "engagement",
  timestamp: "2024-01-15T10:35:00Z",
  user_id: "uuid",
  session_id: "uuid",
  action: "like",
  target_type: "article",
  target_id: "uuid",
  value: 1,
  properties: {
    duration: 300,
    scroll_depth: 0.8,
    clicked_element: "like_button"
  }
}
```

### Aggregated Metrics

```javascript
{
  date: "2024-01-15",
  metrics: {
    page_views: 1250,
    unique_visitors: 450,
    sessions: 520,
    bounce_rate: 0.35,
    avg_session_duration: 180,
    new_users: 85,
    returning_users: 365,
    conversions: 12,
    revenue: 299.99
  },
  dimensions: {
    traffic_sources: {
      organic: 450,
      direct: 320,
      social: 280,
      referral: 150,
      email: 50
    },
    devices: {
      desktop: 650,
      mobile: 480,
      tablet: 120
    },
    locations: {
      "Liberia": 380,
      "United States": 125,
      "Nigeria": 85,
      "Ghana": 65,
      "Other": 80
    },
    content_types: {
      articles: 520,
      podcasts: 180,
      events: 95,
      courses: 65
    }
  }
}
```

## 🔧 Backend Analytics Implementation

### Analytics Routes

```javascript
// backend/src/routes/analytics.js
const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const AnalyticsService = require('../services/analytics');

const router = express.Router();

// GET /api/v1/analytics/dashboard - Get dashboard metrics
router.get('/dashboard', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { start_date, end_date, segment = 'all' } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Start date and end date are required',
        },
      });
    }

    const metrics = await AnalyticsService.getDashboardMetrics({
      startDate: new Date(start_date),
      endDate: new Date(end_date),
      segment,
    });

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch dashboard metrics',
      },
    });
  }
});

// GET /api/v1/analytics/traffic - Get traffic analytics
router.get('/traffic', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { start_date, end_date, segment = 'all', granularity = 'daily' } = req.query;

    const trafficData = await AnalyticsService.getTrafficAnalytics({
      startDate: new Date(start_date),
      endDate: new Date(end_date),
      segment,
      granularity,
    });

    res.json({
      success: true,
      data: trafficData,
    });
  } catch (error) {
    console.error('Traffic analytics error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch traffic analytics',
      },
    });
  }
});

// GET /api/v1/analytics/engagement - Get engagement analytics
router.get('/engagement', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { start_date, end_date, segment = 'all' } = req.query;

    const engagementData = await AnalyticsService.getEngagementAnalytics({
      startDate: new Date(start_date),
      endDate: new Date(end_date),
      segment,
    });

    res.json({
      success: true,
      data: engagementData,
    });
  } catch (error) {
    console.error('Engagement analytics error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch engagement analytics',
      },
    });
  }
});

// GET /api/v1/analytics/content/:type - Get content analytics
router.get('/content/:type', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { type } = req.params;
    const { start_date, end_date, sort_by = 'views' } = req.query;

    const contentData = await AnalyticsService.getContentAnalytics({
      contentType: type,
      startDate: new Date(start_date),
      endDate: new Date(end_date),
      sortBy: sort_by,
    });

    res.json({
      success: true,
      data: contentData,
    });
  } catch (error) {
    console.error('Content analytics error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch content analytics',
      },
    });
  }
});

// POST /api/v1/analytics/reports - Generate custom report
router.post('/reports', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { name, description, metrics, filters, format = 'json' } = req.body;

    const report = await AnalyticsService.generateReport({
      name,
      description,
      metrics,
      filters,
      format,
    });

    res.json({
      success: true,
      data: report,
      message: 'Report generated successfully',
    });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to generate report',
      },
    });
  }
});

// POST /api/v1/analytics/export - Export analytics data
router.post('/export', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { data_type, date_range, format = 'csv', columns } = req.body;

    const exportData = await AnalyticsService.exportData({
      dataType: data_type,
      dateRange,
      format,
      columns,
    });

    res.setHeader('Content-Type', getContentType(format));
    res.setHeader('Content-Disposition', `attachment; filename="analytics.${format}"`);
    res.send(exportData);
  } catch (error) {
    console.error('Data export error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to export data',
      },
    });
  }
});

function getContentType(format) {
  const contentTypes = {
    csv: 'text/csv',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    json: 'application/json',
    pdf: 'application/pdf',
  };
  return contentTypes[format] || 'text/csv';
}

module.exports = router;
```

### Analytics Service

```javascript
// backend/src/services/analytics.js
const { createClient } = require('@supabase/supabase-js');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');

class AnalyticsService {
  static async getDashboardMetrics({ startDate, endDate, segment }) {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    try {
      // Get page views and visitors
      const { data: pageViews, error: pageViewsError } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_type', 'page_view')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())
        .order('timestamp', { ascending: true });

      if (pageViewsError) throw pageViewsError;

      // Calculate metrics
      const metrics = this.calculateMetrics(pageViews, segment);

      // Get traffic sources
      const trafficSources = await this.getTrafficSources(pageViews);

      // Get engagement data
      const engagementData = await this.getEngagementData(startDate, endDate, segment);

      return {
        overview: metrics,
        traffic: {
          sources: trafficSources,
          daily: this.groupByDate(pageViews, 'date'),
        },
        engagement: engagementData,
      };
    } catch (error) {
      console.error('Analytics service error:', error);
      throw error;
    }
  }

  static calculateMetrics(pageViews, segment) {
    const filteredViews = this.applySegmentFilter(pageViews, segment);

    const uniqueVisitors = new Set(filteredViews.map((pv) => pv.user_id)).size;
    const sessions = new Set(filteredViews.map((pv) => pv.session_id)).size;

    // Calculate bounce rate (single page sessions)
    const sessionPageCounts = {};
    filteredViews.forEach((pv) => {
      sessionPageCounts[pv.session_id] = (sessionPageCounts[pv.session_id] || 0) + 1;
    });

    const bouncedSessions = Object.values(sessionPageCounts).filter((count) => count === 1).length;
    const bounceRate = sessions > 0 ? bouncedSessions / sessions : 0;

    // Calculate average session duration
    const sessionDurations = this.calculateSessionDurations(filteredViews);
    const avgSessionDuration =
      sessionDurations.length > 0
        ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
        : 0;

    // Get previous period for comparison
    const previousMetrics = this.getPreviousPeriodMetrics(filteredViews);

    return {
      page_views: filteredViews.length,
      page_views_change: this.calculateChange(filteredViews.length, previousMetrics.pageViews),
      page_views_trend: this.calculateTrend(filteredViews),

      unique_visitors: uniqueVisitors,
      visitors_change: this.calculateChange(uniqueVisitors, previousMetrics.uniqueVisitors),
      visitors_trend: this.calculateVisitorTrend(filteredViews),

      avg_session_duration: this.formatDuration(avgSessionDuration),
      duration_change: this.calculateChange(avgSessionDuration, previousMetrics.avgDuration),
      duration_trend: this.calculateDurationTrend(filteredViews),

      bounce_rate: Math.round(bounceRate * 100),
      bounce_rate_change: this.calculateChange(bounceRate * 100, previousMetrics.bounceRate),
      bounce_rate_trend: this.calculateBounceTrend(filteredViews),
    };
  }

  static async getTrafficSources(pageViews) {
    const sources = {};

    pageViews.forEach((pv) => {
      const source = this.categorizeTrafficSource(pv.referrer);
      sources[source] = (sources[source] || 0) + 1;
    });

    return Object.entries(sources)
      .map(([name, count]) => ({ name, count, percentage: (count / pageViews.length) * 100 }))
      .sort((a, b) => b.count - a.count);
  }

  static categorizeTrafficSource(referrer) {
    if (!referrer) return 'direct';

    const referrerDomain = new URL(referrer).hostname.toLowerCase();

    if (referrerDomain.includes('google')) return 'organic';
    if (
      referrerDomain.includes('facebook') ||
      referrerDomain.includes('twitter') ||
      referrerDomain.includes('linkedin')
    )
      return 'social';
    if (referrerDomain.includes('mailto:') || referrerDomain.includes('email')) return 'email';

    return 'referral';
  }

  static async getEngagementData(startDate, endDate, segment) {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    // Get engagement events
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('*')
      .in('event_type', ['like', 'share', 'comment', 'download'])
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString());

    if (error) throw error;

    const filteredEvents = this.applySegmentFilter(events, segment);

    return {
      content: this.getContentPerformance(filteredEvents),
      top_pages: await this.getTopPages(startDate, endDate, segment),
      devices: this.getDeviceDistribution(filteredEvents),
      geography: this.getGeographicDistribution(filteredEvents),
    };
  }

  static applySegmentFilter(data, segment) {
    if (segment === 'all') return data;

    // Implement segment filtering logic
    switch (segment) {
      case 'new':
        return data.filter((item) => item.is_new_user);
      case 'returning':
        return data.filter((item) => !item.is_new_user);
      case 'premium':
        return data.filter((item) => item.user_subscription === 'premium');
      default:
        return data;
    }
  }

  static formatDuration(seconds) {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`;
  }

  static calculateChange(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  static calculateTrend(data) {
    // Calculate trend data for mini charts
    const dailyData = this.groupByDate(data, 'date');
    const values = Object.values(dailyData).slice(-7); // Last 7 days
    const maxValue = Math.max(...values);

    return values.map((value) => (maxValue > 0 ? value / maxValue : 0));
  }

  static groupByDate(data, dateField) {
    return data.reduce((groups, item) => {
      const date = new Date(item.timestamp).toISOString().split('T')[0];
      groups[date] = (groups[date] || 0) + 1;
      return groups;
    }, {});
  }

  static async exportData({ dataType, dateRange, format, columns }) {
    const data = await this.getExportData(dataType, dateRange);

    switch (format) {
      case 'csv':
        return this.exportToCSV(data, columns);
      case 'xlsx':
        return this.exportToExcel(data, columns);
      case 'json':
        return JSON.stringify(data, null, 2);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  static exportToCSV(data, columns) {
    const parser = new Parser({ fields: columns });
    return parser.parse(data);
  }

  static exportToExcel(data, columns) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Analytics Data');

    // Add headers
    worksheet.addRow(columns);

    // Add data
    data.forEach((row) => {
      worksheet.addRow(columns.map((col) => row[col] || ''));
    });

    return workbook.xlsx.writeBuffer();
  }
}

module.exports = AnalyticsService;
```

## 📋 Best Practices

### Data Collection

1. **Privacy Compliance**: Follow GDPR and data protection regulations
2. **Sampling**: Use statistical sampling for high-traffic sites
3. **Data Retention**: Implement appropriate data retention policies
4. **Real-time Processing**: Use event streaming for real-time analytics
5. **Data Validation**: Validate and clean incoming analytics data

### Performance Optimization

1. **Caching**: Cache frequently accessed analytics data
2. **Aggregation**: Pre-aggregate data for faster queries
3. **Indexing**: Proper database indexing on analytics tables
4. **Batch Processing**: Process analytics events in batches
5. **CDN**: Use CDN for analytics assets and reports

### Visualization

1. **Responsive Design**: Ensure charts work on all devices
2. **Accessibility**: Add ARIA labels and keyboard navigation
3. **Performance**: Optimize chart rendering for large datasets
4. **Interactivity**: Add tooltips and drill-down capabilities
5. **Color Schemes**: Use colorblind-friendly palettes

This comprehensive Analytics system provides powerful insights into user behavior and platform performance while maintaining data privacy and system performance.
