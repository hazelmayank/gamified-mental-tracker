
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
import ViewProfile from './pages/ViewProfile'
// import Home from './pages/Home'
import HomeLanding from './pages/HomeLanding'
import Footer from "./components/Footer";
import MyPets from './pages/MyPets'
import Logout from "./pages/Logout"; // adjust path if needed
import Tranquil_Zone from './pages/Tranquil_Zone'



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
     <Route path="/logout" element={<Logout />} />
     <Route path="/tranquil_zone" element={<Tranquil_Zone></Tranquil_Zone>}></Route>
<Route path="/view-profile" element={<ViewProfile></ViewProfile>}></Route>
      </Routes>
      {/* <Footer /> */}
    </>
  )
}

export default App
