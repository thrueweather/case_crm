import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import Modal from 'components/Modals/index';
import DateField from '../DateField';
import { useEffect } from 'react';

const wrappStyles = {
    marginTop: 3,
    display: 'flex',
    alignItems: 'center',
};

const AddTask = ({ isOpen, handleClose, handleAddTask, taskForm, edit }) => {
    const [date, setDate] = useState(null);
    const [startDate, setStartDate] = useState(null);

    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors },
    } = taskForm;

    const { due_date, messange, note } = getValues();

    useEffect(() => {
        if (!edit) return;

        if (due_date) {
            setStartDate(new Date(due_date).toLocaleDateString());
        }
    }, [edit, due_date]);

    const onAddTask = async data => {
        handleAddTask({
            ...data,
            date,
        });
    };

    return (
        <Modal isOpen={isOpen} handleClose={handleClose} title={`${edit ? 'Edit' : 'Add'} Task`}>
            <form onSubmit={handleSubmit(onAddTask)}>
                <TextField
                    label="Task"
                    type="text"
                    multiline
                    placeholder="Add text"
                    defaultValue={edit ? messange : ''}
                    maxRows={6}
                    rows={4}
                    {...register('message', { required: true })}
                    fullWidth
                />
                <TextField
                    sx={{ marginTop: 2 }}
                    label="Notes"
                    type="text"
                    multiline
                    placeholder="Add text"
                    maxRows={6}
                    rows={4}
                    error={!!errors.notes}
                    defaultValue={edit ? note : ''}
                    {...register('note', { required: true })}
                    fullWidth
                />
                <Box sx={wrappStyles}>
                    <DateField
                        placeholder="Select Date"
                        onChange={setDate}
                        selected={date}
                        value={date ? date : startDate}
                    />
                </Box>
                <Button sx={{ marginTop: 3 }} type="submit" variant="contained">
                    Submit
                </Button>
            </form>
        </Modal>
    );
};

export default AddTask;
