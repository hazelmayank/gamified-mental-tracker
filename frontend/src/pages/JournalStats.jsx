import React, { useEffect, useState } from "react";
import api from "../axios";
import "./JournalStats.css";

export default function JournalStats() {
  const [moodTrends, setMoodTrends] = useState({});
  const [habitTrends, setHabitTrends] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/entries/stats");
        setMoodTrends(res.data.moodTrends || {});
        setHabitTrends(res.data.habitTrends || {});
      } catch (err) {
        alert("Failed to load stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const renderBar = (count) => (
    <div className="stat-bar" style={{ width: `${count * 12}px` }}></div>
  );

  if (loading) return <div className="journal-stats-page">Loading...</div>;

  return (
    <div className="journal-stats-page">
      <h2 className="trend-title">📊 Your Journal Trends</h2>

      <div className="trend-section">
        <h3 className="trend-subtitle">😄 Mood Trends</h3>
        {Object.keys(moodTrends).length === 0 ? (
          <p>No mood data yet.</p>
        ) : (
          <div className="trend-list">
            {Object.entries(moodTrends).map(([mood, count]) => (
              <div className="stat-row" key={mood}>
                <span className="stat-label">{mood}</span>
                {renderBar(count)}
                <span className="stat-count">({count})</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="trend-section">
        <h3 className="trend-subtitle">💪 Habit Trends</h3>
        {Object.keys(habitTrends).length === 0 ? (
          <p>No habit data yet.</p>
        ) : (
          <div className="trend-list">
            {Object.entries(habitTrends).map(([habit, count]) => (
              <div className="stat-row" key={habit}>
                <span className="stat-label">{habit}</span>
                {renderBar(count)}
                <span className="stat-count">({count})</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
