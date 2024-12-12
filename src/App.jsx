/*  import { useState } from 'react'


import './App.css'
import { BrowserRouter, Routes, Route,useLocation } from 'react-router-dom';
import HomeLayout from './homeLayout';
import About from './About';
import Upload from './Upload';
import Login from './Login';
import SignUp from './Signup';
import Homepage from './Homepage';
import Posts from './posts';
import Contact from './Contact';
import UserLayout from './userLayout';
import UserCreatePost from './userCreatePost';
import EditPost from './EditPost';
import UserBlogs from './userBlogs';
import UserHomepage from './UserHomepage';
function App() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 500); // Adjust duration as needed
  }, [location]);





 
  return (
  
       <BrowserRouter>
    <div className={isTransitioning ? 'App transitioning' : 'App'}>
     
  

      <Routes>

        <Route path='/' element={<HomeLayout/>}>
                <Route path='/home' element={<Homepage/>}></Route>
                <Route path='/about' element={<About/>}></Route>
                <Route path='/login' element={<Login/>}></Route>
                <Route path='/upload' element={<Upload/>}></Route>
                <Route path='/contact' element={<Contact/>}></Route>
                <Route path='/register' element={<SignUp/>}></Route>
         </Route>
    
      <Route path='/user' element={<UserLayout/>}>
      <Route path='/user/home' element={<UserHomepage/>}></Route>
      <Route path='/user/create/post' element={<UserCreatePost/>}></Route>
      <Route path='/user/edit' element={<EditPost/>}></Route>
      <Route path='/user/posts' element={<UserBlogs/>}></Route>
      <Route path='/user/edit/:id' element={<EditPost/>}></Route>
      <Route path='/user/allposts' element={<Posts/>}></Route>
      </Route>

      </Routes>
  
</div>
</BrowserRouter>

  )

}
export default App  */
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomeLayout from './homeLayout';
import UserLayout from './userLayout';
import Homepage from './Homepage';
import About from './About';
import Login from './Login';
import SignUp from './Signup';
import Posts from './posts';
import Contact from './Contact';
import UserCreatePost from './userCreatePost';
import EditPost from './EditPost';
import MediaCard from './EventDetails';
import UserBlogs from './userBlogs';
import UserHomepage from './UserHomepage';
import AdminLayout from './AdminLayout';
import AdminHome from './AdminHome';
import Users from './Users'
import AdminAllPosts from './AdminAllPosts'


import Events from './Events';
import NewsContainer from './NewsContainer';
import EditNews from './EditNews';

import EditEvent from './EditEvent';

import AdminUserBlogs from './AdminUserBlogs';
import ErrorBoundary from '../ErrorBoundary';
import RenderEvents from './RenderEvents';

import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword'
import PastEvents from './UserPastEvents';
import UpcomingEvents from './UpcomingEvents';
import UpdatePastEvent from './UpdatePastEvent';
import RenderUpdatedPastEvents from './RenderUpdatedPastEvents';
import UserPosts from './UserPosts';
import AllPosts from './AllPosts';
import NewsForm from './NewsForm';
import UserManual from './UserManual';
import DatabaseError from './DatabaseError';
import NotFoundPage from './NotFoundPage';
import  {useDatabaseCheck}  from './DatabaseCheck';
import UserProfile from './UserProfile';

function App() {
 
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

function AnimatedRoutes() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  

  useEffect(() => {
    setIsTransitioning(true);
    const timeout = setTimeout(() => setIsTransitioning(false), 500); // Adjust duration as needed
    return () => clearTimeout(timeout);
  }, [location]);
 const { isConnected, message, loading}=useDatabaseCheck();
 
 if(!isConnected && !loading){
  return <DatabaseError/>
 }
  return (
    <ErrorBoundary>
    <Routes>
      {/* General routes */}
      <Route path='/' element={<HomeLayout isTransitioning={isTransitioning} />}>
        <Route path='/' element={<Homepage/>}></Route>
        <Route path='/home' element={<Homepage />} />
        <Route path='/about' element={<About />} />
        <Route path='/home/events' element={<UpcomingEvents />} />
        <Route path='/home/past-events' element={<RenderUpdatedPastEvents />} />
        <Route path='/login' element={<Login />} />
        <Route path='/reset-password/:id/:token' element={<ResetPassword />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/home/event/details' element={<MediaCard/>} />
        <Route path='/contact' element={<Contact />} />
       
        <Route path='/register' element={<SignUp />} />
      </Route>
   

      {/* User Routes */}
      <Route path='/user' element={<UserLayout isTransitioning={isTransitioning} />}>
        <Route path='/user/home' element={<UserHomepage />} />
        <Route path='/user/create/post' element={<UserCreatePost />} />
        <Route path='/user/edit' element={<EditPost />} />
        <Route path='/user/manual' element={<UserManual />} />
        <Route path='/user/create/post' element={<UserCreatePost />} />
        <Route path='/user/event/details' element={<MediaCard/>} />
       
        <Route path='/user/posts' element={<UserPosts />} />
        <Route path='/user/past-events' element={<RenderUpdatedPastEvents />} />
        <Route path='/user/upcoming-events' element={<UpcomingEvents />} />
       
        <Route path='/user/edit/:id' element={<EditPost />} />
        <Route path='/user/profile' element={<UserProfile />} />
        
        <Route path='/user/edit/past-events/:id' element={<UpdatePastEvent />} />
        <Route path='/user/allposts' element={<AllPosts/>} />
      </Route>
      <Route path='/admin' element={<AdminLayout/>}>
      
      <Route path='/admin/home' element={<AdminHome />} />
      <Route path='/admin/users' element={<Users />} />
      <Route path='/admin/news' element={<NewsForm />} />
      <Route path='/admin/posts' element={<AdminUserBlogs/>}/>
      <Route path='/admin/edit/news/:id' element={<EditNews />} />
      <Route path='/admin/edit/event/:id' element={<EditEvent/>} />
      <Route path='/admin/edit/:id' element={<EditPost/>} />
      <Route path='/admin/allposts' element={<AdminAllPosts />} />
      
      <Route path='/admin/edit/tips/:id' element={<EditEvent />} />
      <Route path='/admin/create/post' element={<UserCreatePost />} />


      </Route>
        {/* Catch-all route for undefined paths */}
    

        {/* 404 Page Route */}
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </ErrorBoundary>
  );
}

export default App;
