import React, { useState } from 'react'
import './login.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const navigate = useNavigate();
    const [message,setMessage]=useState('');
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('');
    const [loading,setLoading]=useState(false);
    const [isSuccess,setIsSuccess]=useState(false)
    const [isVisible,setIsVisible]=useState(false);
    const serverUri = import.meta.env.VITE_BACKEND_URL;

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
      setLoading(true); // Show loading state while making the request
      setMessage(''); // Clear any previous message
    
      try {
        const res = await axios.post(
          `${serverUri}/signin`,
          { email, password },
          { withCredentials: true, timeout: 15000 }
        );
    
        setLoading(false); // Stop loading once we get a response
        console.log(res);
    
        if (res.data.message === 'Login success') {
          setMessage('Login successful!'); // Show success message
          setIsSuccess(true); // Set to success
    
          // Store token and user data in localStorage
          localStorage.setItem('token', JSON.stringify(res.data.token)); // Assuming token is sent in the response
          localStorage.setItem('userId', JSON.stringify(res.data.user._id)); // Assuming user ID is sent in the response
    
          // Navigate based on user role
          if (res.data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/user/home');
          }
        } else {
          setMessage(res.data.message); // Show error message
          setIsSuccess(false); // Set to error
    
         clearMessage()
        }
      } catch (error) {
      
        setLoading(false); // Stop loading if there's an error
    
        if (error.response) {
          // Server responded with a status code outside the range of 2xx
          console.error('Error response:', error.response);
          setMessage(error.response.data.message); // Show backend error message (e.g., "Invalid credentials" or "Account does not exist")
          clearMessage();
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
          setMessage('No response from the server. Please try again.');
        } else {
          // Something else happened
          console.error('Error:', error.message);
          setMessage('An error occurred. Please try again.');
           clearMessage()
        }
    
        setIsSuccess(false); // Set to error
        clearMessage()
      }
    };
    
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
                    <button disabled={loading}>{loading?"Loading...":"Login"}</button>
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