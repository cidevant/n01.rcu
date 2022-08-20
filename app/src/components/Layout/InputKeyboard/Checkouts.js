import React, { useState, useMemo } from 'react';
import { CheckoutsModal } from './CheckoutsModal';
import dartsIcon from '../../../assets/icons/darts_board.png';
import styled from 'styled-components';
import { useGameInfo } from '../../../hooks/useGameInfo';
import { getCheckouts } from '../../../utils/game';

export function Checkouts() {
    const [modalShow, setModalShow] = useState(false);
    const { scoreLeft } = useGameInfo();
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

    return (
        <ScoreLeftWrapper>
            <CheckoutsButton anyCheckout={anyCheckout} open={onShow} />
            <CheckoutsModal
                show={modalShow}
                close={onClose}
                scoreLeft={scoreLeft}
                checkouts={checkouts}
            />
        </ScoreLeftWrapper>
    );
}

const ScoreLeftWrapper = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    cursor: pointer !important;
`;

export default Checkouts;

function CheckoutsButton({ open, anyCheckout }) {
    const color = anyCheckout ? '#00FFFF' : '#ccc';

    return (
        <div className="d-flex align-items-center">
            <div>
                <CornerButton color={color} onClick={open}>
                    <IconImage src={dartsIcon} alt="darts finish" />
                </CornerButton>
            </div>
        </div>
    );
}

const IconImage = styled.img`
    width: 120px;
`;

export const CornerButton = styled.button`
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
    height: 181px;

    &:active {
        opacity: 0.8;
        background-color: #999;
    }
`;
