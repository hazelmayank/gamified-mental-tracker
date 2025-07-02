import React, { useEffect, useState } from "react";
import api from "../axios";
import "./TodayEntry.css";

export default function TodayEntry() {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      setLoading(true);
      try {
        const res = await api.get("/entries/today");
        setEntry(res.data.entry);
        setNotFound(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setNotFound(true);
        } else {
          alert("Failed to fetch today's entry.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, []);

  if (loading) {
    return <div className="today-entry-page">Loading...</div>;
  }

  if (notFound) {
    return (
      <div className="today-entry-page">
        <h2>📝 Today's Journal</h2>
        <p className="empty-msg">You haven’t submitted an entry today.</p>
      </div>
    );
  }

  if (!entry) return null;

  return (
    <div className="today-entry-page">
      <h2>📝 Today's Journal</h2>
      <div className="entry-card">
        <p><strong>🧠 Mood:</strong> {entry.mood}</p>
        <p><strong>📓 Journal:</strong> {entry.journalText || "Not written"}</p>
        <div>
          <strong>🏁 Habits:</strong>
          <ul>
            {entry.habits && entry.habits.length > 0 ? (
              entry.habits.map((habit, idx) => <li key={idx}>✅ {habit}</li>)
            ) : (
              <li>No habits logged</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
