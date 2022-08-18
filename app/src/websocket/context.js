import React, { createContext } from 'react';
import { useDispatch } from 'react-redux';
import { wsClient } from './client';
import { onopen, onclose, onerror } from '../store/ws';

const WebsocketContext = createContext(null);

function WebsocketProvider({ children }) {
    let wsActions;
    let socket;

    const dispatch = useDispatch();

    if (!socket) {
        socket = wsClient.connect();
        wsActions = {
            send(action, payload) {
                socket.send({
                    type: action,
                    payload,
                });
            },
        };
        socket.onmessage = (message) => {
            try {
                const { type, ...payload } = message;

                if (!type) {
                    throw message;
                }

                dispatch({
                    type: `WS:MSG:${type}`,
                    payload,
                });
            } catch (error) {
                console.error('[ws] cant recognize message', message);
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

    return <WebsocketContext.Provider value={wsActions}>{children}</WebsocketContext.Provider>;
}

export { WebsocketContext, WebsocketProvider };
