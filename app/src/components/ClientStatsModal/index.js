import _ from 'lodash';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useHomeInfo from '../../hooks/useHomeInfo';
import { getDayStats, getDays, dayToTimestamp } from '../../utils/stats';
import { ButtonWrapper, Flex, FlexItem, StatValue, Title, Wrapper } from './index.style';
import { Alert } from 'react-bootstrap';
import { useSwipeable, LEFT, RIGHT } from 'react-swipeable';

export function ClientStatsModal({ show, close }) {
    const daysExist = useRef(false);
    const [dayIndex, setDayIndex] = useState();
    const { stats } = useHomeInfo();
    const days = useMemo(() => getDays(stats), [stats]);
    const dayStats = useMemo(
        () => getDayStats(stats, dayToTimestamp(days[dayIndex])),
        [stats, days, dayIndex]
    );

    useEffect(() => {
        if (!_.isEmpty(days) !== daysExist.current) {
            setDayIndex(0);

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
            <DaySelector days={days} dayIndex={dayIndex} setDayIndex={setDayIndex} />
            <Stats stats={dayStats} />
        </Offcanvas>
    );
}

export default ClientStatsModal;

function DaySelector({ days, dayIndex, setDayIndex }) {
    const day = days[dayIndex];
    const disabledLeft = dayIndex === 0;
    const disabledRight = dayIndex === days.length - 1;
    const swipeDays = useSwipeable({
        onSwiped: (ev) => {
            if (ev.dir === RIGHT) {
                goLeft();
            }

            if (ev.dir === LEFT) {
                goRight();
            }
        },
    });

    function goLeft() {
        if (!disabledLeft) {
            setDayIndex(dayIndex - 1);
        }
    }
    function goRight() {
        if (!disabledRight) {
            setDayIndex(dayIndex + 1);
        }
    }

    return (
        <Wrapper {...swipeDays}>
            <Flex>
                <FlexItem onClick={goLeft} nav disabled={disabledLeft}>
                    <FontAwesomeIcon icon="fa-solid fa-chevron-left" className="me-4" />
                </FlexItem>
                <FlexItem>
                    <Title>Day</Title>
                    <StatValue>{day}</StatValue>
                </FlexItem>
                <FlexItem nav onClick={goRight} disabled={disabledRight}>
                    <FontAwesomeIcon icon="fa-solid fa-chevron-right" className="me-4" />
                </FlexItem>
            </Flex>
        </Wrapper>
    );
}

function Stats({ stats }) {
    if (!stats) {
        return <Alert>No stats</Alert>;
    }

    const setsWinrate = (stats?.sets.win / stats?.sets.total).toFixed(2) * 100;
    const legsWinrate = (stats?.legs.win / stats?.legs.total).toFixed(2) * 100;

    return (
        <>
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

            <hr />
            <Title>Sets</Title>
            <StatValue>
                {stats?.sets.win} / {stats?.sets.total} {setsWinrate > 0 && `(${setsWinrate}%)`}
            </StatValue>

            <Title>Legs</Title>
            <StatValue>
                {stats?.legs.win} / {stats?.legs.total} {legsWinrate > 0 && `(${legsWinrate}%)`}
            </StatValue>

            <hr />

            <Title>High Finish </Title>
            <StatValue>{stats?.highFinish}</StatValue>

            <Title>Best Leg </Title>
            <StatValue>{stats?.bestLeg}</StatValue>

            <Title>Worst Leg </Title>
            <StatValue>{stats?.worstLeg}</StatValue>
        </>
    );
}
