import { createSlice } from '@reduxjs/toolkit';

export const WS_IN_PREFIX = 'WS:IN:'; // incoming message action prefix
export const WS_OUT_PREFIX = 'WS:OUT:'; // sending message action prefix

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
            state.error = null;
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
