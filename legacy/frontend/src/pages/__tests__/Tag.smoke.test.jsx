import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../../context/ThemeContext';
import { ToastProvider } from '../../context/ToastContext';
import App from '../../App';

describe('Tag route (smoke)', () => {
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

  it('renders tag heading for /tag/insighttechthursdays', async () => {
    renderAt('/tag/insighttechthursdays');
    await screen.findByRole('heading', { name: /#insight/i }, { timeout: 20000 });
  }, 25000);
});
