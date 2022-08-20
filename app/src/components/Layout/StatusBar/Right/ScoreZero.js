import React from 'react';
import styled from 'styled-components';
import { useGameInfo } from '../../../../hooks/useGameInfo';
import useLongPress from '../../../../hooks/useLongPress';
import { CornerButton } from '../CornerButton';

export function ScoreZero() {
    const { dispatchInputScore } = useGameInfo();
    const longPressHandlers = useLongPress(
        (e) => {
            e.target.classList.add('ok');
            dispatchInputScore(0);
        },
        (e) => e.target.classList.remove('ok')
    );

    return (
        <div className="d-flex align-items-center">
            <ZeroButton color="#800000" {...longPressHandlers}>
                0
            </ZeroButton>
        </div>
    );
}

const ZeroButton = styled(CornerButton)`
    font-size: 80px;

    &:active {
        opacity: 1;
        background-color: #800000;
    }

    &.ok {
        background-color: green;
    }
`;
