import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import CancelIcon from '@mui/icons-material/Cancel';

import AddNote from 'components/Modals/AddNote';
import ViewNotes from 'components/Modals/ViewNotes';
import ViewTasks from 'components/Modals/ViewTasks';
import AddEditDealModal from 'components/Modals/AddEditDeal';
import TablePaginationActions from 'components/PaginationActions';
import Loader from 'components/Loader';
import ProductsCell from 'components/ProductsCell';

import { getDate, getTime, moneyField } from 'utils';
import {
    fetchDeals,
    changePage,
    changeRowsPerPage,
} from 'store/reducers/deals/index';
import { createDeal, addNotes, updateNotes, deleteCase } from 'api/repository';
import SelectField from 'components/SelectField';

const Deals = () => {
    const { loading, data, error, rowsPerPage, page } = useSelector(
        state => state.deals
    );
    const dispatch = useDispatch();
    const form = useForm();
    const notesForm = useForm();
    const viewNotesForm = useForm();
    const user = useSelector(state => state.user);

    const [activeTab, setActiveTab] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [deal, setDeal] = useState(null);
    const [addNotesIsOpen, setAddNotesIsOpen] = useState(false);
    const [viewNotesIsOpen, setViewNotesIsOpen] = useState(false);
    const [viewTasksIsOpen, setTasksNotesIsOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchDeals(activeTab));
    }, [dispatch, activeTab]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setActiveStep(0);
        form.reset();
    }, [form]);

    const onAddDeal = useCallback(async () => {
        const values = form.getValues();
        try {
            setIsProcessing(true);
            await createDeal(values);
            setIsProcessing(false);
            dispatch(fetchDeals());
            handleClose();
            swal(
                'Great!',
                'The Deal has been successfully created!',
                'success'
            );
        } catch (error) {
            swal('Error!', error.message, 'error');
            setIsProcessing(false);
            handleClose();
        }
    }, [form, dispatch, handleClose]);

    useEffect(() => {
        if (activeStep === 2) {
            onAddDeal();
        }
    }, [activeStep, onAddDeal]);

    const filteredData = useMemo(() => {
        const array = [...data];
        return array
            .sort((a, b) => new Date(b.create_date) - new Date(a.create_date))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [data, page, rowsPerPage]);

    const handleOpen = () => setIsOpen(true);

    const handleChangeStep = async () => {
        setActiveStep(previousStep => previousStep + 1);
    };

    const handleBackActiveStep = step => {
        setActiveStep(step);
    };

    const handleChangePage = (event, newPage) => {
        dispatch(changePage(newPage));
    };

    const handleChangeRowsPerPage = event => {
        dispatch(changeRowsPerPage(parseInt(event.target.value, 10)));
    };

    const handleOpenViewNotesModal = async data => {
        setDeal(data);
        setViewNotesIsOpen(true);
    };

    const handleOpenViewTasksModal = async data => {
        setDeal(data);
        setTasksNotesIsOpen(true);
    };

    const handleOpenAddNoteModal = data => {
        setDeal(data);
        setAddNotesIsOpen(true);
    };

    const onAddNotes = async variables => {
        try {
            await addNotes(deal.id, variables);
            dispatch(fetchDeals(activeTab));
            await swal(
                'Great!',
                'The Notes has been successfully added to the deal!',
                'success'
            );
            setAddNotesIsOpen(false);
        } catch (error) {
            swal({
                title: error.message,
                icon: 'Error',
                dangerMode: true,
            });
        }
    };

    const onEditNotes = async variables => {
        try {
            const data = variables.map(item => ({
                history_pk: item.id,
                note: item.note,
            }));

            await updateNotes(deal.id, data);
            dispatch(fetchDeals(activeTab));
            await swal(
                'Great!',
                'The Notes has been successfully updated!',
                'success'
            );
            setViewNotesIsOpen(false);
        } catch (error) {
            swal({
                title: error.message,
                icon: 'Error',
                dangerMode: true,
            });
        }
    };

    const onRemoveDeal = async dealId => {
        try {
            const confirmed = await swal({
                title: 'Are you sure you want to remove this case?',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            });
            if (confirmed) {
                await deleteCase(dealId);
                dispatch(fetchDeals(activeTab));
                swal(
                    'Great!',
                    'The Case has been successfully removed!',
                    'success'
                );
            }
        } catch (error) {
            swal({
                title: error.message,
                icon: 'Error',
                dangerMode: true,
            });
        }
    };

    if (error) return error.message;

    const availableStatuses = deal
        ? deal.history.length
            ? deal.history.map(i => i)
            : [deal.history]
        : [];

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <Typography variant='h3' gutterBottom component='div' sx={{ marginRight: 3 }}>
                        Cases
                    </Typography>
                    {data.length > 0 &&
                        <SelectField
                            sx={{ width: 200 }}
                            label={'Status Filter'}
                            options={data.map(({ id, status }) => ({
                                value: id,
                                label: status.name,
                            }))}
                        
                        />}
                </Box>
                <Button variant='contained' onClick={handleOpen}>
                    Add Client
                </Button>
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
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    aria-label='basic tabs example'
                    variant='scrollable'
                >
                    <Tab label='All' value='' />
                    <Tab label='Active' value='active' />
                    <Tab label='Inactive' value='inactive' />
                    <Tab label='Completed' value='completed' />
                </Tabs>
            </Box>
            {loading ? (
                <Loader />
            ) : data.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                        <TableHead>
                            <TableRow>
                                <TableCell># ID</TableCell>
                                <TableCell>Created Date Time</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Loan Value</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Products</TableCell>
                                <TableCell>Tasks</TableCell>
                                <TableCell>Notes</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map(row => (
                                <TableRow
                                    key={row.id}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component='th' scope='row'>
                                        <Link to={`/cases/${row.id}`}>
                                            {row.id}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {getDate(row.create_date)}{' '}
                                        {getTime(row.create_date)}
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/cases/${row.id}`}>
                                            {row.lead.customer.first_name}{' '}
                                            {row.lead.customer.last_name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {row.lead.customer.email || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {moneyField.format(
                                            row.lead.property_amount
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {row.status?.name || 'N/A'}
                                    </TableCell>
                                    <TableCell width={200}>
                                        <ProductsCell products={row.products} />
                                    </TableCell>
                                    <TableCell>
                                        {row?.tasks?.length > 0 ? (
                                            <Tooltip
                                                title='View Tasks'
                                                placement='top'
                                            >
                                                <Button
                                                    variant='contained'
                                                    onClick={() =>
                                                        handleOpenViewTasksModal(
                                                            row
                                                        )
                                                    }
                                                >
                                                    <VisibilityIcon />
                                                </Button>
                                            </Tooltip>
                                        ) : (
                                            'N/A'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {row?.isnote ? (
                                            <Tooltip
                                                title='View Notes'
                                                placement='top'
                                            >
                                                <Button
                                                    variant='contained'
                                                    onClick={() =>
                                                        handleOpenViewNotesModal(
                                                            row
                                                        )
                                                    }
                                                >
                                                    <VisibilityIcon />
                                                </Button>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip
                                                title='Add Note'
                                                placement='top'
                                            >
                                                <Button
                                                    variant='contained'
                                                    onClick={() =>
                                                        handleOpenAddNoteModal(
                                                            row
                                                        )
                                                    }
                                                >
                                                    <AddIcon />
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {!user.loading && user.data.is_admin && (
                                            <Button
                                                variant='contained'
                                                onClick={() =>
                                                    onRemoveDeal(row.id)
                                                }
                                            >
                                                Remove
                                                <CancelIcon
                                                    sx={{ marginLeft: 1 }}
                                                />
                                            </Button>
                                        )}
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
                                        { label: 'All', value: data.length },
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
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant='h5' gutterBottom component='div'>
                    There are no cases
                </Typography>
            )}
            <AddEditDealModal
                isOpen={isOpen}
                activeStep={activeStep}
                isProcessing={isProcessing}
                handleClose={handleClose}
                form={form}
                handleChangeStep={handleChangeStep}
                handleBackActiveStep={handleBackActiveStep}
            />
            <AddNote
                isOpen={addNotesIsOpen}
                handleClose={() => setAddNotesIsOpen(false)}
                onSubmit={onAddNotes}
                notesForm={notesForm}
                statuses={availableStatuses}
            />
            <ViewNotes
                isOpen={viewNotesIsOpen}
                handleClose={() => setViewNotesIsOpen(false)}
                onSubmit={onEditNotes}
                viewNotesForm={viewNotesForm}
                data={deal}
                availableStatuses={availableStatuses}
                isModal={true}
            />
            <ViewTasks
                isOpen={viewTasksIsOpen}
                handleClose={() => setTasksNotesIsOpen(false)}
                viewNotesForm={viewNotesForm}
                data={deal}
                availableStatuses={availableStatuses}
                isModal={true}
            />
        </>
    );
};

export default Deals;
