import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "../axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [quests, setQuests] = useState([]);

  // Fetch user + quests
  useEffect(() => {
    async function fetchUserAndQuests() {
      try {
        const [userRes, questRes] = await Promise.all([
          axios.get("/user/me"),
          axios.get("/user/daily-quests"),
        ]);

        setUser(userRes.data.user);
        setQuests(questRes.data.quests);
      } catch (err) {
        console.log("Error loading user or quests", err);
      }
    }

    fetchUserAndQuests();
  }, []);

  const handleQuestToggle = async (questText) => {
    try {
      const res = await axios.post("/user/complete-quest", { questText });

      setQuests((prev) =>
        prev.map((q) => (q.text === questText ? { ...q, completed: true } : q))
      );

      // Update user XP locally
      setUser((prev) => ({
        ...prev,
        xp: res.data.newXP,
        streak: res.data.newStreak,
      }));
    } catch (err) {
      console.error("Quest completion failed:", err.response?.data?.error);
    }
  };

  if (!user) return <p>Loading dashboard...</p>;

  const levelBaseXp = (level) => Math.pow((level - 1) / 0.1, 2);
  const nextLevelXP = levelBaseXp(user.level + 1);
  const currentLevelXP = levelBaseXp(user.level);
  const xpProgressPercent =
    ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="dashboard-container">
      <div className="stats-hud">
        <span>⭐ {user.xp} XP</span>
        <span>🪙 {user.coins || 0} Coins</span>
      </div>

      <div className="dashboard-header">
        <div className="avatar-section">
          <img
            src={`/assets/avatars/${slugify(user?.avatar || "default")}.png`}
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop
              e.target.src = "/default.png"; // Fallback to public/default.png
            }}
            alt="User Avatar"
            className="avatar"
          />

          <div>
            <h2>Welcome back, {user.username} 👋</h2>
            <p>
              Level {user.level} • {user.xp} XP
            </p>

            <div className="xp-bar-tooltip-wrapper">
              <div className="xp-bar">
                <motion.div
                  className="xp-fill"
                  animate={{
                    width: `${xpProgressPercent}%`,
                    boxShadow: "0 0 10px #00bcd4",
                  }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <span className="xp-tooltip">
                Earn XP by journaling, completing quests, and joining
                challenges!
              </span>
            </div>

            <p className="xp-text">
              {Math.floor(user.xp - currentLevelXP)} XP /{" "}
              {Math.floor(nextLevelXP - currentLevelXP)} XP
            </p>

            <div className="streak-tooltip-wrapper">
              <div className="streak-badge">
                🔥 {user.streak || 0}-Day Streak
              </div>
              <span className="streak-tooltip">
                Maintain your streak by completing daily-quests everyday!
              </span>
            </div>
          </div>
        </div>

        {user.equippedPet && (
          <div className="pet-display">
            <img
              src={`/assets/pets/${slugify(user.equippedPet)}.png`}
              alt={user.equippedPet}
              className="pet-in-card"
            />
            <p>{user.equippedPet}</p>
          </div>
        )}
      </div>

      <div className="section">
        <h3>🎯 Quick Actions</h3>
        
<div className="quick-links">
  <Link to="/journal" className="card">📔 New Journal</Link>
  <Link to="/today-entry" className="card">🗓️ Today’s Entry</Link>
  <Link to="/journal-stats" className="card">📈 Entry Stats</Link>
  <Link to="/entries" className="card">🧾 All Entries</Link>
  <Link to="/my-challenges" className="card">🔥 My Challenge</Link>
  <Link to="/challenges" className="card">🌟 Join Challenge</Link>
  <Link to="/mental-health-test" className="card">🧠 Mental Health Test</Link>
  <Link to="/leaderboard" className="card">🏆 Leaderboard</Link>
  <Link to="/store" className="card">🛍️ Store</Link>
  <Link to="/friends" className="card">🫂 Friends</Link>
  <Link to="/tranquil_zone" className="card">🧘‍♂️ Tranquil Zone</Link>
</div>

        
      </div>

      <div className="section">
        <h3>🧠 Daily Quests</h3>
        <ul className="daily-quests">
          {quests.map((quest) => (
            <li
              key={quest.text}
              className={quest.completed ? "completed" : ""}
              onClick={() => !quest.completed && handleQuestToggle(quest.text)}
            >
              <input type="checkbox" checked={quest.completed} readOnly />
              {quest.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
