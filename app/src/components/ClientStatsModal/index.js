import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonWrapper } from './index.style';
import { GamesList } from './GamesList';
import { StatsList } from './StatsList';

export function ClientStatsModal({ show, close }) {
    const [showGame, setShowGame] = useState(false);

    function toggleStatsGame() {
        setShowGame(!showGame);
    }

    return (
        <Offcanvas placement="start" show={show} onHide={close}>
            <ButtonWrapper className="d-grid gap-2">
                <Button onClick={toggleStatsGame} variant="warning">
                    <FontAwesomeIcon icon="fa-solid fa-ranking-star" className="text-black me-4" />
                    {showGame ? 'GAMES' : 'STATS'}
                </Button>
            </ButtonWrapper>
            {showGame ? <GamesList /> : <StatsList />}
        </Offcanvas>
    );
}

export default ClientStatsModal;
