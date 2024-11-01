import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import useAuth from './Auth';
import './UserIntro.css';

const UserIntro = () => {
    const { user } = useAuth();
    const [hasDisplayedMessage, setHasDisplayedMessage] = useState(false);

    useEffect(() => {
        // Check if the user exists and if the welcome message has already been displayed
        if (user && !hasDisplayedMessage) {
            // Check local storage
            const messageShown = localStorage.getItem('welcomeMessageShown');

            if (!messageShown) {
                // Display the welcome message
                setHasDisplayedMessage(true);
                // Set the flag in local storage
                localStorage.setItem('welcomeMessageShown', 'true');
            }
        }
    }, [user, hasDisplayedMessage]);
if(!hasDisplayedMessage){
  return null
}
    return (
        <div className='intro-box'>
            <div>
                {user && hasDisplayedMessage && (
                    <h4 className='text-primary'>Welcome back {user.author}</h4>
                )}
            </div>
        </div>
    );
};

export default UserIntro;
