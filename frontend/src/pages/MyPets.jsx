import { useEffect, useState } from 'react';
import axios from '../axios';
import './MyPets.css'
export default function MyPets() {
  const [inventory, setInventory] = useState([]);
  const [equippedPet, setEquippedPet] = useState(null);
  const [equippedAvatar, setEquippedAvatar] = useState(null);
  useEffect(() => {
    async function fetch() {
      const res = await axios.get('/user/me');
      setInventory(res.data.user.inventory || []);
      setEquippedPet(res.data.user.equippedPet || null);
      setEquippedAvatar(res.data.user.avatar || null);
    }
    fetch();
  }, []);

  const handleEquip = async (petName) => {
    try {
      const res = await axios.post('/user/equip-pet', { petName });
      setEquippedPet(petName);
      alert(res.data.msg);
    } catch (e) {
      alert(e.response.data.msg || "Error equipping pet");
    }
  };
  const handleEquipAvatar = async (avatar) => {
    try {
      const res = await axios.post('/user/equip-avatar', { avatar });
      setEquippedAvatar(avatar);
      alert(res.data.msg);
    } catch (e) {
      alert(e.response?.data?.msg || 'Error equipping avatar');
    }
  };

  const pets = inventory.filter((item) => item.toLowerCase().includes('pet'));
  const avatars=inventory.filter((item) => item.toLowerCase().includes('avatar'));
  return (
    <div className="mypets">
      <h2>🧸 My Pets</h2>
      {pets.length === 0 ? (
        <p>You don't own any pets yet!</p>
      ) : (
        <div className="pet-grid">
          {pets.map((pet) => {
            const petKey = pet.toLowerCase().replace(/\s+/g, '-');
            return (
              <div className="pet-card" key={pet}>
                <img src={`/assets/pets/${petKey}.png`} alt={pet} />
                <p>{pet}</p>
                {equippedPet === pet ? (
                  <span>✅ Equipped</span>
                ) : (
                  <button onClick={() => handleEquip(pet)}>Equip</button>
                )}
              </div>
            );
          })}
        </div>
      )}
      <h2>My Avatars</h2>
      {avatars.length === 0 ? (
        <p>You don't own any avatars yet!</p>
      ) : (
        <div className="pet-grid">
          {avatars.map((avatar) => {
            const avatarKey = avatar.toLowerCase().replace(/\s+/g, '-');
            return (
              <div className="pet-card" key={avatar}>
                <img src={`/assets/avatars/${avatarKey}.png`} alt={avatar} />
                <p>{avatar}</p>
                {equippedAvatar === avatar ? (
                  <span>✅ Equipped</span>
                ) : (
                  <button onClick={() => handleEquipAvatar(avatar)}>Equip</button>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
