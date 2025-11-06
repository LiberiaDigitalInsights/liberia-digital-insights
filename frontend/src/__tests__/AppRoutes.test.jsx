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
    // Wait for the Home content to render (Suspense fallback uses skeletons now)
    await screen.findByRole('heading', { name: /technology/i }, { timeout: 5000 });
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
