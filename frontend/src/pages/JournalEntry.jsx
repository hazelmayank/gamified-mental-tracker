import React, { useState, useEffect } from "react";
import api from "../axios";
import "./JournalEntry.css";
import { useToast } from "../context/ToastContext";

const moodOptions = [
  { label: "Happy", emoji: "😊" },
  { label: "Sad", emoji: "😢" },
  { label: "Anxious", emoji: "😰" },
  { label: "Angry", emoji: "😡" },
  { label: "Calm", emoji: "😌" },
  { label: "Motivated", emoji: "💪" },
];

const moodThemes = {
  Happy: { bg: "#fff8dc", border: "#ffeb3b" },
  Sad: { bg: "#e3f2fd", border: "#2196f3" },
  Angry: { bg: "#ffebee", border: "#f44336" },
  Calm: { bg: "#e0f2f1", border: "#26a69a" },
  Motivated: { bg: "#f1f8e9", border: "#8bc34a" },
  Anxious: { bg: "#ede7f6", border: "#673ab7" },
};

const habitOptions = [
  "Meditation",
  "Exercise",
  "Gratitude",
  "Reading",
  "Sleep 8+ hrs",
];

export default function JournalEntry() {
  const [mood, setMood] = useState("");
  const [journalText, setJournalText] = useState("");
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [quote, setQuote] = useState("");
  const [user, setUser] = useState(null);
  const [coinAnimation, setCoinAnimation] = useState(null);
  const { showToast } = useToast();

  // Random quote for motivation
  useEffect(() => {
    const quotes = [
      "Progress, not perfection.",
      "Small steps make big changes.",
      "You're doing better than you think.",
      "Every entry is a win!",
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // Restore draft
  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem("journal-draft"));
    if (draft) {
      setMood(draft.mood || "");
      setJournalText(draft.journalText || "");
      setHabits(draft.habits || []);
    }
  }, []);

  // Save draft to localStorage
  useEffect(() => {
    localStorage.setItem(
      "journal-draft",
      JSON.stringify({ mood, journalText, habits })
    );
  }, [mood, journalText, habits]);

  const handleHabitchange = (habit) => {
    setHabits((prev) =>
      prev.includes(habit) ? prev.filter((h) => h !== habit) : [...prev, habit]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/entries", { mood, journalText, habits });
      const isUpdate = res.data.msg === "Entry updated";
      setUser(res.data.user);

      if (isUpdate) {
        showToast("📝 Today's entry updated!", "info");
      } else {
        showToast(`✅ Entry created! +${res.data.xpEarned || 0} XP`, "success");

        if (res.data.coinsEarned) {
          showToast(`🪙 You earned +${res.data.coinsEarned} coins!`, "success");
          setCoinAnimation(`+${res.data.coinsEarned} Coins!`);
          setTimeout(() => setCoinAnimation(null), 2000);
        }

        if (res.data.bonusXP) {
          showToast(`🐾 Pet Bonus! +${res.data.bonusXP} XP`, "info");
        }

        if (res.data.leveledUp) {
          showToast(`🎉 Level Up! You're now Level ${res.data.newLevel}!`, "success");
        }

        const res2 = await api.post("/achievements/unlock");
        if (res2.data.unlocked?.length > 0) {
          res2.data.unlocked.forEach((name) =>
            showToast(`🏅 Achievement Unlocked: ${name}`, "success")
          );
        }
      }

      // Clear form
      setMood("");
      setJournalText("");
      setHabits([]);
      setWordCount(0);
      localStorage.removeItem("journal-draft");
    } catch (err) {
      showToast("❌ Error submitting entry", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="journal-entry-page"
      style={{
        backgroundColor: moodThemes[mood]?.bg || "#fff",
        borderLeft: `6px solid ${moodThemes[mood]?.border || "#ccc"}`,
        transition: "all 0.3s ease",
      }}
    >
      <h2>🧠 Daily Journal Entry</h2>
      <p className="quote">✨ {quote}</p>

      {user && (
        <p className="streak-badge">🔥 {user.journalStreak}-Day Streak</p>
      )}

      {coinAnimation && (
        <div className="coin-badge-animation">{coinAnimation}</div>
      )}

      <form onSubmit={handleSubmit} className="journal-form">
        <label>Mood</label>
        <div className="mood-options">
          {moodOptions.map((m) => (
            <button
              key={m.label}
              type="button"
              className={`mood-btn ${mood === m.label ? "selected" : ""}`}
              onClick={() => setMood(m.label)}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>

        <label>Habits Practiced</label>
        <div className="habits-options">
          {habitOptions.map((habit) => (
            <button
              type="button"
              key={habit}
              className={`habit-chip ${habits.includes(habit) ? "active" : ""}`}
              onClick={() => handleHabitchange(habit)}
            >
              {habit}
            </button>
          ))}
        </div>

        <label>Journal</label>
        <textarea
          value={journalText}
          onChange={(e) => {
            setJournalText(e.target.value);
            setWordCount(e.target.value.trim().split(/\s+/).length);
          }}
          placeholder="Reflect on your day, your thoughts, anything you’d like..."
        />
        <p className="word-count">{wordCount} words</p>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "📝 Submit Entry"}
        </button>
      </form>
    </div>
  );
}
