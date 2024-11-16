import React, { useState } from 'react';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from './Auth';

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

const usefulLinks = [
  { name: 'Create New Post', path: '/user/create/post' },
  { name: 'Upcoming Events', path: '/user/upcoming-events' },
  { name: 'Past Events', path: '/user/past-events' },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElUsefulLinks, setAnchorElUsefulLinks] = useState(null);
  const navigate = useNavigate();
  const { session, loading, user } = useAuth();

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleOpenUsefulLinksMenu = (event) => setAnchorElUsefulLinks(event.currentTarget);
  const handleCloseUsefulLinksMenu = () => setAnchorElUsefulLinks(null);

  const handleLogout = () => {
    const serverUri = import.meta.env.VITE_BACKEND_URL;
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
          toast.success('Logout successful! Redirecting...');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          toast.error('Logout failed!');
        }
      })
      .catch(() => toast.error('Error during logout!'));
  };

  const handleAvatarError = (e) => {
    e.target.src = '/default-avatar.png'; // Ensure you have a placeholder image in your public folder.
  };

  if (!session && !loading) {
    navigate('/login');
  }

  if (!loading && user?.isSuspended) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', minHeight: '100vh' }}>
        <h3>Your account has been suspended. Contact support for assistance.</h3>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
            <MenuIcon />
          </IconButton>

          <Menu anchorEl={anchorElNav} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu}>
            {pages.map((page) => (
              <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                <Link to={page.path}>{page.name}</Link>
              </MenuItem>
            ))}
          </Menu>

          <Typography variant="h6" noWrap>
            Logo
          </Typography>

          <Box sx={{ flexGrow: 1 }}>
            {pages.map((page) => (
              <Link key={page.name} to={page.path} style={{ color: 'white', padding: '0 10px' }}>
                {page.name}
              </Link>
            ))}
          </Box>

          <Box>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu}>
                <Avatar
                  alt="User Avatar"
                  src={user?.profilePhoto || '/default-avatar.png'}
                  onError={handleAvatarError}
                />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) =>
                setting.name === 'Logout' ? (
                  <MenuItem key={setting.name} onClick={handleLogout}>
                    {setting.name}
                  </MenuItem>
                ) : (
                  <MenuItem key={setting.name}>
                    <Link to={setting.path}>{setting.name}</Link>
                  </MenuItem>
                )
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default ResponsiveAppBar;
