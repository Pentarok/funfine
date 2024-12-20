import React, { useEffect, useState, useRef } from 'react';
import './posts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import MediaCard from './UpdatedCard';
import useNetworkStatus from './NetworkStatus'

const RenderUpdatedPastEvents = () => {
  const serverUri = import.meta.env.VITE_BACKEND_URL;
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState('ascending');
  const [timeoutError, setTimeoutError] = useState(false);
  const queryClient = useQueryClient();
 /*  const socket = useRef(io(serverUri)); */

  const {isOnline}=useNetworkStatus();
  // Netlify and vercel do not support web sockets
  /* useEffect(() => {
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
  }, [serverUri]);

  useEffect(() => {
    const handlePostCreated = () => {
      queryClient.invalidateQueries(['UpdatedPastEvents']);
      toast.success('New post created!');
    };

    const handlePostDeleted = ({ id }) => {
      queryClient.invalidateQueries(['allPosts']);
      toast.success(`Post ${id} deleted!`);
    };

    const handlePostUpdated = () => {
      queryClient.invalidateQueries(['UpdatedPastEvents']);
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
 */
  const fetchPosts = async () => {
    const source = axios.CancelToken.source();
    const timer = setTimeout(() => {
      source.cancel('Request timed out');
    }, 15000);

    try {
      const res = await axios.get(`${serverUri}/posts/updated/events`, {
        cancelToken: source.token,
      });
      clearTimeout(timer);
      setTimeoutError(false);
      return res.data;
    } catch (error) {
      clearTimeout(timer);
      if (axios.isCancel(error)) {
        setTimeoutError(true);
        throw new Error('Request took too long to respond');
      }
      console.error('Error fetching posts:', error);
      setTimeoutError(true);
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['UpdatedPastEvents'],
    queryFn: fetchPosts,
    retry: false,
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchIntervalInBackground: true, // Keep refetching in the background
    staleTime: 10000, // Data is fresh for 10 seconds
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

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.startDateTime);
    const dateB = new Date(b.endDateTime);
    return sortOrder === 'ascending' ? dateA - dateB : dateB - dateA;
  });

  if (isLoading && !timeoutError) {
    return (
      <div className="text-center text-white d-flex justify-content-center align-items-center">
        <ThreeDots height="80" width="80" radius="9" color="blue" ariaLabel="three-dots-loading" />
      </div>
    );
  }

  if (timeoutError) {
    return (
      <div className="text-center text-white">
        <p>Request timed out. Please try again later.</p>
      </div>
    );
  }

  if (error && !timeoutError) {
    return (
      <div className="text-white text-center">
        <p>An error occurred: {error.message}</p>
      </div>
    );
  }
if(!isOnline){

return <div>Error</div>
}
  if (!sortedPosts || sortedPosts.length === 0) {
    return (
      <div className="center-null-posts">
        <div className="null-posts">
          <p className="text-center text-white">No past events available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="body-container">
      <h1 className="text-center" style={{ color: 'white' }}> Past events</h1>

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

      {sortedPosts.map((post, i) => <MediaCard key={i} event={post} />)}
    </div>
  );
};

export default RenderUpdatedPastEvents;
