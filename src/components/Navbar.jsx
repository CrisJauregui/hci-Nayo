import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main">
      <NavLink to="/" className="navbar-brand" aria-label="ALBA home">
        <span className="navbar-logo">ALBA</span>
        <span className="navbar-tagline">Wake consciously</span>
      </NavLink>
    </nav>
  );
}
