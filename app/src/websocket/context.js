import React, { createContext } from 'react';
import { WebsocketClient } from './client';

const WebsocketContext = createContext(null);
const wsClient = new WebsocketClient('ws://localhost:3000/ws');
let socket;

function WebsocketProvider({ children }) {
    let ws;

    if (!socket) {
        socket = wsClient.connect();
        socket.onopen = () => {
            console.error('===================> onopen');
        };
        socket.onclose = () => {
            console.error('===================> onclose');
        };
        socket.onerror = (error) => {
            console.error('===================> onerror', error);
        };

        ws = {
            socket,
        };
    }

    return <WebsocketContext.Provider value={ws}>{children}</WebsocketContext.Provider>;
}

export { WebsocketContext, WebsocketProvider };
