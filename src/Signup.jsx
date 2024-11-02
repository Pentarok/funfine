import React, { useState } from 'react'
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Toast } from 'bootstrap';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

const SignUp = () => {
    const [isVisible,setIsVisible]=useState(false);

    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [message,setMessage]=useState('');
    const[loading,setLoading]=useState(false);
    const [username,setUserName]=useState('');
    const serverUri = import.meta.env.VITE_BACKEND_URL;
    const togglePasswordVisibility=()=>{
setIsVisible(!isVisible);
    }
    const clearMessage = ()=>{
        setTimeout(() => {
          setMessage('');
        }, 5000);
      }

const navigate = useNavigate();
    const handleFormSubmit = async (e)=>{
        e.preventDefault();
        try {
            setLoading(true)
            const res = await axios.post(`${serverUri}/signup`,{username,email,password},{withCredentials:true})
            console.log(res)
            if(res.data=="Ok"){
                setEmail('');
                setPassword('');
                setUserName('');
                setLoading(false)
                toast.success("Account registered successfully. Redirecting...");
                setTimeout(() => {
                    navigate('/login')
                }, 2000);
            }else{
                toast.error("An error occured!")
                setLoading(false);
            }  
        } catch (error) {
            if(error.response){
                console.log(error.response)
                setMessage((error.response.data.error));
                clearMessage();
            }
            setLoading(false);
        }

    }
  return (
    <div className='center-form'>
<div className="form-container">
<h4 className='text-center text-white'>Sign Up</h4>
{message && <div className={message.includes('Ok')?"":'error'}>{message}</div>}
    <form action="" onSubmit={handleFormSubmit}>
<ToastContainer/>

    <div>
            <label htmlFor="" className=' text-white'>Username:</label>
           <div>
           <input type="text" value={username} onChange={(e)=>setUserName(e.target.value)} required/>
            </div>
        </div>

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
           
            <div className="icon" onClick={togglePasswordVisibility}>
            <FontAwesomeIcon  icon={isVisible?faEye: faEyeSlash} color='white'/>
            </div>
            </div>

            <div className="btn-wrapper">
                <div>
                    <button disabled={loading}>{loading?"Loading..":"Submit"}</button>
                </div>
            </div>

            <div style={{marginTop:'8px'}}>
                <p className='text-white'>Already have an account? <span><Link to='/login' style={{color:'aqua'}}>Login</Link></span></p>
            </div>
        </div>
    </form>
</div>
    </div>
  )
}

export default SignUp