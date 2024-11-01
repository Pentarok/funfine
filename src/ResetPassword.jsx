import React, { useState, useEffect } from  'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Icon } from '@mui/material';
import './login.css';

import axios from 'axios';
const ResetPassword = () => {
  const [password, setPassword] = useState('');
 const [loading,setLoading]=useState(false);
 const [ConfirmPassword,setConfirmPassword]=useState('');
  const [message, setMessage] = useState('');
 const navigate = useNavigate();
 
 const serverUri = import.meta.env.VITE_BACKEND_URL;

const RestoreDefault = ()=>{
  setTimeout(() => {
    setMessage('');
  }, 5000);
  setConfirmPassword('');
  setPassword('');
}
const {id, token}=useParams();
  const handleSend = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior
if(password !== ConfirmPassword){
setMessage('Passwords do not match!Please check and try again')
return
}

    try {
      setLoading(true);  // Start loading
  
      // Make the POST request to your API
      const res = await axios.post(`${serverUri}/reset-password/${id}/${token}`, { password }, { withCredentials: true });
  
      console.log(res);
      setMessage(res.data.message)
   RestoreDefault();
    
    } catch (error) {
      console.error(error);
      if(error.response){
        setMessage(error.response.data.error)
        RestoreDefault();
      }
      // Update state to reflect an error, e.g., set an error message
   
    } finally {
      setLoading(false);  // Stop loading
    }
  };
  
  
  return (
    <div style={{padding:'20px',display:'flex',justifyContent:'center',alignItems:'center'}}>
    <div className="forgot-login-container">

      {message && <div className={message.includes('successfully')?'alert success':'alert error'}>
        <p>{message}</p>
        </div>} {/* Display error or success message */}
        <h6 className='text-white' style={{margin:'10px auto 0px'}}>Enter New Password</h6>
      <form onSubmit={handleSend} className='login-form'>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ width: '100%' }}
        />
       

       <h6 className='text-white' style={{margin:'10px auto 0px'}}>Confirm New Password</h6>
       <input
          type="password"
          value={ConfirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ width: '100%' }}
        />
         <div className="btn-wrapper">
        <button type="submit" disabled={loading} style={{position:'relative',
          left:'0px'
        }} >
          {loading ? 'Loading...' : 'Reset'}
        </button>
        </div>
       
      </form>
    </div>
    </div>
  );
};

export default ResetPassword;
