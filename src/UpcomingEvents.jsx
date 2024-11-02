import React, { useEffect, useState, useRef } from 'react';
import './posts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThreeDots } from 'react-loader-spinner';
import MediaCard from './Card';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { io } from 'socket.io-client';

const UpcomingEvents = () => {
  const serverUri = import.meta.env.VITE_BACKEND_URL;
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState('ascending');
  const queryClient = useQueryClient();
  const socket = useRef(null);

  // Socket event listeners
  useEffect(() => {
    socket.current = io(serverUri, {
      transports: ['websocket'], // Ensure you're using the websocket transport
      withCredentials: true, // Include credentials if your server requires it
    });

    socket.current.on('connect', () => {
      console.log('Socket connected');
    });

    socket.current.on('connect_error', (err) => {
      console.error('Connection Error:', err);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [serverUri]);

  // Refetch posts on WebSocket events
  useEffect(() => {
    const handlePostCreated = () => {
      queryClient.invalidateQueries(['upcoming']);
      toast.success('New post created!');
    };

    const handlePostDeleted = ({ id }) => {
      queryClient.invalidateQueries(['upcoming']);
      toast.success(`Post ${id} deleted!`);
    };

    const handlePostUpdated = () => {
      queryClient.invalidateQueries(['upcoming']);
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
      const res = await axios.get(`${serverUri}/upcoming/events`);
      console.log(res);
      return res.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['upcoming'],
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
    const dateA = new Date(a.startDateTime);
    const dateB = new Date(b.endDateTime);
    return sortOrder === 'ascending' ? dateA - dateB : dateB - dateA;
  });

  if (error) {
    return <div><p className='text-white text-center'>An error occurred: {error.message}</p></div>;
  }

  // Display loading state
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

  // Display message if no posts are available after loading
  if (!sortedPosts || sortedPosts.length === 0) {
    return <div className='center-null-posts'> <div className='null-posts'>
      <p className='text-white text-center'>No upcoming events available</p>
    </div>
    </div>
  }

  return (
    <div className='body-container'>
      <h1 className='text-center' style={{ color: 'white' }}>Upcoming Events</h1>

      {/* Input field for sorting */}
      <div className="sort-wrapper text-center">
        <label htmlFor="sortOrder" className="text-white">Sort by:</label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="ml-2"
        >
          <option value="ascending">Least recent</option>
          <option value="descending">Most recent</option>
        </select>
      </div>

      {/* Cards for displaying events */}
      <div className="card-container">
        {sortedPosts.map((event, i) => <MediaCard key={i} event={event} formatDate={formatDate} />)}
      </div>

      <ToastContainer />
    </div>
  );
};

export default UpcomingEvents;
