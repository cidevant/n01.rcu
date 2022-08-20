import React, { useState, useMemo } from 'react';
import { CheckoutsModal } from './CheckoutsModal';
import { Button } from './index';
import dartsIcon from '../../../../assets/icons/darts_board.png';
import styled from 'styled-components';
import { useGameInfo } from '../../../../hooks/useGameInfo';
import { getCheckouts } from '../../../../utils/game';

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
        <>
            <CheckoutsButton anyCheckout={anyCheckout} open={onShow} />
            <CheckoutsModal
                show={modalShow}
                close={onClose}
                scoreLeft={scoreLeft}
                checkouts={checkouts}
            />
        </>
    );
}

export default Checkouts;

function CheckoutsButton({ open, anyCheckout }) {
    const color = anyCheckout ? '#00FFFF' : '#ccc';

    return (
        <div className="d-flex align-items-center">
            <div>
                <Button color={color} onClick={open}>
                    <IconImage src={dartsIcon} alt="darts finish" />
                </Button>
            </div>
        </div>
    );
}

const IconImage = styled.img`
    width: 120px;
`;
