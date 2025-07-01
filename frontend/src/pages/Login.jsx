import React from 'react'
import "./Login.css";
import axios from '../axios';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();


  const handleLogin=async (e) =>{
  e.preventDefault();
  setLoading(true)
try{
    const res = await axios.post('/auth/signin', { username, password });
    

      localStorage.setItem('token', res.data.token);
      // console.log("res.data:", res.data);
      navigate('/dashboard');
}
catch(err){
      alert(err.response?.data?.msg || 'Login failed');
}
finally{
  setLoading(false)
}

}

  return (
    <div className='login-page'>
        <div className='login-box'>
    <h2>Welcome Back !</h2>
    <p className='subtitle'>Login to continue your journey</p>
    <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onChange={(e)=>{
          setUsername(e.target.value)
        }} required></input>
        <input type="password" placeholder="Password" value={password} onChange={(e)=>{
          setPassword(e.target.value);
        }}required></input>
        <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Log-in"}</button>
    </form>

    <p className='register-link'>
        Don't have an Account? <a href='/register'>Register</a>
    </p>

       </div>
    
    </div>
  )
}

export default Login
