import styled from 'styled-components';
import React, { useState, useMemo } from 'react';
import { CheckoutsModal } from '../../CheckoutsModal';
import { useGameInfo } from '../../../hooks/useGameInfo';
import { getCheckouts } from '../../../utils/game';

export function ScoreLeft() {
    const { scoreLeft } = useGameInfo();
    const [modalShow, setModalShow] = useState(false);
    const checkouts = useMemo(() => getCheckouts(scoreLeft), [scoreLeft]);
    const anyCheckout = checkouts.length > 0;

    function onShow() {
        if (anyCheckout) {
            setModalShow(true);
        }
    }
    function onClose() {
        setModalShow(false);
    }

    if (scoreLeft == null) {
        return;
    }

    return (
        <>
            <ScoreLeftWrapper
                onClick={onShow}
                active={anyCheckout}
                className="d-flex align-items-center justify-content-end"
            >
                <div>
                    <ScoreLeftTitle active={anyCheckout}>SCORE LEFT</ScoreLeftTitle>
                    <ScoreLeftValue active={anyCheckout}>{scoreLeft}</ScoreLeftValue>
                </div>
            </ScoreLeftWrapper>
            <CheckoutsModal
                show={modalShow}
                close={onClose}
                scoreLeft={scoreLeft}
                checkouts={checkouts}
            />
        </>
    );
}

export default ScoreLeft;

const ScoreLeftWrapper = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    height: 100%;
    cursor: pointer !important;
    padding: 0 50px;
    ${({ active }) => active && 'background-color: #FF1493;'}
`;

const ScoreLeftTitle = styled.div`
    color: white;
    text-align: center;
    background-color: #444;
    top: 20px;
    position: relative;
    width: 100%;
    ${({ active }) => active && 'color: white; background-color: black;'}
`;

const ScoreLeftValue = styled.div`
    font-size: 100px;
    color: #666;
    text-align: center;
    ${({ active }) => active && 'color: #111'}
`;
