import React from 'react';
import './about.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const About = () => {
  return (
    <div className=" about-container">
      <h1 className="text-center text-primary mt-4">About Us</h1>
      <p className="about-text">
      Welcome to FunFine, your go-to platform for discovering and sharing unforgettable events, parties, and ceremonies! Whether you're looking to attend the latest happenings or planning your own celebration, we’re here to connect you with the experiences that matter most.
      </p>
<h3>What We Do</h3>
<p>
At FunFine, we make it easy to stay informed about the most exciting events in your area. From lively parties and festive gatherings to special ceremonies and more, our platform is designed to keep you updated and engaged. Plus, you can create your own events, share them with the world, and attract attendees with ease!
</p>
      <h3 className="mt-4">Our Mission</h3>
      <p className="about-text">
      We believe that life’s best moments deserve to be celebrated. Our mission is to bring people together by providing a space where everyone can discover, share, and participate in events that create lasting memories.</p>


      <p className="text-center" >Join us at FunFine and let’s make every moment count!</p>
    </div>
  );
};

export default About;
