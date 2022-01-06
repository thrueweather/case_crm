import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: true,
    data: [],
    searchTerm: '',
    page: 0,
    rowsPerPage: 10,
    error: null,
    loadingStatuses: false,
    statuses: [],
    errorStatuses: null,
    loadingProductForm: false,
    productForm: [],
    errorProductForm: null,
};

export const deals = createSlice({
    name: 'deals',
    initialState,
    reducers: {
        fetchDeals: state => {
            state.loading = true;
        },
        fetchSuccessed: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        fetchFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        changePage: (state, action) => {
            state.page = action.payload;
        },
        changeRowsPerPage: (state, action) => {
            state.rowsPerPage = action.payload;
            state.page = 0;
        },
        fetchStatuses: state => {
            state.loadingStatuses = true;
        },
        fetchStatusesSuccessed: (state, action) => {
            state.loadingStatuses = false;
            state.statuses = action.payload;
        },
        fetchStatusesFailed: (state, action) => {
            state.loadingStatuses = false;
            state.errorStatuses = action.payload;
        },
        fetchProductForm: state => {
            state.loadingProductForm = true;
        },
        fetchProductFormSuccessed: (state, action) => {
            state.loadingProductForm = false;
            state.productForm = action.payload;
        },
        fetchProductFormFailed: (state, action) => {
            state.loadingProductForm = false;
            state.errorProductForm = action.payload;
        },
    },
});

export const {
    fetchDeals,
    fetchSuccessed,
    fetchFailed,
    changePage,
    changeRowsPerPage,
    fetchStatuses,
    fetchStatusesSuccessed,
    fetchStatusesFailed,
    fetchProductForm,
    fetchProductFormSuccessed,
    fetchProductFormFailed,
} = deals.actions;
export default deals.reducer;
