import { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import "./CreateChallenge.css";

export default function CreateChallenge() {
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter a challenge name");
    try {
      await axios.post("/challenges/", { name, isPrivate });
      alert("Challenge created!");
      navigate("/challenges");
    } catch (err) {
      alert(err.response?.data?.msg || "Creation failed");
    }
  };

  return (
    <div className="create-challenge-container">
      <div className="create-card">
        <h2>Create Challenge Room</h2>
        <form onSubmit={handleSubmit} className="challenge-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter challenge name"
          />
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            Make it Private 🔒
          </label>
          <button type="submit">Create Room</button>
        </form>
      </div>
    </div>
  );
}
