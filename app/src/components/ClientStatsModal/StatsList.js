import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useSwipeable, LEFT, RIGHT } from 'react-swipeable';
import useHomeInfo from '../../hooks/useHomeInfo';
import { dayToTimestamp, getDays, getDayStats } from '../../utils/stats';
import { Flex, FlexItem, StatValue, Title, Wrapper } from './index.style';

export function StatsList() {
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

    if (!dayStats) {
        return <Alert>No stats</Alert>;
    }

    const setsWinrate = ((dayStats?.sets.win / dayStats?.sets.total).toFixed(2) * 100).toFixed(0);
    const legsWinrate = ((dayStats?.legs.win / dayStats?.legs.total).toFixed(2) * 100).toFixed(0);

    return (
        <>
            <DaySelector days={days} dayIndex={dayIndex} setDayIndex={setDayIndex} />

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
                {setsWinrate > 0 && `(${setsWinrate}%)`}
            </StatValue>

            <Title>Legs</Title>
            <StatValue>
                {dayStats?.legs.win} / {dayStats?.legs.total}{' '}
                {legsWinrate > 0 && `(${legsWinrate}%)`}
            </StatValue>

            <hr />

            <Title>High Finish </Title>
            <StatValue>{dayStats?.highFinish}</StatValue>

            <Title>Best Leg </Title>
            <StatValue>{dayStats?.bestLeg}</StatValue>

            <Title>Worst Leg </Title>
            <StatValue>{dayStats?.worstLeg}</StatValue>
        </>
    );
}

export function DaySelector({ days, dayIndex, setDayIndex }) {
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
