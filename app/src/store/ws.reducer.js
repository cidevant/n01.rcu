import { createSlice } from '@reduxjs/toolkit';
import { ws } from '../utils/ws';
import { config } from '../config';

const initialState = {
    status: WebSocket.CLOSED,
    close: null,
    error: null,
    accessCode: localStorage.getItem('accessCode') || '',
    wsServerUrl: localStorage.getItem('wsServerUrl') || config.defaultWsServerUrl,
    serverUrl: localStorage.getItem('serverUrl') || config.defaultServerUrl,
};

const slice = createSlice({
    name: 'ws',
    initialState,
    reducers: {
        connect(state) {
            state.status = WebSocket.CONNECTING;
            state.close = null;
            state.error = null;
            ws.connect(state.accessCode, state.wsServerUrl);
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
        setAccessCode(state, action) {
            state.accessCode = action.payload;
            localStorage.setItem('accessCode', action.payload);
        },
        setWsServerUrl(state, action) {
            state.wsServerUrl = action.payload;
            localStorage.setItem('wsServerUrl', action.payload);
        },
    },
});

export const { connect, disconnect, onopen, onclose, onerror, setAccessCode, setWsServerUrl } =
    slice.actions;
export default slice.reducer;
