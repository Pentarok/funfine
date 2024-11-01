import React, { useState } from 'react'
import './Contact.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import bgImage from './assets/funfinebg.webp';

const Contact = () => {

    const [message,setMessage]=useState('');
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [loading,setLoading]=useState(false);
    const [alertMessage,setAlertMessage]=useState('');

    const hideMessage = ()=>{
      setTimeout(() => {
          setAlertMessage("")
      }, 3000);
  }
      const RestoreDefault= ()=>{
          setName('');
          setMessage('');
          setEmail('');
      }
      const PostMessage= async (e)=>{
  
          try {
              setLoading(true)
          e.preventDefault();
          const serverUri = import.meta.env.VITE_BACKEND_URL;
          const contactEmailEndpoint= import.meta.env.VITE_EMAIL_ENDPOINT;
          const res = await axios.post(`${contactEmailEndpoint}`,{email, name, message},{withCredentials:true});


          if(res.data=='Ok'){
              setLoading(false)
              setAlertMessage('Message sent successfully');
              console.log(alertMessage)
             RestoreDefault();
            
             hideMessage();
           
          }else{
              setAlertMessage('An error occured! Please try again');
              setLoading(false)
          }
          setLoading(false)
          } catch (error) {
              setAlertMessage('An error occured! Please try again');
              setLoading(false)
              setTimeout(() => {
                  setAlertMessage("")
              }, 3000);
          }
  
  
      }
  return (
    <div className='center-form' style={{backgroundImage:bgImage}}>
      <form action="
      " onSubmit={PostMessage}>
 <h4 className='text-white text-center'>CONTACT US</h4>
           <div className="contact-form-container">
           {alertMessage.length>1 &&(
 <div  className={alertMessage.includes('error')?'alert error text-center':'alert success text-center '}>{alertMessage}</div>
            )}
           

            <div>
                <label htmlFor="" className='text-white '>Name:</label>
                <input type="text" name="" id=""value={name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div>
                <label htmlFor="" className='text-white '>Email:</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}  required/>
            </div>
            <div>
                <label htmlFor="" className='text-white '>Message:</label>
              <textarea value={message} onChange={(e)=>setMessage(e.target.value)} style={{ resize: 'none' }} required></textarea>

            </div>
            <div className='btn-wrapper'>
              <button disabled={loading}>{loading?'loading':'submit'}</button>
            </div>

           </div>
           </form>
    </div>
  )
}

export default Contact