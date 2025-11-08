import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../context/ToastContext';
import App from '../App';

function renderAt(pathname) {
  return render(
    <HelmetProvider>
      <ThemeProvider>
        <ToastProvider>
          <MemoryRouter initialEntries={[pathname]}>
            <App />
          </MemoryRouter>
        </ToastProvider>
      </ThemeProvider>
    </HelmetProvider>,
  );
}

describe('App routes', () => {
  it('renders Home at /', async () => {
    renderAt('/');
    // Wait for the hero heading to ensure Home finished lazy loading
    await screen.findByRole('heading', { name: /liberia's home for tech news and insights/i }, { timeout: 20000 });
  }, 25000);

  it('renders Contact at /contact', async () => {
    renderAt('/contact');
    await screen.findByRole('heading', { name: /contact us/i }, { timeout: 10000 });
  });

  it('renders NotFound on unknown route', async () => {
    renderAt('/does-not-exist');
    // Wait for lazy NotFound to load; assert the H2 heading text
    await screen.findByRole('heading', { name: /page not found/i }, { timeout: 20000 });
  }, 25000);
});
