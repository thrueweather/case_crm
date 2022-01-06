import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import swal from 'sweetalert';

import Loader from 'components/Loader';
import AddTask from 'components/Modals/AddTask';

import * as Api from 'api/repository';
import { fetchTasks, setActiveTab } from 'store/reducers/tasks';

const Tasks = () => {
    const { loading, data, error, activeTab } = useSelector(state => state.tasks);
    const [editTaskIsOpen, setEditTaskIsOpen] = useState(false);

    const dispatch = useDispatch();
    const theme = useTheme();
    const taskForm = useForm();

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch, activeTab]);

    const onActiveTab = (e, value) => {
        dispatch(setActiveTab(value));
    };

    const onRemoveTask = async taskId => {
        try {
            const confirmed = await swal({
                title: 'Are you sure you want to remove this task?',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            });
            if (confirmed) {
                await Api.removeTask(taskId);
                dispatch(fetchTasks());
                swal('Great!', 'The Task has been successfully removed!', 'success');
            }
        } catch (error) {
            swal({
                title: error.message,
                icon: 'Error',
                dangerMode: true,
            });
        }
    };

    const onAddTask = async data => {
        const values = taskForm.getValues();
        try {
            await Api.updateTasks(values.id, data);
            dispatch(fetchTasks());
            await swal('Great!', 'Task has been successfully edited!', 'success');
            setEditTaskIsOpen(false);
        } catch (error) {
            await swal({
                title: error.message,
                icon: 'Error',
                dangerMode: true,
            });
            setEditTaskIsOpen(false);
        }
    };

    const openModal = async values => {
        for (const key in values) taskForm.setValue(key, values[key]);
        setEditTaskIsOpen(true);
    };

    if (loading && !data) return <Loader />;

    if (error) return error.message;

    return (
        <>
            <Typography variant="h3" gutterBottom component="div">
                Tasks
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 3 }}>
                <Tabs value={activeTab} onChange={onActiveTab} aria-label="basic tabs example">
                    <Tab label="To do" value="toDo" />
                    <Tab label="Completed" value="completed" />
                    <Tab label="All" value="all" />
                </Tabs>
            </Box>
            {data.length ? (<TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Task</TableCell>
                            <TableCell>Due date</TableCell>
                            <TableCell>Notes</TableCell>
                            <TableCell>Case</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map(row => (
                            <TableRow
                                key={row.id}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    background:
                                        new Date(row.due_date).toLocaleDateString() ===
                                            new Date().toLocaleDateString()
                                            ? theme.red.light
                                            : 'transperent',
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.message}
                                </TableCell>
                                <TableCell>{new Date(row.due_date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {row.note.length >= 40 ? (
                                        <Tooltip title={row.note} placement="bottom">
                                            <span>{row.note.slice(0, 40).concat('...')}</span>
                                        </Tooltip>
                                    ) : (
                                        row.note
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Link to={`/cases/${row.deal}`}>Case #{row.deal}</Link>
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" onClick={() => openModal(row)}>
                                        Edit
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        onClick={() => onRemoveTask(row.id)}
                                    >
                                        Remove
                                        <CancelIcon sx={{ marginLeft: 1 }} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>) : ((
                <Typography variant="h5" gutterBottom component="div">
                    There are no tasks yet
                </Typography>
            ))}
            <Box>
                <AddTask
                    edit
                    isOpen={editTaskIsOpen}
                    handleClose={() => setEditTaskIsOpen(false)}
                    taskForm={taskForm}
                    handleAddTask={onAddTask}
                />
            </Box>
        </>
    );
};

export default Tasks;
