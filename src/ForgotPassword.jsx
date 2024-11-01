import React, { useState, useEffect } from  'react'
import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ThreeDots } from 'react-loader-spinner';
import { Icon } from '@mui/material';
import './forgotpassword.css';
import axios from 'axios';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
 const [loading,setLoading]=useState(false);
  const [message, setMessage] = useState('');
  const [success,setSuccess]=useState(false);

  const serverUri = import.meta.env.VITE_BACKEND_URL;

 const navigate = useNavigate();
  
  
const clearMessage = (time)=>{
  setTimeout(() => {
    setMessage('')
    setSuccess(false)
  }, time);
}
  const handleSend = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior
    try {
      setLoading(true);  // Start loading
  
      // Make the POST request to your API
      const res = await axios.post(`${serverUri}/forgot-password`, { email }, { withCredentials: true });
  
      console.log(res);
  
      if (res.data=='success') {
        setSuccess(true);
        // Update state to reflect success, e.g., set a message
        setMessage('A link to reset your password has been sent to your email');
        setEmail('')
        setLoading(false)
        clearMessage(6000)
      }else{
        setSuccess(false)
        setLoading(false)
        setMessage('An error occured');
        clearMessage(5000)
      }
    } catch (error) {
      console.error(error);
      // Update state to reflect an error, e.g., set an error message
      setMessage('An error occured');
      setLoading(false)
      clearMessage(5000)
      setSuccess(false)
    } finally {
      setLoading(false);  // Stop loading
    }
  };
  
  
  return (
    <div style={{padding:'20px',display:'flex',justifyContent:'center',alignItems:'center'}}>
    <div className="forgot-login-container">
    {!success &&   <h3 className='text-white text-center'>Enter Email</h3>}
      {message  && <div className={success?' alert success':'alert error'}> <p>{message}</p></div>}
      <form onSubmit={handleSend} className='login-form'>
     {success?null:
     <div> <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ width: '100%' }}
        />
        
       
          {loading ? 
           <div className='text-center text-white d-flex justify-content-center align-items-center'> <ThreeDots
           height="80"
           width="80"
           radius="9"
           color="blue"
           ariaLabel="three-dots-loading"
         /></div> : 
         <div className="btn-wrapper">

        
          <button type="submit" disabled={loading} style={{position:'relative',
          left:'0px'
        }}>Send</button> </div>}
        
        </div>  
      }
      </form>
    </div>
    </div>
  );
};

export default ForgotPassword;
