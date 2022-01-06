import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';

import { moneyField, getDate } from 'utils';

export default function ProductTable({ data, caseValuePending, caseValueReceived }) {
    return (
        <Box sx={{ marginTop: 3 }}>
            <Typography gutterBottom variant="h4" component="div">
                Product Table
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Product Type</TableCell>
                            <TableCell>Provider Or Lender</TableCell>
                            <TableCell>Product (Insurance Only)</TableCell>
                            <TableCell>Application fee</TableCell>
                            <TableCell>Offer / Completion Fee</TableCell>
                            <TableCell>Proc Fee</TableCell>
                            <TableCell>Gross Total Pending</TableCell>
                            <TableCell>Gross Total Receieved</TableCell>
                            <TableCell>Expiry Date</TableCell>
                            <TableCell>Notes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map(row => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell className="text-capitalize ">
                                    {row.product_type}
                                </TableCell>
                                <TableCell>
                                    {row?.lender?.name || row.product.provider.name}
                                </TableCell>
                                <TableCell>
                                    {row.product_type !== 'mortgage'
                                        ? row.product.name
                                        : 'Mortgage'}
                                </TableCell>
                                <TableCell
                                    className={
                                        row.received_application_fee ? 'received' : 'pending'
                                    }
                                >
                                    {moneyField.format(row.application_fee)}
                                </TableCell>
                                <TableCell
                                    className={
                                        row.received_offer_completion_fee ? 'received' : 'pending'
                                    }
                                >
                                    {moneyField.format(row.offer_completion_fee)}
                                </TableCell>
                                <TableCell
                                    className={row.received_proc_fee ? 'received' : 'pending'}
                                >
                                    {moneyField.format(row.proc_fee)}
                                </TableCell>
                                <TableCell>{moneyField.format(row.gross_total_pending)}</TableCell>
                                <TableCell>{moneyField.format(row.gross_total_received)}</TableCell>
                                <TableCell>{getDate(row.expiry_date)}</TableCell>
                                <TableCell>
                                    {row.message.length >= 40 ? (
                                        <Tooltip title={row.message} placement="bottom">
                                            <span>{row.message.slice(0, 40).concat('...')}</span>
                                        </Tooltip>
                                    ) : (
                                        row.message
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={6}>
                                <h3 style={{ margin: 0 }}>Total</h3>
                            </TableCell>
                            <TableCell>{caseValuePending}</TableCell>
                            <TableCell>{caseValueReceived}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
