/* import React, { useEffect, useState } from 'react';
import './posts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import AdminConfirmDelete from './AdminConfirmDelete';
import { ThreeDots } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from './AdminAuth';

const AdminNews = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [openDeleteId, setOpenDeleteId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [sortOrder, setSortOrder] = useState('ascending'); // State for sort order
  const [deleteEndpoint, setDeleteEndPoint]=useState('')
 
  const queryKey = "news";
  useEffect(() => {
    if (user) {
      setUserId(user.id); 
    }
  }, [user]);

  const serverUri = 'http://localhost:3000';

  const fetchPosts = async () => {
    if (!userId) return []; 
    try {
      const res = await axios.get(`${serverUri}/news`, { timeout: 10000 });
      return res.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Error fetching posts');
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['news', userId],
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
    setDeleteEndPoint(`news/${postId}`);
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
      <ToastContainer  />
      
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

export default AdminNews; */

import React, { useEffect, useState, useRef } from 'react';
import './posts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import AdminConfirmDelete from './AdminConfirmDelete';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from './AdminAuth';
import io from 'socket.io-client';

const AdminNews = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [openDeleteId, setOpenDeleteId] = useState(null);
  const [sortOrder, setSortOrder] = useState('ascending'); 
  const [deleteEndpoint, setDeleteEndPoint] = useState('');
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
      queryClient.invalidateQueries(['news']);
      toast.success('New post created!');
    };

    const handlePostDeleted = ({ id }) => {
      queryClient.invalidateQueries(['news']);
      toast.success(`Post ${id} deleted!`);
    };

    const handlePostUpdated = () => {
      queryClient.invalidateQueries(['news']);
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

  // Fetch news using useQuery
  const { data: newsData = [], isLoading, isError } = useQuery(['news'], async () => {
    const { data } = await axios.get('http://localhost:3000/news', { timeout: 10000 });
    return data;
  });

  // Mutation for deleting posts
  const deletePostMutation = useMutation(async (postId) => {
    await axios.delete(`http://localhost:3000/news/${postId}`);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['news']); // Refetch news after deleting
      toast.success('Post deleted successfully!');
    },
    onError: () => {
      toast.error('Error deleting post');
    }
  });

  const handleDeleteClick = (postId) => {
    setOpenDeleteId(postId);
    setDeleteEndPoint(`news/${postId}`);
  };

  // Handle delete confirmation
  const handleConfirmDelete = (postId) => {
    deletePostMutation.mutate(postId); // Trigger delete mutation
    setOpenDeleteId(null); // Close confirmation modal
  };

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

  // Handle sorting
  const sortedPosts = [...newsData].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'ascending' ? dateA - dateB : dateB - dateA;
  });

  if (isLoading) {
    return <p className='text-white text-center'>Loading...</p>;
  }

  if (isError) {
    toast.error('An error occurred while fetching posts!');
    return <p className='text-white text-center'>Error loading posts</p>;
  }

  return (
    <div className='body-container'>
      <ToastContainer containerId="containerA" />

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

      {sortedPosts.map(({ _id, title, content, file, author, createdAt }) => (
        <div className="larger-news-container" key={_id}>
          <div className="edit-wrapper">
            <Link to={`/admin/edit/${_id}`} className="btn btn-success">
              <FontAwesomeIcon icon={faPenToSquare} />
            </Link>
            <button onClick={() => handleDeleteClick(_id)} className="btn btn-danger">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
          {openDeleteId === _id && (
            <AdminConfirmDelete postId={_id} deleteEndpoint={deleteEndpoint} onConfirm={() => handleConfirmDelete(_id)} setOpenDeleteId={setOpenDeleteId} />
          )}

          <div className="image-content-wrapper">
            {file && (
              <div className="image">
                <img src={file} alt={title} />
              </div>
            )}
            <div className="content">
              <h5 className='text-success'>{title}</h5>
              <div className="text-white" dangerouslySetInnerHTML={{ __html: content }}></div>
              <div className="author">
                <p className="text-dark">By <i>{author}</i></p>
                <p className="text-dark">
                  Posted <span className="date-info">{formatDate(createdAt)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminNews;
