import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Ensure toast is imported
import useAuth from './Auth';
import axios from 'axios';
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
  const [userPhotoURL, setUserPhotoURL] = useState('');
  const navigate = useNavigate();
  const { session, loading, user } = useAuth();
const [userId,setUserId]=useState(null);
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleOpenUsefulLinksMenu = (event) => setAnchorElUsefulLinks(event.currentTarget);
  const handleCloseUsefulLinksMenu = () => setAnchorElUsefulLinks(null);
  const serverUri = import.meta.env.VITE_BACKEND_URL;




  useEffect(() => {
    if (user) {
        setUserId(user.id);
    }
    console.log(userPhotoURL);
}, [user]);

//fetch profile photo
const fetchProfilePhoto =  async ()=>{
  try {
    const res = await axios.get(`${serverUri}/userprofile/${userId}`);
    console.log(res)
    setUserPhotoURL(res.data.profilePhoto);
  } catch (error) {
    console.log(error)
  }
}
useEffect(() => {
  if (userId) {
      fetchProfilePhoto();
  }
}, [userId]);

  // Logout logic...
  const handleLogout = () => {
    fetch(`${serverUri}/logout`, {
      method: 'POST',
      credentials: 'include', // This includes cookies for session invalidation
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you're using JWT for auth
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.message === 'Logout successful') {
          // Remove token and other relevant data from local storage
          localStorage.removeItem('token');
          localStorage.removeItem('userId'); // Adjust as per your stored items

          // Show toast notification for logout success
          toast.success('Logout successful! Redirecting...', {
            position: 'top-right',
            autoClose: 2000, // Toast message will close after 2 seconds
          });

          // Delay redirect by 2 seconds
          setTimeout(() => {
            navigate('/login'); // Redirect to login after logout
          }, 2500); // Slight delay after the toast disappears
        } else {
          console.error('Logout failed');
          toast.error('Logout failed', {
            position: 'top-right',
            autoClose: 2000,
          });
        }
      })
      .catch(error => {
        console.error('Error during logout:', error);
        toast.error('Error during logout', {
          position: 'top-right',
          autoClose: 2000,
        });
      });
  };
console.log(user);
  if (!session && !loading) {
    navigate('/login');
  }

  if (!loading && user.isSuspended) {
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
          <IconButton
            size="large"
            aria-label="menu"
            onClick={handleOpenNavMenu}
            sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }}
          >
            <MenuIcon />
          </IconButton>

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

          {/* Title/Logo for larger screens */}
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
            {/* Your Logo */}
            Logo
          </Typography>

          {/* Main Links for larger screens */}
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

          {/* Useful Links Dropdown */}
          <Box sx={{ flexGrow: 0 }}>
            <Menu
              anchorEl={anchorElUsefulLinks}
              open={Boolean(anchorElUsefulLinks)}
              onClose={handleCloseUsefulLinksMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {usefulLinks.map((link) => (
                <MenuItem key={link.name} onClick={handleCloseUsefulLinksMenu}>
                  <Link to={link.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {link.name}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* User Settings (Avatar and Logout) */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="User Avatar" src={userPhotoURL} />

              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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
      <ToastContainer />
    </>
  );
}

export default ResponsiveAppBar;



