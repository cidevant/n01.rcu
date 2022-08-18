import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    connected: false,
    close: null,
    error: null,
};

const slice = createSlice({
    name: 'ws',
    initialState,
    reducers: {
        onopen(state) {
            state.connected = true;
            state.close = null;
        },
        onclose(state, action) {
            state.connected = false;
            state.close = action.payload;
        },
        onerror(state, action) {
            state.connected = false;
            state.error = action.payload;
        },
    },
});

export const { onopen, onclose, onerror } = slice.actions;

export default slice.reducer;
