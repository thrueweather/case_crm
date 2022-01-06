import { useState, useEffect } from 'react';

import SelectField from 'components/SelectField';

import { request } from 'api/axios';

const initialState = {
    isLoading: false,
    error: null,
    data: null,
};

const AsyncSelect = ({ path, label, onChange, optionName, ...props }) => {
    const [state, setState] = useState(initialState);

    useEffect(() => {
        request()
            .get(path)
            .then(r => {
                setState(prevState => ({
                    ...prevState,
                    data: r.data,
                    isLoading: null,
                }));
            })
            .catch(e =>
                setState(prevState => ({
                    ...prevState,
                    error: e,
                }))
            );
    }, [path]);

    const { isLoading, data, error } = state;

    if (isLoading || !data) return 'Loading...';

    if (error) return error.message;

    return (
        <SelectField
            label={label}
            onChange={onChange}
            options={data.map(item => ({ value: item.id, label: item[optionName] }))}
            {...props}
        />
    );
};

export default AsyncSelect;
