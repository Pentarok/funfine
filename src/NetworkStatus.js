import { useEffect, useState } from 'react';

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Log the initial network status
    console.log('Initial connection status:', navigator.onLine ? 'Online' : 'Offline');

    // Handler for online event
    const handleOnline = () => {
      setIsOnline(true);
      console.log('User is online');
    };

    // Handler for offline event
    const handleOffline = () => {
      setIsOnline(false);
      console.log('User is offline');
    };

    // Add event listeners for network status changes
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Log any errors if they occur
  useEffect(() => {
    if (!navigator.onLine) {
      setError('No internet connection detected.');
      console.error('Error: No internet connection');
    } else {
      setError(null);
    }
  }, [isOnline]);

  return { isOnline, error };
};

export default useNetworkStatus;
