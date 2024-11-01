import React from 'react'
import RenderUpdatedPastEvents from './RenderUpdatedPastEvents'
import UpcomingEvents from './UpcomingEvents'

const AllPosts = () => {
  return (
    <div>
        <UpcomingEvents/>
        <RenderUpdatedPastEvents/>
    </div>
  )
}

export default AllPosts