import { useEffect, useState } from 'react';
import axios from '../axios';
import './MyPets.css';

export default function MyPets() {
  const [inventory, setInventory] = useState([]);
  const [equippedPet, setEquippedPet] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/user/me');
        setInventory(res.data.user.inventory || []);
        setEquippedPet(res.data.user.equippedPet || null);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    }

    fetchData();
  }, []);

  const handleEquip = async (petName) => {
    try {
      const res = await axios.post('/user/equip-pet', { petName });
      setEquippedPet(petName);
      alert(res.data.msg);
    } catch (e) {
      alert(e.response?.data?.msg || "Error equipping pet");
    }
  };

  const pets = inventory.filter((item) =>
    item.toLowerCase().includes('pet')
  );

  return (
    <div className="mypets-wrapper">
      {/* Optional Ocean Bubbles / Fish */}
      <img src="/assets/ocean/fish1.svg" className="fish fish-1" alt="fish" />
      <img src="/assets/ocean/fish2.svg" className="fish fish-2" alt="fish" />
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>

      <div className="mypets">
        <h2>🧸 My Pets</h2>

        {pets.length === 0 ? (
          <p className="no-pets">You don't own any pets yet!</p>
        ) : (
          <div className="pet-grid">
            {pets.map((pet) => {
              const petKey = pet.toLowerCase().replace(/\s+/g, '-');
              return (
                <div className="pet-card" key={pet}>
                  <img src={`/assets/pets/${petKey}.png`} alt={pet} />
                  <p className="pet-name">{pet}</p>
                  {equippedPet === pet ? (
                    <span className="equipped-label">✅ Equipped</span>
                  ) : (
                    <button onClick={() => handleEquip(pet)}>Equip</button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
