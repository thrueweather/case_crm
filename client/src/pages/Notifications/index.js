import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import CircleIcon from '@mui/icons-material/Circle';
import FormControlLabel from '@mui/material/FormControlLabel';
import DateField from 'components/DateField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import SelectField from 'components/SelectField';
import AsyncSelect from 'components/AsyncSelect';
import TablePaginationActions from 'components/PaginationActions';

import {
    fetchNotifications,
    setActiveTab,
    setBroker,
    setDate,
    setStatus,
    resetFilters,
    changePage,
    changeRowsPerPage,
} from 'store/reducers/notifications';
import * as Api from 'api/repository';
import { getDate, getTime, timeSince } from 'utils';
import { fetchStatuses } from 'store/reducers/deals/index';

const Notifications = () => {
    const user = useSelector(state => state.user);
    const { loadingStatuses, statuses } = useSelector(state => state.deals);
    const {
        data,
        errors,
        activeTab,
        broker,
        date,
        statusType,
        rowsPerPage,
        page,
    } = useSelector(state => state.notifications);
    const dispatch = useDispatch();
    const history = useHistory();
    const theme = useTheme();

    const [selectedItems, setSelectedItems] = useState([]);

    const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (broker || date || statusType) {
            dispatch(fetchNotifications());
        }
    }, [broker, date, statusType, dispatch, activeTab]);

    useEffect(() => {
        dispatch(fetchStatuses());
    }, [dispatch]);

    const filteredData = useMemo(() => {
        const array = [...data];
        return array
            .sort((a, b) => new Date(b.create_date) - new Date(a.create_date))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [data, page, rowsPerPage]);

    const unmarkClickHandler = async () => {
        try {
            const confirmed = await swal({
                title: 'Are you sure?',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            });
            if (confirmed) {
                await Api.unmarkNotifications(selectedItems);
                onClearSelectedItems();
            }
        } catch (error) {
            swal('Error!', error.message, 'error');
        }
    };

    const markClickHandler = async () => {
        try {
            const confirmed = await swal({
                title: 'Are you sure?',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            });
            if (confirmed) {
                await Api.markNotifications(selectedItems);
                onClearSelectedItems();
            }
        } catch (error) {
            swal('Error!', error.message, 'error');
        }
    };

    const onRemoveNotifications = async () => {
        try {
            const confirmed = await swal({
                title: 'Are you sure?',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            });
            if (confirmed) {
                const response = await Api.deleteNotifications(selectedItems);
                if (response.success) {
                    onClearSelectedItems();
                    swal('Success!', '', 'success');
                }
            }
        } catch (error) {
            swal('Error!', error.message, 'error');
        }
    };

    const selectAllNotification = () => {
        if (selectedItems.length === data.length) {
            return setSelectedItems([]);
        }
        setSelectedItems(data.map(item => item.id));
    };

    const selectNotification = id => {
        setSelectedItems(state => {
            const idx = state.indexOf(id);

            if (idx === -1) return [...state, id];
            else return [...state.slice(0, idx), ...state.slice(idx + 1)];
        });
    };

    const onActiveTab = (e, value) => dispatch(setActiveTab(value));

    const redirectToDeal = dealId => {
        if (!dealId) return;
        history.push(`/cases/${dealId}`);
    };

    const onResetFilters = () => dispatch(resetFilters());

    const handleChangePage = (event, newPage) => {
        dispatch(changePage(newPage));
    };

    const handleChangeRowsPerPage = event => {
        dispatch(changeRowsPerPage(parseInt(event.target.value, 10)));
    };

    const onClearSelectedItems = () => {
        dispatch(fetchNotifications());
        setSelectedItems([]);
    };

    if (errors) return errors.message;

    const actionButton = !!selectedItems.length && (
        <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            direction={isTablet ? 'column' : 'row'}
        >
            <Grid item>
                <Button variant='contained' onClick={markClickHandler}>
                    Mark as read
                </Button>
            </Grid>
            <Grid item>
                <Button variant='contained' onClick={unmarkClickHandler}>
                    Mark as unread
                </Button>
            </Grid>
            <Grid item>
                <Button variant='contained' onClick={onRemoveNotifications}>
                    Remove
                </Button>
            </Grid>
        </Grid>
    );

    const resetFiltersButton =
        broker || date || statusType ? (
            <Button
                sx={{ marginLeft: 3 }}
                variant='outlined'
                onClick={onResetFilters}
            >
                Reset
            </Button>
        ) : null;

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isTablet ? 'column' : 'row',
                }}
            >
                <Typography
                    sx={{ marginRight: 3 }}
                    variant='h3'
                    gutterBottom
                    component='div'
                >
                    Notifications
                </Typography>

                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    direction={isTablet ? 'column' : 'row'}
                >
                    {!user.loading && user.data.is_admin && (
                        <Grid item>
                            {/* <SelectField
                                sx={{ width: 200 }}
                                label={'Select Broker'}
                                value={broker}
                                onChange={e => dispatch(setBroker(e.target.value))}
                                options={brokers.map(({ id, email }) => ({
                                    value: id,
                                    label: email,
                                }))}
                            /> */}
                            <AsyncSelect
                                sx={{ width: 228 }}
                                value={broker || ''}
                                label='Select Broker'
                                path='/api/brokers/'
                                onChange={e =>
                                    dispatch(setBroker(e.target.value))
                                }
                                optionName='email'
                            />
                        </Grid>
                    )}
                    <Grid item>
                        <DateField
                            placeholder='Select Date'
                            onChange={e => dispatch(setDate(e))}
                            selected={date}
                        />
                    </Grid>
                    <Grid item>
                        {loadingStatuses ? (
                            'Loading...'
                        ) : (
                            <SelectField
                                sx={{ width: 228 }}
                                label={'Select Status Type'}
                                value={statusType || ''}
                                onChange={e =>
                                    dispatch(setStatus(e.target.value))
                                }
                                options={statuses.map(({ id, name }) => ({
                                    value: id,
                                    label: name,
                                }))}
                            />
                        )}
                    </Grid>
                    <Grid item>{resetFiltersButton}</Grid>
                </Grid>
            </Box>
            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    marginBottom: 3,
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={onActiveTab}
                    aria-label='basic tabs example'
                >
                    <Tab label='Unread' value='unread' />
                    <Tab label='Read' value='read' />
                </Tabs>
            </Box>
            {!!data.length && (
                <FormControlLabel
                    sx={{ marginRight: 3 }}
                    control={
                        <Checkbox
                            checked={selectedItems.length === data.length}
                            onChange={selectAllNotification}
                        />
                    }
                    label='Select All'
                />
            )}
            {actionButton}
            <Box mt={3}>
                {data.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                            <TableBody>
                                {filteredData.map(row => (
                                    <TableRow
                                        key={row.id}
                                        sx={{
                                            '&:last-child td, &:last-child th':
                                                { border: 0 },
                                        }}
                                        style={{
                                            backgroundColor: row.readed
                                                ? '#F7F7F7'
                                                : 'white',
                                            cursor: row.deal
                                                ? 'pointer'
                                                : 'auto',
                                        }}
                                    >
                                        <TableCell
                                            component='th'
                                            scope='row'
                                            width={50}
                                            sx={{ paddingRight: 0 }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {!row.readed && (
                                                    <CircleIcon
                                                        color='primary'
                                                        fontSize='small'
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            component='th'
                                            scope='row'
                                            sx={{ padding: 0 }}
                                        >
                                            <Checkbox
                                                checked={selectedItems.includes(
                                                    row.id
                                                )}
                                                onChange={() =>
                                                    selectNotification(row.id)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell
                                            onClick={() =>
                                                redirectToDeal(row.deal)
                                            }
                                            component='th'
                                            scope='row'
                                        >
                                            {row.message}
                                        </TableCell>
                                        <TableCell
                                            onClick={() =>
                                                redirectToDeal(row.deal)
                                            }
                                            component='th'
                                            scope='row'
                                        >
                                            {getDate(row.create_date)}{' '}
                                            {getTime(row.create_date)}
                                        </TableCell>
                                        <TableCell
                                            onClick={() =>
                                                redirectToDeal(row.deal)
                                            }
                                            component='th'
                                            scope='row'
                                        >
                                            {timeSince(row.create_date)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[
                                            5,
                                            10,
                                            25,
                                            {
                                                label: 'All',
                                                value: data.length,
                                            },
                                        ]}
                                        count={data.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            inputProps: {
                                                'aria-label': 'rows per page',
                                            },
                                            native: true,
                                        }}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={
                                            handleChangeRowsPerPage
                                        }
                                        ActionsComponent={
                                            TablePaginationActions
                                        }
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography variant='h6' gutterBottom component='div'>
                            No one notifications yet
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Notifications;
