import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './Auth';

const PollingSuspensionChecker = ({ pollingInterval = 10000 }) => {
  const { user } = useAuth(); // Access the user object
  const navigate = useNavigate();
  const [isSuspended, setIsSuspended] = useState(user?.isSuspended); // Track suspension status locally

  useEffect(() => {
    if (!user) return; // No need to poll if the user isn't logged in

    const interval = setInterval(() => {
      if (user.isSuspended !== isSuspended) {
        setIsSuspended(user.isSuspended); // Update local state
      }

      if (user.isSuspended) {
        // Log out or redirect when suspended
        navigate('/login');
      }
    }, pollingInterval);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [user, isSuspended, pollingInterval, navigate]);

  return null; // This component doesn't render anything
};

export default PollingSuspensionChecker;
