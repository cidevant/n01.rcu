import { createSlice } from '@reduxjs/toolkit';
import { ws } from '../utils/ws';
import { config } from '../config';
import { obsConnect as _obsConnect, obsDisconnect as _obsDisconnect } from '../utils/obs';

const initialState = {
    status: WebSocket.CLOSED,
    close: null,
    error: null,
    accessCode: localStorage.getItem('accessCode') || '',
    wsServerUrl: localStorage.getItem('wsServerUrl') || config.defaultWsServerUrl,
    obsStatus: WebSocket.CLOSED,
    obsClose: null,
    obsError: null,
    obsUrl: localStorage.getItem('obsUrl') || config.defaultObsUrl,
    obsPassword: localStorage.getItem('obsPassword') || config.defaultObsPassword,
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
        obsConnect(state) {
            state.obsStatus = WebSocket.CONNECTING;
            state.obsClose = null;
            state.obsError = null;
            _obsConnect(state.obsUrl, state.obsPassword);
        },
        obsDisconnect(state) {
            state.obsStatus = WebSocket.CLOSING;
            _obsDisconnect();
        },
        obsOnopen(state) {
            state.obsStatus = WebSocket.OPEN;
            state.obsClose = null;
            state.obsError = null;
        },
        obsOnclose(state, action) {
            state.obsStatus = WebSocket.CLOSED;
            state.obsClose = action.payload;
        },
        obsOnerror(state, action) {
            state.obsStatus = WebSocket.CLOSED;
            state.obsError = action.payload;
        },
        setAccessCode(state, action) {
            state.accessCode = action.payload;
            localStorage.setItem('accessCode', action.payload);
        },
        setWsServerUrl(state, action) {
            state.wsServerUrl = action.payload;
            localStorage.setItem('wsServerUrl', action.payload);
        },
        setObsUrl(state, action) {
            state.obsUrl = action.payload;
            localStorage.setItem('obsUrl', action.payload);
        },
        setObsPassword(state, action) {
            state.obsPassword = action.payload;
            localStorage.setItem('obsPassword', action.payload);
        },
    },
});

export const {
    connect,
    disconnect,
    onopen,
    onclose,
    onerror,
    setAccessCode,
    setWsServerUrl,
    setObsUrl,
    setObsPassword,
    obsConnect,
    obsDisconnect,
    obsOnopen,
    obsOnclose,
    obsOnerror,
    obsUrl,
    obsPassword,
} = slice.actions;

export default slice.reducer;
