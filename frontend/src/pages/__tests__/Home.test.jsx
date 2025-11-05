import React from 'react';
import Home from '../Home';
import { renderWithProviders, screen } from '../../test/utils';

describe('Home Page', () => {
  it('renders homepage sections', () => {
    renderWithProviders(<Home />);
    expect(screen.getAllByText(/technology/i).length).toBeGreaterThan(0);
  });

  it('renders article cards', () => {
    renderWithProviders(<Home />);
    // Check for article links (ArticleCard components render as links)
    const articleLinks = screen.getAllByRole('link');
    expect(articleLinks.length).toBeGreaterThan(0);
  });

  it('renders sidebar widgets', () => {
    renderWithProviders(<Home />);
    // Check for podcast widget or newsletter widget text
    const widgets = screen.queryAllByText(/podcast|newsletter|events/i);
    expect(widgets.length).toBeGreaterThan(0);
  });
});
