import { useEffect, useState } from "react";
import axios from "../axios";
import "./Achievements.css";

export default function Achievements(){

     const [allAchievements, setAllAchievements] = useState([]);
  const [unlocked, setUnlocked] = useState([]);

    useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const [all, unlocked] = await Promise.all([
          axios.get("/achievements"),
          axios.get("/achievements/unlocked")
        ]);
        setAllAchievements(all.data.achievements || []);
        setUnlocked(unlocked.data.achievements.map(a => a._id));
      } catch (err) {
        console.error("Failed to load achievements", err);
      }
    };
    fetchAchievements();
  }, []);

  
  return (
  <div className="achievements-page">
    <h2>🏆 Achievements</h2>
    <div className="achievements-grid">
      {allAchievements.map((ach) => {
        const isUnlocked = unlocked.includes(ach._id);
        return (
          <div key={ach._id} className={`achievement-card ${isUnlocked ? "unlocked" : "locked"}`}>
            {!isUnlocked && <div className="lock-icon">🔒</div>}
            <div className="achievement-name">{ach.name}</div>
            <div className="achievement-description">{ach.description}</div>
            <div className="achievement-condition">
              Condition: {ach.criteria.type} {ach.criteria.condition} {ach.criteria.value}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

}

