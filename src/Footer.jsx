import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const Footer = () => {
  return (
    <div className='footer'>

               <div>
                <h4>Find us on:</h4>
                <div className="icons-box">
                    <div>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faFacebook} size="2x" color='white' />
      </a>
                    </div>

                    <div>
                    <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faWhatsapp} size="2x" color='white'/>
      </a>
                    </div>
                </div>
          
    
               </div>
               <p className='text-center'>
        &copy; {new Date().getFullYear()} FunFine.com. All rights reserved. 
        <br />
        Where events meet moments, and people come together..
      </p>
    </div>
  )
}

export default Footer