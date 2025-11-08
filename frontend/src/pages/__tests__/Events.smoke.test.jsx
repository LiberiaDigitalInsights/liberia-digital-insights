import React from 'react';
import { renderWithProviders, screen } from '../../test/utils';
import Events from '../Events';

describe('Events page (smoke)', () => {
  it('renders and shows Events heading', () => {
    renderWithProviders(<Events />);
    expect(screen.getByRole('heading', { name: /events/i })).toBeInTheDocument();
  });
});
