import React from 'react';
import styled from 'styled-components';
import { useNetworkInfo } from '../../../../hooks/useNetworkInfo';
import { CornerButton } from '../CornerButton';
import { Filter } from './Filter';

export function RightButtons() {
    const { isConnected, isPaired } = useNetworkInfo();

    if (isConnected && isPaired) {
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
