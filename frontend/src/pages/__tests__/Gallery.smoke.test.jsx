import React from 'react';
import { renderWithProviders, screen } from '../../test/utils';
import Gallery from '../Gallery';

describe('Gallery page (smoke)', () => {
  it('renders and shows Gallery heading', () => {
    renderWithProviders(<Gallery />);
    expect(screen.getByRole('heading', { name: /gallery/i })).toBeInTheDocument();
  });
});
