import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NetworkModal } from './NetworkModal';
import React, { useState, useMemo } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import styled from 'styled-components';
import { CornerButton } from '../CornerButton';
import { useNetworkInfo } from '../../../../hooks/useNetworkInfo';
import ClientStatsModal from '../../../ClientStatsModal';

export function LeftButtons() {
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
            <NetworkModal show={modalShow} close={onClose} />
        </>
    );
}

export default LeftButtons;

function NetworkButton({ open }) {
    const { isConnected, isPaired, client } = useNetworkInfo();
    const icon = useMemo(() => {
        if (isConnected) {
            if (isPaired) {
                return <FontAwesomeIcon fontSize={70} icon="fa-solid fa-handshake" />;
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
    const [showStats, setShowStats] = useState(false);

    function openStatsModal() {
        if (isPaired) {
            setShowStats(true);
        }
    }

    function closeStatsModal() {
        setShowStats(false);
    }

    return (
        <div className="d-flex align-items-center">
            <div className="me-4">
                <Button color={color} onClick={open}>
                    {icon}
                </Button>
            </div>
            <Title onClick={openStatsModal} textColor={textColor}>
                {text}
            </Title>
            <ClientStatsModal show={showStats} close={closeStatsModal} />
        </div>
    );
}

const Title = styled.div`
    font-size: 40px;
    width: 100%;
    font-weight: bold;
    text-align: center;
    color: ${(props) => props.textColor};
    user-select: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
`;

const Button = styled(CornerButton)`
    & > i {
        font-size: 100px;
    }

    & > div {
        width: 80px;
        height: 80px;
        border-width: 10px;
    }
`;
