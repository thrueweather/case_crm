import React from 'react';
import DatePicker from 'react-datepicker';

const DateField = ({
    selected,
    onChange,
    placeholder,
    error,
    dateFormat = 'dd-MM-yyyy',
    ...props
}) => (
    <DatePicker
        value={selected}
        selected={selected}
        onChange={onChange}
        placeholderText={placeholder}
        dateFormat={dateFormat}
        className={error ? 'validate-error' : ''}
        {...props}
    />
);

export default DateField;
