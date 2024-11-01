import React, { useRef, useState } from 'react';
import './userCreatePost.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import placeholder from './assets/placeholder.webp'; // Import placeholder image
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import useAuth from './AdminAuth';
import useNetworkStatus from './NetworkStatus';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image'],
    [{ color: [] }, { background: [] }],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent', 'link', 'image', 'color', 'background',
];

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [imageUrl, setImageUrl] = useState(placeholder); // Default to placeholder
const queryClient = useQueryClient();
  const { isOnline } = useNetworkStatus(); // Use the hook
  const { user } = useAuth();
  const inputRef = useRef(null);

  // Handle file input and image preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setImageUrl(url);
    } else {
      setImageUrl(placeholder);
    }
  };

  // Use useMutation hook for creating the post
  const { mutate, isLoading } = useMutation(async (data) => {
    const token = localStorage.getItem('token');

    const res = await axios.post(`${serverUri}/events`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return res.data;
  }, {
    onSuccess: () => {
queryClient.invalidateQueries({queryKey:["Events"]});
      toast.success('Post created successfully!', { autoClose: 3000 });
      setTitle('');
      setContent('');
      setFile(null);
      setSummary('');
      inputRef.current.value="";
      setImageUrl(placeholder);
    },
    onError: (error) => {
      if (axios.isCancel(error)) {
        toast.error('Request timed out. Please try again!', { autoClose: 3000 });
      } else if (error.response && error.response.status === 500) {
        toast.error('Server error. Please try again later.', { autoClose: 3000 });
      } else if (error.message === 'Network Error') {
        toast.error('No internet connection. Please check your connection and try again!', { autoClose: 3000 });
      } else {
        toast.error('Failed to create post. Try again!', { autoClose: 3000 });
      }
    },
  });

  // Function to handle form submission
  const CreatePost = async (e) => {
    e.preventDefault();
    if (!isOnline) {
      toast.error('Failed to create post. Check Your internet connection!', { autoClose: 3000 });
      return;
    }

    // Create a FormData object and append necessary data
    const data = new FormData();
    data.append('file', file);
    data.append('content', content);
    data.append('title', title);
    data.append('summary', summary);

    try {
      await mutate(data);
      // Reset form fields after successful post
     
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
   <h2 className=' text-center text-white'>Create Event</h2>    
  <ToastContainer/>

      <form onSubmit={CreatePost}>
        <div className="user-form-wrapper">
           
          <div className="user-form-container">
            <div>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="file">Optional</label>
              <input
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
              />
            </div>

            <div>
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                required
              />
            </div>

            <div>
              <button type="submit" className="post-btn" disabled={isLoading}>
                {isLoading ? 'Creating Post...' : 'Create Post'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;

   
