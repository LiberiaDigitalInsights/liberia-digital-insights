import React from 'react';
import { renderWithProviders, screen } from '../../test/utils';
import Podcasts from '../Podcasts';

describe('Podcasts page (smoke)', () => {
  it('renders and shows at least one heading', () => {
    renderWithProviders(<Podcasts />);
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });
});
