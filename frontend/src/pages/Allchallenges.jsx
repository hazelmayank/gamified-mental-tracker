import { useEffect, useState } from "react";
import axios from "../axios";
import "./Allchallenges.css";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext"; // ✅ Import toast hook

export default function AllChallenges() {
  const [challenges, setChallenges] = useState([]);
  const navigate = useNavigate();
  const { showToast } = useToast(); // ✅ Destructure showToast from context

  useEffect(() => {
    axios.get("/challenges/all")
      .then((res) => setChallenges(res.data.challenges || []))
      .catch((err) => {
        console.error(err);
        showToast("Failed to load challenges", "error"); // ✅ Show error toast
      });
  }, []);

  const handleJoin = async (id) => {
    try {
      await axios.post(`/challenges/join/${id}`);
      showToast("🎉 Joined successfully!", "success"); // ✅ Success toast
    } catch (err) {
      showToast(err.response?.data?.msg || "❌ Join failed", "error"); // ✅ Error toast
    }
  };

  return (
    <div className="challenges-container">
      <h2>Public Challenge Rooms</h2>
      <br />
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
