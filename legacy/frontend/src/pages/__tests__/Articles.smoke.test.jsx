import { renderWithProviders, screen } from '../../test/utils';
import Articles from '../Articles';
import { vi } from 'vitest';

vi.mock('../../services/backendApi', () => ({
  backendApi: {
    analytics: { trackVisit: vi.fn().mockResolvedValue({}) },
    articles: {
      list: vi.fn().mockResolvedValue({
        articles: [
          {
            id: 1,
            title: 'Test Article',
            slug: 'test-article',
            content: 'Test content for read time calculation.',
            published_at: new Date().toISOString(),
            category: { name: 'Technology' },
            tags: [],
          },
        ],
        pagination: { total: 1, totalPages: 1 },
      }),
    },
    podcasts: { list: vi.fn().mockResolvedValue({ podcasts: [] }) },
    insights: { list: vi.fn().mockResolvedValue({ insights: [] }) },
    events: { list: vi.fn().mockResolvedValue({ events: [] }) },
    categories: { list: vi.fn().mockResolvedValue({ data: [] }) },
    advertisements: { list: vi.fn().mockResolvedValue({ data: [] }) },
  },
}));

describe('Articles page (smoke)', () => {
  it('renders without crashing and shows heading', async () => {
    renderWithProviders(<Articles />);
    expect(await screen.findByRole('heading', { name: /articles/i })).toBeInTheDocument();
  });
});
