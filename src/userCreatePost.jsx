/* import React, { useEffect, useRef, useState } from 'react';
import './userCreatePost.css';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import placeholder from './assets/placeholder.webp'; // Import placeholder image
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import useAuth from './Auth';
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    [{ 'font': [] }],
    [{ 'size': [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image'],
    [{ 'color': [] }, { 'background': [] }],  // Color and background color
    ['clean']  // Clear formatting
  ],
  clipboard: {
    matchVisual: false, // Disable automatic inline styles conversion
  }
};


const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'color', // Add color to formats
  'background' // Add background color to formats
];


const UserCreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [date, setdate] = useState('');
  const [imageUrl, setImageUrl] = useState(null); // State for image URL
  const [isSubmitting, setIsSubmitting] = useState(false); // Track post creation state
  

  const { user} = useAuth(); // Destructure user from useAuth

console.log(user)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Create a URL for the selected file and set it to the imageUrl state
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setImageUrl(url);
    } else {
      // Set placeholder if no file is selected
      setImageUrl(null);
    }
  };

  const inputRef = useRef(null);

  // Use useMutation hook
  const { mutate, isError, isPending } = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem('token'); // Get token from localStorage
  
      const res = await axios.post('http://localhost:3000/posts', data, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in Authorization header
        },
        withCredentials: true, // Ensure credentials are sent
      });
  
      return res.data; // Return the data after the request
    },
  });
  


  const CreatePost = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set loading state

    // Create a FormData object and append necessary data
    const data = new FormData();
    data.append('file', file);
    data.append('content', content);
    data.append('title', title);
    data.append('date', date);

    // Use mutate to trigger the mutation
    mutate(data, {
      onSuccess: (response) => {
        console.log('Post created successfully:', response);
        setIsSubmitting(false); // Reset loading state
      },
      onError: (error) => {
        console.error('Post creation failed:', error.message);
        setIsSubmitting(false); // Reset loading state
      },
    });
  };


  return (
    <div>
 {user && <h4 className='text-white'>{user.author}</h4>}
      <ToastContainer /> 
      <form action="" onSubmit={CreatePost}>
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
                placeholder="date"
                value={date}
                onChange={(e) => setdate(e.target.value)}
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
  modules={modules}  // Ensure you're passing the modules prop
  formats={formats}  // Ensure you're passing the formats prop
  required
/>

            </div>
            <div>
              <button type="submit" className="post-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Post...' : 'Create Post'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserCreatePost;
 */


/* import React, { useRef, useState } from 'react';
import './userCreatePost.css';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import placeholder from './assets/placeholder.webp'; // Import placeholder image
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import useAuth from './Auth';
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

const UserCreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [date, setDate] = useState('');
  const [venue,setVenue]=useState('');
  const [contacts,setContacts]=useState([]);
  const [imageUrl, setImageUrl] = useState(placeholder); // Default to placeholder

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

    const res = await axios.post('http://localhost:3000/posts', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return res.data;
  }, {
    onSuccess: () => {

      toast.success('Post created successfully!', { autoClose: 3000 });
      setTitle('');
      setContent('');
      setFile(null);
      setDate('');
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
    data.append('date', date);
    data.append('contacts',contacts)
    try {
      await mutate(data);
      // Reset form fields after successful post
     
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      
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
                type="date"
                placeholder="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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

export default UserCreatePost;

   
 */




import React, { useRef, useState } from 'react';
import './userCreatePost.css';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import placeholder from './assets/placeholder.webp'; // Import placeholder image
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import useAuth from './Auth';
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

const UserCreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [venue, setVenue] = useState('');
  const [fee,setFee]=useState('');
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState(''); // For new contact input
  const [imageUrl, setImageUrl] = useState(placeholder); // Default to placeholder

  // New state for start and end date/time
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');

  const { isOnline } = useNetworkStatus(); // Use the hook
  const { user } = useAuth();
  const inputRef = useRef(null);
  const serverUri = import.meta.env.VITE_BACKEND_URL;
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

  // Add new contact to the contacts array
  const addContact = () => {
    if (newContact && !contacts.includes(newContact)) {
      setContacts((prevContacts) => [...prevContacts, newContact]);
      setNewContact(''); // Clear input after adding
    }
  };

  // Remove contact from the contacts array
  const removeContact = (contactToRemove) => {
    setContacts((prevContacts) => prevContacts.filter(contact => contact !== contactToRemove));
  };

  // Use useMutation hook for creating the post
  const { mutate, isLoading } = useMutation(async (data) => {
    const token = localStorage.getItem('token');

    const res = await axios.post(`${serverUri}/posts`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return res.data;
  }, {
    onSuccess: () => {
      toast.success('Post created successfully!', { autoClose: 3000 });
      setTitle('');
      setContent('');
      setFile(null);
      setStartDateTime(''); // Reset start date/time
      setEndDateTime(''); // Reset end date/time
      setContacts([]); // Clear contacts after success
      inputRef.current.value = "";
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
    data.append('startDateTime', startDateTime); // Append start date/time
    data.append('endDateTime', endDateTime); // Append end date/time
    data.append('contacts', JSON.stringify(contacts)); // Convert contacts array to JSON string
    data.append('venue', venue);
  /*   data.append('fee',fee); */
    try {
      await mutate(data);
      // Reset form fields after successful post
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      <ToastContainer />

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

            {/* Start Date and Time */}
            <div>
              <label htmlFor="">Start Date and Time</label>
              <input
                type="datetime-local"
                placeholder="Start Date and Time"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                required
              />
            </div>

            {/* End Date and Time */}
            <div>
              <label htmlFor="">End date and Time</label>
              <input
                type="datetime-local"
                placeholder="End Date and Time"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="venue">Venue</label>
              <input
                type="text"
                onChange={(e) => setVenue(e.target.value)}
              />
            </div>
{/*             <div>
              <label htmlFor="">Charges(In Ksh)</label>
              <input
                type="number"
                placeholder="Enter fee"
                value={fee}

                onChange={(e) => setFee(e.target.value)}
                required
              />
            </div> */}
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

            {/* Contacts Management */}
{/*             <div className="contact-section">
              <h3>Contacts</h3>
              <input
                type="text"
                placeholder="Add contact number"
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
              />
              <button type="button" onClick={addContact}>
                Add Contact
              </button>
              <ul>
                {contacts.map((contact, index) => (
                  <li key={index}>
                    {contact} <button type="button" onClick={() => removeContact(contact)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
 */}
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

export default UserCreatePost;
