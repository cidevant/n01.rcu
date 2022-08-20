import React from 'react';
import styled from 'styled-components';
import { useNetworkInfo } from '../../../../hooks/useNetworkInfo';
import { CornerButton } from '../CornerButton';
import { useGameInfo } from '../../../../hooks/useGameInfo';
import { Filter } from './Filter';
import { Checkouts } from './Checkouts';

export function RightButtons() {
    const [isConnected, isPaired] = useNetworkInfo();
    const { gameStarted } = useGameInfo();

    if (gameStarted) {
        return <Checkouts />;
    }

    if (isConnected && isPaired && !gameStarted) {
        return <Filter />;
    }

    return null;
}

export default RightButtons;

export const Button = styled(CornerButton)`
    & > i {
        font-size: 100px;
    }

    & > div {
        width: 80px;
        height: 80px;
        border-width: 10px;
    }

    & > svg {
        width: 60px;
        height: 60px;
    }
`;
