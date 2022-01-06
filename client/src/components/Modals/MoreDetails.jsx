import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import Divider from '@mui/material/Divider';
import Modal from 'components/Modals';

const styles = theme => ({
    list: {
        padding: '10px 0',
    },
});

const MoreDetails = ({ isOpen, handleClose, details, classes }) => {
    if (!isOpen) return null;

    const { status, products, notes } = details;

    const displayProducts =
        products.length > 0 ? (
            <ul>
                {products.map(i => (
                    <li key={i.id}>{i.product?.name || 'Mortgage'}</li>
                ))}
            </ul>
        ) : (
            'N/A'
        );

    const displayNotes =
        notes.length > 0 ? (
            <ul>
                {notes.map(item => (
                    <li key={item.id}>{item.note}</li>
                ))}
            </ul>
        ) : (
            'N/A'
        );

    return (
        <Modal isOpen={isOpen} handleClose={handleClose} title="More details">
            <div className={classes.list}>Status: {status?.name}</div>
            <Divider />
            <div className={classes.list}>Products: {displayProducts}</div>
            <Divider />
            <div className={classes.list}>Notes: {displayNotes}</div>
            <Divider />
        </Modal>
    );
};

export default withStyles(styles)(MoreDetails);
