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
  it('renders Home at /', () => {
    renderAt('/');
    expect(screen.getAllByText(/technology/i).length).toBeGreaterThan(0);
  });

  it('renders Contact at /contact', () => {
    renderAt('/contact');
    expect(screen.getByText(/contact us/i)).toBeInTheDocument();
  });

  it('renders NotFound on unknown route', () => {
    renderAt('/does-not-exist');
    // Page Not Found heading from NotFound.jsx
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
});
