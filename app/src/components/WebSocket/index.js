/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ws, WS_IN_PREFIX } from '../../utils/ws';
import { connect, disconnect, onopen, onclose, onerror } from '../../store/ws.reducer';

export function WebSocket({ children }) {
    const dispatch = useDispatch();
    const accessCode = useSelector((state) => state.ws.accessCode);
    const wsServerUrl = useSelector((state) => state.ws.wsServerUrl);

    // Setup websocket client
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
    }, [dispatch]);

    // Try connecting only once at the beginning
    useEffect(() => {
        if (!ws.open && ws.__isValidAccessCode(accessCode) && ws.__isValidUrl(wsServerUrl)) {
            dispatch(connect(accessCode, wsServerUrl));
        }

        return () => {
            if (ws.open) {
                dispatch(disconnect());
            }
        };
    }, []);

    return <>{children}</>;
}
