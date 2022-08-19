import { createSlice } from '@reduxjs/toolkit';
import { ws } from '../utils/ws';

const initialState = {
    status: WebSocket.CLOSED,
    close: null,
    error: null,
    accessCode: null,
};

const slice = createSlice({
    name: 'ws',
    initialState,
    reducers: {
        connect(state, action) {
            state.status = WebSocket.CONNECTING;
            state.accessCode = action.payload;
            state.close = null;
            state.error = null;
            ws.connect(action.payload);
        },
        disconnect(state) {
            state.status = WebSocket.CLOSING;
            ws.disconnect();
        },
        onopen(state) {
            state.status = WebSocket.OPEN;
            state.close = null;
            state.error = null;
        },
        onclose(state, action) {
            state.status = WebSocket.CLOSED;
            state.close = action.payload;
        },
        onerror(state, action) {
            state.status = WebSocket.CLOSED;
            state.error = action.payload;
        },
    },
});

export const { connect, disconnect, onopen, onclose, onerror } = slice.actions;
export default slice.reducer;
