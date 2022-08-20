import React, { useState, useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from 'react-bootstrap/Spinner';
import { faHandshake } from '@fortawesome/fontawesome-free-solid';

function AccessCodeForm(props) {
    const wsStatus = useSelector((state) => state.ws.status);
    const client = useSelector((state) => state.client.client);
    const clientStatus = useSelector((state) => state.client.status);
    const [accessCode, setAccessCode] = useState(useSelector((state) => state.ws.accessCode));
    const [serverUrl, setServerUrl] = useState(useSelector((state) => state.ws.serverUrl));
    const isConnected = wsStatus === WebSocket.OPEN;
    const isPaired = clientStatus === 'PAIRED';

    function updateAccessCode(event) {
        event.preventDefault();

        const { value } = event.target;

        if (value.length < 5) {
            const upperValue = `${value}`.toUpperCase();

            setAccessCode(upperValue);
            props.updateFormValues('accessCode', upperValue);
        }
    }

    function updateServerUrl(event) {
        event.preventDefault();
        setServerUrl(event.target.value);
        props.updateFormValues('serverUrl', event.target.value);
    }

    return (
        <Form>
            <div className="d-grid">
                <div className="d-flex flex-row">
                    <ServerConnection status={isConnected} />
                    <ClientConnection
                        serverStatus={isConnected}
                        status={isPaired}
                        client={client}
                    />
                </div>
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
        </Form>
    );
}

export default AccessCodeForm;

function ServerConnection(props) {
    const isConnected = props.status === true;
    const icon = useMemo(() => {
        if (!isConnected) {
            return <FontAwesomeIcon icon="fa-solid fa-circle" className="me-2 text-danger" />;
        }

        return <FontAwesomeIcon icon="fa-solid fa-circle" className="me-2 text-success" />;
    }, [isConnected]);

    return (
        <StatusWrapper>
            {icon}
            {isConnected ? 'CONNECTED TO SERVER' : 'SERVER DISCONNECTED'}
        </StatusWrapper>
    );
}

function ClientConnection({ status, client, serverStatus }) {
    const text = useMemo(() => {
        if (!serverStatus) {
            return '';
        }

        if (status && client?.name) {
            return client?.name?.toUpperCase?.();
        }

        return 'WAITING FOR CLIENT';
    }, [serverStatus, status, client?.name]);
    const icon = useMemo(() => {
        if (!serverStatus) {
            return '';
        }

        if (status) {
            return <FontAwesomeIcon className="me-2 text-success" icon={faHandshake} />;
        }

        return <Spinner className="me-2" animation="border" size="sm" />;
    }, [status, serverStatus]);

    return (
        <StatusWrapper borderLeft>
            {icon}
            {text}
        </StatusWrapper>
    );
}

const StatusWrapper = styled.div`
    ${({ borderLeft }) => borderLeft && 'border-left: 1px solid #999;'}
    width: 50%;
    padding: 15px;
    background-color: #eee;
    color: #777;
    border-bottom: 1px solid #999;
    font-weight: bold;
    text-align: center;
    font-size: 18px;
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
