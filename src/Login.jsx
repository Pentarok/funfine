import React, { useState } from 'react'
import './login.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Auth from './Auth';
import useAuth from './Auth';
const Login = () => {
    const navigate = useNavigate();
    const [message,setMessage]=useState('');
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('');
    const [loading1,setloading1]=useState(false);
    const [isSuccess,setIsSuccess]=useState(false)
    const [isVisible,setIsVisible]=useState(false);
    const serverUri = import.meta.env.VITE_BACKEND_URL;

    const {session, loading}=useAuth();

    const togglePasswordVisibility=()=>{
setIsVisible(!isVisible);
    }
    const clearMessage = ()=>{
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
    const handleLogin = async (e) => {
      e.preventDefault();
      if (loading1) return; // Prevent duplicate clicks
      setloading1(true);
      setMessage(''); // Clear any previous message
    
      try {
        const res = await axios.post(
          `${serverUri}/signin`,
          { email, password },
          { withCredentials: true }
        );
    
        setloading1(false);
        console.log(res);
    
        if (res.data.message === 'Login success') {
          setMessage('Login successful!');
          setIsSuccess(true);
    
          // Store token and user data
          localStorage.setItem('token', res.data.token); // No need to `JSON.stringify` if it's just a string
          localStorage.setItem('userId', res.data.user._id);
    
          // Navigate based on user role
          if (res.data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/user/home');
          }
        } else {
          setMessage(res.data.message);
          setIsSuccess(false);
          clearMessage();
        }
      } catch (error) {
        setloading1(false);
    
        if (error.response) {
          console.error('Error response:', error.response);
          setMessage(error.response.data.message);
        } else if (error.request) {
          console.error('Error request:', error.request);
          setMessage('No response from the server. Please try again.');
        } else {
          console.error('Error:', error.message);
          setMessage('An error occurred. Please try again.');
        }
    
        setIsSuccess(false);
        clearMessage();
      }
    };
    
    if(session && !loading){
      navigate('/user/home');
    }
  return (
    <div className='center-form'>
<div className="login-form-container">
<h4 className='text-center text-white'>Login</h4>

{message &&<div className={message.includes('successful')?'alert success':'alert error'}>
  {message}
</div> }
    <form action="" onSubmit={handleLogin}>
        <div>
            <label htmlFor="" className=' text-white'>Email:</label>
           <div>
           <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
            </div>
        </div>
        <div>
            <label htmlFor="" className=' text-white'>Password:</label>
            <div className='password-input'>
            <input  type={isVisible?"text":"password"} value={password} onChange={(e)=>setPassword(e.target.value)} required/>
           
            <div className="login-icon" onClick={togglePasswordVisibility}>
            <FontAwesomeIcon  icon={isVisible?faEye: faEyeSlash} color='white'/>
            </div>
            </div>

            <div className="btn-wrapper">
                <div>
                    <button disabled={loading1}>{loading1?"loading...":"Login"}</button>
                </div>
            </div>
<div>
<Link to='/forgotpassword' className='text-white'>Forgot Pasword?</Link>
</div>
            <div style={{marginTop:'8px'}}>
                <p className='text-white'>Don't have an account? <span><Link to='/register' style={{color:'aqua'}}>Sign Up</Link></span></p>
            </div>
        </div>
    </form>
</div>
    </div>
  )
}

export default Login