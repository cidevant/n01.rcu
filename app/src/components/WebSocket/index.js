import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ws } from '../../utils/ws';
import { onopen, onclose, onerror, WS_IN_PREFIX } from '../../store/ws.reducer';

export function WebSocket({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        ws.onmessage = (message) => {
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

        if (!ws.open) {
            ws.connect();
        }

        return () => {
            if (ws.open) {
                ws.disconnect();
            }
        };
    }, [dispatch]);

    return <>{children}</>;
}
