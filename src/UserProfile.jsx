import React, { useEffect, useRef, useState } from 'react';
import './UserProfile.css';
import useAuth from './Auth';
import { toast } from 'react-toastify';
import ConfirmDeleteAccount from './confirmAccountDeletion';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

const UserProfile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUserName] = useState(''); // Initialize username state
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [buttonLoading,setbuttonLoading]=useState(false);
    const { user } = useAuth();
    const [file, setfile] = useState(null);
    const fileRef = useRef(null);
    const serverUri = import.meta.env.VITE_BACKEND_URL;
const queryClient = useQueryClient();
    useEffect(() => {
        if (user) {
            setUserId(user.id);
        }
    }, [user]);

    // Fetch user data including username
    const fetchUserData = async () => {
        try {
            const res = await axios.get(`${serverUri}/userprofile/${userId}`);
            console.log('Fetched user data:', res.data); // Debug log
            // Check if the response structure is correct
            if (res.data) {
                setUserName(res.data.username); // Set the username state
            }
        } catch (error) {
            console.log(error);
            setUserName(''); // Clear username on error
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserData(); // Fetch user data when userId changes
        }
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setbuttonLoading(true)
        const selectedFile = fileRef.current.files[0];  // Access selected file using fileRef

        console.log('Selected file before submission:', file); // Debug log
        console.log('Username before submission:', username); // Debug log

        const data = new FormData();
        data.append('username', username); // Include username in form data
        if (file) {
            data.append('file', file); // Include file if it exists
        }
        data.append('userId', userId); // Include userId
console.log(data)
        try {

            const response = await fetch(`${serverUri}/userprofile/${userId}`, {
                credentials: 'include',
                method: 'PUT',
                body: data,
          
              });
           
         const res = await response.json();
         setbuttonLoading(false);
         console.log(res)
if(res=='success'){
    queryClient.invalidateQueries(["profilePhoto"]);
    toast.success('Profile updated successfully!', { autoClose: 3000 });
 

}else{
    toast.error('An error occured. Please try again.', { autoClose: 3000 });
}

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('An error occured!', { autoClose: 3000 });
            setbuttonLoading(false)
        }
    };

    if (loading) {
        return <div className='text-white text-center'>Loading...Please wait</div>; // Show loading state while fetching
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', gap: '3rem', flexWrap: 'wrap' }}>
            <div className="profile-container">
                <form onSubmit={handleSubmit}  enctype="multipart/form-data">
                    <div>
                        <label htmlFor="">Username:</label>
                        <input
                            type="text"
                            value={username} // Controlled input
                            onChange={(e) => setUserName(e.target.value)} // Update state on change
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="">Profile Photo:</label>
                        <input
                            type="file"
                            name='file'
                            ref={fileRef}
                            onChange={(e) => setfile(e.target.files[0])} // Update state with the selected file
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button type="submit" disabled={buttonLoading}>{buttonLoading?"Loading...":"Update profile"}</button>
                    </div>
                </form>
            </div>
            <div className="delete-account">
                <div>
                    {!isOpen && (
                        <button onClick={() => setIsOpen(true)} className='btn-drop'>Delete account</button>
                    )}
                    {isOpen && (
                        <ConfirmDeleteAccount setIsOpen={setIsOpen} isOpen={isOpen} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
