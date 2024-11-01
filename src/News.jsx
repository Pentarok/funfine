import React, { useEffect, useState } from 'react';
import './posts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useQuery ,useQueryClient} from '@tanstack/react-query';
import { io } from 'socket.io-client';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { useRef } from 'react';

const News = () => {
  const serverUri = import.meta.env.VITE_BACKEND_URL;
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState('descending');
  const queryClient = useQueryClient();
  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`${serverUri}/news`);
      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Error fetching posts');
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: fetchPosts,
  });


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


  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
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

  if (error) {
    return <p className='text-danger text-center'>Error fetching posts. Please try again later.</p>;
  }

  // Conditional rendering for empty posts
  if (sortedPosts.length === 0) {
    return <p className='text-white text-center'>No posts available.</p>;
  }

  return (
    <div className='body-container'>
      <h1 className='text-center' style={{ color: 'white' }}>News</h1>

      {sortedPosts.map((post, index) => (
        <div className="larger-news-container" key={post._id || index}>
          <div className="image-content-wrapper">
            {post.file && (
              <div className="image">
                <img src={post.file} alt={post.title} />
              </div>
            )}
            <div className="content">
              <h5 className='text-success'>{post.title}</h5>
              <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
              <div className="author">
                <p className="text-dark">By <i>{post.author}</i></p>
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

export default News;
