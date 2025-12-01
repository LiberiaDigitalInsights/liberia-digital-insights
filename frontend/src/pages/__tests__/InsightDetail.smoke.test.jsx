import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../../context/ThemeContext';
import { ToastProvider } from '../../context/ToastContext';
import App from '../../App';

describe('InsightDetail route (smoke)', () => {
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

  it('renders H1 for insight detail at /insight/1', async () => {
    renderAt('/insight/1');
    // H1 contains the article title; match a distinctive part
    await screen.findByRole('heading', { name: /teameden/i }, { timeout: 20000 });
  }, 25000);
});
