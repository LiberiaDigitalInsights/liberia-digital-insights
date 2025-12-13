// Unsubscribe Page Tests
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Unsubscribe from '../Unsubscribe';
import { backendApi } from '../../services/backendApi';

// Mock the backend API
jest.mock('../../services/backendApi');

const mockBackendApi = backendApi;

describe('Unsubscribe Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithToken = (token) => {
    return render(
      <MemoryRouter initialEntries={[`/unsubscribe?token=${token}`]}>
        <Unsubscribe />
      </MemoryRouter>,
    );
  };

  it('shows loading state initially', () => {
    mockBackendApi.newsletters.unsubscribe.mockImplementation(() => new Promise(() => {}));

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

    mockBackendApi.newsletters.unsubscribe.mockResolvedValue({
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
    mockBackendApi.newsletters.unsubscribe.mockRejectedValue(new Error('Already unsubscribed'));

    renderWithToken('already-unsubscribed-token');

    await waitFor(() => {
      expect(screen.getByText('Already Unsubscribed')).toBeInTheDocument();
    });

    expect(
      screen.getByText('You are already unsubscribed from our newsletter.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update Subscription/i })).toBeInTheDocument();
  });

  it('shows error state for invalid token', async () => {
    mockBackendApi.newsletters.unsubscribe.mockRejectedValue(
      new Error('Invalid unsubscribe token'),
    );

    renderWithToken('invalid-token');

    await waitFor(() => {
      expect(screen.getByText('Unsubscribe Failed')).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        'Invalid or expired unsubscribe link. Please contact support for assistance.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subscribe to Newsletter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Contact Support/i })).toBeInTheDocument();
  });

  it('shows error state for missing token', async () => {
    render(
      <BrowserRouter>
        <Unsubscribe />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Unsubscribe Failed')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Invalid unsubscribe link. Please contact support for assistance.'),
    ).toBeInTheDocument();
  });

  it('shows generic error for other errors', async () => {
    mockBackendApi.newsletters.unsubscribe.mockRejectedValue(new Error('Network error'));

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

    mockBackendApi.newsletters.unsubscribe.mockResolvedValue({
      message: 'Successfully unsubscribed',
      subscriber: mockSubscriber,
    });

    mockBackendApi.newsletters.subscribe.mockResolvedValue({
      message: 'Successfully resubscribed',
    });

    renderWithToken('valid-token');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Resubscribe/i })).toBeInTheDocument();
    });

    const resubscribeButton = screen.getByRole('button', { name: /Resubscribe/i });
    fireEvent.click(resubscribeButton);

    await waitFor(() => {
      expect(mockBackendApi.newsletters.subscribe).toHaveBeenCalledWith({
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

    mockBackendApi.newsletters.unsubscribe.mockResolvedValue({
      message: 'Successfully unsubscribed',
      subscriber: mockSubscriber,
    });

    mockBackendApi.newsletters.subscribe.mockRejectedValue(new Error('Subscribe failed'));

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

    mockBackendApi.newsletters.unsubscribe.mockResolvedValue({
      message: 'Successfully unsubscribed',
      subscriber: mockSubscriber,
    });

    renderWithToken('valid-token');

    await waitFor(() => {
      expect(screen.getByText('1/15/2024')).toBeInTheDocument();
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

    mockBackendApi.newsletters.unsubscribe.mockResolvedValue({
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
    mockBackendApi.newsletters.unsubscribe.mockRejectedValue(new Error('Invalid token'));

    renderWithToken('invalid-token');

    await waitFor(() => {
      const privacyLink = screen.getByText('Privacy Policy');
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink.closest('a')).toHaveAttribute('href', '/privacy');
    });
  });
});
