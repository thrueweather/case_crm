import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: true,
    data: null,
    error: null,
};

export const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
        fetchUser(state) {
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
    },
});

export const { fetchUser, fetchSuccessed, fetchFailed } = user.actions;

export default user.reducer;