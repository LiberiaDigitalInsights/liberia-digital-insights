import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
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
    // Wait for Suspense fallback to disappear, then assert content
    const loading = await screen.findByText(/loading/i, undefined, { timeout: 5000 });
    await waitForElementToBeRemoved(loading, { timeout: 10000 });
    await screen.findByRole('heading', { name: /technology/i });
  });

  it('renders Contact at /contact', async () => {
    renderAt('/contact');
    await screen.findByText(/contact us/i);
  });

  it('renders NotFound on unknown route', async () => {
    renderAt('/does-not-exist');
    // Page Not Found heading from NotFound.jsx
    await screen.findByText(/page not found/i);
  });
});
