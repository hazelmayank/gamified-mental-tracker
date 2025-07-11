import { useEffect, useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import "./Friends.css";

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (id) => {
    await axios.post("/friends/respond", {
      requestId: id,
      action: "accept",
    });
    fetchData();
  };

  const handleUnfriend = async (id) => {
    await axios.delete(`/friends/${id}`);
    fetchData();
  };

  const viewProfile = (id) => {
    navigate(`/view-profile/?id=${id}`);
  };

  return (
    <div className="friends-wrapper">
      {/* Floating Fishes */}
      <img src="/assets/ocean/fish1.svg" className="fish fish-1" alt="fish" />
      <img src="/assets/ocean/fish2.svg" className="fish fish-2" alt="fish" />
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      <div className="bubble bubble-4"></div>
      <div className="bubble bubble-5"></div>

      {/* Main Transparent Card */}
      <div className="friends-page transparent-card">
        <h2>👥 Friends</h2>

        {/* Pending Requests */}
        <div className="section">
          <h3>🔔 Pending Friend Requests</h3>
          {requests.length === 0 ? (
            <p>No pending requests</p>
          ) : (
            <div className="card-list">
              {requests.map((req) => (
                <div className="friend-card transparent-card" key={req._id}>
                  <span>{req.fromUser?.username}</span>
                  <button onClick={() => handleAccept(req._id)}>Accept</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Friends List */}
        <div className="section">
          <h3>✅ Your Friends</h3>
          {friends.length === 0 ? (
            <p>You have no friends yet 😢</p>
          ) : (
            <div className="card-list">
              {friends.map((friend) => (
                <div className="friend-card transparent-card" key={friend._id}>
                  <span>{friend.username}</span>
                  <div id="enigma_spacing">
                    <button onClick={() => viewProfile(friend._id)}>View Profile</button>
                    <button onClick={() => handleUnfriend(friend._id)}>Unfriend</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Find Friends Button */}
        <div className="find-friends-button">
          <button onClick={() => navigate("/find-friends")}>
            🔍 Find Friends
          </button>
        </div>
      </div>
    </div>
  );
}
