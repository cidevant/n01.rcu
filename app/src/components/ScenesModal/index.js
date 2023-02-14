import React, { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Opponent } from './Opponent';
import useGameInfo from '../../hooks/useGameInfo';
import { SCENES, SCENES_GREETINGS, SCENES_MEMES } from '../../utils/game';
import Item from './Item';

export function ScenesModal({ show, close, opponent, average }) {
    const [sendSceneScore, setSendSceneScore] = useState(true);

    function toggleSendSceneScore() {
        setSendSceneScore(!sendSceneScore);
    }

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
            <ScenesList
                toggleSendSceneScore={toggleSendSceneScore}
                sendSceneScore={sendSceneScore}
            />
        </Offcanvas>
    );
}

export default ScenesModal;

function ScenesList({ sendSceneScore, toggleSendSceneScore }) {
    const { dispatchExitGame, dispatchToggleStats, dispatchRefreshPage } = useGameInfo();

    return (
        <Wrapper>
            <ToggleSceneScoreButtonWrapper>
                <Button
                    size="lg"
                    onClick={toggleSendSceneScore}
                    variant={sendSceneScore === true ? 'success' : 'secondary'}
                >
                    <FontAwesomeIcon
                        className="text-white me-4"
                        icon={sendSceneScore === true ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}
                    />
                    SEND SCENE SCORE
                </Button>
            </ToggleSceneScoreButtonWrapper>
            <Flex>
                {SCENES.map((scene) => (
                    <Item scene={scene} sendScore={sendSceneScore} key={scene.code} />
                ))}{' '}
            </Flex>

            <Flex>
                {SCENES_MEMES.map((scene) => (
                    <Item scene={scene} key={scene.code} />
                ))}{' '}
            </Flex>

            <Flex>
                {SCENES_GREETINGS.map((scene) => (
                    <Item scene={scene} key={scene.code} />
                ))}
            </Flex>

            <hr />

            <div className="d-flex gap-4">
                <ControlButton
                    onClick={dispatchToggleStats}
                    className="d-flex align-items-center justify-content-center"
                >
                    STATS
                </ControlButton>

                <ControlButton
                    onClick={dispatchRefreshPage}
                    className="d-flex align-items-center justify-content-center"
                >
                    REFRESH
                </ControlButton>
                <ControlButton
                    onClick={dispatchExitGame}
                    className="d-flex align-items-center justify-content-center"
                >
                    EXIT
                </ControlButton>
            </div>
        </Wrapper>
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

const Wrapper = styled.div`
    padding: 20px;
`;

const Flex = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    flex-wrap: wrap;
    margin-bottom: 30px;
`;

const ControlButton = styled.div`
    margin-top: 30px;
    font-size: 40px;
    background-color: #ccc;
    border: 1px solid #004757;
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.2);
    padding: 5px;
    color: black;
    border-radius: 10px;
    min-height: 160px;
    width: 33%;
    text-align: center;
`;
const ToggleSceneScoreButtonWrapper = styled.div`
    z-index: 10;
    padding: 20px;
    width: 100%;

    & > button {
        border-radius: 0;
        font-size: 40px;
        height: 100px;
        width: 100%;
    }
`;
