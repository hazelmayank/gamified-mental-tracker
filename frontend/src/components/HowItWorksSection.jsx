import React from "react";
import "./HowItWorksSection.css";

export default function HowItWorksSection() {
  return (
    <section className="how-it-works-section">
      <h2>🛠️ How It Works</h2>
      <div className="steps">
        <div className="step">
          <span className="step-number">1</span>
          <h3>Create a Journal</h3>
          <p>Reflect daily by logging your mood, thoughts, and habits.</p>
        </div>
        <div className="step">
          <span className="step-number">2</span>
          <h3>Earn XP & Achievements</h3>
          <p>Level up by completing entries, challenges, and unlocking badges.</p>
        </div>
        <div className="step">
          <span className="step-number">3</span>
          <h3>Join the Community</h3>
          <p>Encourage friends, join challenges, and grow together.</p>
        </div>
      </div>

      <div className="cta-box">
        <h3>Ready to build a mindful, happier you?</h3>
        <a href="/register" className="cta-button">🌱 Get Started</a>
      </div>
    </section>
  );
}
