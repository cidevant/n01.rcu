import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useMemo } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import styled from 'styled-components';
import { CornerButton } from '../CornerButton';
import { useNetworkInfo } from '../../../hooks/useNetworkInfo';
import DailyStatsModal from '../../DailyStatsModal';
import { GamesHistoryModal } from '../../GamesHistoryModal';

export function LeftButtons() {
    const { isConnected, isPaired, client } = useNetworkInfo();
    const [showStats, setShowStats] = useState(false);
    const [showGamesHistory, setShowGamesHistory] = useState(false);

    const icon = useMemo(() => {
        if (isConnected) {
            if (isPaired) {
                return <FontAwesomeIcon fontSize={70} icon="fa-solid fa-list" />;
            }

            return <Spinner animation="border" size="lg" />;
        }

        return <i className={'bi bi-link-45deg'} />;
    }, [isConnected, isPaired]);
    const text = useMemo(() => {
        if (!isConnected) {
            return;
        }

        if (isPaired) {
            return client?.name ? client?.name?.toUpperCase?.() : 'NOT AUTHORIZED';
        }

        return 'WAITING FOR CLIENT';
    }, [isConnected, isPaired, client]);
    const color = isConnected ? (isPaired ? 'green' : '#ffa029') : '#444';
    const textColor = isConnected ? (isPaired ? 'rgb(33, 237, 40)' : '#ffa029') : 'white';

    function openStatsModal() {
        if (isPaired) {
            setShowStats(true);
        }
    }

    function closeStatsModal() {
        setShowStats(false);
    }

    function openGamesHistoryModal() {
        if (isPaired) {
            setShowGamesHistory(true);
        }
    }

    function closeGamesHistory() {
        setShowGamesHistory(false);
    }

    if (!isConnected) {
        return null;
    }

    return (
        <div className="d-flex align-items-center">
            <div className="me-4" onClick={openGamesHistoryModal}>
                <Button color={color}>{icon}</Button>
            </div>
            <Title onClick={openStatsModal} textColor={textColor}>
                {text}
            </Title>
            <DailyStatsModal show={showStats} close={closeStatsModal} />
            <GamesHistoryModal show={showGamesHistory} close={closeGamesHistory} />
        </div>
    );
}

export default LeftButtons;

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
