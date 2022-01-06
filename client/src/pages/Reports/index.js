import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Grow from '@mui/material/Grow';
import ButtonGroup from '@mui/material/ButtonGroup';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import FileSaver from 'file-saver';

import AsyncSelect from 'components/AsyncSelect';
import DateField from 'components/DateField';
import { getDate } from 'utils';
import { exportReports } from 'api/repository'


import {
    fetchReports,
    setBroker,
    setDateRange,
    resetFilters,
    setYear,
    setMonth,
    setCompany,
} from 'store/reducers/reports';



const Reports = () => {
    const user = useSelector(state => state.user);
    const { data, broker, dateRange, year, month, company } = useSelector(
        state => state.reports
    );
    const { startDate, endDate } = dateRange;
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const dispatch = useDispatch();

    const options = [
        {
            name: 'csv',
        },
        {
            name: 'xlsx',
        },
        {
            name: 'pdf',
        },
    ];

    useEffect(() => {
        dispatch(fetchReports())
    }, [startDate, endDate, year, month, broker, company, dispatch])

    const onChangeDateRange = (dates) => {
        dispatch(setDateRange(dates));
    };

    const onResetFilters = () => {
        dispatch(resetFilters());
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };

    const handleClose = event => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const getReports = async format => {
        const res = await exportReports(format);
        FileSaver.saveAs(res, `reports.${format}`)
    }

    const resetFiltersButton =
        broker || startDate || endDate || year || month || company ? (
            <Button variant="outlined" onClick={onResetFilters}>
                Reset
            </Button>
        ) : null;

    return (
        <div>
            <Typography variant="h3" gutterBottom component="div">
                Reports
            </Typography>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ alignItems: 'center', }}>
                <Grid item >
                    <DateField
                        placeholder="Select Date Range"
                        onChange={onChangeDateRange}
                        selected={startDate}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        isClearable
                        disabled={year || month}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className={year || month ? "datepicker__disabled" : ''}
                    />
                </Grid>
                <Grid item>
                    <DateField
                        placeholder="Select Year"
                        selected={year}
                        onChange={e => dispatch(setYear(e))}
                        showYearPicker
                        dateFormat="yyyy"
                        isClearable
                        disabled={startDate}
                        className={startDate ? "datepicker__disabled" : ''}
                    />
                </Grid>
                <Grid item>
                    <DateField
                        renderCustomHeader={() => (
                            <div
                                style={{
                                    display: "none",
                                }}
                            >
                            </div>
                        )}
                        placeholder="Select Month"
                        selected={month}
                        onChange={e => dispatch(setMonth(e))}
                        dateFormat="MM"
                        showMonthYearPicker
                        showFullMonthYearPicker
                        isClearable
                        disabled={startDate}
                        className={startDate ? "datepicker__disabled" : ''}
                    />
                </Grid>
                {!user.loading && user.data.is_admin && (
                    <>
                        <Grid item>
                            <AsyncSelect
                                value={company || ''}
                                sx={{ width: '228px' }}
                                path="/api/companies/"
                                label="Brokerage"
                                optionName="name"
                                onChange={e => dispatch(setCompany(e.target.value))}
                            />
                        </Grid>
                        <Grid item>
                            <AsyncSelect
                                value={broker || ''}
                                sx={{ width: '228px' }}
                                path="/api/brokers/"
                                label="Broker"
                                optionName="email"
                                onChange={e => dispatch(setBroker(e.target.value))}
                            />
                        </Grid>
                        <Grid item>
                            <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                                <Button
                                    variant="contained"
                                    onClick={handleToggle}
                                    // eslint-disable-next-line react/jsx-no-duplicate-props
                                    onClick={() => getReports(options[selectedIndex].name)}
                                >
                                    {'Export '}
                                    {options[selectedIndex].name}
                                </Button>
                                <Button
                                    size="small"
                                    aria-controls={open ? 'split-button-menu' : undefined}
                                    aria-expanded={open ? 'true' : undefined}
                                    aria-label="select merge strategy"
                                    aria-haspopup="menu"
                                    onClick={handleToggle}
                                >
                                    <ArrowDropDownIcon />
                                </Button>
                            </ButtonGroup>

                            <Popper
                                open={open}
                                anchorEl={anchorRef.current}
                                role={undefined}
                                transition
                                disablePortal
                            >
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{
                                            transformOrigin:
                                                placement === 'bottom' ? 'center top' : 'center bottom',
                                        }}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={handleClose}>
                                                <MenuList id="split-button-menu">
                                                    {options.map((option, index) => (
                                                        <MenuItem
                                                            key={option.name}
                                                            selected={index === selectedIndex}
                                                            onClick={event => handleMenuItemClick(event, index)}
                                                        >
                                                            {option.name}
                                                        </MenuItem>
                                                    ))}
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </Grid>
                    </>
                )}
                <Grid item>{resetFiltersButton}</Grid>
            </Grid>
            {data.length ? (<TableContainer sx={{ marginTop: 10 }} component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date Fields</TableCell>
                            <TableCell>Broker</TableCell>
                            <TableCell>Leads Purchased</TableCell>
                            <TableCell>Conversion %</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map(row => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{row.date ? getDate(row.date) : ''}</TableCell>
                                <TableCell>{row.broker}</TableCell>
                                <TableCell>{row.leads_purchased}</TableCell>
                                <TableCell>{row.leads_converted}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>) : (<Typography sx={{ marginTop: 10 }} variant="h5" gutterBottom component="div">
                There are no reports yet
            </Typography>)}

        </div>
    );
};

export default Reports;
