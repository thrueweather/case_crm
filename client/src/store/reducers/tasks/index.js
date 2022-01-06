import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: true,
    data: null,
    error: null,
    activeTab: 'toDo'
};

export const tasks = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        fetchTasks(state) {
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
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
    },
});

export const { fetchTasks, fetchSuccessed, fetchFailed, setActiveTab } = tasks.actions;

export default tasks.reducer;