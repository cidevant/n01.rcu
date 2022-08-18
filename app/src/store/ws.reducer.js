import { createSlice } from '@reduxjs/toolkit';
import { ws } from '../utils/ws';

export const WS_IN_PREFIX = 'WS:IN:'; // incoming message action prefix
export const WS_OUT_PREFIX = 'WS:OUT:'; // sending message action prefix

const initialState = {
    accessCode: null,
    connected: false,
    close: null,
    error: null,
};

const slice = createSlice({
    name: 'ws',
    initialState,
    reducers: {
        connect(state, action) {
            ws.connect(action.payload);

            state.accessCode = action.payload;
        },
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

export const { connect, onopen, onclose, onerror } = slice.actions;
export default slice.reducer;
