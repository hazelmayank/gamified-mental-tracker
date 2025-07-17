import React, { useEffect, useState } from 'react';
import axios from '../axios';
import './Store.css';

export default function Store() {
  const [items, setItems] = useState([]);
  const [coins, setCoins] = useState(0);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const itemsRes = await axios.get('/store');
      setItems(itemsRes.data.allItems || []);
      
      const userRes = await axios.get('/user/me');
      setCoins(userRes.data.user.coins);
      setInventory(userRes.data.user.inventory || []);
    }
    fetchData();
  }, []);

  const handleBuy = async (itemName) => {
    try {
      const res = await axios.post('/user/spend', { itemName });
      alert(res.data.msg);
      setCoins(res.data.coins);
      setInventory(res.data.inventory);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to purchase');
    }
  };

  const renderSection = (title, filteredItems) => (
    <>
      <h3 className="store-section-heading">{title}</h3>
      <div className="store-grid">
        {filteredItems.map((item) => (
          <div key={item.name} className="store-item">
            <img src={`/assets/pets/${item.image}`} alt={item.name} />
            <h4>{item.name}</h4>
            <p>Type: {item.type}</p>
            <p>Cost: {item.cost} Coins</p>
            {inventory.includes(item.name) ? (
              <span className="owned">✅ Owned</span>
            ) : (
              <button onClick={() => handleBuy(item.name)}>Buy</button>
            )}
          </div>
        ))}
      </div>
    </>
  );

  const pets = items.filter((i) => i.name.endsWith('Pet'));
  const themes = items.filter((i) => i.name.endsWith('Theme'));
  const avatars = items.filter((i) => i.name.endsWith('Avatar'));

  return (
    <div className="store">
      <h2>🛒 Mental Health Store</h2>
      <p>Your Coins: <strong>{coins}</strong></p>

      {renderSection("🐾 Pets", pets)}
      {renderSection("🎨 Themes", themes)}
      {renderSection("🧑 Avatars", avatars)}
    </div>
  );
}
