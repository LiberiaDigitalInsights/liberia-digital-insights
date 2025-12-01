import React from 'react';
import { renderWithProviders, screen } from '../../test/utils';
import Signup from '../Signup';

describe('Signup page (smoke)', () => {
  it('renders and shows at least one heading', () => {
    renderWithProviders(<Signup />);
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });
});
