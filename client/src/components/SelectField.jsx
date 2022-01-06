import React from 'react';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const SelectField = ({ label, options, sx, fullWidth, id, ...props }) => {
    return (
        <FormControl fullWidth={fullWidth || null} sx={sx || null}>
            <InputLabel id={id || null}>{label}</InputLabel>
            <Select label={label} {...props}>
                {options?.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                        {label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SelectField;
