import React from 'react';

import { Link } from 'react-router-dom'; // Import Link for navigation
import 'bootstrap/dist/css/bootstrap.min.css';
import './Intro.css'
import axios from "axios";
import partyImage from './assets/Party.webp';
const Intro = () => {
  return (
    <div className='text-image-box'>
      <div className="text-content">
        <h1 className='' style={{color:'greenyellow'}}>Welcome to FineFun<br></br>
        Your Ultimate Hub for Events, Parties, and Ceremonies!</h1>
       <p className='text-white'>Are you looking to stay updated on the latest events, parties, and ceremonies happening in your area? Or perhaps you’re hosting a special occasion and want to spread the word? You’ve come to the right place!</p>
        
     <h3 style={{color:'greenyellow'}} >Discover Events that Excite You</h3>
        <p className='text-white'>
        From lively parties to intimate ceremonies, we’ve got all the events you need to know about! Whether it’s a wedding, birthday celebration, corporate event, or a fun local gathering, FunFine brings you all the details in one convenient place.
        </p>
<h3 style={{color:'greenyellow'}}>Share Your Events</h3>
<p className='text-white'>
Got an event coming up? We make it easy to share your special day with the people who matter. Our platform allows you to post your event, attract guests, and build buzz in no time!
</p>
        <p className='text-white'>
          <strong><Link to='/register' className='btn  text-dark fw-bold' style={{backgroundColor:'greenyellow'}}>Sign up</Link> for an account today</strong> start sharing your events! Connect with others and make every celebration unforgettable.
        </p>
 
        <Link to="/about" className="btn btn-primary">
          Learn More About Us
        </Link>
      </div>
      <div className="image-wrapper">
        {/* Add your image here */}
        <img src={partyImage} alt="" />
      </div>
    </div>
  );
}

export default Intro;
