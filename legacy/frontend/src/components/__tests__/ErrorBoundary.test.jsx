import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ErrorBoundary } from '../ErrorBoundary';

function Good() {
  return <div>Good Component</div>;
}

function Bad() {
  throw new Error('Boom');
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <Good />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Good Component')).toBeInTheDocument();
  });

  it('renders fallback UI when a child throws', () => {
    // Prevent console.error noise from React error boundary during test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Bad />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(
      screen.getByText(/please try refreshing the page or return to the home/i),
    ).toBeInTheDocument();

    spy.mockRestore();
  });
});
