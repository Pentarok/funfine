/* import React, { useContext, useState } from 'react'

import image from './assets/study.jpeg'
import './posts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PostContext } from './homepage';

const Posts = () => {
   
    const posts = useContext(PostContext)
    function formatDate(dateString) {
      const date = new Date(dateString);
    
      const options = {
        weekday: 'long', // Example: 'Tuesday'
        year: 'numeric',
        month: 'long', // Example: 'September'
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true // 12-hour clock (AM/PM)
      };
    
      return date.toLocaleString('en-US', options);
    }
    
 
    
     
  return (
    <div>
              <div>


        {posts.map((post,i)=>
        <div className="larger-container">
       
        <div className="image-content-wrapper" key={i} >
            <div className="image">
              <img src={`${serverUri}/${post.file}`} alt="" />
            </div>
                       <div className="content">
                    <div className=" text-white"  dangerouslySetInnerHTML={{__html:post.content}}>
                  
                        </div>
                        <div className='author'>
                          <p className='text-white'>By &nbsp;<i>{post.author}</i></p>
                          <p className='text-white'>Posted <span className='date-info'> {formatDate(post.createdAt)}</span></p>
                        </div>
                  </div>
                        
  </div>
  </div> )}

</div>
    </div>
  )
}

export default Posts */
/* 
import React, { useEffect, useState } from 'react';
import './posts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const Posts = () => {

  const serverUri = 'http://localhost:3000';



  const fetchPosts = async () => {
    try {
     
      const res = await axios.get(`${serverUri}/posts`);
      const data = res.data;
      return data;
     
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };


const { data, isLoading, error}=useQuery({
  queryKey:["allPosts"],
  queryFn:fetchPosts,

})


  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, // 12-hour clock (AM/PM)
    };
    return date.toLocaleString('en-US', options);
  }

  if(isLoading){
    return <div className='text-center text-white d-flex justify-content-center align-items-center'> <ThreeDots
    height="80"
    width="80"
    radius="9"
    color="blue"
    ariaLabel="three-dots-loading"
  /></div>; // Handle loading state if userInfo is null
}
 
  // Conditional rendering for empty posts or loading state
  if (!data || data.length === 0) {
    return <p className='text-dark text-center'>No posts available</p>;
  }

  return (
    <div>
      <h1 className='text-center' style={{color:'white'}}>Posts</h1>
      {data.map((post, i) => (
        <div className="larger-container" key={i}>
          <div className="image-content-wrapper">
            {post.file!==null ?
            <div className="image">
              
            <img src={post.file} alt="" />
</div>:null
 
            }
           
            <div className="content">
              <h5 className='text-success'>{post.title}</h5>
              <div
                className=""
                dangerouslySetInnerHTML={{ __html: post.content }}
              ></div>
              <div className="author">
                <p className="text-dark">
                  By &nbsp;<i>{post.author}</i>
                </p>
                <p className="text-dark">
                  Posted <span className="date-info">{formatDate(post.createdAt)}</span>
                </p>
              </div>
            </div>
          </div>
          <div>


          </div>
        
        </div>
      ))}
    </div>
  );
};

export default Posts;
 */

import React, { useEffect, useState } from 'react';
import './posts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { io } from 'socket.io-client';
import { useQuery } from '@tanstack/react-query';
import { server } from 'websocket';

const Posts = () => {
  const serverUri = import.meta.env.VITE_BACKEND_URL;
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState('ascending'); // State for sort order

const queryClient = useQueryClient();
  
  const socket = useRef(io(serverUri)); // Initialize socket connection

  // Socket event listeners
  useEffect(() => {
    socket.current = io(serverUri);

    socket.current.on('connect', () => {
      console.log('Socket connected');
    });

    socket.current.on('connect_error', (err) => {
      console.error('Connection Error:', err);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Refetch news on WebSocket events
  useEffect(() => {
    const handlePostCreated = () => {
      queryClient.invalidateQueries(['allPosts']);
      toast.success('New post created!');
    };

    const handlePostDeleted = ({ id }) => {
      queryClient.invalidateQueries(['allPosts']);
      toast.success(`Post ${id} deleted!`);
    };

    const handlePostUpdated = () => {
      queryClient.invalidateQueries(['allPosts']);
      toast.success('Post updated!');
    };

    socket.current.on('postCreated', handlePostCreated);
    socket.current.on('postDeleted', handlePostDeleted);
    socket.current.on('postUpdated', handlePostUpdated);

    return () => {
      socket.current.off('postCreated', handlePostCreated);
      socket.current.off('postDeleted', handlePostDeleted);
      socket.current.off('postUpdated', handlePostUpdated);
    };
  }, [queryClient]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${serverUri}/posts`);
      return res.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['allPosts'],
    queryFn: fetchPosts,
  });


  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  // Sort posts based on the selected order
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'ascending' ? dateA - dateB : dateB - dateA;
  });

  if (isLoading) {
    return (
      <div className='text-center text-white d-flex justify-content-center align-items-center'>
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="blue"
          ariaLabel="three-dots-loading"
        />
      </div>
    );
  }

  // Conditional rendering for empty posts or loading state
  if (!sortedPosts || sortedPosts.length === 0) {
    return <p className='text-white text-center'>No posts available</p>;
  }

  return (
    <div className='body-container'>
      <h1 className='text-center' style={{ color: 'white' }}>Posts</h1>

      {/* Input field for sorting */}
      <div className="sort-wrapper text-center">
        <label htmlFor="sortOrder" className="text-white">Sort by:</label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="ml-2"
        >
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </div>

      {sortedPosts.map((post, i) => (
        <div className="larger-container" key={post._id || i}>
          <div className="image-content-wrapper">
            {post.file !== null ? (
              <div className="image">
                <img src={post.file} alt="" />
              </div>
            ) : null}

            <div className="content">
              <h5 className='text-success'>{post.title}</h5>
              <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
              <div className="author">
                <p className="text-dark">By &nbsp;<i>{post.author}</i></p>
                <p className="text-dark">
                  Posted <span className="date-info">{formatDate(post.createdAt)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
