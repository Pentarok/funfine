import React from 'react';
import './UserConfirmDelete.css';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';





const UserConfirmDelete = ({ postId, setOpenDeleteId, deleteEndpoint,setDeleteEndPoint, queryKey }) => {
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
  
      toast.success('User deleted successfully!', { autoClose: 3000 });
      setOpenDeleteId(null); // Close the delete modal after success
    },
    onError: () => {
      toast.error('An error occurred while deleting the user!', { autoClose: 3000 });
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
      <div className="user-confirm-wrapper">
        <div onClick={() => setOpenDeleteId(null)} className='close-icon'>X</div>
        <div className='warning-text'>
          <p className='text-white'>Are you sure you want to delete this user?</p>
          <p className='text-white'>This action cannot be undone.</p>
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

export default UserConfirmDelete;

