import { useState, useEffect } from "react";

export function useDatabaseCheck() {
  const [isConnected, setIsConnected] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const serverUri = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function checkConnection() {
      setLoading(true); // Set loading to true when starting the check
      try {
        const response = await fetch(`${serverUri}/api/check-db-connection`);
        const data = await response.json();

        if (data.connected) {
          setIsConnected(true);
          setMessage("Database connection successful.");
        } else {
          setIsConnected(false);
          setMessage("Failed to connect to the database.");
        }
      } catch (error) {
        setIsConnected(false);
        setMessage("Database connection error: " + error.message);
      } finally {
        setLoading(false); // Set loading to false when the check is complete
      }
    }

    checkConnection();
  }, []);

  return { isConnected, message, loading }; // Return the loading state
}
