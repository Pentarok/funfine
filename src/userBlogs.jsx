/* 
import React, { useEffect, useState } from 'react';
import './posts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

import { ThreeDots } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from './Auth';

const UserBlogs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [userId, setUserId] = useState(null);

  // Set userId once the user is fetched
  useEffect(() => {
    if (user) {
      setUserId(user.id); // Ensure user.id is defined before using it
    }
  }, [user]);

  const serverUri = 'http://localhost:3000';

  const fetchPosts = async () => {
    if (!userId) return []; // Return an empty array if userId is not available yet

    try {
      const res = await axios.get(`${serverUri}/userposts/${userId}`, { timeout: 10000 });
      console.log(res)
      return res.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Error fetching posts');
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', userId],
    queryFn: fetchPosts,
    enabled: !!userId, // Ensure the query is only run when userId is available
    onSuccess: () => {
      // Handle success
    },
    onError: () => {
      toast.error('An error occurred while fetching posts!', { autoClose: 3000 });
    }
  });

  const deletePost = async (postId) => {
    const res = await axios.delete(`${serverUri}/post/${postId}`);
    return res.data;
  };

  const deletemutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully!', { autoClose: 3000 });
    },
    onError: () => {
      toast.error('An error occurred while deleting the post!', { autoClose: 3000 });
    }
  });

  const handleDelete = (postId) => {
    deletemutation.mutate(postId);
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

  if (error) {
    return <div>An error occurred</div>;
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

  return (
    <div>
      {data.map((post, i) => (
        <div className="larger-container" key={i}>
          <div className="edit-wrapper">
            <Link to={`/edit/${post._id}`} className="btn btn-success">
              <FontAwesomeIcon icon={faPenToSquare} />
            </Link>
            <button onClick={() => handleDelete(post._id)} className="btn btn-danger">
              Delete Post
            </button>
          </div>
          <div className="image-content-wrapper">
            {post.file && (
              <div className="image">
                <img src={post.file} alt="" />
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

export default UserBlogs;

 */
import React, { useEffect, useState } from 'react';
import './posts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import ConfirmDelete from './ConfirmDelete';
import { ThreeDots } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from './Auth';

const UserBlogs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [openDeleteId, setOpenDeleteId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [sortOrder, setSortOrder] = useState('ascending'); // State for sort order

  useEffect(() => {
    if (user) {
      setUserId(user.id); 
    }
  }, [user]);
  const serverUri = import.meta.env.VITE_BACKEND_URL;

  const fetchPosts = async () => {
    if (!userId) return []; // Return an empty array if no userId is present
    try {
      const res = await axios.get(`${serverUri}/userposts/upcoming/${userId}`, { timeout: 10000 });
      return res.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Error fetching posts');
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["userPosts"],
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


  if (error) {
    return <div><p className='text-white text-center'>An error occurred: {error.message}</p></div>;
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

  // Check if data is an array and has valid posts
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="center-null-posts">
      <div className="null-posts">
      <p className='text-white text-center'>You have no upcoming events</p></div></div>;
  }

  // Sort posts based on the selected order
  const sortedPosts = [...data].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'ascending' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className='body-container'>
      <ToastContainer containerId='H' />
      <h3 className='text-white text-center'>My Upcoming Events</h3>
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
        <div className="larger-container" key={post._id}>
          <div className="edit-wrapper">
            <Link to={`/user/edit/${post._id}`} className="btn btn-success">
              <FontAwesomeIcon icon={faPenToSquare} />
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
                <img src={post.file} alt={post.title} />
              </div>
            )}
            <div className="content">
              <h5 className='text-success'>{post.title}</h5>

              <div className="author">
                <p><strong>Starts</strong> <span>{formatDate(post.startDateTime)}</span></p>
                <p> <strong>Ends</strong> <span>{formatDate(post.endDateTime)}</span></p>
                <p className="text-dark"><strong>Venue &nbsp;</strong> <i>{post.venue}</i></p>
             
                <div className="text-white" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                <p className="text-primary">
                  Posted <span className="text-primary">{formatDate(post.createdAt)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserBlogs;
