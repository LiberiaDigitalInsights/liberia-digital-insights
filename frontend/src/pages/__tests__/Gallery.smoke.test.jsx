import { renderWithProviders, screen } from '../../test/utils';
import Gallery from '../Gallery';
import { vi } from 'vitest';

vi.mock('../../hooks/useGallery', () => ({
  useGallery: () => ({
    getItems: vi.fn().mockResolvedValue([]),
    getEvents: vi.fn().mockResolvedValue([]),
    getCategories: vi.fn().mockResolvedValue([]),
  }),
}));

describe('Gallery page (smoke)', () => {
  it('renders and shows Gallery heading', async () => {
    renderWithProviders(<Gallery />);
    expect(await screen.findByRole('heading', { name: /gallery/i })).toBeInTheDocument();
  });
});
