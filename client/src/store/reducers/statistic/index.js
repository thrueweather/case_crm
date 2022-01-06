import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: true,
    data: null,
    error: null,
};

export const statistic = createSlice({
    name: 'statistic',
    initialState,
    reducers: {
        fetchStatistic: state => {
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
    },
});

export const { fetchStatistic, fetchSuccessed, fetchFailed } =
    statistic.actions;

export default statistic.reducer;
