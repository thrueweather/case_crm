import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    data: [],
    activeTab: 'unread',
    page: 0,
    rowsPerPage: 10,
    broker: null,
    date: null,
    statusType: null,
    error: null,
    selectedItems: [],
};

export const notifications = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        fetchNotifications(state) {
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
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        setBroker: (state, action) => {
            state.broker = action.payload;
        },
        setDate: (state, action) => {
            state.date = action.payload;
        },
        setStatus: (state, action) => {
            state.statusType = action.payload;
        },
        resetFilters: state => {
            state.broker = null;
            state.date = null;
            state.statusType = null;
        },
    },
});

export const {
    fetchNotifications,
    fetchSuccessed,
    fetchFailed,
    changePage,
    changeRowsPerPage,
    setActiveTab,
    setBroker,
    setDate,
    setStatus,
    resetFilters,
    setSelectedItems,
} = notifications.actions;
export default notifications.reducer;
