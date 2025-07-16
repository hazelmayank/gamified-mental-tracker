import { useEffect, useState } from "react";
import axios from "../axios";
import "./Friends.css";
 import { useNavigate } from "react-router-dom";
export default function Friends() {
    const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  const fetchData = async () => {
    const r1 = await axios.get("/friends/requests");
    const r2 = await axios.get("/friends");
    setRequests(r1.data.allrequests || []);
    setFriends(r2.data.friends || []);
  };

  const viewProfile = async (id) => {
  navigate(`/view-profile/?id=${id}`); 
  };


  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (id) => {
    await axios.post("/friends/respond", {
        requestId: id, action: "accept" ,
    });
    fetchData();
  };

  const handleUnfriend = async (id) => {
    await axios.delete(`/friends/${id}`);
    fetchData();
  };

  return (
    <div className="friends-page">
      <h2>👥 Friends</h2>

      <div className="section">
        <h3>🔔 Pending Friend Requests</h3>
        {requests.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          <div className="card-list">
            {requests.map((req) => (
              <div className="friend-card" key={req._id}>
                <span>{req.fromUser?.username}</span>
                <button onClick={() => handleAccept(req._id)}>Accept</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h3>✅ Your Friends</h3>
        {friends.length === 0 ? (
          <p>You have no friends yet 😢</p>
        ) : (
          <div className="card-list">
            {friends.map((friend) => (
              <div className="friend-card" key={friend._id}>
               <span>{friend.username}</span>
                <div id="enigma_spacing"><button onClick={() => viewProfile(friend._id)}>View Profile</button>
                <button onClick={() => handleUnfriend(friend._id)}>Unfriend</button></div> 
              </div>
            ))}
          </div>
        )}
      </div>
     



<div className="find-friends-button">
  <button onClick={() => navigate("/find-friends")}>
    🔍 Find Friends
  </button>
</div>

    </div>
  );
}
