import React from "react";
import "./FeaturesSection.css";

const features = [
  {
    icon: "🧠",
    title: "Guided Journaling",
    description: "Daily prompts and mood tracking to help you reflect and grow.",
  },
  {
    icon: "🔥",
    title: "Challenge Rooms",
    description: "Join public or private wellness challenges with friends.",
  },
  {
    icon: "📈",
    title: "Progress Dashboard",
    description: "View stats, streaks, XP level, and trends over time.",
  },
  {
    icon: "🏅",
    title: "Achievements",
    description: "Unlock badges for habits, streaks, and gratitude practice.",
  },
  {
    icon: "🛍️",
    title: "Customization & Rewards",
    description: "Use XP to unlock avatar upgrades, app themes, or pets.",
  },
  {
    icon: "🤝",
    title: "Community",
    description: "Send friend requests, support each other, and grow together.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="features-section">
      <h2>✨ Features That Empower You</h2>
      <div className="features-grid">
        {features.map((feat, idx) => (
          <div className="feature-card" key={idx}>
            <div className="feature-icon">{feat.icon}</div>
            <h3>{feat.title}</h3>
            <p>{feat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
