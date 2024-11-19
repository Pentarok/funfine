import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import logo from './assets/logo.webp';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import useAuth from './Auth';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import './homeNavbar.css'

// Page and Settings data
const pages = [
  { name: 'Home', path: '/user/home' },
  { name: 'All Posts', path: '/user/allposts' },
  { name: 'My Posts', path: '/user/posts' },
  { name: 'User Manual', path: '/user/manual' },
];

const settings = [
  { name: 'Logout', path: '/home' },
  { name: 'Profile', path: '/user/profile' },
];

// Links for the "Useful Links" dropdown
const usefulLinks = [
  { name: 'Create New Post', path: '/user/create/post' },
  { name: 'Upcoming Events', path: '/user/upcoming-events' },
  { name: 'Past Events', path: '/user/past-events' },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElUsefulLinks, setAnchorElUsefulLinks] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userPhotoURL, setUserPhotoURL] = useState('');
  const navigate = useNavigate();
  const { session, loading, user } = useAuth();

  // Server URI
  const serverUri = import.meta.env.VITE_BACKEND_URL;

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleOpenUsefulLinksMenu = (event) => setAnchorElUsefulLinks(event.currentTarget);
  const handleCloseUsefulLinksMenu = () => setAnchorElUsefulLinks(null);

  // Update userId on user state change
  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  // Fetch profile photo with TanStack Query (React Query)
  const fetchProfilePhoto = async () => {
    try {
      const res = await axios.get(`${serverUri}/userprofile/${userId}`);
      return res.data.profilePhoto;
    } catch (error) {
      console.error("Error fetching profile photo:", error);
      throw new Error("Error fetching profile photo");
    }
  };

  // Using useQuery to fetch the profile photo
  const { data: profilePhoto, isLoading, isError } = useQuery({
    queryKey: ['profilePhoto', userId],
    queryFn: fetchProfilePhoto,
    enabled: !!userId, // Only run the query when userId is available
    retry: 2, // Retry failed requests twice
    onSuccess: (data) => {
      setUserPhotoURL(data); // Update the state when data is successfully fetched
    },
  });

  // Handle logout logic
  const handleLogout = () => {
    fetch(`${serverUri}/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Logout successful') {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          toast.success('Logout successful! Redirecting...', { position: 'top-right', autoClose: 2000 });
          setTimeout(() => navigate('/login'), 2500);
        } else {
          toast.error('Logout failed', { position: 'top-right', autoClose: 2000 });
        }
      })
      .catch((error) => {
        toast.error('Error during logout', { position: 'top-right', autoClose: 2000 });
      });
  };

  // Handle redirection if not logged in
  if (!session && !loading) {
    navigate('/login');
  }

  // Handle suspended account
  if (!loading && user?.isSuspended) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', minHeight: '100vh' }}>
        <div>
          <h3>Oops, it seems your account has been suspended!</h3>
          <p>Contact support for further clarification.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <AppBar position="static">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Toggler for mobile view */}

                              {/* Logo Placeholder */}
                              <div className="logo">


<Box sx={{ mr: 0 }}>
    <img
        src={logo} // Replace with your logo path
        alt="Logo"
        style={{ height: '40px', width: 'auto' }} // Adjust height and width as needed
    />
</Box>
</div>
          <IconButton
            size="large"
            aria-label="menu"
            onClick={handleOpenNavMenu}
            sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }}
          >
            <MenuIcon />
          </IconButton>

          {/* Navigation menu */}
          <Menu
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            {pages.map((page) => (
              <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                <Link to={page.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {page.name}
                </Link>
              </MenuItem>
            ))}
            <MenuItem onClick={handleOpenUsefulLinksMenu}>
              <Typography variant="body1" sx={{ color: 'inherit' }}>Useful Links</Typography>
            </MenuItem>
          </Menu>

          {/* Logo/Title for larger screens */}
          <Typography
            variant="h6"
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Logo
          </Typography>

          {/* Main links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link key={page.name} to={page.path} style={{ textDecoration: 'none', color: 'white', padding: '0 10px' }}>
                {page.name}
              </Link>
            ))}
            <Typography variant="button" sx={{ cursor: 'pointer', color: 'white' }} onClick={handleOpenUsefulLinksMenu}>
              Useful Links
            </Typography>
          </Box>

          {/* User settings and avatar */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Avatar" src={isLoading ? '/loading-avatar.png' : profilePhoto} />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                setting.name === 'Logout' && session ? (
                  <MenuItem key={setting.name} onClick={handleLogout}>
                    <Typography textAlign="center">{setting.name}</Typography>
                  </MenuItem>
                ) : (
                  setting.name !== 'Logout' && (
                    <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                      <Link to={setting.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography textAlign="center">{setting.name}</Typography>
                      </Link>
                    </MenuItem>
                  )
                )
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Useful Links dropdown */}
      <Menu
        anchorEl={anchorElUsefulLinks}
        open={Boolean(anchorElUsefulLinks)}
        onClose={handleCloseUsefulLinksMenu}
        sx={{ color: 'black' }}
      >
        {usefulLinks.map((link) => (
          <MenuItem key={link.name} onClick={handleCloseUsefulLinksMenu}>
            <Link to={link.path} style={{ textDecoration: 'none', color: 'inherit' }}>
              {link.name}
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default ResponsiveAppBar;
