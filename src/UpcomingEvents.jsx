import React, { useState } from 'react';
import './posts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThreeDots } from 'react-loader-spinner';
import MediaCard from './Card';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';

const UpcomingEvents = () => {
  const serverUri = import.meta.env.VITE_BACKEND_URL;
  const [sortOrder, setSortOrder] = useState('ascending');

  const fetchPosts = async () => {
    const res = await axios.get(`${serverUri}/upcoming/events`);
    if (!res.data) {
      throw new Error('No data returned');
    }
    return res.data;
  };

  const { data: posts, isLoading, error, isError } = useQuery({
    queryKey: ['upcoming'],
    queryFn: fetchPosts,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 10000,
    retry: 2, // Retry failed requests twice
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

  // Sort posts based on the selected order
  const sortedPosts = posts
    ? [...posts].sort((a, b) => {
        const dateA = new Date(a.startDateTime);
        const dateB = new Date(b.endDateTime);
        return sortOrder === 'ascending' ? dateA - dateB : dateB - dateA;
      })
    : [];

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

  if (isError) {
    return <div><p className='text-white text-center'>An error occurred: {error.message}</p></div>;
  }

  if (sortedPosts.length === 0) {
    return (
      <div className='center-null-posts'>
        <div className='null-posts'>
          <p className='text-white text-center'>No upcoming events available</p>
        </div>
      </div>
    );
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
        {sortedPosts.map((event, i) => (
          <MediaCard key={i} event={event} formatDate={formatDate} />
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default UpcomingEvents;
