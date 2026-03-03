import React from 'react';
import { renderWithProviders, screen } from '../../test/utils';
import Categories from '../Categories';

describe('Categories page (smoke)', () => {
  it('renders and shows Categories heading', () => {
    renderWithProviders(<Categories />);
    expect(screen.getByRole('heading', { name: /categories/i })).toBeInTheDocument();
  });
});
