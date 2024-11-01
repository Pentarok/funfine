import React from 'react'

import News from './News'
import AdminNews from './AdminNews'

const NewsContainer = () => {
  return (
    <div>
        <CreateNews/>
        <AdminNews/>
        <News/>
    </div>
  )
}

export default NewsContainer