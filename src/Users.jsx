import React, { useState } from 'react';
import axios from 'axios';
import './Users.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import UserConfirmDelete from './UserConfirmDelete';

const Users = () => {

  const queryClient = useQueryClient();
  const [openDeleteId, setOpenDeleteId] = useState(null);
  const [suspendUserId, setSuspendUserId] = useState(null); // For showing the dropdown
  const [suspendReason, setSuspendReason] = useState(''); // For selected reason
  const queryKey = "users";
  const serverUri = import.meta.env.VITE_BACKEND_URL;
  // List of suspension reasons
  const suspensionReasons = [
    'End of Free Trial Period',
    'Overdue Charges',
    'Violation of Terms',
    'Account Inactivity',
    'Security Concerns',
    'Fraudulent Activity',
  ];

  const handleDeleteClick = (userId) => {
    setOpenDeleteId(userId);
  };

  const suspendMutation = useMutation({
    mutationFn: async ({ userId, reason }) => {
      await axios.post(`${serverUri}/user/suspend/${userId}`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey]);
      toast.success('User suspended successfully');
      setSuspendUserId(null);  // Close the dropdown after success
    },
    onError: () => {
      toast.error('Failed to suspend user');
    }
  });

  const unsuspendMutation = useMutation({
    mutationFn: async (userId) => {
      await axios.post(`${serverUri}/user/unsuspend/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey]);
      toast.success('User unsuspended successfully');
    },
    onError: () => {
      toast.error('Failed to unsuspend user');
    }
  });

  const handleSuspendClick = (userId) => {
    setSuspendUserId(userId); // Open the dropdown for the selected user
  };
const CancelSuspend = ()=>{
  setSuspendUserId(null)
}
  const handleSuspendConfirm = (userId) => {
    suspendMutation.mutate({ userId, reason: suspendReason });
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(`${serverUri}/users`);
      console.log(res)
      return res.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error occurred!</div>;
  }

  return (
    <div className="users-container">
      <ToastContainer containerId="Z1"/>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Date Joined</th>
            <th>Status</th>

            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, i) => (
              <tr key={i}>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>{item.isSuspended ?
                <div>
                <p>Suspended</p>
                <p>Reason: {item.suspensionReason}</p>
                </div>
           
                
                
                
                : 'Active'} </td>
         <td>
                  <button onClick={() => handleDeleteClick(item._id)} className="btn btn-danger">Delete Account</button>
                  
                  {item.isSuspended ? (
                    <button onClick={() => unsuspendMutation.mutate(item._id)} className="btn btn-warning">Unsuspend</button>
                  ) : (
                    <>
                      <button onClick={() => handleSuspendClick(item._id)} className="btn btn-warning">Suspend</button>
                      {suspendUserId === item._id && (
                        <div className="suspend-reason-dropdown">
                          <select 
                            value={suspendReason} 
                            onChange={(e) => setSuspendReason(e.target.value)} 
                            className="form-control mt-2"
                          >
                            <option value="">Select Reason</option>
                            {suspensionReasons.map((reason, idx) => (
                              <option key={idx} value={reason}>{reason}</option>
                            ))}
                          </select>
                       


                          <button 
                           onClick={CancelSuspend}
                            className="btn btn-dark mt-2"
                          >
                            Cancel
                          </button>

                          <button 
                            onClick={() => handleSuspendConfirm(item._id)} 
                            disabled={!suspendReason}
                            className="btn btn-danger mt-2"
                          >
                            Confirm Suspension
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  
                  {item._id === openDeleteId && (
                    <UserConfirmDelete 
                      deleteEndpoint={`user/delete/${item._id}`} 
                      setOpenDeleteId={setOpenDeleteId} 
                      queryKey={queryKey} 
                    />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-users">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
