import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/" className="logo-link" onClick={closeMenu}>
          CognifyWell
        </Link>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <ul className={`navbar__links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
        <li><Link to="/achievements" onClick={closeMenu}>Achievements</Link></li>
        <li><Link to="/store" onClick={closeMenu}>Store</Link></li>
        <li><Link to="/friends" onClick={closeMenu}>Friends</Link></li>
        <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
        <li><Link to="/register" onClick={closeMenu}>Register</Link></li>
        <li><Link to="/mypets" onClick={closeMenu}>Pets</Link></li>
        <li><Link to="/logout" onClick={closeMenu}>Logout</Link></li>
      </ul>
    </nav>
  );
}
