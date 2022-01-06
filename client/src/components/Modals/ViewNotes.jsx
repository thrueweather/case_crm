import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Modal from 'components/Modals';

import { getTime } from 'utils';

const ViewNotes = ({ isOpen, handleClose, onSubmit, data }) => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setNotes(data.history);
        }
    }, [isOpen, data]);

    const onChange = (id, key) => e => {
        const arr = [...notes];
        setNotes(arr.map(item => (item.id === id ? { ...item, [key]: e.target.value } : item)));
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} handleClose={handleClose} title="View Notes">
            {notes.map(({ id, create_date, note, status }) => (
                <Box key={id} sx={{ marginBottom: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        {status.name}
                        <Box>
                            {new Date(create_date).toDateString()} - {getTime(create_date)}
                        </Box>
                    </Box>
                    <TextField
                        label="Notes"
                        type="text"
                        multiline
                        placeholder="Notes"
                        maxRows={6}
                        value={note}
                        onChange={onChange(id, 'note')}
                        fullWidth
                    />
                </Box>
            ))}
            <Button sx={{ marginTop: 3 }} variant="contained" onClick={() => onSubmit(notes)}>
                Save Note
            </Button>
        </Modal>
    );
};

export default ViewNotes;
