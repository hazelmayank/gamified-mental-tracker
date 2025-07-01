import { useState } from "react";
import axios from '../axios';
import './SendFriendRequest.css'

export default function SendFriendRequest(){
    const [query,setQuery]=useState("");
    const [results,setResults]=useState([]);

    const handleSearch=async ()=>{
        if(!query.trim()) return;
        try{
           const res = await axios.get('/friends/search', {
      params: { query }
    });

;
            setResults(res.data.users || []);

        }
        catch(err){
      console.log("Search failed",err)
        }
    };

    const handleSend=async (userId)=>{

        try{
            await axios.post("/friends/request",{toUser:userId});
            alert("Friend Request send!")
        }catch (err) {
      alert(err.response?.data?.msg || "Failed to send request");
    }

    }

     return (
    <div className="search-page">
      <h2>🔍 Find Friends</h2>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          placeholder="Enter username..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <ul className="search-results">
        {results.map((user) => (
          <li key={user._id}>
            <span>{user.username}</span>
            <button onClick={() => handleSend(user._id)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
