import { renderWithProviders, screen } from '../../test/utils';
import Register from '../Register';
import { vi } from 'vitest';

vi.mock('../../services/backendApi', () => ({
  authApi: {
    register: vi.fn().mockResolvedValue({}),
  },
  backendApi: {
    analytics: { trackVisit: vi.fn().mockResolvedValue({}) },
    talents: {
      list: vi.fn().mockResolvedValue({
        talents: [],
        pagination: { pages: 1 },
      }),
    },
    articles: { list: vi.fn().mockResolvedValue({ articles: [] }) },
    podcasts: { list: vi.fn().mockResolvedValue({ podcasts: [] }) },
    insights: { list: vi.fn().mockResolvedValue({ insights: [] }) },
    events: { list: vi.fn().mockResolvedValue({ events: [] }) },
    categories: { list: vi.fn().mockResolvedValue({ data: [] }) },
    advertisements: { list: vi.fn().mockResolvedValue({ data: [] }) },
    training: { list: vi.fn().mockResolvedValue({ data: [] }) },
  },
}));

describe('Register page (smoke)', () => {
  it('renders and shows heading', async () => {
    renderWithProviders(<Register />);
    // Register page might show "Registration" heading
    expect(await screen.findByRole('heading', { name: /registration/i })).toBeInTheDocument();
  });
});
