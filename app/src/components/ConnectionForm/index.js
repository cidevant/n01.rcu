import React, { useState, useMemo, useCallback } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ws from '../../utils/ws';
import { connect, disconnect } from '../../store/ws.reducer';

function ConnectionForm() {
    const wsStatus = useSelector((state) => state.ws.status);

    const [accessCode, setAccessCode] = useState(useSelector((state) => state.ws.accessCode));
    const [serverUrl, setServerUrl] = useState(useSelector((state) => state.ws.serverUrl));
    const isConnected = wsStatus === WebSocket.OPEN;
    const dispatch = useDispatch();
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

    function updateAccessCode(event) {
        event.preventDefault();

        const { value } = event.target;

        if (value.length < 5) {
            const upperValue = `${value}`.toUpperCase();

            setAccessCode(upperValue);
            updateFormValues('accessCode', upperValue);
        }
    }

    function updateServerUrl(event) {
        event.preventDefault();
        setServerUrl(event.target.value);
        updateFormValues('serverUrl', event.target.value);
    }

    return (
        <Form>
            <div className="d-grid">
                <ConnectionStatus />
                <FormInputWrapper className="mt-4">
                    <TitleForm>ACCESS CODE</TitleForm>
                    <FormInput
                        disabled={isConnected}
                        type="text"
                        value={accessCode}
                        maxLength={4}
                        onChange={updateAccessCode}
                    />
                </FormInputWrapper>
                <FormInputWrapper className="mt-4">
                    <TitleForm>SERVER URL</TitleForm>
                    <FormInput
                        disabled={isConnected}
                        type="text"
                        placeholder="ws://localhost:3000/ws"
                        value={serverUrl}
                        onChange={updateServerUrl}
                    />
                </FormInputWrapper>
            </div>
            <ConnectDisconnectButton />
        </Form>
    );
}

export default ConnectionForm;

function ConnectionStatus() {
    const wsStatus = useSelector((state) => state.ws.status);
    const isConnected = wsStatus === WebSocket.OPEN;
    const clientStatus = useSelector((state) => state.client.status);
    const isPaired = clientStatus === 'PAIRED';

    function renderStatus() {
        if (isConnected && isPaired) {
            return 'CONNECTED & PAIRED';
        }

        if (isConnected && !isPaired) {
            return 'CONNECTED';
        }

        return 'CONNECTION FORM';
    }

    return <StatusWrapper>{renderStatus()}</StatusWrapper>;
}

function ConnectDisconnectButton() {
    const dispatch = useDispatch();
    const accessCode = useSelector((state) => state.ws.accessCode);
    const serverUrl = useSelector((state) => state.ws.serverUrl);
    const wsStatus = useSelector((state) => state.ws.status);
    const disabled = !ws.__isValidAccessCode(accessCode) || !ws.__isValidUrl(serverUrl);

    function dispatchConnect() {
        dispatch(connect());
    }

    function dispatchDisconnect() {
        dispatch(disconnect());
    }

    function renderButton() {
        if (wsStatus === WebSocket.OPEN) {
            return (
                <Button variant="danger" size="lg" onClick={dispatchDisconnect}>
                    <FontAwesomeIcon icon="fa-solid fa-power-off" className="me-4" />
                    DISCONNECT
                </Button>
            );
        }

        return (
            <Button size="lg" disabled={disabled} onClick={dispatchConnect}>
                <FontAwesomeIcon icon="fa-solid fa-link" className="me-4" />
                CONNECT
            </Button>
        );
    }

    return <ButtonWrapper className="d-grid gap-2 mt-4">{renderButton()}</ButtonWrapper>;
}

const StatusWrapper = styled.div`
    width: 100%;
    padding: 35px 15px;
    background-color: #333;
    color: white;
    border-bottom: 1px solid #999;
    border-top: 1px solid #999;
    font-weight: bold;
    text-align: center;
    font-size: 32px;
    z-index: 1;
`;

const FormInputWrapper = styled.div`
    padding: 0 20px;
`;

const TitleForm = styled.div`
    color: #888;
    font-size: 40px;
`;

const FormInput = styled(Form.Control)`
    font-size: 40px;
    border-width: 4px;
    height: 120px;
    border-radius: 0;
    outline: none;
`;

const ButtonWrapper = styled.div`
    z-index: 10;
    padding: 20px;
    width: 100%;

    & > button {
        border-radius: 0;
        font-size: 40px;
        height: 140px;
    }
`;
