import React, { useMemo, useCallback } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from 'react-redux';
import Form from './Form';
import { connect, disconnect, setAccessCode, setServerUrl } from '../../../store/ws.reducer';
import { ws } from '../../../utils/ws';
import styled from 'styled-components';

export function NetworkOffcanvas({ show, close }) {
    const dispatch = useDispatch();
    const accessCode = useSelector((state) => state.ws.accessCode);
    const serverUrl = useSelector((state) => state.ws.serverUrl);
    const wsStatus = useSelector((state) => state.ws.status);
    const connectDisconnectButton = useMemo(() => {
        const disabled = !ws.__isValidAccessCode(accessCode) || !ws.__isValidUrl(serverUrl);

        function dispatchConnect() {
            dispatch(connect());
        }

        function dispatchDisconnect() {
            dispatch(disconnect());
        }

        if (wsStatus === WebSocket.OPEN) {
            return (
                <Button variant="danger" size="lg" onClick={dispatchDisconnect}>
                    DISCONNECT
                </Button>
            );
        }

        return (
            <Button disabled={disabled} onClick={dispatchConnect}>
                CONNECT
            </Button>
        );
    }, [wsStatus, accessCode, serverUrl, dispatch]);
    const updateFormValues = useCallback(
        (key, value) => {
            if (key === 'accessCode') {
                dispatch(setAccessCode(value));
            } else if (key === 'serverUrl') {
                dispatch(setServerUrl(value));
            }
        },
        [dispatch]
    );

    return (
        <Offcanvas placement="start" show={show} onHide={close}>
            <ButtonWrapper className="d-grid gap-2">{connectDisconnectButton}</ButtonWrapper>
            <Offcanvas.Body>
                <Form updateFormValues={updateFormValues} />
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default NetworkOffcanvas;

const ButtonWrapper = styled.div`
    height: 150px;

    & > button {
        border-radius: 0;
        font-size: 80px;
    }
`;
