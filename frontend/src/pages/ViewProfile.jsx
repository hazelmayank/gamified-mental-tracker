import React, { useEffect, useState } from "react";
import axios from "../axios";
import "./ViewProfile.css";
import { useLocation } from "react-router-dom";

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}
function getPetNameFromPath(path) {
  if (!path) return "None";

  const fileName = path.split("/").pop().replace(".png", ""); // "mindful-panda-pet"
  const words = fileName.split("-"); // ["mindful", "panda", "pet"]

  const capitalized = words.map(
    word => word.charAt(0).toUpperCase() + word.slice(1)
  );

  return capitalized.join(" "); // "Mindful Panda Pet"
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
          // console.log("API response:", res.data);
        const data = res.data;
        // console.log("Friend Info being sent:", data);

        // Ensure pets and other properties are safe
        setFriend({
          avatarUrl:  `/assets/pets/${data.avatarUrl}` || "/default.png",
          username: data.username || "Anonymous",
          level: data.level || 1,
          xp: data.xp || 0,
          // xpProgress: data.xpProgress || 0,
         pet: data.pet
    ? `/assets/pets/${slugify(data.pet)}.png`
    : null, // fallback image
        });
//         console.log("Pet value before slugify:", data.pet);
// console.log("Slugified pet path:", `/assets/pets/${slugify(data.pet)}.png`);
        // console.log(data.pet);
        // console.log(data);
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
      <img src={friend.avatarUrl} alt={friend.username} className="avatar" />

        <h2 className="username">{friend.username}</h2>
        <p className="level">
          Level {friend.level} • XP: {friend.xp}
        </p>
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${friend.xp % 100}%` }}></div>
        </div>
        <div>
        <h3 className="section-title">Equipped Pet</h3>
         {friend.pet ? (<div className="pet-image-name"> <div><img src={friend.pet} alt="Equipped Pet" className="pet-image" /></div><div>{getPetNameFromPath(friend.pet)}</div></div>
) : (
  <p className="no-pets">None 💤</p>
)}
       </div>
      </div>
    </div>
  );
}
