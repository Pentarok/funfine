import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
const DatabaseError = () => {
  return (
    <div style={{minHeight:'100vh', padding:'30px',display:'flex',justifyContent:'center',alignItems:'center'}}>
        <div className="" style={{
            border:'1px solid white',
            borderRadius:'5px',
            maxWidth:'450px',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            flexDirection:'column',
            backgroundColor:'white',
           padding:'15px'
        }}>
            <div>
              <i>  <h2 className='text-danger'>Database Error</h2></i>
                <p>There was an error establishing database connection</p>
                <p>The administrator of this website should look into this matter</p>
            </div>
        </div>
    </div>
  )
}

export default DatabaseError