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

const EditNews = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);  // Ensure the file state is initialized correctly
  const [summary, setSummary] = useState('');
 
  const [isUpdating,setisUpdating]=useState(false);
  const [currentFile, setCurrentFile] = useState(null); // To store the current file details
  const { id } = useParams();

  const serverUri = import.meta.env.VITE_BACKEND_URL;
console.log(serverUri);

  const inputRef = useRef(currentFile)
  const fetchPost = async () => {
    try {
      const res = await axios.get(`${serverUri}/news/${id}`);
      console.log(res);
      setTitle(res.data.title);
      setSummary(res.data.summary);
      setCurrentFile(res.data.file);  // Store the current file
      setContent(res.data.content);
    } catch (error) {
      console.error('Error fetching the post:', error);
      toast.error("Failed to load post data.");
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

 
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set a new file if selected
  };

  const UpdatePost = async () => {
    const data = new FormData();
    
    // Only append the file if a new file was selected
    if (file) {
      data.append('file', file);
    }
    
    data.append('content', content); // Append content
    data.append('title', title);    // Append title
    data.append('summary', summary); // Append summary

    try {
      setisUpdating(true);
      const res = await fetch(`${serverUri}/news/update/${id}`, {
        credentials: 'include',
        method: 'PUT',
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Post updated successfully!");
        setisUpdating(false)
       
        setContent('');
        setFile(null);
        setTitle('');
        setSummary('');
        inputRef.current.value = ''; // Clear file input

      } else {
        toast.error("Failed to update post.");
        setisUpdating(false)
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the post.");
      setisUpdating(false)
    }
  };
  const goBack = ()=>{
    window.history.back()
  }

  return (
    <div>
      <div style={{margin:'10px'}}>
        <button onClick={goBack} className='btn btn-primary'>Go back</button>
      </div>
    <div className="edit-post-container d-flex justify-content-center align-items-center">
      <div >
        <div className="user-form-wrapper" style={{maxWidth:'450px'}}>
          <div className="user-form-container">
            <button className='btn btn-danger' onClick={goBack}>Cancel</button>
            <h4 className='text-center text-success '>Edit Post</h4>
            <div>
              <label className='fw-bold'>Title</label>
              <input
                type='text'
                placeholder='Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="" className='fw-bold'>Summary</label>
              <input
                type='text'
                placeholder='Summary'
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
            <div>
             {/*  {currentFile && (
                <div>
                  <p>Current file: <a href={`http://localhost:3002/uploads/${currentFile}`} download>{currentFile}</a></p>
                </div>
              )} */}
              <input
                type="file"
               ref={inputRef}
               
                onChange={handleFileChange} // Set file with correct handler
              />
            </div>
            <div>
              <ReactQuill value={content} onChange={setContent} formats={formats} modules={modules} />  {/* Correctly bind content */}
            </div>
            <div>
              <button className='post-btn' onClick={UpdatePost} disabled={isUpdating}>{isUpdating?'Updating Post...':'Update Post'}</button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
    </div>
  );
};

export default EditNews;

