import React from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Opponent } from './Opponent';
import useGameInfo from '../../hooks/useGameInfo';
import { SCENES, SCENES_GREETINGS, SCENES_MEMES } from '../../utils/game';
import Item from './Item';

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
        <Wrapper>
            <Flex>
                {SCENES.map((scene) => (
                    <Item scene={scene} key={scene.code} />
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

            <div className="d-flex gap-5">
                <ControlButton
                    onClick={dispatchToggleStats}
                    className="d-flex align-items-center justify-content-center"
                >
                    TOGGLE STATS
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
                    EXIT GAME
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
    font-size: 40px;
    background-color: #0dcaf0;
    border: 1px solid #004757;
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.2);
    padding: 5px;
    color: black;
    border-radius: 10px;
    min-height: 60px;
    width: 33%;
    text-align: center;
`;
