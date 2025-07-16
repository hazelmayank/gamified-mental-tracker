import React, { useEffect, useState } from 'react'
import "./Dashboard.css";
import axios from '../axios'
import { Link } from 'react-router-dom'

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get('/user/me');
        setUser(res.data.user);
      } catch (err) {
        console.log("Failed to fetch the user", err);
      }
    }
    fetchUser();
  }, []);

  if (!user) return <p>Loading dashboard...</p>;

  const levelBaseXp = (level) => Math.pow((level - 1) / 0.1, 2);
  const nextLevelXP = levelBaseXp(user.level + 1);
  const currentLevelXP = levelBaseXp(user.level);
  const xpProgressPercent = ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className='dashboard-container'>

      {user.equippedPet && (
        <img
          src={`/assets/pets/${slugify(user.equippedPet)}.png`}
          alt={user.equippedPet}
          className="pet-widget"
        />
      )}

      <div className="welcome-section">
        <img
          src={`/${user.avatar || 'default.png'}`}
          onError={(e) => e.target.style.display = 'none'}
          className='avatar'
          alt='avatar'
        />

        <div>
          <h2>Welcome back, {user.username} 👋</h2>

          <p className="level-coins">
            <span>Level {user.level}</span>
            <span>🪙 Coins: {user.coins || 0}</span>
          </p>

          <div className="xp-bar">
  <div className="xp-fill" style={{ width: `${xpProgressPercent}%` }}></div>
</div>
<p className="xp-label">
  {Math.floor(user.xp - currentLevelXP)} XP / {Math.floor(nextLevelXP - currentLevelXP)} XP
</p>


          <div className="quick-links">
            <Link to='/journal' className="card">📔 New Journal Entry</Link>
            <Link to='/journal-stats' className="card">📈 Entry Stats</Link>
            <Link to='/today-entry' className="card">🗓️ Today’s Entry</Link>
            <Link to='/entries' className="card">🧾 All Entries</Link>
            <Link to='/my-challenges' className="card">🔥 My Challenge</Link>
            <Link to='/challenges' className="card">🔥 Join Challenge</Link>
            <Link to='/leaderboard' className="card">🏆 Leaderboard</Link>
            <Link to='/store' className="card">🛍️ Store</Link>
            <Link to='/friends' className="card">🫂 Friends</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
