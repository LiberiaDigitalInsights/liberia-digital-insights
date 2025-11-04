import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/utils';
import NewsletterWidget from '../NewsletterWidget';
import ToastViewport from '../../ui/Toast';

describe('NewsletterWidget', () => {
  it('validates required fields and submits successfully', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <NewsletterWidget />
        <ToastViewport />
      </>,
    );

    // Try submit empty
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    expect(await screen.findByText(/validation error/i)).toBeInTheDocument();

    // Fill minimal fields
    await user.type(screen.getByLabelText(/name/i), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/your email/i), 'ada@example.com');

    await user.click(screen.getByRole('button', { name: /sign up/i }));

    // Expect success toast
    expect(await screen.findByText(/subscribed/i)).toBeInTheDocument();
  });
});
