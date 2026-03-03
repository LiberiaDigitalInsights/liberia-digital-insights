import React from 'react';
import { renderWithProviders, screen, fireEvent, waitFor } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import Navbar from '../Navbar';

describe('Navbar dropdown accessibility', () => {
  function setup() {
    renderWithProviders(<Navbar />);
    const contentTrigger = screen.getByRole('button', { name: /content/i });
    // Create a guaranteed outside element to click
    const outside = document.createElement('div');
    outside.setAttribute('data-testid', 'outside');
    document.body.appendChild(outside);
    return { contentTrigger, outside };
  }

  it('toggles aria-expanded on click and shows menu', async () => {
    const { contentTrigger } = setup();

    // Initially collapsed
    expect(contentTrigger).toHaveAttribute('aria-expanded', 'false');

    // Open
    await userEvent.click(contentTrigger);
    expect(contentTrigger).toHaveAttribute('aria-expanded', 'true');
    const menu = document.getElementById('content-menu');
    expect(menu).toBeTruthy();
    expect(menu.className).toMatch(/visible/);

    // Close
    await userEvent.click(contentTrigger);
    expect(contentTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens with Enter/Space and closes with Escape, restoring focus', async () => {
    const { contentTrigger } = setup();

    // Open via Enter
    contentTrigger.focus();
    fireEvent.keyDown(contentTrigger, { key: 'Enter' });
    expect(contentTrigger).toHaveAttribute('aria-expanded', 'true');

    // Escape closes and restores focus
    fireEvent.keyDown(contentTrigger, { key: 'Escape' });
    expect(contentTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(contentTrigger).toHaveFocus();
  });

  it('closes when clicking outside', async () => {
    const { contentTrigger, outside } = setup();

    await userEvent.click(contentTrigger);
    expect(contentTrigger).toHaveAttribute('aria-expanded', 'true');

    // Click outside (Navbar listens on mousedown)
    fireEvent.mouseDown(outside);
    await userEvent.click(outside);
    // wait for state update
    await waitFor(() => expect(contentTrigger).toHaveAttribute('aria-expanded', 'false'));
  });
});
