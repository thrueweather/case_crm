import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: true,
    data: [],
    searchTerm: '',
    page: 0,
    rowsPerPage: 10,
    error: null,
};


export const leads = createSlice({
    name: 'leads',
    initialState,
    reducers: {
        fetchLeads(state) {
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
        changeSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
    },
});

export const { fetchLeads, fetchSuccessed, fetchFailed, changePage, changeRowsPerPage, changeSearchTerm } = leads.actions;

export default leads.reducer;