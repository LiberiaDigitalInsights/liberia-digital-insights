// NewsletterWidget Component Tests
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NewsletterWidget from '../sidebar/NewsletterWidget';
import { useToast } from '../../context/ToastContext';
import { useNewsletterSubscription } from '../../hooks/useBackendApi';

// Mock the dependencies
jest.mock('../../context/ToastContext');
jest.mock('../../hooks/useBackendApi');

const mockUseToast = useToast;
const mockUseNewsletterSubscription = useNewsletterSubscription;

describe('NewsletterWidget', () => {
  const mockShowToast = jest.fn();
  const mockSubscribe = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseToast.mockReturnValue({
      showToast: mockShowToast,
    });

    mockUseNewsletterSubscription.mockReturnValue({
      subscribe: mockSubscribe,
      loading: false,
      error: null,
    });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <NewsletterWidget />
      </BrowserRouter>,
    );
  };

  it('renders newsletter signup form', () => {
    renderComponent();

    expect(screen.getByText('NEWSLETTER SIGNUP')).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Organization/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Position/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        title: 'Validation Error',
        description: 'Please correct the highlighted fields.',
        variant: 'danger',
      });
    });
  });

  it('shows validation error for invalid email', async () => {
    renderComponent();

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        title: 'Validation Error',
        description: 'Please correct the highlighted fields.',
        variant: 'danger',
      });
    });

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('submits form successfully with valid data', async () => {
    mockSubscribe.mockResolvedValue({ message: 'Successfully subscribed' });

    renderComponent();

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const companyInput = screen.getByLabelText(/Company/i);
    const orgInput = screen.getByLabelText(/Organization/i);
    const positionInput = screen.getByLabelText(/Position/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(companyInput, { target: { value: 'Tech Corp' } });
    fireEvent.change(orgInput, { target: { value: 'Tech Org' } });
    fireEvent.change(positionInput, { target: { value: 'Developer' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubscribe).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Tech Corp',
        org: 'Tech Org',
        position: 'Developer',
      });
    });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        title: 'Subscribed',
        description: 'Thanks for subscribing to our newsletter!',
        variant: 'success',
      });
    });

    // Check if form is reset
    expect(screen.getByLabelText(/Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('');
  });

  it('handles subscription error', async () => {
    mockSubscribe.mockRejectedValue(new Error('Network error'));

    renderComponent();

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Network error',
        variant: 'danger',
      });
    });
  });

  it('shows loading state during submission', async () => {
    mockSubscribe.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    mockUseNewsletterSubscription.mockReturnValue({
      subscribe: mockSubscribe,
      loading: true,
      error: null,
    });

    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
  });

  it('clears validation errors when user types', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });

    // First trigger validation error
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalled();
    });

    // Then type in email field
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    // Error should be cleared
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
  });

  it('shows success message after successful submission', async () => {
    mockSubscribe.mockResolvedValue({ message: 'Successfully subscribed' });

    renderComponent();

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("You're all set! Check your inbox for a welcome email."),
      ).toBeInTheDocument();
    });
  });

  it('shows generic error message when no specific error provided', async () => {
    mockSubscribe.mockRejectedValue({});

    renderComponent();

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to subscribe. Please try again.',
        variant: 'danger',
      });
    });
  });
});
