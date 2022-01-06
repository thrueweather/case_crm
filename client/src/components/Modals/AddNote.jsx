import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Modal from 'components/Modals';
import SelectField from '../SelectField';

const AddNote = ({ isOpen, handleClose, notesForm, onSubmit, statuses = [], selectedStatus }) => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        getValues,
    } = notesForm;

    const values = getValues();

    return (
        <Modal isOpen={isOpen} handleClose={handleClose} title="Add Note">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Typography sx={{ fontSize: 18 }} gutterBottom>
                    {selectedStatus?.name}
                </Typography>
                <TextField
                    label="Notes"
                    type="text"
                    multiline
                    placeholder="Add text"
                    maxRows={6}
                    rows={4}
                    error={!!errors.notes}
                    {...register('notes', { required: true })}
                    fullWidth
                />
                {!selectedStatus && (
                    <SelectField
                        fullWidth
                        sx={{ marginTop: 3 }}
                        label={'Select Corresponding Event'}
                        error={!!errors.status}
                        defaultValue={values.status}
                        {...register('history_pk', { required: true })}
                        options={statuses.map(({ id, status }) => ({
                            value: id,
                            label: status.name,
                        }))}
                    />
                )}
                <Button sx={{ marginTop: 3 }} type="submit" variant="contained">
                    Submit Note
                </Button>
            </form>
        </Modal>
    );
};

export default AddNote;
