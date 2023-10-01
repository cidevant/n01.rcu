import styled from 'styled-components';
import React, { useState } from 'react';
import { useGameInfo } from '../../hooks/useGameInfo';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ScoreButton from '../ScoreButton';

export function ScoreLeft() {
    const { scoreLeft } = useGameInfo();
    const anyCheckout = scoreLeft <= 170;
    const [show, setShow] = useState(false);

    function toggleShow() {
        setShow(!show);
    }

    function close() {
        setShow(false);
    }

    if (scoreLeft == null) {
        return;
    }

    return (
        <>
            <ScoreLeftWrapper
                active={anyCheckout}
                onClick={toggleShow}
                className="d-flex align-items-center justify-content-end"
            >
                <OverlayTrigger
                    show={show}
                    key="score-selector"
                    placement="top"
                    overlay={
                        <div>
                            <ScoreSelector close={close} />
                        </div>
                    }
                >
                    <div>
                        <ScoreLeftTitle active={anyCheckout}>SCORE LEFT</ScoreLeftTitle>
                        <ScoreLeftValue active={anyCheckout}>{scoreLeft}</ScoreLeftValue>
                    </div>
                </OverlayTrigger>
            </ScoreLeftWrapper>
        </>
    );
}

export default ScoreLeft;

function ScoreSelector({ close }) {
    const { scoreLeft, dispatchInputScore } = useGameInfo();

    function action(value) {
        dispatchInputScore(parseInt(value, 10));
        close();
    }

    return (
        <ScoreSelectorWrapper>
            <ScoreSelectorItem>
                <ScoreButton buttonStyle="finish" score={scoreLeft} action={action} />
            </ScoreSelectorItem>
            <ScoreSelectorItem wide>
                <ScoreButton buttonStyle="zero" score="0" action={action} />
            </ScoreSelectorItem>
        </ScoreSelectorWrapper>
    );
}

const ScoreSelectorWrapper = styled.div`
    display: flex;
    flex-direction: row;
    top: -10px;
    position: relative;
`;

const ScoreSelectorItem = styled.div`
    flex-grow: 1;
    margin-left: 10px;
    width: 250px;

    ${({ wide }) => wide && 'width: 500px;'};
`;

const ScoreLeftWrapper = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    height: 100%;
    cursor: pointer !important;
    padding: 0 50px;
    ${({ active }) => active && 'background-color: #FF1493;'};
    user-select: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
`;

const ScoreLeftTitle = styled.div`
    color: white;
    text-align: center;
    background-color: #444;
    top: 20px;
    position: relative;
    width: 100%;
    ${({ active }) => active && 'color: white; background-color: black;'};
    user-select: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
`;

const ScoreLeftValue = styled.div`
    font-size: 100px;
    color: #666;
    text-align: center;
    ${({ active }) => active && 'color: #111'};
    user-select: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
`;
