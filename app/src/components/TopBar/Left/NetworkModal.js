import { connect, disconnect, setAccessCode, setServerUrl } from '../../../store/ws.reducer';
import { useSelector, useDispatch } from 'react-redux';
import { ws } from '../../../utils/ws';
import Button from 'react-bootstrap/Button';
import Form from './Form';
import Offcanvas from 'react-bootstrap/Offcanvas';
import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function NetworkModal({ show, close }) {
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
                    <FontAwesomeIcon icon="fa-solid fa-power-off" className="me-4" />
                    DISCONNECT
                </Button>
            );
        }

        return (
            <Button disabled={disabled} onClick={dispatchConnect}>
                <FontAwesomeIcon icon="fa-solid fa-link" className="me-4" />
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
            <Form updateFormValues={updateFormValues} />
        </Offcanvas>
    );
}

export default NetworkModal;

const ButtonWrapper = styled.div`
    height: 150px;
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.4);
    z-index: 10;

    & > button {
        border-radius: 0;
        font-size: 80px;
    }
`;
