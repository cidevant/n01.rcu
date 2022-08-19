import React, { useState, useCallback, useMemo } from 'react';
import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { useSelector } from 'react-redux';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake } from '@fortawesome/fontawesome-free-solid';

export function StatusBar() {
    const wsStatus = useSelector((state) => state.ws.status);
    const clientStatus = useSelector((state) => state.client.status);
    const client = useSelector((state) => state.client.client);
    const [modalShow, setModalShow] = useState(false);
    const hideModal = useCallback(() => {
        setModalShow(false);
    }, []);
    const buttonIcon = useMemo(() => {
        if (wsStatus === WebSocket.OPEN) {
            return clientStatus === 'PAIRED' ? (
                <FontAwesomeIcon icon={faHandshake} />
            ) : (
                <Spinner className="p-2" animation="border" size="sm" />
            );
        }

        return <i className={'bi bi-link-45deg'} />;
    }, [wsStatus, clientStatus]);
    const buttonVariant = useMemo(() => {
        if (wsStatus === WebSocket.OPEN) {
            return clientStatus === 'PAIRED' ? 'success' : 'warning';
        }

        return 'danger';
    }, [wsStatus, clientStatus]);
    const connectionMessage = useMemo(() => {
        if (wsStatus === WebSocket.OPEN) {
            if (clientStatus === 'PAIRED' && client.name) {
                return <div className="ms-2 d-inline fw-bold">{client.name?.toUpperCase()}</div>;
            }

            return <div className="ms-2 d-inline">WAITING FOR CLIENT</div>;
        }

        return '';
    }, [wsStatus, clientStatus, client]);

    function openModal() {
        setModalShow(true);
    }

    return (
        <>
            <Navbar sticky="top" bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand>
                        <Button variant={buttonVariant} onClick={openModal}>
                            {buttonIcon}
                        </Button>
                        {connectionMessage}
                        <Modal show={modalShow} onHide={hideModal} />
                    </Navbar.Brand>
                    <Nav className="ms-auto">
                        <Nav.Link href="#home">
                            <i className="bi bi-three-dots" />
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}
