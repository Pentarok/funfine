import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

const ConfirmDeleteAccount = ({ setIsOpen ,isOpen }) => {
  const serverUri = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const deleteAccount = async () => {
    const token = localStorage.getItem('token');
    await axios.delete(`${serverUri}/deleteAccount`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast.success('Account deleted successfully!', { autoClose: 3000 });
      localStorage.clear(); // Clear all stored data
      navigate('/login'); // Redirect to login after logout
    },
    onError: () => {
      toast.error('An error occurred while deleting your account!', { autoClose: 3000 });
    }
  });

  const handleDelete = () => {
    mutate(); // Call mutation to delete account
  };

  return (
    <div className='mega-box'>
      <div className="confirm-wrapper">
        <div onClick={() => setIsOpen(false)} className='close-icon'>X</div>
        <div className='warning-text'>
          <p>Are you sure you want to delete your account?</p>
          <p>This action cannot be undone.</p>
        </div>
        <div className='action-wrapper'>
          <button onClick={() => setIsOpen(false)} className='cancel-btn'>Cancel</button>
          <button onClick={handleDelete} className='delete-btn' disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteAccount;
