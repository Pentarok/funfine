import React, { useEffect, useRef, useState } from 'react';
import './UserProfile.css';
import useAuth from './Auth';
import ConfirmDeleteAccount from './confirmAccountDeletion';
import axios from 'axios';

const UserProfile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUserName] = useState(''); // Initialize username state
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const { user } = useAuth();
    const [file, setfile] = useState(null);
    const fileRef = useRef(null);
    const serverUri = import.meta.env.VITE_BACKEND_URL;

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
            if (res.data && res.data.username) {
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

        console.log('Selected file before submission:', file); // Debug log
        console.log('Username before submission:', username); // Debug log

        const formData = new FormData();
        formData.append('username', username); // Include username in form data
        if (file) {
            formData.append('file', file); // Include file if it exists
        }
        formData.append('userId', userId); // Include userId

        try {
            const response = await axios.put(`${serverUri}/profile/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Required for file upload
                },
            });
            console.log('Profile updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (loading) {
        return <div className='text-white text-center'>Loading...Please wait</div>; // Show loading state while fetching
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', gap: '3rem', flexWrap: 'wrap' }}>
            <div className="profile-container">
                <form onSubmit={handleSubmit}>
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
                            ref={fileRef}
                            onChange={(e) => setfile(e.target.files[0])} // Update state with the selected file
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button type="submit">Update profile</button>
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
