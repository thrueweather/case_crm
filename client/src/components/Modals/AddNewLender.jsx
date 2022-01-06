import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Modal from './index';

const AddNewLender = ({ newLenderIsOpen, setNewLenderIsOpen, newLender, onChangeNewLender }) => (
    <Modal
        isOpen={newLenderIsOpen}
        handleClose={() => setNewLenderIsOpen(false)}
        title="Add a New Mortgage Lender"
        styles={{ width: 600 }}
    >
        <Typography variant="subtitle1" gutterBottom component="div">
            If your intended mortgage is not on the list then please fill out their name correctly
            below. Please ensure all spellings are correct as this provider will then be available
            for the entire platform.
        </Typography>
        <TextField
            sx={{ marginY: 3 }}
            label="Add Lender Name"
            type="text"
            placeholder="Add Lender Name"
            value={newLender}
            onChange={onChangeNewLender}
            fullWidth
        />
        <Button type="submit" variant="contained" onClick={() => setNewLenderIsOpen(false)}>
            Save
        </Button>
    </Modal>
);

export default AddNewLender;
