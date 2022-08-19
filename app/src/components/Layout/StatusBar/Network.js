import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake } from '@fortawesome/fontawesome-free-solid';
import styled from 'styled-components';
import { useNetworkInfo } from '../../../hooks/useNetworkInfo';

function Network() {
    const [modalShow, setModalShow] = useState(false);

    function openModal() {
        setModalShow(true);
    }

    return <NetworkButton open={openModal} />;
}

export default Network;

function NetworkButton({ open }) {
    const [isConnected, isPaired, client] = useNetworkInfo();
    const text = useMemo(() => {
        if (!isConnected) {
            return;
        }

        if (isPaired && client?.name) {
            return client?.name?.toUpperCase?.();
        }

        return 'WAITING FOR CLIENT';
    }, [isConnected, isPaired, client]);
    const icon = useMemo(() => {
        if (isConnected) {
            if (isPaired) {
                return <FontAwesomeIcon icon={faHandshake} />;
            }

            return <Spinner className="p-2" animation="border" size="sm" />;
        }

        return <i className={'bi bi-link-45deg'} />;
    }, [isConnected, isPaired, client]);

    return (
        <div className="d-flex align-items-center">
            <div className="me-2">
                <Button onClick={open}>{icon}</Button>
            </div>
            <Title>{text}</Title>
        </div>
    );
}

const Button = styled.button`
    color: white;
    background-color: #666;
    display: block;
    text-align: center;
    border: 0;
    opacity: 1;
    user-select: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    font-weight: bolder;
    width: 80px;
    height: 80px;

    *:active {
        opacity: 0.8;
        background-color: #999;
    }
`;

const Title = styled.div`
    font-size: 24px;
`;
