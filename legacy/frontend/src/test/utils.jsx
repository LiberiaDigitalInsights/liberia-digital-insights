import React from 'react';
import { render } from '@testing-library/react';
import Providers from './Providers';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../context/ToastContext';
import ToastViewport from '../components/ui/Toast';

export function renderWithProviders(ui, options) {
  return render(ui, { wrapper: Providers, ...options });
}

export function renderWithContext(ui, options) {
  return render(ui, {
    wrapper: ({ children }) => (
      <HelmetProvider>
        <ThemeProvider>
          <ToastProvider>
            {children}
            <ToastViewport />
          </ToastProvider>
        </ThemeProvider>
      </HelmetProvider>
    ),
    ...options,
  });
}

export { screen, fireEvent, waitFor, act } from '@testing-library/react';
