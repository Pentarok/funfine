import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './News.css';

const NewsForm = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const serverUri = import.meta.env.VITE_BACKEND_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!subject || !message) {
      toast.error('Both subject and message are required');
      return;
    }

    setLoading(true);

    try {
      // Send news data to backend
      const response = await axios.post(`${serverUri}/send-news`, { subject, message });
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Error sending news');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='news-mega-container'>
    <div className='news-form-container'>
      <h2 className='text-white text-center'>Send News</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className='text-white'>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label className='text-white'>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="btn-wrapper">
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send News'}
        </button>
        </div>

      </form>
      <ToastContainer />
    </div>
    </div>
  );
};

export default NewsForm;
