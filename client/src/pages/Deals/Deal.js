import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import swal from 'sweetalert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Toolbar from './Toolbar';
import AddEditDealModal from 'components/Modals/AddEditDeal';
import AddStatus from 'components/Modals/AddStatus';
import AddProduct from 'components/Modals/AddProduct';
import AddNote from 'components/Modals/AddNote';
import AddTask from 'components/Modals/AddTask';
import MoreDetails from 'components/Modals/MoreDetails';
import ProductTable from './ProductTable';
import History from './History';
import Loader from 'components/Loader';

import { getDataOfDeal, moneyField, caseValuePending, caseValueReceived } from 'utils';
import * as Api from 'api/repository';
import { fetchTasks } from 'store/reducers/tasks';

const styles = theme => ({
    root: {
        '& .MuiAccordion-root': {
            boxShadow: 'none',
        },
        '& .MuiAccordionSummary-root': {
            paddingLeft: '8px',
            color: '#1976d2',
        },
    },
});

const Deal = ({ classes }) => {
    const { id } = useParams();
    const form = useForm();
    const notesForm = useForm();
    const taskForm = useForm();
    const dispatch = useDispatch();

    const [editDealIsOpen, setEditDealIsOpen] = useState(false);
    const [addStatusIsOpen, setAddStatusIsOpen] = useState(false);
    const [addProductIsOpen, setAddProductIsOpen] = useState(false);
    const [addTaskIsOpen, setAddTaskIsOpen] = useState(false);
    const [notesIsOpen, setNotesIsOpen] = useState(false);
    const [deal, setDeal] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [editIsProcessing, setEditIsProcessing] = useState(false);
    const [moreDetailsIsOpen, setMoreDetailsIsOpen] = useState(false);
    const [viewNotesIsOpen, setViewNotesIsOpen] = useState(false);

    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchData = useCallback(async () => {
        try {
            const response = await Api.fetchDeal(id);
            setDeal(response);

            const values = getDataOfDeal(response.lead);
            for (const key in values) form.setValue(key, values[key]);

            setIsProcessing(false);
        } catch (error) {
            setError(error);
            setIsProcessing(false);
        }
    }, [id, form]);

    useEffect(() => fetchData(), [fetchData]);

    const onEditDeal = useCallback(async () => {
        const values = form.getValues();
        try {
            setEditIsProcessing(true);
            await Api.editDeal(deal.id, values);
            setActiveStep(2);
            setEditIsProcessing(false);
            fetchData();
            await swal('Great!', 'The Deal has been successfully updated!', 'success');
            handleCloseEditModal();
        } catch (error) {
            setActiveStep(1);
            setEditIsProcessing(false);
            swal({
                title: error.message,
                icon: 'Error',
                dangerMode: true,
            });
        }
    }, [form, deal, fetchData]);

    useEffect(() => {
        if (activeStep === 2) {
            onEditDeal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeStep]);

    const handleChangeStep = () => setActiveStep(previousStep => previousStep + 1);

    const handleBackActiveStep = step => setActiveStep(step);

    const handleOpenEditModal = () => setEditDealIsOpen(true);

    const handleCloseEditModal = () => {
        setEditDealIsOpen(false);
        setActiveStep(0);
    };

    const onAddNotes = async variables => {
        try {
            await Api.addNotes(deal.id, variables);
            fetchData();
            await swal('Great!', 'The Notes has been successfully added to the deal!', 'success');
            setNotesIsOpen(false);
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
                ...item,
                status: typeof item.status === 'object' ? item.status.id : item.status,
            }));
            await Api.updateNotes(deal.id, data);
            fetchData();
            await swal('Great!', 'The Notes has been successfully updated!', 'success');
            setViewNotesIsOpen(false);
        } catch (error) {
            swal({
                title: error.message,
                icon: 'Error',
                dangerMode: true,
            });
        }
    };

    const handleAddProduct = async variables => {
        try {
            await Api.addProduct(deal.id, variables);
            fetchData();
            await swal('Great!', 'The Product has been successfully added to the deal!', 'success');
            setAddProductIsOpen(false);
        } catch (error) {
            await swal({
                title: error.message,
                icon: 'Error',
                dangerMode: true,
            });
            setAddProductIsOpen(false);
        }
    };

    const onAddTask = async data => {
        try {
            await Api.addTask(deal.id, data);
            fetchData();
            await swal('Great!', 'Task has been successfully added to the deal!', 'success');
            dispatch(fetchTasks());
            setAddTaskIsOpen(false);
        } catch (error) {
            await swal({
                title: error.message,
                icon: 'Error',
                dangerMode: true,
            });
            setAddTaskIsOpen(false);
        }
    };

    const wrappStyles = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    if (isProcessing || !deal) return <Loader />;

    if (error) return error.message;

    const availableStatusesForNotes = deal.history.map(item => item);

    const handleOpenViewNotesModal = () => {
        setViewNotesIsOpen(state => !state);
    };

    const totalValuePending = moneyField.format(caseValuePending(deal?.products));
    const totalValueReceived = moneyField.format(caseValueReceived(deal?.products));

    return (
        <Box className={classes.root}>
            {isTablet ? (
                <Box textAlign="center">
                    <Typography variant="h4" gutterBottom component="div" sx={{ margin: 0 }}>
                        Case #{id}
                    </Typography>

                    <Box>
                        <Box className="lead-info">
                            <Typography gutterBottom variant="h4" component="div">
                                {deal?.lead.customer.first_name}
                            </Typography>
                            <Typography gutterBottom variant="h4" component="div">
                                {deal?.lead.customer.last_name}
                            </Typography>
                            <Typography variant="h6" component="div">
                                Created At: {new Date(deal?.create_date).toDateString()}
                            </Typography>
                            <Button size="small" onClick={() => setMoreDetailsIsOpen(true)}>
                                More Details
                            </Button>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                            <Card variant="outlined" sx={{ marginBottom: 3 }}>
                                <CardContent>
                                    <Typography
                                        sx={{ fontSize: 18 }}
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        Case Value Pending
                                    </Typography>
                                    <Typography variant="h3">{totalValuePending}</Typography>
                                </CardContent>
                            </Card>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography
                                        sx={{ fontSize: 18 }}
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        Case Value Received
                                    </Typography>
                                    <Typography variant="h3">{totalValueReceived}</Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                    <Toolbar
                        wrappStyles={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}
                        handleOpenEditModal={handleOpenEditModal}
                        setAddStatusIsOpen={setAddStatusIsOpen}
                        setAddProductIsOpen={setAddProductIsOpen}
                        setNotesIsOpen={setNotesIsOpen}
                        setAddTaskIsOpen={setAddTaskIsOpen}
                    />
                </Box>
            ) : (
                <Box>
                    <Toolbar
                        wrappStyles={wrappStyles}
                        id={id}
                        handleOpenEditModal={handleOpenEditModal}
                        setAddStatusIsOpen={setAddStatusIsOpen}
                        setAddProductIsOpen={setAddProductIsOpen}
                        setNotesIsOpen={setNotesIsOpen}
                        setAddTaskIsOpen={setAddTaskIsOpen}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box className="lead-info">
                            <Typography gutterBottom variant="h4" component="div">
                                {deal?.lead.customer.first_name}
                            </Typography>
                            <Typography gutterBottom variant="h4" component="div">
                                {deal?.lead.customer.last_name}
                            </Typography>
                            <Typography variant="h6" component="div">
                                Created At: {new Date(deal?.create_date).toDateString()}
                            </Typography>
                            <Button size="small" onClick={() => setMoreDetailsIsOpen(true)}>
                                More Details
                            </Button>
                        </Box>
                        <Card variant="outlined" sx={{ marginX: 3 }}>
                            <CardContent>
                                <Typography
                                    sx={{ fontSize: 18 }}
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Case Value Pending
                                </Typography>
                                <Typography variant="h3">{totalValuePending}</Typography>
                            </CardContent>
                        </Card>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography
                                    sx={{ fontSize: 18 }}
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Case Value Received
                                </Typography>
                                <Typography variant="h3">{totalValueReceived}</Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            )}

            <Box sx={{ marginTop: 3 }}>
                <History
                    data={deal.history}
                    deal={deal}
                    viewNotesIsOpen={viewNotesIsOpen}
                    handleOpenViewNotesModal={handleOpenViewNotesModal}
                    handleEditNotes={onEditNotes}
                    fetchData={fetchData}
                    availableStatusesForNotes={availableStatusesForNotes}
                />
            </Box>
            <Box>
                <ProductTable
                    data={deal.products}
                    caseValuePending={totalValuePending}
                    caseValueReceived={totalValueReceived}
                />
            </Box>
            <AddEditDealModal
                edit
                isOpen={editDealIsOpen}
                form={form}
                activeStep={activeStep}
                isProcessing={editIsProcessing}
                handleClose={handleCloseEditModal}
                handleChangeStep={handleChangeStep}
                handleBackActiveStep={handleBackActiveStep}
            />
            <AddStatus
                deal={deal}
                isOpen={addStatusIsOpen}
                handleClose={() => setAddStatusIsOpen(false)}
                refetchDeal={fetchData}
            />
            <AddProduct
                isOpen={addProductIsOpen}
                handleClose={() => setAddProductIsOpen(false)}
                handleAddProduct={handleAddProduct}
                fetchData={fetchData}
                deal={deal}
            />
            <AddNote
                isOpen={notesIsOpen}
                handleClose={() => setNotesIsOpen(false)}
                onSubmit={onAddNotes}
                notesForm={notesForm}
                statuses={availableStatusesForNotes}
            />
            <AddTask
                isOpen={addTaskIsOpen}
                handleClose={() => setAddTaskIsOpen(false)}
                handleAddTask={onAddTask}
                taskForm={taskForm}
            />
            <MoreDetails
                isOpen={moreDetailsIsOpen}
                handleClose={() => setMoreDetailsIsOpen(false)}
                details={deal}
            />
        </Box>
    );
};

export default withStyles(styles)(Deal);
