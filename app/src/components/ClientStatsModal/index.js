import _ from 'lodash';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import React, { useMemo, useCallback, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useHomeInfo from '../../hooks/useHomeInfo';
import { getDayStats, getDays, dayToTimestamp } from '../../utils/stats';
import { ButtonWrapper, StatValue, Title, Wrapper } from './index.style';

export function ClientStatsModal({ show, close }) {
    const daysExist = useRef(false);
    const [day, setDay] = useState();
    const { stats } = useHomeInfo();
    const days = useMemo(() => getDays(stats), [stats]);
    const dayStats = useMemo(() => getDayStats(stats, dayToTimestamp(day)), [stats, day]);

    useEffect(() => {
        if (!_.isEmpty(days) !== daysExist.current) {
            setDay(days[0]);

            daysExist.current = true;
        }
    }, [days]);

    return (
        <Offcanvas placement="start" show={show} onHide={close}>
            <ButtonWrapper className="d-grid gap-2">
                <Button size="lg" onClick={close} variant="warning">
                    <FontAwesomeIcon icon="fa-solid fa-ranking-star" className="text-black me-4" />
                    STATS
                </Button>
            </ButtonWrapper>

            {day}

            <hr />

            <Stats stats={dayStats} />
        </Offcanvas>
    );
}

export default ClientStatsModal;

function Stats({ stats }) {
    return (
        <>
            <Wrapper>
                <Title>Average</Title>
                <StatValue>{stats?.average?.score?.toFixed?.(2)}</StatValue>
            </Wrapper>
            <Wrapper>
                <Title>First 9</Title>
                <StatValue>{stats?.average?.first9?.toFixed?.(2)}</StatValue>
            </Wrapper>

            <hr />

            <Wrapper>
                <Title>Sets</Title>
                <StatValue>
                    {stats?.sets.win} / {stats?.sets.total}
                </StatValue>
            </Wrapper>
            <Wrapper>
                <Title>Legs</Title>
                <StatValue>
                    {stats?.legs.win} / {stats?.legs.total}
                </StatValue>
            </Wrapper>

            <hr />

            <Wrapper>
                <Title>100+</Title>
                <StatValue>{stats?.['100']}</StatValue>
            </Wrapper>
            <Wrapper>
                <Title>140+</Title>
                <StatValue>{stats?.['140']}</StatValue>
            </Wrapper>
            <Wrapper>
                <Title>180's</Title>
                <StatValue>{stats?.['180']}</StatValue>
            </Wrapper>
            <Wrapper>
                <Title>High Finish </Title>
                <StatValue>{stats?.highFinish}</StatValue>
            </Wrapper>
            <Wrapper>
                <Title>Best Leg </Title>
                <StatValue>{stats?.bestLeg}</StatValue>
            </Wrapper>
            <Wrapper>
                <Title>Worst Leg </Title>
                <StatValue>{stats?.worstLeg}</StatValue>
            </Wrapper>
        </>
    );
}
