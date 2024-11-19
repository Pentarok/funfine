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
import useAuth from './AdminAuth';

const UserBlogs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [openDeleteId, setOpenDeleteId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [eventViewLoading,setEventEviewLoading]=useState(false);
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
      const res = await axios.get(`${serverUri}/posts`, { timeout: 10000 });
      return res.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Error fetching posts');
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["AllPosts",userId],
    queryFn: fetchPosts,
    enabled: !!userId,
    onError: () => {
      toast.error('An error occurred while fetching posts!', { autoClose: 3000 });
    }
  });


  const toggleEventView = async (postId) => {
    // Optimistically update the UI
    const updatedPosts = data.map((post) => 
      post._id === postId ? { ...post, postRender: !post.postRender } : post
    );
    queryClient.setQueryData(["AllPosts", userId], updatedPosts);
  
    // Set loading state
    setEventEviewLoading(true);
  
    try {
      await axios.post(`${serverUri}/toggleEventsView/${postId}`);
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries(["AllPosts", userId]);
    } catch (error) {
      console.error('Error toggling event view:', error);
      // Revert the optimistic update in case of an error
      queryClient.setQueryData(["AllPosts", userId], data);
      toast.error('Failed to toggle public view!');
    } finally {
      setEventEviewLoading(false);
    }
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

  // Check if data is an array and has valid posts
  if (!data || !Array.isArray(data) || data.length === 0) {
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
        <div className="larger-container" key={post._id}>
          <div className="edit-wrapper">
            {/* <Link to={`/user/edit/${post._id}`} className="btn btn-success">
              <FontAwesomeIcon icon={faPenToSquare} />
            </Link> */}
            <button onClick={() => setOpenDeleteId(post._id)} className="btn btn-danger">
              <FontAwesomeIcon icon={faTrash} />
            </button>

   
          </div>
          <div className='toggle-event-status'>
{eventViewLoading
? 
<div className='text-center d-flex justify-content-center align-items-center'>
<ThreeDots
  height="80"
  width="80"
  radius="9"
  color="white"
  ariaLabel="three-dots-loading"
/>
</div>

: <button onClick={()=>toggleEventView(post._id)} style={{marginTop:'5px'}}>{post.postRender?'Disable Public access':'Enable public view'}</button>}  
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
                <p className="text-dark"> <strong>{post.isPast?'Started':'Starts'}:&nbsp;</strong><i>{formatDate(post.startDateTime)}</i></p>
                <p className="text-dark"><strong>{post.isPast?'Ended':'Ends'}:&nbsp;</strong><i>{formatDate(post.endDateTime)}</i></p>
                <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
               
               
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
