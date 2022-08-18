import { createSlice } from '@reduxjs/toolkit';

export const WS_IN_PREFIX = 'WS:IN:'; // incoming message
export const WS_OUT_PREFIX = 'WS:OUT:'; // sending message

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
