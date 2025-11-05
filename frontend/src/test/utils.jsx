import React from 'react';
import { render } from '@testing-library/react';
import Providers from './Providers';

export function renderWithProviders(ui, options) {
  return render(ui, { wrapper: Providers, ...options });
}

export { screen, fireEvent, waitFor, act } from '@testing-library/react';
