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

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleOpenUsefulLinksMenu = (event) => setAnchorElUsefulLinks(event.currentTarget);

  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleCloseUsefulLinksMenu = () => setAnchorElUsefulLinks(null);

  const handleLogout = () => {
    // ...logout logic as in original code...
  };

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
        <Box sx={{ flexGrow: 1 }}>
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                backgroundColor: 'black',
                textDecoration: 'none',
              }}
            >
              {/* Add logo or name here */}
            </Typography>

            {/* Main Links (Home, All Posts, etc.) */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Link
                  key={page.name}
                  to={page.path}
                  style={{ textDecoration: 'none', color: 'white', padding: '0 10px' }}
                >
                  {page.name}
                </Link>
                
              ))}
               <Typography
                 variant="button"
                 sx={{ cursor: 'pointer', color: 'white' }}
                 onClick={handleOpenUsefulLinksMenu}
               >
                 Useful Links
               </Typography>
            </Box>
           
            {/* Useful Links Dropdown */}
            <Box sx={{ flexGrow: 0,}}>
           
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
                {settings.map((setting) =>
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
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>
      <ToastContainer />
    </>
  );
}

export default ResponsiveAppBar;
