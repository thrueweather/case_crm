import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import Modal from 'components/Modals';

const ViewTasks = ({ isOpen, data, handleClose }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setTasks(data.tasks);
        }
    }, [isOpen, data]);

    const showMessage = message => {
        if (message.length > 255) {
            return message.slice(0, 255).concat('...');
        }

        return message;
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} handleClose={handleClose} title="View Tasks">
            {tasks.map(({ id, message, due_date }, index) => (
                <Box key={id} sx={{ marginBottom: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        Task #{index + 1}
                        <Box>{new Date(due_date).toDateString()}</Box>
                    </Box>
                    <Tooltip title={message} placement="top">
                        <TextField
                            label="Task"
                            type="text"
                            multiline
                            maxRows={6}
                            value={showMessage(message)}
                            fullWidth
                            InputProps={{ readOnly: true }}
                        />
                    </Tooltip>
                </Box>
            ))}
        </Modal>
    );
};

export default ViewTasks;
