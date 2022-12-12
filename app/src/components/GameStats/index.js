import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Flex, FlexItem, StatValue, Title, Wrapper } from './index.style';

function GameStats() {
    const dayStats = {};
    const setsWinRate = 0;
    const legsWinRate = 0;

    return (
        <div>
            <Title>Average</Title>
            <StatValue>{dayStats?.average?.score?.toFixed?.(2)}</StatValue>

            <Title>First 9</Title>
            <StatValue>{dayStats?.average?.first9?.toFixed?.(2)}</StatValue>

            <hr />
            <Title>100+</Title>
            <StatValue>{dayStats?.['100']}</StatValue>

            <Title>140+</Title>
            <StatValue>{dayStats?.['140']}</StatValue>

            <Title>180's</Title>
            <StatValue>{dayStats?.['180']}</StatValue>

            <hr />
            <Title>Sets</Title>
            <StatValue>
                {dayStats?.sets.win} / {dayStats?.sets.total}{' '}
                {setsWinRate > 0 && `(${setsWinRate}%)`}
            </StatValue>

            <Title>Legs</Title>
            <StatValue>
                {dayStats?.legs.win} / {dayStats?.legs.total}{' '}
                {legsWinRate > 0 && `(${legsWinRate}%)`}
            </StatValue>

            <hr />

            <Title>High Finish </Title>
            <StatValue>{dayStats?.highFinish}</StatValue>

            <Title>Best Leg </Title>
            <StatValue>{dayStats?.bestLeg}</StatValue>

            <Title>Worst Leg </Title>
            <StatValue>{dayStats?.worstLeg}</StatValue>
        </div>
    );
}

export default GameStats;
