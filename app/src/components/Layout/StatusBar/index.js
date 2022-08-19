import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { useSelector } from 'react-redux';

export function StatusBar() {
    const wsStatus = useSelector((state) => state.ws.status);

    function getStatusBarWsStatus(status) {
        if (status === WebSocket.CLOSED) {
            return <StatusClosed />;
        }

        if (status === WebSocket.OPEN) {
            return <StatusOpen />;
        }
    }

    return (
        <>
            <Navbar sticky="top" bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand>{getStatusBarWsStatus(wsStatus)}</Navbar.Brand>
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
    return <div>Closed</div>;
}

function StatusOpen() {
    return <div>Connected</div>;
}

function StatusWaitingClient(params) {
    return (
        <>
            <Spinner className="p-2" animation="border" size="sm" />
            Waiting for client connection...
        </>
    );
}
