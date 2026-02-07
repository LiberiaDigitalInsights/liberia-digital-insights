import { renderWithContext, screen, waitFor, fireEvent } from '../../test/utils';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Unsubscribe from '../Unsubscribe';
import { backendApi } from '../../services/backendApi';
import { vi } from 'vitest';

// Mock the backend API
vi.mock('../../services/backendApi', () => ({
  backendApi: {
    analytics: { trackVisit: vi.fn().mockResolvedValue({}) },
    newsletters: {
      unsubscribe: vi.fn(),
      subscribe: vi.fn(),
    },
  },
}));

describe('Unsubscribe Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithToken = (token) => {
    return renderWithContext(
      <MemoryRouter initialEntries={[`/unsubscribe?token=${token}`]}>
        <Routes>
          <Route path="/unsubscribe" element={<Unsubscribe />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it('shows loading state initially', () => {
    backendApi.newsletters.unsubscribe.mockImplementation(() => new Promise(() => {}));

    renderWithToken('valid-token');

    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByText('Processing Request...')).toBeInTheDocument();
  });

  it('shows success state for valid token', async () => {
    const mockSubscriber = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      subscribed_at: '2024-01-01T00:00:00Z',
      unsubscribe_token: 'valid-token',
    };

    backendApi.newsletters.unsubscribe.mockResolvedValue({
      message: 'Successfully unsubscribed',
      subscriber: mockSubscriber,
    });

    renderWithToken('valid-token');

    await waitFor(() => {
      expect(screen.getByText('Successfully Unsubscribed')).toBeInTheDocument();
    });

    expect(
      screen.getByText('You have been successfully unsubscribed from our newsletter.'),
    ).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Resubscribe/i })).toBeInTheDocument();
  });

  it('shows already unsubscribed state', async () => {
    backendApi.newsletters.unsubscribe.mockRejectedValue(new Error('Already unsubscribed'));

    renderWithToken('already-unsubscribed-token');

    await waitFor(() => {
      expect(screen.getByText('Already Unsubscribed')).toBeInTheDocument();
    });

    expect(
      screen.getByText('You are already unsubscribed from our newsletter.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Update Subscription/i })).toBeInTheDocument();
  });

  it('shows error state for invalid token', async () => {
    backendApi.newsletters.unsubscribe.mockRejectedValue(new Error('Invalid unsubscribe token'));

    renderWithToken('invalid-token');

    await waitFor(() => {
      expect(screen.getByText('Unsubscribe Failed')).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        'Invalid or expired unsubscribe link. Please contact support for assistance.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Subscribe to Newsletter/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contact Support/i })).toBeInTheDocument();
  });

  it('shows error state for missing token', async () => {
    renderWithContext(
      <MemoryRouter initialEntries={['/unsubscribe']}>
        <Unsubscribe />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Unsubscribe Failed')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Invalid unsubscribe link. Please contact support for assistance.'),
    ).toBeInTheDocument();
  });

  it('shows generic error for other errors', async () => {
    backendApi.newsletters.unsubscribe.mockRejectedValue(new Error('Network error'));

    renderWithToken('valid-token');

    await waitFor(() => {
      expect(screen.getByText('Unsubscribe Failed')).toBeInTheDocument();
    });

    expect(
      screen.getByText('An error occurred while processing your request. Please try again later.'),
    ).toBeInTheDocument();
  });

  it('handles resubscribe successfully', async () => {
    const mockSubscriber = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      subscribed_at: '2024-01-01T00:00:00Z',
      company: 'Tech Corp',
      org: 'Tech Org',
      position: 'Developer',
    };

    backendApi.newsletters.unsubscribe.mockResolvedValue({
      message: 'Successfully unsubscribed',
      subscriber: mockSubscriber,
    });

    backendApi.newsletters.subscribe.mockResolvedValue({
      message: 'Successfully resubscribed',
    });

    renderWithToken('valid-token');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Resubscribe/i })).toBeInTheDocument();
    });

    const resubscribeButton = screen.getByRole('button', { name: /Resubscribe/i });
    fireEvent.click(resubscribeButton);

    await waitFor(() => {
      expect(backendApi.newsletters.subscribe).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Tech Corp',
        org: 'Tech Org',
        position: 'Developer',
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText('Welcome back! You have been resubscribed to our newsletter.'),
      ).toBeInTheDocument();
    });
  });

  it('handles resubscribe error', async () => {
    const mockSubscriber = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      subscribed_at: '2024-01-01T00:00:00Z',
    };

    backendApi.newsletters.unsubscribe.mockResolvedValue({
      message: 'Successfully unsubscribed',
      subscriber: mockSubscriber,
    });

    backendApi.newsletters.subscribe.mockRejectedValue(new Error('Subscribe failed'));

    renderWithToken('valid-token');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Resubscribe/i })).toBeInTheDocument();
    });

    const resubscribeButton = screen.getByRole('button', { name: /Resubscribe/i });
    fireEvent.click(resubscribeButton);

    await waitFor(() => {
      expect(
        screen.getByText('Failed to resubscribe. Please use the newsletter signup form.'),
      ).toBeInTheDocument();
    });
  });

  it('displays formatted subscription date', async () => {
    const mockSubscriber = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      subscribed_at: '2024-01-15T00:00:00Z',
      unsubscribe_token: 'valid-token',
    };

    backendApi.newsletters.unsubscribe.mockResolvedValue({
      message: 'Successfully unsubscribed',
      subscriber: mockSubscriber,
    });

    renderWithToken('valid-token');

    await waitFor(() => {
      expect(screen.getByText(/1\/1[45]\/2024/)).toBeInTheDocument();
    });
  });

  it('shows additional information for successful unsubscribe', async () => {
    const mockSubscriber = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      subscribed_at: '2024-01-01T00:00:00Z',
      unsubscribe_token: 'valid-token',
    };

    backendApi.newsletters.unsubscribe.mockResolvedValue({
      message: 'Successfully unsubscribed',
      subscriber: mockSubscriber,
    });

    renderWithToken('valid-token');

    await waitFor(() => {
      expect(screen.getByText("We're sorry to see you go!")).toBeInTheDocument();
    });

    expect(screen.getByText(/You'll no longer receive our weekly newsletter/)).toBeInTheDocument();
    expect(screen.getByText(/You can resubscribe at any time/)).toBeInTheDocument();
  });

  it('includes privacy policy link', async () => {
    backendApi.newsletters.unsubscribe.mockRejectedValue(new Error('Invalid token'));

    renderWithToken('invalid-token');

    await waitFor(() => {
      const privacyLink = screen.getByText('Privacy Policy');
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink.closest('a')).toHaveAttribute('href', '/privacy');
    });
  });
});
