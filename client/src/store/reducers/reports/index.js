import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    data: [],
    page: 0,
    rowsPerPage: 10,
    broker: null,
    dateRange: {
        startDate: null,
        endDate: null,
    },
    year: null,
    month: null,
    company: null,
    error: null,
};

export const reports = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        fetchReports(state) {
            state.loading = true;
        },
        fetchSuccessed: (state, action) => {
            state.data = action.payload;
            state.loading = false;
        },
        fetchFailed: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        changePage: (state, action) => {
            state.page = action.payload;
        },
        changeRowsPerPage: (state, action) => {
            state.rowsPerPage = action.payload;
            state.page = 0;
        },
        setBroker: (state, action) => {
            state.broker = action.payload;
        },
        setDateRange: (state, action) => {
            const [start, end] = action.payload;
            state.dateRange = {
                startDate: start,
                endDate: end,
            }
        },
        setYear: (state, action) => {
            state.year = action.payload
        },
        setMonth: (state, action) => {
            state.month = action.payload
        },
        setCompany: (state, action) => {
            state.company = action.payload
        },
        resetFilters: (state) => {
            state.broker = null;
            state.company = null;
            state.year = null;
            state.month = null;
            state.dateRange = {
                startDate: null,
                endDate: null,
            }
        },
    },
});

export const { fetchReports, fetchSuccessed, fetchFailed, changePage, changeRowsPerPage, setBroker, setDateRange, setYear, setMonth, setCompany, resetFilters } = reports.actions;

export default reports.reducer;