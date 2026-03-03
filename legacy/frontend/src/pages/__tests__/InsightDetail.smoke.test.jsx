import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../../context/ThemeContext';
import { ToastProvider } from '../../context/ToastContext';
import App from '../../App';
import { vi } from 'vitest';

// Mock API
vi.mock('../../services/backendApi', () => ({
  backendApi: {
    analytics: {
      trackVisit: vi.fn().mockResolvedValue({}),
    },
    articles: { list: vi.fn().mockResolvedValue({ articles: [] }) },
    podcasts: { list: vi.fn().mockResolvedValue({ podcasts: [] }) },
    events: { list: vi.fn().mockResolvedValue({ events: [] }) },
    categories: { list: vi.fn().mockResolvedValue({ data: [] }) },
    insights: {
      list: vi.fn().mockResolvedValue({ insights: [] }),
      getBySlug: vi.fn().mockImplementation((id) => {
        if (id === '123e4567-e89b-12d3-a456-426614174002') {
          return Promise.resolve({
            insight: {
              id: '123e4567-e89b-12d3-a456-426614174002',
              title: 'Digital Transformation: TeamEden Strategies',
              content: 'Detailed content here...',
              author: 'Michael Chen',
              category: 'Technology',
              date: '2024-03-20',
              image: '/placeholder.jpg',
            },
          });
        }
        return Promise.reject(new Error('Insight not found'));
      }),
    },
  },
}));

describe('InsightDetail route (smoke)', () => {
  function renderAt(pathname) {
    return render(
      <HelmetProvider>
        <ThemeProvider>
          <ToastProvider>
            <MemoryRouter initialEntries={[pathname]}>
              <App />
            </MemoryRouter>
          </ToastProvider>
        </ThemeProvider>
      </HelmetProvider>,
    );
  }

  it('renders H1 for insight detail at /insight/123e4567-e89b-12d3-a456-426614174002', async () => {
    renderAt('/insight/123e4567-e89b-12d3-a456-426614174002');
    // H1 contains the article title; match a distinctive part
    await screen.findByRole('heading', { name: /teameden/i }, { timeout: 20000 });
  }, 25000);
});
