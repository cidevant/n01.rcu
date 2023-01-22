import React from 'react';
import styled from 'styled-components';
import { useNetworkInfo } from '../../hooks/useNetworkInfo';
import { obsToggleScene } from '../../utils/obs';

function Item({ scene }) {
    const { obsUrl, obsPassword } = useNetworkInfo();

    async function setScene() {
        await obsToggleScene(scene.code, obsUrl, obsPassword);
    }

    return (
        <SceneButton
            sceneStyle={scene.style}
            onClick={setScene}
            className="d-flex align-items-center justify-content-center"
        >
            {scene.name}
        </SceneButton>
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

    ${({ sceneStyle }) => sceneStyle === 'yellow' && 'background-color: yellow;'};
    ${({ sceneStyle }) => sceneStyle === 'green' && 'background-color: lightgreen;'};
    ${({ sceneStyle }) => sceneStyle === 'red' && 'background-color: red;'};
`;
