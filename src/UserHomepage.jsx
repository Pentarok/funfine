import React from 'react'
import UserIntro from './UserIntro'
import Posts from './posts'
import News from './News'
import MediaCard from './Card'
import Contact from './Contact'
import UserHomeContent from './UserHomeContent'
import UserManual from './UserManual'

const UserHomepage = () => {
   
  return (
    <div>
  
<UserIntro/>

<UserHomeContent/>

<Posts/>
<Contact/>

    </div>
  )
}

export default UserHomepage