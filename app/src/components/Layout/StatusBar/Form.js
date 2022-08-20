import React, { useState, useMemo } from 'react';
import { Container, Col, Row, Form, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

    function connectionStatus() {
        return (
            <>
                <h4 className="mt-1">CONNECTION STATUS</h4>
                <ConnectionStatus
                    title="Server"
                    iconVariant={isConnected ? 'success' : 'danger'}
                    server
                    status={isConnected}
                    text={isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                />
                {isConnected && (
                    <ConnectionStatus
                        title="Client"
                        iconVariant={isPaired ? 'success' : 'warning'}
                        client={client}
                        status={isPaired}
                    />
                )}
            </>
        );
    }

    function connectionSettings() {
        return (
            <>
                <h4 className="mt-1">SETTINGS</h4>
                <Row>
                    <Col className="col-4 d-flex align-items-center">
                        <Title>Access code</Title>
                    </Col>
                    <Col className="col-8">
                        <Form.Control
                            disabled={isConnected}
                            type="text"
                            value={accessCode}
                            maxLength={4}
                            onChange={updateAccessCode}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col className="col-4 d-flex align-items-center">
                        <Title>Server URL</Title>
                    </Col>
                    <Col className="col-8">
                        <Form.Control
                            disabled={isConnected}
                            type="text"
                            placeholder="ws://localhost:3000/ws"
                            value={serverUrl}
                            onChange={updateServerUrl}
                        />
                    </Col>
                </Row>
            </>
        );
    }

    return (
        <Form>
            <Container className="d-grid gap-3">
                {connectionStatus()}
                {connectionSettings()}
            </Container>
        </Form>
    );
}

export default AccessCodeForm;

const Title = styled.div`
    color: #888;
`;

function ConnectionStatus(props) {
    function renderIcon() {
        if (props.iconVariant) {
            const classNames = `${props.iconVariant ? `text-${props.iconVariant}` : ''} me-2`;

            return <FontAwesomeIcon icon="fa-solid fa-circle" className={classNames} />;
        }
    }

    function getContent() {
        if (props.server) {
            return (
                <span className="fw-bold">
                    {props.status === true ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
            );
        }

        return <ClientConnectionText status={props.status} client={props.client} />;
    }

    return (
        <Row>
            <Col className="col-4 d-flex">
                <Title>{props.title}</Title>
            </Col>
            <Col className="col-8">
                {renderIcon()}
                {getContent()}
            </Col>
        </Row>
    );
}

function ClientConnectionText({ status, client }) {
    if (status === true && client != null) {
        return (
            <span>
                <span className="fw-bold">{client.name?.toUpperCase?.()}</span>
                <br />
                <span className="text-black-50">(id: {client.id})</span>
            </span>
        );
    }

    return <span>WAITING FOR CLIENT</span>;
}
