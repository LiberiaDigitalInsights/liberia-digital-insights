import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../../context/ThemeContext';
import { ToastProvider } from '../../context/ToastContext';
import App from '../../App';

describe('Category route (smoke)', () => {
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

  it('renders category heading for /category/technology', async () => {
    renderAt('/category/technology');
    await screen.findByRole('heading', { name: /technology/i }, { timeout: 20000 });
  }, 25000);
});
