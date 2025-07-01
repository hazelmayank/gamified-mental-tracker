import { useEffect, useState } from "react";
import axios from "../axios";
import "./AllChallenges.css";
import { Navigate, useNavigate } from "react-router-dom";

export default function AllChallenges() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    axios.get("/challenges/all")
      .then((res) => setChallenges(res.data.challenges || []))
      .catch((err) => console.error(err));
  }, []);

  const handleJoin = async (id) => {
    try {
      await axios.post(`/challenges/join/${id}`);

      alert("Joined successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Join failed");
    }
  };
const navigate=useNavigate();
  return (
    <div className="challenges-container">
      <h2>Public Challenge Rooms</h2>
       <button onClick={() => navigate("/challenges/create")} className="create-btn">
    ➕ Create New Challenge
  </button>
      <div className="challenge-grid">
        {challenges.map((ch) => (
          <div className="challenge-card" key={ch._id}>
            <h3>{ch.name}</h3>
            <p>{ch.description}</p>
            <p><strong>Created By:</strong> {ch.creator?.username || "Unknown"}</p>
            <button onClick={() => handleJoin(ch._id)}>Join</button>
          </div>
        ))}
      </div>
    </div>
  );
}
