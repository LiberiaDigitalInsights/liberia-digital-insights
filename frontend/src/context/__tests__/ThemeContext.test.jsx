import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, useTheme } from '../ThemeContext';
import Button from '../../components/ui/Button';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('ThemeContext', () => {
  it('provides theme context', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toBeInTheDocument();
  });

  it('defaults to dark theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('toggles theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    const themeDisplay = screen.getByTestId('theme');
    const toggleButton = screen.getByText('Toggle');

    expect(themeDisplay).toHaveTextContent('dark');
    fireEvent.click(toggleButton);
    expect(themeDisplay).toHaveTextContent('light');
    fireEvent.click(toggleButton);
    expect(themeDisplay).toHaveTextContent('dark');
  });

  it('persists theme in localStorage', () => {
    localStorage.setItem('theme', 'light');
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });
});
