import React from 'react';
import ResponsiveAppBar from './UserNav';
import { Outlet } from 'react-router-dom';
import useNetworkStatus from './NetworkStatus';
import './Layout.css';

const UserLayout = ({ isTransitioning }) => {
 
 
  const {isOnline,error}=useNetworkStatus();
   if(!isOnline){
    return <div style={{display:'flex',minHeight:'100vh', justifyContent:'center',alignItems:'center'}}><div className='offline-alert'>It seems you are offline check your internet connection and try again</div></div>
  } 
  return (
    <div>
      <ResponsiveAppBar />
      <div className={`outlet-wrapper ${isTransitioning ? 'transitioning' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default UserLayout;
