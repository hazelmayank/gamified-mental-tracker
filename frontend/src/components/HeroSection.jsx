import React from "react";
import "./HeroSection.css";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Your Mental Wellness, Gamified 🌿</h1>
        <p>
          Level up your mind. Track your habits. Join challenges. 
          Unlock your best self — one journal at a time.
        </p>
        <Link to="/register" className="cta-button">Get Started</Link>
      </div>

      <div className="hero-image">
        <img src="/hero-illustration.svg" alt="MindTrack Illustration" />
      </div>
    </section>
  );
}
