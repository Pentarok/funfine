import React, { useEffect, useRef, useState } from 'react';
import './userCreatePost.css';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

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

const EditPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [startDateTime, setStartDateTime] = useState(''); // New state for start date-time
  const [endDateTime, setEndDateTime] = useState('');     // New state for end date-time
  const [venue, setVenue] = useState('');
  

  const [isUpdating, setisUpdating] = useState(false);
  const [currentFile, setCurrentFile] = useState(null); 
  const { id } = useParams();

  const serverUri = import.meta.env.VITE_BACKEND_URL;;
  const inputRef = useRef(currentFile);

  // Fetch post details for editing
  const fetchPost = async () => {
    try {
      const res = await axios.get(`${serverUri}/post/${id}`);
      console.log(res.data);
      setTitle(res.data.title);
      setContent(res.data.content);
      setVenue(res.data.venue);
      setStartDateTime(new Date(res.data.startDateTime).toISOString().slice(0, 16)); // Format datetime-local input
      setEndDateTime(new Date(res.data.endDateTime).toISOString().slice(0, 16));
   
      setCurrentFile(res.data.file);  // Set current file for download
    } catch (error) {
      console.error('Error fetching the post:', error);
      toast.error("Failed to load post data.");
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set a new file if selected
  };

  // Add a new contact to the list
  const addContact = () => {
    if (newContact && !contacts.includes(newContact)) {
      setContacts([...contacts, newContact]);
      setNewContact(''); // Clear input after adding
    }
  };

  // Remove a contact from the list
  const removeContact = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
  };

  // Update post
  const UpdatePost = async () => {
    const data = new FormData();
    if (file) {
      data.append('file', file);
    }
    data.append('content', content);
    data.append('title', title);
    data.append('startDateTime', startDateTime); // Append start date-time
    data.append('endDateTime', endDateTime);     // Append end date-time
    data.append('venue', venue);


    try {
      setisUpdating(true);
      const res = await fetch(`${serverUri}/post/update/${id}`, {
        credentials: 'include',
        method: 'PUT',
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Post updated successfully!");
        setisUpdating(false);
        setContent('');
        setFile(null);
        setTitle('');
        setEndDateTime('');
        setStartDateTime('');
        setVenue('');
        inputRef.current.value = ''; // Clear file input
      } else {
        toast.error("Failed to update post.");
        setisUpdating(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the post.");
      setisUpdating(false);
    }
  };

  // Go back function
  const goBack = () => {
    window.history.back();
  };

  return (
    <div>
      <div style={{ margin: '10px' }}>
        <button onClick={goBack} className='btn btn-primary'>Go back</button>
      </div>
      <div className="edit-post-container d-flex justify-content-center align-items-center">
        <div >
          <div className="user-form-wrapper" style={{ maxWidth: '450px' }}>
            <div className="user-form-container">
              <button className='btn btn-danger' onClick={goBack}>Cancel</button>
              <h4 className='text-center text-success '>Edit Post</h4>

              {/* Title */}
              <div>
                <label className='fw-bold'>Title</label>
                <input
                  type='text'
                  placeholder='Title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Venue */}
              <div>
                <label className='fw-bold'>Venue</label>
                <input
                  type='text'
                  placeholder='Venue'
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
              </div>

              {/* Start DateTime */}
              <div>
                <label className='fw-bold'>Start Date & Time</label>
                <input
                  type='datetime-local'
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                />
              </div>

              {/* End DateTime */}
              <div>
                <label className='fw-bold'>End Date & Time</label>
                <input
                  type='datetime-local'
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                />
              </div>


              {/* File */}
              <div>
                <input
                  type="file"
                  ref={inputRef}
                  onChange={handleFileChange} // Set file with correct handler
                />
              </div>

              {/* Content */}
              <div>
                <ReactQuill value={content} onChange={setContent} formats={formats} modules={modules} />
              </div>

              {/* Update Button */}
              <div>
                <button className='post-btn' onClick={UpdatePost} disabled={isUpdating}>
                  {isUpdating ? 'Updating Post...' : 'Update Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer containerId='E' />
      </div>
    </div>
  );
};

export default EditPost;
