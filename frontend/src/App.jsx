
import './App.css'
import Navbar from './components/Navbar'
import { Routes,Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import JournalEntry from './pages/JournalEntry'
import PrivateRoute from './components/PrivateRoute'
import Allchallenges from './pages/Allchallenges'
import CreateChallenge from './pages/CreateChallenge'
import  ChallengeRoom  from './pages/ChallengeRoom'
import MyChallenges from './pages/MyChallenges'
import Leaderboard from './pages/Leaderboard'
import Friends from './pages/Friends'
import SendFriendRequest from './pages/SendFriendRequest'
import Achievements from './pages/Achievements'
import Store from './pages/Store'
import EntriesList from './pages/EntryList'
import TodayEntry from './pages/TodayEntry'
import JournalStats from './pages/JournalStats';
// import Home from './pages/Home'
import HomeLanding from './pages/HomeLanding'
import Footer from "./components/Footer";
import MyPets from './pages/MyPets'



function App() {
  

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomeLanding />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>}></Route>
        {/* <Route path='*' element={<NotFound />} /> */}
        <Route path="/journal" element={<PrivateRoute><JournalEntry /></PrivateRoute>} />
        <Route path="/challenges" element={<Allchallenges />} />
        <Route path="/challenges/create" element={<PrivateRoute><CreateChallenge /></PrivateRoute>} />
        <Route path="/challenge/:id" element={<PrivateRoute><ChallengeRoom /></PrivateRoute>} />
        <Route path="/my-challenges" element={<PrivateRoute><MyChallenges /></PrivateRoute>} /> 
        <Route path="/find-friends" element={<SendFriendRequest />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/achievements" element={<Achievements />} />
        <Route path="/store" element={<Store />} />
        <Route path="/entries" element={<EntriesList />} />
        <Route path="/today-entry" element={<TodayEntry />} />
        <Route path="/journal-stats" element={<JournalStats />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path='/login' element={<Login />} />
    <Route path="/mypets" element={<MyPets />} />

      </Routes>
      {/* <Footer /> */}
    </>
  )
}

export default App
