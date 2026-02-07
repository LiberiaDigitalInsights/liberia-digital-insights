import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Talent from '../Talent';
import { renderWithProviders } from '../../test/utils';
import { backendApi } from '../../services/backendApi';
import { vi } from 'vitest';

vi.mock('../../services/backendApi', () => ({
  backendApi: {
    analytics: { trackVisit: vi.fn().mockResolvedValue({}) },
    talents: {
      list: vi.fn().mockResolvedValue({
        talents: [
          {
            id: '1',
            name: 'John Doe',
            role: 'Designer',
            category: 'Design',
            bio: 'Bio',
            links: { website: 'https://example.com' },
          },
          {
            id: '2',
            name: 'Jane Doe',
            role: 'Engineer',
            category: 'Engineering',
            bio: 'Bio',
            links: { website: 'https://example.com' },
          },
        ],
        pagination: { pages: 1 },
      }),
      create: vi.fn().mockResolvedValue({ id: '3', name: 'New Person' }),
    },
    articles: { list: vi.fn().mockResolvedValue({ articles: [] }) },
    podcasts: { list: vi.fn().mockResolvedValue({ podcasts: [] }) },
    insights: { list: vi.fn().mockResolvedValue({ insights: [] }) },
    events: { list: vi.fn().mockResolvedValue({ events: [] }) },
    categories: { list: vi.fn().mockResolvedValue({ data: [] }) },
  },
}));

function renderTalent() {
  return renderWithProviders(<Talent />);
}

describe('Talent Hub', () => {
  it('renders list and can filter', async () => {
    renderTalent();

    // Wait for the select component to be rendered
    const select = await screen.findByLabelText(/filter by category/i);
    expect(select).toBeInTheDocument();

    // Check initial content
    expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();

    const user = userEvent.setup();
    // Use selectOptions instead of click
    await user.selectOptions(select, 'Engineering');

    // After filtering
    expect(await screen.findByText(/Jane Doe/i)).toBeInTheDocument();
  });

  it('validates and submits new talent', async () => {
    renderTalent();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Check for validation errors (assuming they appear as text)
    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Role is required/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/name/i), 'New Person');
    await user.type(screen.getByLabelText(/role/i), 'Engineer');
    await user.selectOptions(screen.getByLabelText(/category \*/i), 'Engineering');
    await user.type(screen.getByLabelText(/bio/i), 'This is a short bio that meets min length');

    const submitBtn = screen.getByRole('button', { name: /^submit$/i });
    await user.click(submitBtn);

    // Success state should appear
    await waitFor(
      () => {
        expect(backendApi.talents.create).toHaveBeenCalled();
      },
      { timeout: 10000 },
    );

    expect(
      await screen.findByText(/Profile Submitted/i, undefined, { timeout: 10000 }),
    ).toBeInTheDocument();
  }, 20000);
});
