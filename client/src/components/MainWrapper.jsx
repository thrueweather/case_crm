import { useEffect, useState } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import NavBar from 'components/NavBar';

import * as path from 'constants/routes';
import { withAuth } from 'utils/withAuth';
import { fetchTasks } from 'store/reducers/tasks';
import { fetchNotifications } from 'store/reducers/notifications';
import { useInterval } from 'utils';

const drawerWidth = 240;

const ResponsiveDrawer = props => {
    const history = useHistory();
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.tasks);
    const theme = useTheme();
    useInterval(() => dispatch(fetchNotifications()), 10000);

    const { window, children } = props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        dispatch(fetchTasks());
        dispatch(fetchNotifications());
    }, [dispatch]);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const drawer = (
        <>
            <Toolbar />
            <Divider />
            <List className='sidebar'>
                <Link to={path.DASHBOARD}>
                    <ListItemButton selected={pathname === path.DASHBOARD}>
                        <ListItemText primary={'Dashboard'} />
                    </ListItemButton>
                </Link>
                <Link to={path.LEADS}>
                    <ListItemButton selected={pathname === path.LEADS}>
                        <ListItemText primary={'Leads'} />
                    </ListItemButton>
                </Link>
                <Link to={path.CASES}>
                    <ListItemButton
                        selected={
                            pathname === path.CASES ||
                            pathname.includes('cases')
                        }
                    >
                        <ListItemText primary={'Cases'} />
                    </ListItemButton>
                </Link>
                <Link to={path.REPORTS}>
                    <ListItemButton selected={pathname === path.REPORTS}>
                        <ListItemText primary={'Reports'} />
                    </ListItemButton>
                </Link>
            </List>
        </>
    );

    const container =
        window !== undefined ? () => window().document.body : undefined;

    const desktopStyles = !isTablet && {
        display: 'flex',
        textAlign: 'left',
    };

    const expiryTasks = tasks.data?.filter(
        task =>
            new Date(task.due_date).toLocaleDateString() ===
            new Date().toLocaleDateString()
    );

    const mainStyles = {
        ...desktopStyles,
        height: '100vh',
        background: '#f3f3f3',
    };

    return (
        <Box sx={mainStyles}>
            <CssBaseline />
            <NavBar
                drawerWidth={drawerWidth}
                isTablet={isTablet}
                expiryTasks={expiryTasks}
                history={history}
                handleDrawerToggle={handleDrawerToggle}
            />
            <Box
                component='nav'
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label='mailbox folders'
            >
                <Drawer
                    container={container}
                    variant='temporary'
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant='permanent'
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default withAuth(ResponsiveDrawer);
