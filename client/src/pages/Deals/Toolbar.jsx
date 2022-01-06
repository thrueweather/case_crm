import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grow from '@mui/material/Grow';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Toolbar = ({
    wrappStyles,
    id,
    handleOpenEditModal,
    setAddStatusIsOpen,
    setAddProductIsOpen,
    setNotesIsOpen,
    setAddTaskIsOpen,
}) => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

    const options = [
        {
            name: 'Product',
            fn: setAddProductIsOpen,
        },
        {
            name: 'Status',
            fn: setAddStatusIsOpen,
        },
        {
            name: 'Task',
            fn: setAddTaskIsOpen,
        },
        {
            name: 'Notes',
            fn: setNotesIsOpen,
        },
    ];

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

    return (
        <Box sx={wrappStyles}>
            {!isTablet && (
                <Typography variant="h4" gutterBottom component="div" sx={{ margin: 0 }}>
                    Case #{id}
                </Typography>
            )}
            <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={handleOpenEditModal}>
                    Edit Case
                </Button>
                <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                    <Button
                        variant="contained"
                        onClick={handleToggle}
                        // eslint-disable-next-line react/jsx-no-duplicate-props
                        onClick={options[selectedIndex].fn}
                    >
                        <AddIcon />
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
            </Stack>
        </Box>
    );
};

export default Toolbar;
