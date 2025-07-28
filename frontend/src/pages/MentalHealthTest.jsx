import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../axios";
import { useToast } from "../context/ToastContext";
import "./MentalHealthTest.css";

const questions = [
  {
    id: 1,
    question: "How are you feeling today?",
    options: ["Very Good", "Good", "Neutral", "Bad", "Very Bad"],
  },
  {
    id: 2,
    question: "How well did you sleep last night?",
    options: ["Very Well", "Well", "Okay", "Poorly", "Very Poorly"],
  },
  {
    id: 3,
    question: "How often have you felt anxious recently?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
  {
    id: 4,
    question: "Do you feel socially connected?",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
  },
  {
    id: 5,
    question: "How motivated have you felt lately?",
    options: [
      "Very Motivated",
      "Motivated",
      "Neutral",
      "Unmotivated",
      "Very Unmotivated",
    ],
  },
];

export default function MentalHealthTest() {
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [xpGained, setXpGained] = useState(0);
  const [bonusXP, setBonusXP] = useState(0);
  const [coins, setCoins] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);

  const { showToast } = useToast();
  const currentQuestion = questions[currentIndex];

  const handleSelect = (index) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: index }));

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 300);
  };

  const calculateScore = () => {
    const total = Object.values(answers).reduce(
      (sum, val) => sum + (4 - val) * 25,
      0
    );
    return Math.round(total / questions.length);
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      setError("Please answer all the questions.");
      return;
    }

    setLoading(true);
    setError("");

    const wellnessScore = calculateScore();
    setScore(wellnessScore);
    setSubmitted(true);

    if (wellnessScore >= 80) setFeedback("You're doing great! Keep it up!");
    else if (wellnessScore >= 50) setFeedback("You're doing okay. Take care!");
    else setFeedback("It might be a tough time. You're not alone.");

    try {
      const res = await api.post("/user/submit-test", { score: wellnessScore });

      setXpGained(res.data.xpGained || 0);
      setBonusXP(res.data.bonusXP || 0);
      setCoins(res.data.coinsEarned || 0);
      setLeveledUp(res.data.leveledUp || false);
      setNewLevel(res.data.newLevel || 0);

      showToast("✅ Test submitted successfully!", "success");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || "Submission failed.";
      showToast(`❌ ${msg}`, "error");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mental-health-test">
      <h2>🧠 Daily Mental Wellness Test</h2>

      {!submitted && (
        <>
          <div className="progress">
            Question {currentIndex + 1} of {questions.length}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="question-block"
            >
              <p>{currentQuestion.question}</p>
              <div className="options">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`option-btn ${
                      answers[currentQuestion.id] === i ? "selected" : ""
                    }`}
                    onClick={() => handleSelect(i)}
                    disabled={loading}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {currentIndex === questions.length - 1 && (
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Test"}
            </button>
          )}

          {error && <p className="error">{error}</p>}
        </>
      )}

      {submitted && (
        <motion.div
          className="result"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Your Wellness Score: {score}/100</h3>
          <p>{feedback}</p>
          <p className="pet-message">🐾 Your companion is proud of you!</p>
          <div className="rewards">
            <p>✨ XP Gained: <strong>+{xpGained}</strong></p>
            {bonusXP > 0 && <p>🐾 Pet Bonus XP: <strong>+{bonusXP}</strong></p>}
            <p>🪙 Coins Earned: <strong>+{coins}</strong></p>
            {leveledUp && (
              <p className="level-up">🎉 You leveled up! New Level: {newLevel}</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
