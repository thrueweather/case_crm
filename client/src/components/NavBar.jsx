import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Tooltip from '@mui/material/Tooltip';

import * as path from 'constants/routes';

const NavBar = ({ drawerWidth, isTablet, handleDrawerToggle, history, expiryTasks }) => {
    const notifications = useSelector(state => state.notifications);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = event => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    const handleLogOut = () => {
        handleClose();
        localStorage.clear();
        history.push(path.SIGN_IN);
    };

    const wrappStyles = { margin: 0, padding: '0 10px' };

    const expiryTasksList =
        expiryTasks?.length > 0 ? (
            <ul style={wrappStyles}>
                {expiryTasks?.map(task => (
                    <li key={task.id}>{task.message}</li>
                ))}
            </ul>
        ) : (
            ''
        );

    const notificationsList =
        notifications?.data?.length > 0 ? (
            <ul style={wrappStyles}>
                {notifications?.data.slice(0, 5).map(notification => (
                    <li key={notification.id}>{notification.message}</li>
                ))}
            </ul>
        ) : (
            ''
        );

    const notificationCounter = notifications.data?.filter(item => !item.readed).length;

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
            }}
        >
            {isTablet ? (
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleDrawerToggle}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => history.push(path.NOTIFICATIONS)}>
                            Notifications
                        </MenuItem>
                        <MenuItem onClick={() => history.push(path.TASKS)}>Tasks</MenuItem>
                        <MenuItem onClick={() => history.push(path.PROFILE)}>Account</MenuItem>
                        <MenuItem onClick={handleLogOut}>Log out</MenuItem>
                    </Menu>
                </Toolbar>
            ) : (
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        align="left"
                        sx={{ flexGrow: 1 }}
                    >
                        Expert Mortgage Advisor CRM
                    </Typography>
                    <Link to={path.TASKS}>
                        <Tooltip title={expiryTasksList} placement="bottom">
                            <Badge
                                color="secondary"
                                badgeContent={expiryTasks?.length}
                                sx={{ marginRight: 2, display: 'flex' }}
                            >
                                <CheckBoxIcon color="action" />
                            </Badge>
                        </Tooltip>
                    </Link>
                    <Link to={path.NOTIFICATIONS}>
                        <Tooltip title={notificationsList} placement="bottom">
                            <Badge
                                color="secondary"
                                badgeContent={notificationCounter}
                                sx={{ marginRight: 1 }}
                            >
                                <NotificationsIcon
                                    color="inherit"
                                    sx={{ cursor: 'pointer', color: '#fff' }}
                                />
                            </Badge>
                        </Tooltip>
                    </Link>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => history.push(path.PROFILE)}>Account</MenuItem>
                        <MenuItem onClick={handleLogOut}>Log out</MenuItem>
                    </Menu>
                </Toolbar>
            )}
        </AppBar>
    );
};

export default NavBar;
