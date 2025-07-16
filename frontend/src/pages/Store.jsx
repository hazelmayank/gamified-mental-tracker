import React, { useEffect, useState } from 'react';
import axios from '../axios';
import './Store.css';

export default function Store() {
  const [items, setItems] = useState([]);
  const [xp, setXP] = useState(0);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const itemsRes = await axios.get('/store');
      setItems(itemsRes.data.allItems || []);
      
      const userRes = await axios.get('/user/me');
      setXP(userRes.data.user.xp);
      setInventory(userRes.data.user.inventory || []);
    }
    fetchData();
  }, []);

  const handleBuy = async (itemName) => {
    try {
      const res = await axios.post('/user/spend', { itemName });
      alert(res.data.msg);
      setXP(res.data.xp);
      setInventory(res.data.inventory);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to purchase');
    }
  };

  return (
    <div className="store-wrapper">
      {/* Ocean Background Layers */}
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      <div className="bubble bubble-4"></div>
      <img src="/assets/ocean/fish1.svg" className="fish fish-1" alt="fish" />
      <img src="/assets/ocean/fish2.svg" className="fish fish-2" alt="fish" />

      {/* Store Content */}
      <div className="store">
        <h2>🛒 Mental Health Store</h2>
        <p>Your XP: <strong>{xp}</strong></p>

        <div className="store-grid">
          {items.map((item) => (
            <div key={item.name} className="store-item">
              <img src={`/assets/pets/${item.image}`} alt={item.name} />
              <h4>{item.name}</h4>
              <p>Type: {item.type}</p>
              <p>Cost: {item.cost} XP</p>
              {inventory.includes(item.name) ? (
                <span className="owned">✅ Owned</span>
              ) : (
                <button onClick={() => handleBuy(item.name)}>Buy</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
