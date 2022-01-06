import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import swal from 'sweetalert';
import swalReactModal from '@sweetalert/with-react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

import TablePaginationActions from 'components/PaginationActions';
import Loader from 'components/Loader';

import {
    fetchLeads,
    changePage,
    changeRowsPerPage,
    changeSearchTerm,
} from 'store/reducers/leads';
import {
    moneyField,
    useDebounce,
    getDate,
    getTime,
    stableSort,
    getComparator,
} from 'utils';
import * as Api from 'api/repository';

const Leads = () => {
    const { loading, data, error, rowsPerPage, page, searchTerm } = useSelector(
        state => state.leads
    );
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const debauncedSearchTerm = useDebounce(searchTerm, 300);
    const theme = useTheme();

    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('update_date');

    const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        dispatch(fetchLeads());
    }, [dispatch]);

    // Filter data by search
    const filteredData = useMemo(() => {
        const value = debauncedSearchTerm;
        const array = [...data];
        return array.filter(
            x =>
                x.property_amount?.toString()?.includes(value) ||
                x.mortgage_amount?.toString()?.includes(value) ||
                x.message?.toLowerCase().includes(value.toLowerCase()) ||
                getDate(x.create_date).includes(value) ||
                getTime(x.create_date).includes(value)
        );
    }, [data, debauncedSearchTerm]);

    const lastAvailableLead = useMemo(() => {
        const array = [...data];
        return array.length
            ? array.sort(
                  (a, b) => new Date(b.create_date) - new Date(a.create_date)
              )[0]
            : null;
    }, [data]);

    const handleChangePage = (event, newPage) => {
        dispatch(changePage(newPage));
    };

    const handleChangeRowsPerPage = event => {
        dispatch(changeRowsPerPage(parseInt(event.target.value, 10)));
    };

    const handleChangeSearchTerm = e => {
        dispatch(changeSearchTerm(e.target.value));
    };

    const handleRequestSort = useCallback(
        (event, property) => {
            const isAsc = orderBy === property && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(property);
        },
        [order, orderBy]
    );

    const handleBuyLead = useCallback(
        async lead => {
            const {
                property_amount,
                mortgage_amount,
                message,
                create_date,
                id,
            } = lead;
            const confirmed = await swalReactModal({
                title: 'Are you sure you would to purchase this lead?',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
                content: (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            textAlign: 'left',
                        }}
                    >
                        <ul>
                            <li>
                                Property Value -{' '}
                                {moneyField.format(property_amount)}
                            </li>
                            <li>
                                Mortgage Amount -{' '}
                                {moneyField.format(mortgage_amount)}
                            </li>
                            <li>Message - {message}</li>
                            <li>
                                Created - {getDate(create_date)}{' '}
                                {getTime(create_date)}
                            </li>
                        </ul>
                    </Box>
                ),
            });
            if (confirmed) {
                const response = await Api.buyLead(id);
                if (response.status === 200) {
                    dispatch(fetchLeads());
                    swal(
                        'Great!',
                        'You have successfully purchased a lead',
                        'success'
                    );
                    return;
                }
                if (response.status === 205) {
                    dispatch(fetchLeads());
                    swal('Sorry', 'This lead has been bought', 'warning');
                    return;
                }
                swal('Something went wrong', {
                    icon: 'error',
                });
            }
        },
        [dispatch]
    );

    const handleDeactivateLead = useCallback(
        async lead => {
            const { id } = lead;
            const confirmed = await swal({
                title: `You're about to de-activate this lead - no one will be able to see or buy this until you reactive it via admin panel?`,
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            });
            if (confirmed) {
                const response = await Api.deactivateLead(id);
                if (response.success) {
                    dispatch(fetchLeads());
                    swal(
                        'Great!',
                        'You have successfully deactivated this lead',
                        'success'
                    );
                    return;
                }
                swal('Something went wrong', {
                    icon: 'error',
                });
            }
        },
        [dispatch]
    );

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    if (error) return error.message;

    if (!data.length) {
        return (
            <Typography variant='h5' gutterBottom component='div'>
                There are no leads yet
            </Typography>
        );
    }

    const showNote = str => {
        if (str.length > 35) {
            return (
                <Tooltip title={str} placement='top'>
                    <span>{str.slice(0, 35).concat('...')}</span>
                </Tooltip>
            );
        }

        return str || 'N/A';
    };

    return (
        <>
            <Typography variant='h3' gutterBottom component='div'>
                Leads
            </Typography>
            {loading ? (
                <Loader />
            ) : (
                <>
                    {lastAvailableLead && (
                        <Typography
                            variant='h5'
                            fontSize={isTablet ? '3vw' : '25px'}
                            gutterBottom
                            component='div'
                        >
                            Newest Lead Available As Of :{' '}
                            {new Date(
                                lastAvailableLead.create_date
                            ).toDateString()}{' '}
                            - {getTime(lastAvailableLead.create_date)}
                        </Typography>
                    )}
                    <TextField
                        label='Search'
                        variant='outlined'
                        placeholder='Searches all fields'
                        value={searchTerm}
                        onChange={handleChangeSearchTerm}
                        style={{ marginBottom: 20, minWidth: 250 }}
                    />
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell># ID</TableCell>
                                    <TableCell
                                        onClick={e =>
                                            handleRequestSort(e, 'create_date')
                                        }
                                    >
                                        Created Date Time
                                    </TableCell>
                                    <TableCell
                                        onClick={e =>
                                            handleRequestSort(
                                                e,
                                                'property_amount'
                                            )
                                        }
                                    >
                                        Porperty Value
                                    </TableCell>
                                    <TableCell
                                        onClick={e =>
                                            handleRequestSort(
                                                e,
                                                'mortgage_amount'
                                            )
                                        }
                                    >
                                        Mortgage Amount
                                    </TableCell>
                                    <TableCell>Notes</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stableSort(
                                    filteredData,
                                    getComparator(order, orderBy)
                                )
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map(row => (
                                        <TableRow key={row.id}>
                                            <TableCell
                                                component='th'
                                                scope='row'
                                            >
                                                #{row.id}
                                            </TableCell>
                                            <TableCell>
                                                {getDate(row.create_date)}{' '}
                                                {getTime(row.create_date)}
                                            </TableCell>
                                            <TableCell>
                                                {moneyField.format(
                                                    row.property_amount || 0
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {moneyField.format(
                                                    row.mortgage_amount || 0
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {showNote(row.message)}
                                            </TableCell>
                                            <TableCell>
                                                <Grid
                                                    container
                                                    spacing={{ xs: 2, md: 3 }}
                                                    columns={{
                                                        xs: 4,
                                                        sm: 8,
                                                        md: 12,
                                                    }}
                                                    alignItems='center'
                                                    direction={
                                                        isTablet
                                                            ? 'column'
                                                            : 'row'
                                                    }
                                                >
                                                    {!user.loading &&
                                                        !user.data
                                                            .read_only && (
                                                            <Grid item>
                                                                <Button
                                                                    variant='contained'
                                                                    onClick={() =>
                                                                        handleBuyLead(
                                                                            row
                                                                        )
                                                                    }
                                                                >
                                                                    Buy Lead
                                                                </Button>
                                                            </Grid>
                                                        )}
                                                    {!user.loading &&
                                                        user.data.is_admin && (
                                                            <Grid item>
                                                                <Button
                                                                    variant='contained'
                                                                    onClick={() =>
                                                                        handleDeactivateLead(
                                                                            row
                                                                        )
                                                                    }
                                                                >
                                                                    Deactivate
                                                                    Lead
                                                                </Button>
                                                            </Grid>
                                                        )}
                                                </Grid>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{ height: 53 * emptyRows }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
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
                </>
            )}
        </>
    );
};

export default Leads;
