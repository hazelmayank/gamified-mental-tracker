import React, { useState } from "react";
import api from "../axios";
import "./JournalEntry.css";
import { useToast } from "../context/ToastContext"; // ✅ Import toast

const moodOptions = ["Happy", "Sad", "Anxious", "Angry", "Calm", "Motivated"];
const habitOptions = ["Meditation", "Exercise", "Gratitude", "Reading", "Sleep 8+ hrs"];

export default function JournalEntry() {
  const [mood, setMood] = useState("");
  const [journalText, setJournalText] = useState("");
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast(); // ✅ Get toast method

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

      const isUpdate = res.data.msg === "Entry updated";

      if (isUpdate) {
        showToast("📝 Today's entry has been updated!", "info");
      } else {
        showToast(`✅ Entry created! +${res.data.xpEarned} XP earned!`, "success");

        if (res.data.bonusXP) {
          showToast(`🐾 Pet Bonus! +${res.data.bonusXP} XP`, "info");
        }

        if (res.data.leveledUp) {
          showToast(`🎉 Level Up! You're now Level ${res.data.newLevel}!`, "success");
        }

        const res2 = await api.post("/achievements/unlock");
    if (res2.data.unlocked?.length > 0) {
  res2.data.unlocked.forEach(name =>
    showToast(`🏅 New Achievement Unlocked: ${name}`, "success")
  );
        }

      }



      // Clear form
      setMood("");
      setJournalText("");
      setHabits([]);

    } catch (err) {
      // console.log("Error is " ,err);
      showToast("❌ Error submitting entry", "error");
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
