import React from 'react';
import Button from './ui/Button';
import { useTheme } from '../context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  return (
    <Button
      variant="subtle"
      onClick={toggleTheme}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      leftIcon={isLight ? <FaMoon aria-hidden /> : <FaSun aria-hidden />}
    />
  );
}
