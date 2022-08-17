import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';

export function StatusBar() {
    return (
        <>
            <Navbar sticky="top" bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand>
                        <Spinner className="p-2" animation="border" size="sm" />
                        Waiting for client connection...
                    </Navbar.Brand>
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
