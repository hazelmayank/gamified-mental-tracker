import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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

function App() {
  

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>}></Route>
        {/* <Route path='*' element={<NotFound />} /> */}
        <Route path="/journal" element={<PrivateRoute><JournalEntry /></PrivateRoute>} />
        <Route path="/challenges" element={<Allchallenges />} />
        <Route path="/challenges/create" element={<PrivateRoute><CreateChallenge /></PrivateRoute>} />
        <Route path="/challenge/:id" element={<PrivateRoute><ChallengeRoom /></PrivateRoute>} />
        <Route path="/my-challenges" element={<PrivateRoute><MyChallenges /></PrivateRoute>} />

      </Routes>
    </>
  )
}

export default App
