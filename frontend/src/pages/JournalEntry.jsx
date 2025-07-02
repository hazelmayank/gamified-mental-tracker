import React, { useState } from "react";
import api from "../axios";
import "./JournalEntry.css";

const moodOptions = ["Happy", "Sad", "Anxious", "Angry", "Calm", "Motivated"];
const habitOptions = ["Meditation", "Exercise", "Gratitude", "Reading", "Sleep 8+ hrs"];

export default function JournalEntry() {
  const [mood, setMood] = useState("");
  const [journalText, setJournalText] = useState("");
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleHabitchange = (habit) => {
    setHabits((prev) =>
      prev.includes(habit) ? prev.filter((h) => h !== habit) : [...prev, habit]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/entries", {
        mood,
        journalText,
        habits
      });

      alert(res.data.msg || "Entry submitted!");
      setMood("");
      setJournalText("");
      setHabits([]);

      alert("Thanks for reflecting today! You've earned some XP!");
    } catch (err) {
      alert("Error submitting entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="journal-entry-page">
      <h2>Daily Journal Entry</h2>
      <form onSubmit={handleSubmit} className="journal-form">
        <label>Mood</label>
        <select value={mood} onChange={(e) => setMood(e.target.value)} required>
          <option value="">Select your mood</option>
          {moodOptions.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <label>Habits Practiced</label>
        <div className="habits-options">
          {habitOptions.map((habit) => (
            <label key={habit}>
              <input
                type="checkbox"
                checked={habits.includes(habit)}
                onChange={() => handleHabitchange(habit)}
                value={habit}
              />
              {habit}
            </label>
          ))}
        </div>

        <label>Journal</label>
        <textarea
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          placeholder="Reflect your day..."
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Entry"}
        </button>
      </form>
    </div>
  );
}
