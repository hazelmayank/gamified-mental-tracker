import React, { useEffect, useState } from "react";
import api from "../axios";
import "./EntriesList.css";

export default function EntriesList() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const res = await api.get("/entries");
      setEntries(res.data.entries || []);
    } catch (err) {
      alert("Failed to fetch entries");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await api.delete(`/entries/${id}`);
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert("Failed to delete entry");
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="entries-page">
      <h2>🗃️ Your Journal Entries</h2>
      {loading ? (
        <p>Loading...</p>
      ) : entries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <div className="entries-list">
          {entries.map((entry) => (
            <div key={entry._id} className="entry-card">
              <div className="entry-header">
                <div className="entry-date">
                  📅 {new Date(entry.date).toDateString()}
                </div>
                <div className="entry-mood">{entry.mood}</div>
              </div>

              {entry.habits.length > 0 && (
                <div className="entry-habits">
                  {entry.habits.map((habit) => (
                    <span key={habit} className="habit-chip">
                      {habit}
                    </span>
                  ))}
                </div>
              )}

              {entry.journalText && (
                <p className="entry-text">📝 {entry.journalText}</p>
              )}

              <button
                onClick={() => handleDelete(entry._id)}
                className="delete-btn"
              >
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
