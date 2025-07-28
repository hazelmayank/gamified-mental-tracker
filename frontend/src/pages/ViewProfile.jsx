import React, { useEffect, useState } from "react";
import axios from "../axios";
import "./ViewProfile.css";
import { useLocation } from "react-router-dom";

// Utility to make strings URL-safe
function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

// Convert pet image filename to a readable name
function getPetNameFromPath(path) {
  if (!path) return "None";
  const fileName = path.split("/").pop().replace(".png", "");
  const words = fileName.split("-");
  const capitalized = words.map(
    word => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalized.join(" ");
}

export default function ViewProfile() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const friendId = queryParams.get('id');

  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/friends/${friendId}`)
      .then((res) => {
        const data = res.data;

        setFriend({
          avatarUrl: data.avatarUrl
            ? `/assets/avatars/${slugify(data.avatarUrl)}.png`
            : "/assets/avatars/default.png",
          username: data.username || "Anonymous",
          level: data.level || 1,
          xp: data.xp || 0,
          pet: data.pet
            ? `/assets/pets/${slugify(data.pet)}.png`
            : null,
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch friend:", err);
        setLoading(false);
      });
  }, [friendId]);

  if (loading) return <div className="profile-container">Loading...</div>;
  if (!friend) return <div className="profile-container">Friend not found</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src={friend.avatarUrl}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/avatars/default.png";
          }}
          alt="User Avatar"
          className="avatar"
        />

        <h2 className="username">{friend.username}</h2>
        <p className="level">
          Level {friend.level} • XP: {friend.xp}
        </p>
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${friend.xp % 100}%` }}></div>
        </div>

        <div>
          <h3 className="section-title">Equipped Pet</h3>
          {friend.pet ? (
            <div className="pet-image-name">
              <div>
                <img src={friend.pet} alt="Equipped Pet" className="pet-image" />
              </div>
              <div>{getPetNameFromPath(friend.pet)}</div>
            </div>
          ) : (
            <p className="no-pets">None 💤</p>
          )}
        </div>
      </div>
    </div>
  );
}
