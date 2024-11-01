import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const serverUri = import.meta.env.VITE_BACKEND_URL;
useEffect(()=>{
  console.log(session)
},[session])

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        console.log('Token:', token); // Debug log for token

        if (token) {
          // Verify the token with the server
          const response = await axios.get(`${serverUri}/verifyadmin`, {
            headers: {
              Authorization: `Bearer ${token}` // Pass the token in Authorization header
            },
            withCredentials: true
          });
console.log(response)
          console.log('Response from server:', response.data); // Log the response

          if (response.data && response.data.user) {
            setUser(response.data.user);
            setSession(true);
          
          } else {
            setSession(false);
        
          }
        } else {
          setSession(false);
        }
      } catch (err) {
        setError(err);
        console.error('Error verifying admin:', err); // Debug log for error
        setSession(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return { user, session, error, loading };
};

export default useAuth;
