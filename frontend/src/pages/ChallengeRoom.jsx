import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../axios";
import "./ChallengeRoom.css";

export default function ChallengeRoom() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [showXP, setShowXP] = useState(false);

  useEffect(() => {
    axios
      .get(`/challenges/${id}`)
      .then((res) => setChallenge(res.data.challenge))
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.elements.submission.value;
    if (!text) return alert("Please write something");

    try {
      await axios.post(`/challenges/submit/${id}`, { text });

      // XP animation
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1500);

      // Optionally: add new submission to local state immediately
      setChallenge((prev) => ({
        ...prev,
        submissions: [
          ...prev.submissions,
          {
            text,
            submittedAt: new Date(),
            user: { username: "You" } // or use actual logged-in username
          },
        ],
      }));

      e.target.reset();
    } catch (err) {
      alert("Submission failed");
    }
  };

  if (!challenge) return <p>Loading...</p>;

  return (
    <div className="challenge-room">
      <h2>{challenge.name}</h2>
      <p>{challenge.description}</p>
      <p><strong>Created by:</strong> {challenge.creator?.username || "Unknown"}</p>
      <p><strong>Participants:</strong> {challenge.participants.length}</p>

      <form onSubmit={handleSubmit}>
        <textarea name="submission" rows="4" placeholder="Write your progress..."></textarea>
        <button type="submit">Submit Progress</button>

        {showXP && <div className="xp-popup">+10 XP 🧠</div>}
      </form>

      {challenge.submissions.length > 0 && (
        <div className="submissions-section">
          <h3>Community Progress</h3>
          <ul>
            {challenge.submissions.map((sub, index) => (
              <li key={index}>
                <p><strong>{sub.user?.username || "Anonymous"}</strong>:</p>
                <p>{sub.text}</p>
                <p className="submitted-at">{new Date(sub.submittedAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
