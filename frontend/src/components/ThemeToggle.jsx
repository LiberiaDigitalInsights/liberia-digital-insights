import React from 'react';
import Button from './ui/Button';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  return (
    <Button variant="subtle" onClick={toggleTheme} aria-label="Toggle theme">
      {isLight ? 'Dark' : 'Light'} mode
    </Button>
  );
}
