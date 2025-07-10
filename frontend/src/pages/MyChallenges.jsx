import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import "./MyChallenges.css";

export default function MyChallenges() {
  
  const [challenges, setChallenges] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/challenges/my")
      .then((res) => setChallenges(res.data.challenges || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="my-challenges-container">
      <h2>My Challenges</h2>
      <div className="my-challenges-grid">
        {challenges.map((ch) => (
          <div className="my-challenge-card" key={ch._id}>
            <h3>{ch.name}</h3>
            <span className={ch.isPrivate ? "badge private" : "badge public"}>
              {ch.isPrivate ? "Private" : "Public"}
            </span>
            <p>👥 Participants: {ch.participants.length}</p>
            <button onClick={() => navigate(`/challenge/${ch._id}`)}>
              Enter Room
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
