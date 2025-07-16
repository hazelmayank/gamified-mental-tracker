import React from 'react'
import './Register.css'
import axios from '../axios'
import {useNavigate} from 'react-router-dom'
import { useState } from 'react'

const Register = () => {
const [loading, setLoading] = useState(false);
const [form,setForm]=useState({
  username:'',
  email:'',
  password:''
});

const [error,setError]=useState('');
const navigate=useNavigate();

const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit=async ()=>{
setLoading(true)
    try{

      const res=await axios.post('/auth/signup',form);
      localStorage.setItem("token",res.data.token);

      navigate('/dashboard');

    }
    catch(err){
  setError(err.response?.data?.msg || "Registration failed");
    }
    finally{
      setLoading(true)
    }

  }

  return (
    <div className='register-container'>
        <div className='register-card'>
            <h2>Create Account</h2>
         <p>Start your mindful journey today!</p>
         <input type="text" name="username" placeholder='Username' value={form.username} onChange={handleChange}></input>
         <input type="text" name="email" placeholder='Email' value={form.email} onChange={handleChange}></input>
         <input type="password" name="password"  placeholder='Password' value={form.password} onChange={handleChange}></input>

          {error && <p className="error-text">{error}</p>}
         
         <button onClick={handleSubmit} disabled={loading}>{loading ? "Registering..." : "Register"}</button>
         <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>Already have an account ? <a href='/login'>Login</a></p>
        </div>
      
    </div>
  )
}

export default Register
