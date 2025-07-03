import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>CognifyWell 🧠</h3>
        <p>A gamified mental health tracker for your daily growth journey.</p>

        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/register">Get Started</a>
          <a href="/login">Login</a>
        </div>

        <p className="footer-copy">&copy; {new Date().getFullYear()} CognifyWell. All rights reserved.</p>
      </div>
    </footer>
  );
}
