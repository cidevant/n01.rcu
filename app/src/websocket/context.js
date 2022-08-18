import React, { createContext } from 'react';
import { useDispatch } from 'react-redux';
import { ws } from './client';
import { onopen, onclose, onerror, WS_IN_PREFIX } from '../store/ws.reducer';

const WebsocketContext = createContext(null);

function WebsocketProvider({ children }) {
    let socket;

    const dispatch = useDispatch();

    if (!socket) {
        if (!ws.open) {
            ws.connect();
        }

        socket = ws;
        socket.onmessage = (message) => {
            try {
                const { type, ...payload } = message;

                if (!type) {
                    throw message;
                }

                dispatch({
                    type: `${WS_IN_PREFIX}${type}`,
                    payload,
                });
            } catch (error) {
                console.error('[ws.provider] unknown message', message);
            }
        };
        socket.onopen = () => {
            dispatch(onopen());
        };
        socket.onclose = (event) => {
            dispatch(
                onclose({
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean,
                })
            );
        };
        socket.onerror = (error) => {
            dispatch(onerror(error));
        };
    }

    return <WebsocketContext.Provider value={socket}>{children}</WebsocketContext.Provider>;
}

export { WebsocketContext, WebsocketProvider };
