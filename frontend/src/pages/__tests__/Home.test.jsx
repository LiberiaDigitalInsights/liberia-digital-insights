import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';
import { ToastProvider } from '../../context/ToastContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';

const HomeWrapper = () => (
  <HelmetProvider>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <Home />
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </HelmetProvider>
);

describe('Home Page', () => {
  it('renders homepage sections', () => {
    render(<HomeWrapper />);
    expect(screen.getAllByText(/technology/i).length).toBeGreaterThan(0);
  });

  it('renders article cards', () => {
    render(<HomeWrapper />);
    // Check for article links (ArticleCard components render as links)
    const articleLinks = screen.getAllByRole('link');
    expect(articleLinks.length).toBeGreaterThan(0);
  });

  it('renders sidebar widgets', () => {
    render(<HomeWrapper />);
    // Check for podcast widget or newsletter widget text
    const widgets = screen.queryAllByText(/podcast|newsletter|events/i);
    expect(widgets.length).toBeGreaterThan(0);
  });
});
