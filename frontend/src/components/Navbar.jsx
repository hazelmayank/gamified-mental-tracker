import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/" className="logo-link">MindTrack</Link>
      </div>
      <ul className="navbar__links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/achievements">Achievements</Link></li>
        <li><Link to="/store">Store</Link></li>
        <li><Link to="/friends">Friends</Link></li>
        <li><Link to="/">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
    </nav>
  );
}
