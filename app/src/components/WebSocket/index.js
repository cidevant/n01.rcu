import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ws, WS_IN_PREFIX } from '../../utils/ws';
import { connect, disconnect, onopen, onclose, onerror } from '../../store/ws.reducer';

export function WebSocket({ children }) {
    const accessCode = localStorage.getItem('accessCode');
    const dispatch = useDispatch();

    useEffect(() => {
        ws.onmessage = (message) => {
            try {
                const { type, ...payload } = message;

                if (!type) {
                    throw message;
                }

                dispatch({
                    type: `${WS_IN_PREFIX}:${type}`,
                    payload,
                });
            } catch (error) {
                console.error('[ws.provider] unknown message', message);
            }
        };
        ws.onopen = () => {
            dispatch(onopen());
        };
        ws.onclose = (event) => {
            dispatch(
                onclose({
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean,
                })
            );
        };
        ws.onerror = (error) => {
            dispatch(onerror(error));
        };

        if (accessCode) {
            dispatch(connect(accessCode));
        }

        return () => {
            if (ws.open) {
                dispatch(disconnect());
            }
        };
    }, [dispatch, accessCode]);

    return <>{children}</>;
}
