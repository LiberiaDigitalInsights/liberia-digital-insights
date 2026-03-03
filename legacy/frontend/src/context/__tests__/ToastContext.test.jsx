import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';
import { ToastProvider, useToast } from '../ToastContext';
import ToastViewport from '../../components/ui/Toast';

const TestComponent = () => {
  const { showToast } = useToast();
  return (
    <div>
      <button onClick={() => showToast({ title: 'Test', description: 'Message', duration: 10 })}>
        Show Toast
      </button>
    </div>
  );
};

describe('ToastContext', () => {
  it('provides toast context', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <TestComponent />
      </ToastProvider>,
    );
    expect(screen.getByText('Show Toast')).toBeInTheDocument();
  });

  it('shows toast when showToast is called', async () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <TestComponent />
      </ToastProvider>,
    );

    const button = screen.getByText('Show Toast');
    fireEvent.click(button);

    await waitFor(
      () => {
        expect(screen.getByText('Test')).toBeInTheDocument();
        expect(screen.getByText('Message')).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it('removes toast after duration', async () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <ToastViewport />
        <TestComponent />
      </ToastProvider>,
    );

    const button = screen.getByText('Show Toast');
    fireEvent.click(button);

    // Verify toast is visible
    expect(screen.getByText('Test')).toBeInTheDocument();

    // Fast-forward time to trigger toast removal (3500ms duration)
    act(() => {
      vi.advanceTimersByTime(3600); // Slightly more than duration
    });

    // Flush microtasks and re-render cycle
    await act(async () => {
      await Promise.resolve();
    });

    // Verify toast is removed without relying on waitFor timers
    expect(screen.queryByText('Test')).not.toBeInTheDocument();

    vi.useRealTimers();
  }, 10000);
});
