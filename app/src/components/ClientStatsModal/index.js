import _ from 'lodash';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useHomeInfo from '../../hooks/useHomeInfo';
import Modal from 'react-bootstrap/Modal';
import { getDayStats, getDays, dayToTimestamp } from '../../utils/stats';
import {
    ButtonWrapper,
    Flex,
    FlexItem,
    StatValue,
    Title,
    Wrapper,
    GameInfo,
    GamePlayer,
    GamePlayerName,
    GamePlayerStats,
    GamePlayerLegs,
    GameInfoModalPlayer,
    GameInfoModalPlayers,
} from './index.style';
import { Alert } from 'react-bootstrap';
import { useSwipeable, LEFT, RIGHT } from 'react-swipeable';
import { config } from '../../config';

export function ClientStatsModal({ show, close }) {
    const daysExist = useRef(false);
    const [dayIndex, setDayIndex] = useState();
    const { stats, games } = useHomeInfo();
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

    const [showGame, setShowGame] = useState(false);

    function toggleStatsGame() {
        setShowGame(!showGame);
    }

    return (
        <Offcanvas placement="start" show={show} onHide={close}>
            <ButtonWrapper className="d-grid gap-2">
                <Button size="lg" onClick={toggleStatsGame} variant="warning">
                    <FontAwesomeIcon icon="fa-solid fa-ranking-star" className="text-black me-4" />
                    {showGame ? 'GAMES' : 'STATS'}
                </Button>
            </ButtonWrapper>

            {showGame ? (
                <Games games={games} />
            ) : (
                <>
                    <DaySelector days={days} dayIndex={dayIndex} setDayIndex={setDayIndex} />
                    <Stats stats={dayStats} />
                </>
            )}
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

    const setsWinrate = ((stats?.sets.win / stats?.sets.total).toFixed(2) * 100).toFixed(0);
    const legsWinrate = ((stats?.legs.win / stats?.legs.total).toFixed(2) * 100).toFixed(0);

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

function Games({ games }) {
    const [showGameInfoModal, setShowGameInfoModal] = useState(false);

    if (!games || games?.length === 0) {
        return <Alert>No games</Alert>;
    }

    function openGameInfo(mid) {
        return () => {
            setShowGameInfoModal(mid);
        };
    }

    function closeModal() {
        setShowGameInfoModal(false);
    }

    return (
        <div>
            <GameInfoModal
                show={showGameInfoModal !== false}
                mid={showGameInfoModal}
                close={closeModal}
            />
            {games.map((game) => {
                const p1Stats = ((game.p1allScore / game.p1allDarts) * 3).toFixed(2);
                const p2Stats = ((game.p2allScore / game.p2allDarts) * 3).toFixed(2);
                const p1Winner = game.p1winLegs > game.p2winLegs;
                const p2Winner = game.p2winLegs > game.p1winLegs;

                return (
                    <GameInfo key={game.mid} onClick={openGameInfo(game.mid)}>
                        <GamePlayer winner={p1Winner}>
                            <GamePlayerLegs>{game.p1winLegs}</GamePlayerLegs>
                            <GamePlayerName>{game.p1name}</GamePlayerName>
                            <GamePlayerStats>{p1Stats}</GamePlayerStats>
                        </GamePlayer>

                        <GamePlayer winner={p2Winner}>
                            <GamePlayerLegs second>{game.p2winLegs}</GamePlayerLegs>
                            <GamePlayerName>{game.p2name}</GamePlayerName>
                            <GamePlayerStats>{p2Stats}</GamePlayerStats>
                        </GamePlayer>
                    </GameInfo>
                );
            })}
        </div>
    );
}

export function GameInfoModal({ close, mid, show }) {
    const [gameInfo, setGameInfo] = useState(null);

    useEffect(() => {
        if (show) {
            fetch(
                `${config.nakkaApiEndpoint}/n01/online/n01_history.php?cmd=history_match&mid=${mid}`
            )
                .then((data) => data.json())
                .then(setGameInfo);
        }

        return () => {
            setGameInfo(null);
        };
    }, [setGameInfo, mid, show]);

    const p1Stats = {};
    const p2Stats = {};

    if (gameInfo == null) {
        return null;
    }

    return (
        <Modal dialogClassName="XL_MODAL" show={show} fullscreen={false} onHide={close}>
            <GameInfoModalPlayers onClick={close}>
                <GameInfoModalPlayer>
                    <GamePlayerStats>{gameInfo?.statsData?.[0]?.name}</GamePlayerStats>
                    <Title>Sets</Title>
                    <StatValue>{p1Stats?.win}</StatValue>

                    <Title>Legs</Title>
                    <StatValue>{p1Stats?.win}</StatValue>

                    <hr />

                    <Title>100+</Title>
                    <StatValue>{p1Stats?.['100']}</StatValue>

                    <Title>140+</Title>
                    <StatValue>{p1Stats?.['140']}</StatValue>

                    <Title>180's</Title>
                    <StatValue>{p1Stats?.['180']}</StatValue>

                    <hr />

                    <Title>High Finish </Title>
                    <StatValue>{p1Stats?.highFinish}</StatValue>

                    <Title>Best Leg </Title>
                    <StatValue>{p1Stats?.bestLeg}</StatValue>

                    <Title>Worst Leg </Title>
                    <StatValue>{p1Stats?.worstLeg}</StatValue>
                </GameInfoModalPlayer>
                <GameInfoModalPlayer>
                    <GamePlayerStats>{gameInfo?.statsData?.[1]?.name}</GamePlayerStats>
                    <Title>Sets</Title>
                    <StatValue>{p2Stats?.win}</StatValue>

                    <Title>Legs</Title>
                    <StatValue>{p2Stats?.win}</StatValue>

                    <hr />

                    <Title>100+</Title>
                    <StatValue>{p2Stats?.['100']}</StatValue>

                    <Title>140+</Title>
                    <StatValue>{p2Stats?.['140']}</StatValue>

                    <Title>180's</Title>
                    <StatValue>{p2Stats?.['180']}</StatValue>

                    <hr />

                    <Title>High Finish </Title>
                    <StatValue>{p2Stats?.highFinish}</StatValue>

                    <Title>Best Leg </Title>
                    <StatValue>{p2Stats?.bestLeg}</StatValue>

                    <Title>Worst Leg </Title>
                    <StatValue>{p2Stats?.worstLeg}</StatValue>
                </GameInfoModalPlayer>
            </GameInfoModalPlayers>
        </Modal>
    );
}
