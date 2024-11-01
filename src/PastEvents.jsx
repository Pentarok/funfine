import React, { useEffect, useState, useRef } from 'react';
import './posts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, ToastContainer } from 'react-toastify';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import ConfirmDelete from './ConfirmDelete';
import { io } from 'socket.io-client';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import useAuth from './Auth';

const PastEvents = ({userId}) => {
  const serverUri = import.meta.env.VITE_BACKEND_URL;
 
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState('ascending');
  const [openDeleteId, setOpenDeleteId] = useState(null);
  
  const queryClient = useQueryClient();
  const socket = useRef(null);

  

  // Initialize socket connection once
  useEffect(() => {
    if (!socket.current) {
      socket.current = io(serverUri);
      socket.current.on('connect', () => {
        console.log('Socket connected');
      });

      socket.current.on('connect_error', (err) => {
        console.error('Connection Error:', err);
      });
    }

    return () => {
      socket.current?.disconnect();
    };
  }, [serverUri]);

  // Socket event listeners
  useEffect(() => {
    const handlePostCreated = () => {
      queryClient.invalidateQueries(['allPosts','PastEvents']);
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

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${serverUri}/userposts/past/${userId}`);
      console.log(res)
      if (res.data && Array.isArray(res.data)) {
        return res.data;
      } else {
        toast.error('No posts found.');
        return [];
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts. Please try again later.');
      return [];
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['PastEvents',userId],
    queryFn: fetchPosts,
  });

  // Update posts state when data changes
  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  // Format date utility
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

  // Handle loading states
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

  // Conditional rendering for empty posts
  if (!sortedPosts || sortedPosts.length === 0) {
    return <div className="center-null-posts">
      <div className="null-posts">
      <p className='text-white text-center'>You have no past events</p></div></div>
  }
const toggleEventView = async(postId)=>{
  const res = await axios.post(`${serverUri}/toggleEventsView/${postId}`);
  console.log(res);
  if(res){
    queryClient.invalidateQueries(['PastEvents',userId])
  }
}
  return (
    <div className='body-container'>
      <h1 className='text-center' style={{ color: 'white' }}>Past Events</h1>

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
          {post.pastRender === false && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'yellow' }}>
              <p>This event has passed. Ensure it is updated before enabling public view (e.g., by narrating the happenings and adding a cover photo).</p>
          
          

            </div>


          )}
<div className='toggle-event-status'>
  <button onClick={()=>toggleEventView(post._id)}>{post.pastRender?'Disable Public access':'Enable public view'}</button>
</div>
          <div className="edit-wrapper">
            <Link to={`/user/edit/past-events/${post._id}`} className="btn btn-success">
              <FontAwesomeIcon icon={faPenToSquare} color='white' />
            </Link>
            <button onClick={() => setOpenDeleteId(post._id)} className="btn btn-danger">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
          {openDeleteId === post._id && (
            <ConfirmDelete postId={post._id} setOpenDeleteId={setOpenDeleteId} />
          )}

          <div className="image-content-wrapper">
            {post.file && (
              <div className="image">
                <img src={post.file} alt="" />
              </div>
            )}
              {post.coverPhoto ? (
              <div className="image">
                <img src={post.coverPhoto} alt="" />
              </div>
            ) : <p className='text-white'>This post has no coverPhoto!</p>}
             

            <div className="content">
              <h5 className='text-success'>{post.title}</h5>
              
              <div className="author">
                <p className="text-dark"> <strong>Started:&nbsp;</strong><i>{formatDate(post.startDateTime)}</i></p>
                <p className="text-dark"><strong>Ended:&nbsp;</strong><i>{formatDate(post.endDateTime)}</i></p>
                <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
               
               
                <p className="text-dark">
                  Posted <span className="date-info">{formatDate(post.createdAt)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      <ToastContainer containerId='G' />
    </div>
  );
};

export default PastEvents;
