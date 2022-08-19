import { faHandshake } from '@fortawesome/fontawesome-free-solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NetworkOffcanvas } from './NetworkOffcanvas';
import { useNetworkInfo } from '../../../hooks/useNetworkInfo';
import React, { useState, useMemo } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import styled from 'styled-components';

function Network() {
    const [modalShow, setModalShow] = useState(false);

    function onShow() {
        setModalShow(true);
    }
    function onClose() {
        setModalShow(false);
    }

    return (
        <>
            <NetworkButton open={onShow} />
            <NetworkOffcanvas show={modalShow} close={onClose} />
        </>
    );
}

export default Network;

function NetworkButton({ open }) {
    const [isConnected, isPaired, client] = useNetworkInfo();
    const icon = useMemo(() => {
        if (isConnected) {
            if (isPaired) {
                return <FontAwesomeIcon fontSize={70} icon={faHandshake} />;
            }

            return <Spinner animation="border" size="lg" />;
        }

        return <i className={'bi bi-link-45deg'} />;
    }, [isConnected, isPaired]);
    const text = useMemo(() => {
        if (!isConnected) {
            return;
        }

        if (isPaired && client?.name) {
            return client?.name?.toUpperCase?.();
        }

        return 'WAITING FOR CLIENT';
    }, [isConnected, isPaired, client]);
    const color = isConnected ? (isPaired ? 'green' : '#ffa029') : '#444';
    const textColor = isConnected ? (isPaired ? 'rgb(33, 237, 40)' : '#ffa029') : 'white';

    return (
        <div className="d-flex align-items-center">
            <div className="me-4">
                <Button color={color} onClick={open}>
                    {icon}
                </Button>
            </div>
            <Title textColor={textColor}>{text}</Title>
        </div>
    );
}

const Button = styled.button`
    color: white;
    background-color: ${({ color }) => color};
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
    width: 150px;
    outline: none;
    height: 150px;

    *:active {
        opacity: 0.8;
        background-color: #999;
    }

    & > i {
        font-size: 100px;
    }

    & > div {
        width: 80px;
        height: 80px;
        border-width: 10px;
    }
`;

const Title = styled.div`
    font-size: 40px;
    font-weight: bold;
    color: ${(props) => props.textColor};
`;
