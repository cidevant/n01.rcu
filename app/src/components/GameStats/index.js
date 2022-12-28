import React from 'react';
import { StatValue, Title } from './index.style';

function GameStats({ stats = {} }) {
    function renderSets() {
        if (!stats?.sets) {
            return null;
        }

        const setsWinRate = ((stats?.sets?.win / stats?.sets?.total).toFixed(2) * 100).toFixed(0);

        return (
            <>
                <Title>Sets</Title>
                <StatValue>
                    {stats?.sets?.win} / {stats?.sets?.total}{' '}
                    {setsWinRate > 0 && `(${setsWinRate}%)`}
                </StatValue>
            </>
        );
    }

    function renderLegs() {
        if (!stats?.legs) {
            return null;
        }

        const legsWinRate = ((stats?.legs?.win / stats?.legs?.total).toFixed(2) * 100).toFixed(0);

        return (
            <>
                <Title>Legs</Title>
                <StatValue>
                    {stats?.legs?.win} / {stats?.legs?.total}{' '}
                    {legsWinRate > 0 && `(${legsWinRate}%)`}
                </StatValue>
            </>
        );
    }

    function renderSetsLegs() {
        if (!stats?.sets || !stats?.legs) {
            return null;
        }

        return (
            <>
                <hr />
                {renderSets()}
                {renderLegs()}
            </>
        );
    }

    return (
        <div>
            <Title>Average</Title>
            <StatValue>{stats?.average?.score?.toFixed?.(2)}</StatValue>

            <Title>First 9</Title>
            <StatValue>{stats?.average?.first9?.toFixed?.(2)}</StatValue>

            <hr />
            <Title>100+</Title>
            <StatValue>{stats?.['100']}</StatValue>

            <Title>140+</Title>
            <StatValue>{stats?.['140']}</StatValue>

            <Title>180's</Title>
            <StatValue>{stats?.['180']}</StatValue>

            {renderSetsLegs()}

            <hr />

            <Title>High Finish </Title>
            <StatValue>{stats?.highFinish}</StatValue>

            <Title>Best Leg </Title>
            <StatValue>{stats?.bestLeg}</StatValue>

            <Title>Worst Leg </Title>
            <StatValue>{stats?.worstLeg}</StatValue>
        </div>
    );
}

export default GameStats;
