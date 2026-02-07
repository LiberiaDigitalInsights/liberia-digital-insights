import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithProviders } from '../../../test/utils';
import NewsletterWidget from '../NewsletterWidget';
import ToastViewport from '../../ui/Toast';

// Ensure deterministic success for subscribeNewsletter in tests
// Note: path is relative to this test file location
// Mock hook
vi.mock('../../../hooks/useBackendApi', () => ({
  useNewsletterSubscription: () => ({
    subscribe: vi.fn().mockResolvedValue({ ok: true }),
    loading: false,
  }),
}));

describe('NewsletterWidget', () => {
  it('validates required fields and submits successfully', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NewsletterWidget />);

    // Try submit empty
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    expect(await screen.findByText(/validation error/i)).toBeInTheDocument();

    // Fill minimal fields
    await user.type(screen.getByLabelText(/name/i), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/your email/i), 'ada@example.com');

    await user.click(screen.getByRole('button', { name: /sign up/i }));

    // Expect success toast
    // Expect success toast or success message in form
    expect(await screen.findByText(/Thanks for subscribing/i)).toBeInTheDocument();
  });
});
