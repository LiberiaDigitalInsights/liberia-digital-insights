import React from 'react';
import { renderWithProviders, screen } from '../../test/utils';
import Articles from '../Articles';

describe('Articles page (smoke)', () => {
  it('renders without crashing and shows at least one heading', () => {
    renderWithProviders(<Articles />);
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });
});
