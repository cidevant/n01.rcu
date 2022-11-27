import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonWrapper } from './index.style';
import { StatsList } from './StatsList';
import { GamesHistory } from '../GamesHistory';

export function DailyStats({ show, close }) {
    const [showGameHistory, setShowGameHistory] = useState(false);

    function toggleStatsGame() {
        setShowGameHistory(!showGameHistory);
    }

    return (
        <Offcanvas
            disableScrolling={false}
            scroll={true}
            placement="start"
            show={show}
            onHide={close}
        >
            <ButtonWrapper className="d-grid gap-2">
                <Button onClick={toggleStatsGame} variant="warning">
                    <FontAwesomeIcon icon="fa-solid fa-ranking-star" className="text-black me-4" />
                    {showGameHistory ? 'GAMES' : 'STATS'}
                </Button>
            </ButtonWrapper>
            <Offcanvas.Body>{showGameHistory ? <GamesHistory /> : <StatsList />}</Offcanvas.Body>
        </Offcanvas>
    );
}

export default DailyStats;
