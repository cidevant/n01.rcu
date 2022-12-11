import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonWrapper } from './index.style';
import { StatsList } from './StatsList';

export function DailyStatsModal({ show, close }) {
    return (
        <Offcanvas scroll={true} placement="start" show={show} onHide={close}>
            <ButtonWrapper className="d-grid gap-2">
                <Button variant="warning">
                    <FontAwesomeIcon icon="fa-solid fa-ranking-star" className="text-black me-4" />
                    DAILY STATS
                </Button>
            </ButtonWrapper>
            <Offcanvas.Body>
                <StatsList />
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default DailyStatsModal;
