import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';

function AccessCodeForm(props) {
    const wsStatus = useSelector((state) => state.ws.status);
    const clientStatus = useSelector((state) => state.client.status);
    const [accessCode, setAccessCode] = useState(useSelector((state) => state.ws.accessCode));
    const [serverUrl, setServerUrl] = useState(useSelector((state) => state.ws.serverUrl));
    const isConnected = wsStatus === WebSocket.OPEN;

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
            <Container className="d-grid gap-3">
                <h4>Connection status</h4>
                <Row>
                    <Col className="col-4 d-flex align-items-center">
                        <Title>Server</Title>
                    </Col>
                    <Col className="col-8">
                        <AccessCodeInput
                            disabled
                            type="text"
                            className={isConnected ? 'is-valid' : 'is-invalid'}
                            value={isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col className="col-4 d-flex align-items-center">
                        <Title>Client</Title>
                    </Col>
                    <Col className="col-8">
                        <AccessCodeInput
                            disabled
                            type="text"
                            className={
                                isConnected
                                    ? clientStatus === 'PAIRED'
                                        ? 'is-valid'
                                        : 'is-invalid'
                                    : ''
                            }
                            value={isConnected ? clientStatus : ''}
                        />
                    </Col>
                </Row>
                <hr />

                <h4>Connection settings</h4>

                <Row>
                    <Col className="col-4 d-flex align-items-center">
                        <Title>Access code</Title>
                    </Col>
                    <Col className="col-8">
                        <AccessCodeInput
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
                        <AccessCodeInput
                            disabled={isConnected}
                            type="text"
                            placeholder="ws://localhost:3000/ws"
                            value={serverUrl}
                            onChange={updateServerUrl}
                        />
                    </Col>
                </Row>
            </Container>
        </Form>
    );
}

export default AccessCodeForm;

const Title = styled.div``;

const AccessCodeInput = styled(Form.Control)``;
