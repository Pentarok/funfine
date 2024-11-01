import React, { useEffect, useState } from 'react';
import './posts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { useRef } from 'react';
import AdminConfirmDelete from './AdminConfirmDelete';
import { ThreeDots } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from './AdminAuth';
import io from 'socket.io-client';

const AdminEvents = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [openDeleteId, setOpenDeleteId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [sortOrder, setSortOrder] = useState('ascending'); // State for sort order
  const [deleteEndpoint, setDeleteEndPoint]=useState('')
 
  const queryKey = "Events";
  useEffect(() => {
    if (user) {
      setUserId(user.id); 
    }
  }, [user]);

  const socket = useRef(io('http://localhost:3000')); // Initialize socket connection

  // Socket event listeners
  useEffect(() => {
    socket.current = io('http://localhost:3000');

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
      queryClient.invalidateQueries(['Events']);
      toast.success('New post created!');
    };

    const handlePostDeleted = ({ id }) => {
      queryClient.invalidateQueries(['Events']);
      toast.success(`Post ${id} deleted!`);
    };

    const handlePostUpdated = () => {
      queryClient.invalidateQueries(['Events']);
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

  const serverUri = 'http://localhost:3000';

  const fetchPosts = async () => {
    if (!userId) return []; 
    try {
      const res = await axios.get(`${serverUri}/events`, { timeout: 10000 });
      return res.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Error fetching posts');
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['Events', userId],
    queryFn: fetchPosts,
    enabled: !!userId,

    onError: () => {
      toast.error('An error occurred while fetching posts!', { autoClose: 3000 });
    }
  });

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


  const handleDeleteClick = (postId)=>{
    setOpenDeleteId(postId);
    setDeleteEndPoint(`event/${postId}`);
  }
  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  if (isLoading) {
    return (
      <div className='text-center d-flex justify-content-center align-items-center'>
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

  if (!data || data.length === 0) {
    return <p className='text-white text-center'>You have no posts yet</p>;
  }

  // Sort posts based on the selected order
  const sortedPosts = [...data].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'ascending' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className='body-container'>
      <ToastContainer />
      
      {/* Input field for sorting */}
      <div className="sort-wrapper text-center mb-3">
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

      {sortedPosts.map((post) => (
        <div className="larger-news-container" key={post._id}>
          <div className="edit-wrapper">
            <Link to={`/admin/edit/event/${post._id}`} className="btn btn-success">
              <FontAwesomeIcon icon={faPenToSquare} />
            </Link>
            <button onClick={() => handleDeleteClick(post._id)} className="btn btn-danger">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
          {openDeleteId === post._id && (
            <AdminConfirmDelete postId={post._id} deleteEndpoint={deleteEndpoint} setOpenDeleteId={setOpenDeleteId} setDeleteEndPoint={setDeleteEndPoint} queryKey={queryKey}/>
          )}

          <div className="image-content-wrapper">
            {post.file && (
              <div className="image">
                <img src={post.file} alt={post.title} />
              </div>
            )}
            <div className="content">
              <h5 className='text-success'>{post.title}</h5>
              <div className="text-white" dangerouslySetInnerHTML={{ __html: post.content }}></div>
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

export default AdminEvents;