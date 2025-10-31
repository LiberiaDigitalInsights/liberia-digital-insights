import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="flex justify-around p-4 md:p-6 bg-amber-950 text-white">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/components">Components</Link>
    </nav>
  );
}

export default Navbar;
