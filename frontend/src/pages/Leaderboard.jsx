import { useEffect,useState } from "react";
import axios from '../axios'
import './Leaderboard.css'

export default function Leaderboard(){

    const [users,setUsers]=useState([]);

    useEffect(()=>{
        axios.get('/user/leaderboard').then(res=>setUsers(res.data.topUsers)).catch(err=>
            console.log("Error "+err))
        
    },[]);

    
  return (
    <div className="leaderboard-container">
      <h2>🏆 Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>👤 Username</th>
            <th>🏅 Level</th>
            <th>🧠 XP</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={user._id}>
              <td>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
              </td>
              <td>{user.username}</td>
              <td>{user.level}</td>
              <td>{user.xp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

