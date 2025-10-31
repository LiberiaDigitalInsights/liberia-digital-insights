import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 md:p-6 border-b border-[var(--color-border)]">
      <div className="flex gap-6">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/components">Components</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
      <ThemeToggle />
    </nav>
  );
}

export default Navbar;
