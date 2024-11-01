import React from 'react';
import './ConfirmDelete.css';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';

const AdminConfirmDelete = ({ postId, setOpenDeleteId, deleteEndpoint,setDeleteEndPoint, queryKey }) => {
  const serverUri = import.meta.env.VITE_BACKEND_URL;
  const queryClient = useQueryClient(); 

  const deletePost = async (deleteEndpoint) => {
    const res = await axios.delete(`${serverUri}/${deleteEndpoint}`);
    return res.data;
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey:[queryKey]});
  
      toast.success('Post deleted successfully!', { autoClose: 3000 });
      setOpenDeleteId(null); // Close the delete modal after success
    },
    onError: () => {
      toast.error('An error occurred while deleting the post!', { autoClose: 3000 });
    }
  });

  const handleDelete = () => {
    if(deleteEndpoint){
        mutate(deleteEndpoint); 
        setDeleteEndPoint('')
    }
   else{
    return
   }
    // Call mutate directly without .then() or .catch()
  }

  return (
    <div className='mega-box'>
      <div className="confirm-wrapper">
        <div onClick={() => setOpenDeleteId(null)} className='close-icon'>X</div>
        <div className='warning-text'>
          <p>Are you sure you want to delete this post?</p>
          <p>This action cannot be undone.</p>
        </div>
        <div className='action-wrapper'>
          <button onClick={() => setOpenDeleteId(null)} className='cancel-btn'>Cancel</button>
          <button onClick={handleDelete} className='delete-btn' disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminConfirmDelete;

