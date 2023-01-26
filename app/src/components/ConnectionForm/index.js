import React, { useState, useMemo, useCallback } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ws from '../../utils/ws';
import {
    connect,
    disconnect,
    obsConnect,
    obsDisconnect,
    setAccessCode,
    setWsServerUrl,
    setObsPassword,
    setObsUrl,
} from '../../store/ws.reducer';
import _ from 'lodash';

function ConnectionForm() {
    const wsStatus = useSelector((state) => state.ws.status);
    const obsStatus = useSelector((state) => state.ws.obsStatus);

    const [accessCode, setAccessCodeState] = useState(useSelector((state) => state.ws.accessCode));
    const [wsServerUrl, setServerUrlState] = useState(useSelector((state) => state.ws.wsServerUrl));
    const [obsUrl, setObsUrlState] = useState(useSelector((state) => state.ws.obsUrl));
    const [obsPassword, setObsPasswordState] = useState(
        useSelector((state) => state.ws.obsPassword)
    );
    const isConnected = wsStatus === WebSocket.OPEN;
    const isObsConnected = obsStatus === WebSocket.OPEN;
    const dispatch = useDispatch();
    const wsDisabled = !ws.__isValidAccessCode(accessCode) || !ws.__isValidUrl(wsServerUrl);
    const obsDisabled = _.isEmpty(obsUrl);

    function updateAccessCode(event) {
        event.preventDefault();

        const { value } = event.target;

        if (value.length < 5) {
            const upperValue = `${value}`.toUpperCase();

            setAccessCodeState(upperValue);
            dispatch(setAccessCode(upperValue));
        }
    }

    function updateServerUrl(event) {
        event.preventDefault();
        setServerUrlState(event.target.value);
        dispatch(setWsServerUrl(event.target.value));
    }
    function updateObsUrl(event) {
        event.preventDefault();
        setObsUrlState(event.target.value);
        dispatch(setObsUrl(event.target.value));
    }

    function updateObsPassword(event) {
        event.preventDefault();
        setObsPasswordState(event.target.value);
        dispatch(setObsPassword(event.target.value));
    }

    function dispatchConnect() {
        dispatch(connect());
    }

    function dispatchDisconnect() {
        dispatch(disconnect());
    }

    function dispatchObsConnect() {
        dispatch(obsConnect(obsUrl, obsPassword));
    }

    function dispatchObsDisconnect() {
        dispatch(obsDisconnect());
    }

    return (
        <Form>
            <div className="d-grid">
                <StatusWrapper>SERVER</StatusWrapper>
                <FormInputWrapper className="mt-4">
                    <TitleForm>URL</TitleForm>
                    <FormInput
                        disabled={isConnected}
                        type="text"
                        placeholder="wss://n01.devant.cz/ws"
                        value={wsServerUrl}
                        onChange={updateServerUrl}
                    />
                </FormInputWrapper>
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

                <ConnectDisconnectButton
                    connect={dispatchConnect}
                    disconnect={dispatchDisconnect}
                    disabled={wsDisabled}
                    isConnected={isConnected}
                />
                <StatusWrapper>OBS</StatusWrapper>
                <FormInputWrapper className="mt-4">
                    <TitleForm>URL</TitleForm>
                    <FormInput
                        type="text"
                        disabled={isObsConnected}
                        placeholder="wss://n01.devant.cz/obs"
                        value={obsUrl}
                        onChange={updateObsUrl}
                    />
                </FormInputWrapper>
                <FormInputWrapper className="mt-4">
                    <TitleForm>PASSWORD</TitleForm>
                    <FormInput
                        type="text"
                        disabled={isObsConnected}
                        value={obsPassword}
                        onChange={updateObsPassword}
                    />
                </FormInputWrapper>
                <ConnectDisconnectButton
                    connect={dispatchObsConnect}
                    disconnect={dispatchObsDisconnect}
                    disabled={obsDisabled}
                    isConnected={isObsConnected}
                />
            </div>
        </Form>
    );
}

export default ConnectionForm;

function ConnectDisconnectButton({ connect, disconnect, isConnected, disabled }) {
    function renderButton() {
        if (isConnected) {
            return (
                <Button variant="danger" size="lg" onClick={disconnect}>
                    <FontAwesomeIcon icon="fa-solid fa-power-off" className="me-4" />
                    DISCONNECT
                </Button>
            );
        }

        return (
            <Button size="lg" disabled={disabled} onClick={connect}>
                <FontAwesomeIcon icon="fa-solid fa-link" className="me-4" />
                CONNECT
            </Button>
        );
    }

    return <ButtonWrapper className="d-grid gap-2 mt-4">{renderButton()}</ButtonWrapper>;
}

const StatusWrapper = styled.div`
    width: 100%;
    padding: 20px 15px;
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
    height: 80px;
    border-radius: 0;
    outline: none;
`;

const ButtonWrapper = styled.div`
    z-index: 10;
    padding: 20px;
    margin-bottom: 30px;
    width: 100%;

    & > button {
        border-radius: 0;
        font-size: 40px;
        height: 100px;
    }
`;
