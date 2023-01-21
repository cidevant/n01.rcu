import React from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Opponent } from './Opponent';
import useGameInfo from '../../hooks/useGameInfo';

export function ScenesModal({ show, close, opponent, average }) {
    return (
        <Offcanvas placement="end" show={show} onHide={close}>
            <ButtonWrapper className="d-grid gap-2">
                <Button size="lg" onClick={close} variant="info">
                    <FontAwesomeIcon
                        icon="fa-solid fa-face-grin-squint-tears"
                        className="text-black me-4"
                    />
                    SCENES
                </Button>
            </ButtonWrapper>
            <Opponent opponent={opponent} average={average} />
            <hr />
            <ScenesList />
        </Offcanvas>
    );
}

export default ScenesModal;

function ScenesList() {
    const { dispatchExitGame, dispatchToggleStats, dispatchRefreshPage } = useGameInfo();

    return (
        <ContentWrapper>
            <CheckoutsRow className="d-flex gap-5">
                <CheckoutDart
                    onClick={dispatchToggleStats}
                    className="d-flex align-items-center justify-content-center"
                >
                    TOGGLE STATS
                </CheckoutDart>
            </CheckoutsRow>
            <CheckoutsRow className="d-flex gap-5">
                <CheckoutDart
                    onClick={dispatchRefreshPage}
                    className="d-flex align-items-center justify-content-center"
                >
                    REFRESH
                </CheckoutDart>
            </CheckoutsRow>
            <CheckoutsRow className="d-flex gap-5">
                <CheckoutDart
                    onClick={dispatchExitGame}
                    className="d-flex align-items-center justify-content-center"
                >
                    EXIT GAME
                </CheckoutDart>
            </CheckoutsRow>
        </ContentWrapper>
    );
}

const ButtonWrapper = styled.div`
    height: 150px;
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.4);
    z-index: 10;

    & > button {
        border-radius: 0;
        font-size: 70px;
        border: 0;

        &:hover,
        &:active {
            background-color: #0dcaf0;
            opacity: 0.8;
        }
    }
`;

const ContentWrapper = styled.div`
    padding: 20px;
`;

const CheckoutsRow = styled.div`
    padding: 20px;
`;

const CheckoutDart = styled.div`
    font-size: 40px;
    width: 100%;
    background-color: #0dcaf0;
    border: 1px solid #004757;
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.2);
    padding: 5px 15px;
    color: black;
    border-radius: 10px;
    min-width: 295px;
    min-height: 200px;
`;
