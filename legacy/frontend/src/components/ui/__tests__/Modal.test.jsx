import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Modal from '../Modal';

describe('Modal', () => {
  it('renders when open and closes on close button and backdrop', () => {
    const onClose = vi.fn();

    const { rerender } = render(
      <Modal open title="My Modal" onClose={onClose}>
        <div>Body</div>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('My Modal')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();

    // Close via button
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);

    // Close via backdrop (first child of the dialog container)
    const backdrop = dialog.firstChild;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(2);

    // When not open, it should not render
    rerender(
      <Modal open={false} title="My Modal" onClose={onClose}>
        <div>Body</div>
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
