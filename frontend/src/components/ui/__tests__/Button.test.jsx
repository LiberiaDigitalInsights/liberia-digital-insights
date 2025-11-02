import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Button from '../Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('disables when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('disables when disabled prop is true', () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant classes', () => {
    const { container } = render(<Button variant="outline">Outlined</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('border');
  });

  it('applies size classes', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('px-5');
  });

  it('renders as custom component when using as prop', () => {
    render(
      <Button as="a" href="/test">
        Link Button
      </Button>,
    );
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
  });

  it('renders with left icon', () => {
    const Icon = () => <span data-testid="icon">🔍</span>;
    render(<Button leftIcon={<Icon />}>Search</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    const Icon = () => <span data-testid="icon">→</span>;
    render(<Button rightIcon={<Icon />}>Next</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
