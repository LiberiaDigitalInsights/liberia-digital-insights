import React from 'react';
import { renderWithProviders, screen } from '../../test/utils';
import Insights from '../Insights';

describe('Insights page (smoke)', () => {
  it('renders without crashing and shows at least one heading', () => {
    renderWithProviders(<Insights />);
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });
});
