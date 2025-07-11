import { useEffect, useState } from "react";
import axios from "../axios";
import "./Achievements.css";
// import "../styles/OceanTheme.css"; // Optional: if you separate common ocean styles

export default function Achievements() {
  const [allAchievements, setAllAchievements] = useState([]);
  const [unlocked, setUnlocked] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const [all, unlocked] = await Promise.all([
          axios.get("/achievements"),
          axios.get("/achievements/unlocked"),
        ]);
        setAllAchievements(all.data.achievements || []);
        setUnlocked(unlocked.data.achievements.map((a) => a._id));
      } catch (err) {
        console.error("Failed to load achievements", err);
      }
    };
    fetchAchievements();
  }, []);

  return (
    <div className="ocean-wrapper">
      {/* Bubbles */}
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      <div className="bubble bubble-4"></div>
      <div className="bubble bubble-5"></div>

      {/* Fish */}
      <img
        src="/assets/ocean/fish1.svg"
        className="fish fish-1"
        alt="fish"
        onError={(e) => (e.target.style.display = "none")}
      />
      <img
        src="/assets/ocean/fish2.svg"
        className="fish fish-2"
        alt="jellyfish"
        onError={(e) => (e.target.style.display = "none")}
      />

      {/* Page Content */}
      <div className="achievements-page">
        <h1>🏆 Oceanic Achievements</h1>
        <div className="achievements-grid">
          {allAchievements.map((ach) => {
            const isUnlocked = unlocked.includes(ach._id);
            return (
              <div
                key={ach._id}
                className={`achievement-card ${isUnlocked ? "unlocked" : "locked"}`}
              >
                {!isUnlocked && <div className="locked-overlay">🔒</div>}
                <h3 className="achievement-name">🐚 {ach.name}</h3>
                <p className="achievement-description">{ach.description}</p>
                <div className="criteria">
                  Condition: {ach.criteria.type} {ach.criteria.condition}{" "}
                  {ach.criteria.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
