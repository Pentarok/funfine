import React from 'react';
import ResponsiveAppBar from './AdminNav';
import { Outlet } from 'react-router-dom';
import './Layout.css';

const AdminLayout = ({ isTransitioning }) => {
  return (
    <div>
      <ResponsiveAppBar />
      
      <div className={`outlet-wrapper ${isTransitioning ? 'transitioning' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
