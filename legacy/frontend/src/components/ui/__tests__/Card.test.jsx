import { render, screen } from '@testing-library/react';
import React from 'react';
import Card from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>,
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-card" />);
    expect(container.firstChild).toHaveClass('custom-card');
  });

  it('passes through props', () => {
    const { container } = render(<Card data-testid="card" />);
    expect(container.firstChild).toHaveAttribute('data-testid', 'card');
  });
});
