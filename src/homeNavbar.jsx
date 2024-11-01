import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import logo from './assets/logo.webp';
import './homeNavbar.css'
const pages = [
    { name: 'Home', path: '/home' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
];

const usefulLinks = [
    { name: 'Upcoming Events', path: '/home/events' },
    { name: 'Past Events', path: '/home/past-events' }
];

const authLinks = [
    { name: 'Register', path: '/register' },
    { name: 'Login', path: '/login' },
];

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUsefulLinks, setAnchorElUsefulLinks] = useState(null);
    const location = useLocation();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleOpenUsefulLinksMenu = (event) => {
        setAnchorElUsefulLinks(event.currentTarget);
    };

    const handleCloseUsefulLinksMenu = () => {
        setAnchorElUsefulLinks(null);
    };

    useEffect(() => {
        if (anchorElUsefulLinks) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [anchorElUsefulLinks]);

    const isServicesPage = location.pathname === '/services';

    return (
        <AppBar position="static" sx={{ backgroundColor: 'hsl(180, 100%, 60%)', marginBottom: isServicesPage ? '20px' : '0' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ minHeight: '48px' }}>
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
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="small"
                            aria-label="open navigation menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">
                                        <Link to={page.path} style={{ color: 'inherit', textDecoration: 'none' }}>
                                            {page.name}
                                        </Link>
                                    </Typography>
                                </MenuItem>
                            ))}

                            <MenuItem onClick={handleOpenUsefulLinksMenu}>
                                <Typography textAlign="center">Useful Links</Typography>
                            </MenuItem>

                            <Menu
                                anchorEl={anchorElUsefulLinks}
                                open={Boolean(anchorElUsefulLinks)}
                                onClose={handleCloseUsefulLinksMenu}
                            >
                                {usefulLinks.map((link) => (
                                    <MenuItem key={link.name} onClick={handleCloseUsefulLinksMenu}>
                                        <Typography textAlign="center">
                                            <Link to={link.path} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                {link.name}
                                            </Link>
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Menu>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 0,
                                    mx: 1,
                                    color: 'black',
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    '&:hover': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            >
                                <Link to={page.path} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    {page.name}
                                </Link>
                            </Button>
                        ))}

                        <Button
                            onClick={handleOpenUsefulLinksMenu}
                            sx={{
                                my: 0,
                                mx: 1,
                                color: 'black',
                                display: 'block',
                                fontSize: '0.875rem',
                                '&:hover': {
                                    backgroundColor: 'white',
                                },
                            }}
                        >
                            Useful Links
                        </Button>

                        <Menu
                            anchorEl={anchorElUsefulLinks}
                            open={Boolean(anchorElUsefulLinks)}
                            onClose={handleCloseUsefulLinksMenu}
                        >
                            {usefulLinks.map((link) => (
                                <MenuItem key={link.name} onClick={handleCloseUsefulLinksMenu}>
                                    <Typography textAlign="center">
                                        <Link to={link.path} style={{ color: 'inherit', textDecoration: 'none' }}>
                                            {link.name}
                                        </Link>
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
                        {authLinks.map((link) => (
                            <Button
                                key={link.name}
                                sx={{
                                    my: 0,
                                    mx: 1,
                                    color: 'black',
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    '&:hover': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            >
                                <Link to={link.path} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    {link.name}
                                </Link>
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
