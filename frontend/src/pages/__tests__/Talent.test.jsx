import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Talent from '../Talent';
import { renderWithProviders } from '../../test/utils';

function renderTalent() {
  return renderWithProviders(<Talent />);
}

describe('Talent Hub', () => {
  it('renders list and can filter', async () => {
    renderTalent();
    // Tabs/chips include categories
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    // At least one card visible
    expect(screen.getAllByText(/designer|engineer|product/i).length).toBeGreaterThan(0);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /engineering/i }));
    // After filtering, cards should show Engineering role/category
    expect(screen.getAllByText(/engineering/i).length).toBeGreaterThan(0);
  });

  it('validates and submits new talent', async () => {
    renderTalent();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /submit/i }));
    // Shows toast via validation error (we assert presence of error text element)
    expect(screen.getAllByText(/required|please fix the form fields/i).length).toBeGreaterThan(0);

    await user.type(screen.getByLabelText(/name/i), 'New Person');
    await user.type(screen.getByLabelText(/^role$/i), 'Engineer');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Engineering');
    await user.type(screen.getByLabelText(/bio/i), 'This is a short bio that meets min length');

    await user.click(screen.getByRole('button', { name: /^submit$/i }));

    // New card should appear on the page
    expect(await screen.findByText('New Person')).toBeInTheDocument();
  });
});
