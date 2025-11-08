import React from 'react';
import { renderWithProviders, screen } from '../../test/utils';
import About from '../About';

describe('About page (smoke)', () => {
  it('renders a heading', () => {
    renderWithProviders(<About />);
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });
});
