import { render, screen } from '@testing-library/react';
import React from 'react';
import Badge from '../Badge';

describe('Badge', () => {
  it('renders badge text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(<Badge variant="subtle">Subtle</Badge>);
    expect(container.firstChild).toHaveClass(
      'bg-[color-mix(in_oklab,var(--color-surface),white_8%)]',
    );
  });

  it('applies default variant when none specified', () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstChild).toHaveClass(
      'bg-[color-mix(in_oklab,var(--color-surface),white_8%)]',
    );
  });

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom-badge">Custom</Badge>);
    expect(container.firstChild).toHaveClass('custom-badge');
  });
});
