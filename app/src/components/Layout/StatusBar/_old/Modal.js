import React, { useMemo, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useSelector, useDispatch } from 'react-redux';
import Form from './Form';
import { connect, disconnect, setAccessCode, setServerUrl } from '../../../store/ws.reducer';
import { ws } from '../../../utils/ws';

function ConnectionSettingsModal(props) {
    const dispatch = useDispatch();
    const accessCode = useSelector((state) => state.ws.accessCode);
    const serverUrl = useSelector((state) => state.ws.serverUrl);
    const wsStatus = useSelector((state) => state.ws.status);
    const connectDisconnectButton = useMemo(() => {
        const disabled = !ws.__isValidAccessCode(accessCode) || !ws.__isValidUrl(serverUrl);

        if (wsStatus === WebSocket.OPEN) {
            return (
                <Button variant="danger" onClick={() => dispatch(disconnect())}>
                    Disconnect
                </Button>
            );
        }

        return (
            <Button disabled={disabled} onClick={() => dispatch(connect())}>
                Connect
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
        <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header>
                <Modal.Title>NETWORK</Modal.Title>
                {connectDisconnectButton}
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Form updateFormValues={updateFormValues} />
            </Modal.Body>
        </Modal>
    );
}

export default ConnectionSettingsModal;
