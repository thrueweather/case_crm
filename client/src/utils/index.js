import { useState, useEffect, useRef } from 'react';

export const getInternalToken = () => {
    const data = localStorage.getItem('token');
    const token = (data && JSON.parse(data).token) || '';
    return token;
};

export const moneyField = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export const getDate = date => new Date(date).toLocaleDateString();

export const getTime = time =>
    new Date(time).toLocaleTimeString().split(':').slice(0, 2).join(':');

export const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
};

export const getComparator = (order, orderBy) => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
};

export const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
};

export const saveToken = token => {
    const timestamp = +new Date();
    const data = JSON.stringify({ token, timestamp });
    window.localStorage.setItem('token', data);
};

export const genders = {
    male: 1,
    female: 2,
};

export const getDataOfDeal = data => {
    const obj = {};
    for (const key in data) {
        if (
            key === 'message' ||
            key === 'mortgage_amount' ||
            key === 'property_amount' ||
            key === 'customer'
        ) {
            if (typeof data[key] === 'object') {
                for (const i in data[key]) {
                    obj[i] = data[key][i];
                }
            }
            obj[key] = data[key];
            delete obj.customer;
        }
        continue;
    }
    return obj;
};

export const caseValuePending = products => {
    return products.reduce(
        (accum, curr) => (accum += curr.gross_total_pending),
        0
    );
};

export const caseValueReceived = products => {
    return products.reduce(
        (accum, curr) => (accum += curr.gross_total_received),
        0
    );
};

export function useInterval(callback, delay) {
    const cb = useRef(callback);

    useEffect(() => {
        cb.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay === null) return;

        const id = setInterval(() => cb.current(), delay);

        return () => clearInterval(id);
    }, [delay]);
}

export const timeSince = date => {
    let seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + ' years ago';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + ' months ago';
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + ' days ago';
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + ' hours ago';
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + ' minutes ago';
    }
    return Math.floor(seconds) + ' seconds ago';
};
