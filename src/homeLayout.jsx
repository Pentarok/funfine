import React from 'react'
import { Outlet } from 'react-router-dom'
import ResponsiveAppBar from './homeNavbar'
import './homeLayout.css';
const HomeLayout = () => {
  return (
<>
<div className='homepage'>


    <ResponsiveAppBar/>
    <Outlet/>
    </div>
</>
  )
}

export default HomeLayout