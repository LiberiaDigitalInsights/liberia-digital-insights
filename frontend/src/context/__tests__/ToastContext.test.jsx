import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import { ToastProvider, useToast } from '../ToastContext';
import ToastViewport from '../../components/ui/Toast';

const TestComponent = () => {
  const { showToast } = useToast();
  return (
    <div>
      <button onClick={() => showToast({ title: 'Test', description: 'Message' })}>
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

    // Wait for toast to appear
    await waitFor(
      () => {
        expect(screen.getByText('Test')).toBeInTheDocument();
      },
      { timeout: 1000 },
    );

    // Verify toast is visible
    expect(screen.getByText('Test')).toBeInTheDocument();

    // Fast-forward time to trigger toast removal (3500ms duration)
    act(() => {
      vi.advanceTimersByTime(3600); // Slightly more than duration
    });

    // Process all pending async work
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Verify toast is removed
    // Note: The setTimeout in ToastContext should have triggered removeToast
    const toastAfterTimeout = screen.queryByText('Test');
    expect(toastAfterTimeout).not.toBeInTheDocument();

    vi.useRealTimers();
  }, 10000);
});
