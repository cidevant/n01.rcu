import React from 'react';
import styled from 'styled-components';
import useGameInfo from '../../hooks/useGameInfo';
import { useNetworkInfo } from '../../hooks/useNetworkInfo';
import { obsToggleScene } from '../../utils/obs';
import LongPressButton from '../LongPressButton';

function Item({ scene, sendScore, delay, useLongPress = false }) {
    const { obsUrl, obsPassword } = useNetworkInfo();
    const { dispatchInputScore } = useGameInfo();

    async function setScene() {
        await obsToggleScene(scene.code, obsUrl, obsPassword, delay);

        if (sendScore && scene.score) {
            const score = parseInt(scene.score, 10);

            if (score >= 0) {
                dispatchInputScore(score);
            }
        }
    }

    async function onLongPress(event) {
        event.target.classList.add('confirmed');
        await setScene();
    }

    function onPressIn(event) {
        event.target.classList.add('touching');
    }

    function onPressOut(event) {
        event.target.classList.remove('confirmed');
        event.target.classList.remove('touching');
    }

    function renderButton() {
        const buttonProps = {
            sceneStyle: scene.style,
            className: 'd-flex align-items-center justify-content-center',
        };

        if (!useLongPress) {
            buttonProps.onClick = setScene;
        }

        return <SceneButton {...buttonProps}>{scene.name}</SceneButton>;
    }

    if (!useLongPress) {
        return renderButton();
    }

    return (
        <LongPressButton onLongPress={onLongPress} onPressOut={onPressOut} onPressIn={onPressIn}>
            {renderButton()}
        </LongPressButton>
    );
}

export default Item;

const SceneButton = styled.div`
    flex-grow: 1;
    width: 30%;
    min-height: 160px;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 40px;
    margin: 10px;
    background-color: #0dcaf0;
    border: 1px solid #004757;
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.2);
    padding: 5px;
    color: black;
    border-radius: 10px;
    text-align: center;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;

    ${({ sceneStyle }) => sceneStyle === 'yellow' && 'background-color: yellow;'};
    ${({ sceneStyle }) => sceneStyle === 'green' && 'background-color: lightgreen;'};
    ${({ sceneStyle }) => sceneStyle === 'red' && 'background-color: red;'};

    &.touching {
        background-color: #15c900;
        transition: background-color 1s;
    }

    &.confirmed {
        border-color: #fff;
        color: white;
    }
`;
