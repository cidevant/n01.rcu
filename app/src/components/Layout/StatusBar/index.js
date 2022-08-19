import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { useSelector } from 'react-redux';

export function StatusBar() {
    const wsStatus = useSelector((state) => state.ws.status);
    const clientStatus = useSelector((state) => state.client.status);

    function getStatusBarWsStatus(ws, client) {
        if (ws === WebSocket.CLOSED) {
            return <StatusClosed />;
        }

        if (ws === WebSocket.OPEN) {
            if (client === 'PAIRED') {
                return <StatusPaired />;
            }

            return <StatusUnpaired />;
        }
    }

    return (
        <>
            <Navbar sticky="top" bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand>{getStatusBarWsStatus(wsStatus, clientStatus)}</Navbar.Brand>
                    <Nav className="ms-auto fs-3">
                        <Nav.Link href="#home">
                            <i className="bi bi-three-dots" />
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

function StatusClosed() {
    return <div>DISCONNECTED</div>;
}

function StatusPaired() {
    return <div>PAIRED</div>;
}

function StatusUnpaired() {
    return (
        <>
            <Spinner className="p-2" animation="border" size="sm" />
            Waiting for client connection...
        </>
    );
}
