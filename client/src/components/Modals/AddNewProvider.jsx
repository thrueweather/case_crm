import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Modal from './index';

const AddNewProvider = ({
    newProviderIsOpen,
    setNewProviderIsOpen,
    newProvider,
    onChangeNewProvider,
}) => (
    <Modal
        isOpen={newProviderIsOpen}
        handleClose={() => setNewProviderIsOpen(false)}
        title="Add a New Insurance Provider And Product"
        styles={{ width: 600 }}
    >
        <Typography variant="subtitle1" gutterBottom component="div">
            If your intended provider and product is not on the list then please fill out their name
            correctly below. Please ensure all spellings are correct as this provider will then be
            available for the entire platform.
        </Typography>
        <TextField
            sx={{ marginY: 3 }}
            label="Add Provider Name"
            type="text"
            placeholder="Add Provider Name"
            value={newProvider.name}
            onChange={onChangeNewProvider('name')}
            fullWidth
        />
        <TextField
            sx={{ marginBottom: 3 }}
            label="Add Product Name"
            type="text"
            placeholder="Add Product Name"
            value={newProvider.product}
            onChange={onChangeNewProvider('product')}
            fullWidth
        />
        <Button type="submit" variant="contained" onClick={() => setNewProviderIsOpen(false)}>
            Save
        </Button>
    </Modal>
);

export default AddNewProvider;
