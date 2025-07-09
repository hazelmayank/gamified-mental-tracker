import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../axios";
import "./ChallengeRoom.css";
import { useToast } from "../context/ToastContext"; 

export default function ChallengeRoom() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [lastXPGained, setLastXPGained] = useState(0);

  const [showXP, setShowXP] = useState(false);
  const { showToast } = useToast(); 

  useEffect(() => {
    axios
      .get(`/challenges/${id}`)
      .then((res) => setChallenge(res.data.challenge))
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.elements.submission.value;
    if (!text) return showToast("Please write something", "info");

    try {
      const res = await axios.post(`/challenges/submit/${id}`, { text });
      const { xpGained = 10, bonusXP = 0, newLevel, leveledUp } = res.data;

      const baseXP = xpGained - bonusXP;

      showToast(
        `Challenge Submitted! +${xpGained} XP (${baseXP} base + ${bonusXP} bonus 🐾)`,
        "success"
      );

      if (leveledUp) {
        showToast(`🎉 Level Up! You're now Level ${newLevel}!`, "success");
      }

      const res2 = await axios.post("/achievements/unlock");
        if (res2.data.unlocked?.length > 0) {
      res2.data.unlocked.forEach(name =>
    showToast(`🏅 New Achievement Unlocked: ${name}`, "success")
  );
}

      setLastXPGained(xpGained);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1500);

      setChallenge((prev) => ({
        ...prev,
        submissions: [
          ...prev.submissions,
          {
            text,
            submittedAt: new Date(),
            user: { username: "You" },
          },
        ],
      }));

      e.target.reset();
    } catch (err) {
      const msg = err?.response?.data?.msg || "Submission failed";
      showToast(msg, "error");
    }
  };

  if (!challenge) return <p>Loading...</p>;

  return (
    <div className="challenge-room">
      <h2>{challenge.name}</h2>
      <p>{challenge.description}</p>
      <p>
        <strong>Created by:</strong>{" "}
        {challenge.creator?.username || "Unknown"}
      </p>
      <p>
        <strong>Participants:</strong> {challenge.participants.length}
      </p>

      <form onSubmit={handleSubmit}>
        <textarea
          name="submission"
          rows="4"
          placeholder="Write your progress..."
        ></textarea>
        <button type="submit">Submit Progress</button>
        {showXP && <div className="xp-popup">+{lastXPGained} XP 🧠</div>}


      </form>

      {challenge.submissions.length > 0 && (
        <div className="submissions-section">
          <h3>Community Progress</h3>
          <ul>
            {challenge.submissions.map((sub, index) => (
              <li key={index}>
                <p>
                  <strong>{sub.user?.username || "Anonymous"}</strong>:
                </p>
                <p>{sub.text}</p>
                <p className="submitted-at">
                  {new Date(sub.submittedAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
