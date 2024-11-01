import React, { useEffect, useState } from 'react'
import PastEvents from './PastEvents'
import UserBlogs from './userBlogs'
import useAuth from './Auth';


const UserPosts = () => {
    const {user,loading}=useAuth();
    const [userId,setUserId]=useState(null);
    // Set userId from user context
  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);
  if(loading){
    return <div className='text-center text-white'>Loading please wait...</div>
  }
  return (
    <div>
        <UserBlogs/>
        <PastEvents  userId={userId} />

    </div>
  )
}

export default UserPosts