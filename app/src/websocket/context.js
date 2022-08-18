import React, { createContext } from 'react';
import { useDispatch } from 'react-redux';
import { wsClient } from './client';

const WebsocketContext = createContext(null);

function WebsocketProvider({ children }) {
    let wsActions;
    let socket;

    const dispatch = useDispatch();

    if (!socket) {
        socket = wsClient.connect();
        wsActions = {
            send: function (action, payload) {
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
                    type: `WS:ACTION:${type}`,
                    payload,
                });
            } catch (error) {
                console.error('[ws] cant recognize message', message);
            }
        };
        socket.onopen = () => {
            console.log('ID');
            dispatch({
                type: 'WS:CONN:ONOPEN',
            });
        };
        socket.onclose = (event) => {
            dispatch({
                type: 'WS:CONN:ONCLOSE',
                payload: {
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean,
                },
            });
        };
        socket.onerror = (error) => {
            dispatch({
                type: 'WS:CONN:ONERROR',
                payload: {
                    error,
                },
            });
        };
    }

    return <WebsocketContext.Provider value={wsActions}>{children}</WebsocketContext.Provider>;
}

export { WebsocketContext, WebsocketProvider };
