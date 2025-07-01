import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
const Navbar = () => {
  return (
    <nav className='navbar'>
        <h1 className='logo'>MindTrack</h1>
        <div className='nav-links'>
            <Link to={"/dashboard"} >Dashboard</Link>
            <Link to={"/register"} >Register</Link>
            <Link to={"/"} >Login</Link>
        </div> 
    </nav>
  )
}

export default Navbar
