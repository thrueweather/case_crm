import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const ModalWrapper = ({ isOpen, handleClose, title, children, styles }) => {
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

    const modalStyles = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isTablet ? '100%' : 600,
        overflowY: 'auto',
        maxHeight: 700,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{ ...modalStyles, ...styles }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h4" gutterBottom component="div">
                        {title}
                    </Typography>
                    <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
                </Box>
                {children}
            </Box>
        </Modal>
    );
};

export default React.memo(ModalWrapper);
