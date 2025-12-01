import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../../context/ThemeContext';
import { ToastProvider } from '../../context/ToastContext';
import App from '../../App';

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

describe('Training & Courses routes', () => {
  it('renders hub at /training-courses', async () => {
    renderAt('/training-courses');
    await screen.findByRole('heading', { name: /training & courses/i }, { timeout: 5000 });
    await screen.findByRole('heading', { name: /upcoming training/i });
    await screen.findByRole('heading', { name: /upcoming courses/i });
  });

  it('renders training detail', async () => {
    renderAt('/training/1');
    // Title from mock training item 1
    await screen.findByRole('heading', { name: /full-stack web development bootcamp/i });
    // Register CTA should be present
    const register = await screen.findByRole('link', { name: /^register$/i }, { timeout: 10000 });
    expect(register).toBeInTheDocument();
  }, 20000);

  it('renders course detail', async () => {
    renderAt('/course/1');
    await screen.findByRole('heading', { name: /foundations of cybersecurity/i });
    const register = await screen.findByRole('link', { name: /^register$/i }, { timeout: 10000 });
    expect(register).toBeInTheDocument();
  }, 20000);

  it('renders register page with type/id context', async () => {
    renderAt('/register?type=training&id=1');
    await screen.findByRole('heading', { name: /registration/i }, { timeout: 10000 });
    const context = await screen.findByText(/you are registering for:/i);
    expect(context).toHaveTextContent(/you are registering for:\s*training\s*#1/i);
  });
});
