import { useState } from 'react';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import CancelIcon from '@mui/icons-material/Cancel';

import AddNote from 'components/Modals/AddNote';

import { getDate, getTime } from 'utils';
import * as Api from 'api/repository';

const History = ({ data = [], deal, fetchData }) => {
    const notesForm = useForm();

    const [selectedStatus, setSelectedStatus] = useState([]);
    const [selectedHistory, setSelectedHistory] = useState([]);
    const [notesIsOpen, setNotesIsOpen] = useState(false);
    const [expandedNotes, setExpandedNotesl] = useState(false);

    const onAddNotes = async variables => {
        try {
            await Api.addNotes(deal.id, { ...variables, history_pk: selectedHistory.id });

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

    const onOpenNotesModal = date => {
        setSelectedHistory(date);
        setSelectedStatus(date.status);
        setNotesIsOpen(true);
    };

    const onShowAllNotes = event => setExpandedNotesl(event.target.checked);

    const showNotes = str => {
        if (expandedNotes) return str;

        if (str.length > 35) {
            return (
                <Tooltip title={str} placement="top">
                    <span>{str.slice(0, 35).concat('...')}</span>
                </Tooltip>
            );
        }

        return str;
    };

    const onRemoveRecord = async (dealId, recordId) => {
        try {
            const confirmed = await swal({
                title: 'Are you sure you want to remove this history record?',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            });
            if (confirmed) {
                await Api.removeHistoryRecord(dealId, recordId);
                fetchData();
            }
        } catch (error) {
            swal({
                title: error.message,
                icon: 'Error',
                dangerMode: true,
            });
        }
    };

    return (
        <Box>
            <Typography gutterBottom variant="h4" component="div">
                History
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell>Created Date Time</TableCell>
                            <TableCell>
                                Notes
                                {data?.some(i => i?.note?.length > 35) && (
                                    <>
                                        <Checkbox
                                            sx={{ marginLeft: 1 }}
                                            onChange={onShowAllNotes}
                                        />{' '}
                                        {expandedNotes ? 'collapse' : 'expand'}
                                    </>
                                )}
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data
                            .sort((a, b) => new Date(b.create_date) - new Date(a.create_date))
                            .map(row => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row" width={200}>
                                        {row.status.name}
                                    </TableCell>
                                    <TableCell width={200}>
                                        {getDate(row.create_date)} {getTime(row.create_date)} <br />{' '}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <Box>
                                            {row.note ? (
                                                showNotes(row.note)
                                            ) : (
                                                <Button
                                                    variant="text"
                                                    onClick={() => onOpenNotesModal(row)}
                                                >
                                                    Add Note
                                                </Button>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="right">
                                        {row.status.name !== deal.status.name && (
                                            <Button
                                                variant="contained"
                                                onClick={() => onRemoveRecord(deal.id, row.id)}
                                            >
                                                Remove
                                                <CancelIcon sx={{ marginLeft: 1 }} />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <AddNote
                isOpen={notesIsOpen}
                handleClose={() => setNotesIsOpen(false)}
                onSubmit={onAddNotes}
                notesForm={notesForm}
                statuses={[]}
                selectedStatus={selectedStatus}
            />
        </Box>
    );
};

export default History;
