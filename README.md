#  CognifyWell

**CognifyWell** is a gamified mental health tracker that empowers users to build healthy habits, reflect through journaling, and track emotional patterns — all while earning XP, leveling up, unlocking achievements, and building community support.

>  Built with React.js, Node.js, MongoDB. 
>  Designed to make mental wellness engaging and sustainable.

---

##  Features

-  **Daily Journaling** — Track your mood and write reflections.
- **Mood & Habit Analytics** — Visualize trends and emotional patterns.
- **Gamification** — Earn XP, collect coins, level up, and unlock achievements.
- **Virtual Pets** — Equip pets that give XP bonuses and motivate consistency.
- **Challenges** — Join or create challenges to build habits with friends.
- **Social Layer** — Add friends, view entries, and cheer each other on.
- **Store System** — Spend earned coins to unlock pets and profile customizations.

---

## Tech Stack

| Frontend   | Backend       | Database | Auth     |
|------------|---------------|----------|----------|
| React.js   | Node.js + Express.js | MongoDB  | JWT-based |

---

## Project Structure

```
cognifywell/
├── frontend/              # React frontend
│   ├── components/      # UI components
│   ├── pages/           # Routes like Dashboard, Journal, etc.
│   └── context/         # Global Toasts, Auth, etc.
├── backend/              # Express backend
│   ├── db.js          # MongoDB schemas
│   ├── routes/          # API endpoints
│   └── middleware.js     # Auth, validation
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cognifywell.git
cd gamified-mental-tracker
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGO_URL="mongodb+srv://mayankjeefinal:Mayank%406696@mayankfirstdb.vva4taq.mongodb.net/gamified-mental-tracker"
JWT_SECRET="123456"
```

### 4. Run the App

```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm start
```

---


## Contributing

We’re currently building this as a focused project, but feel free to fork and play with it. Contributions coming soon.

---

## License

This project is under the **MIT License**. 
See `LICENSE` file for details.
