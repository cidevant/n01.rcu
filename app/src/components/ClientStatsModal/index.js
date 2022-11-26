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

const gameInfoEmptyStats = {
    average: 0,
    first9: 0,
    setsWin: 0,
    legsWin: 0,
    100: 0,
    140: 0,
    180: 0,
    highFinish: 0,
    bestLeg: 0,
    worstLeg: 0,
};

export function GameInfoModal({ close, mid, show }) {
    const [gameInfo, setGameInfo] = useState(null);
    const [playersStats, setPlayersStats] = useState(null);

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

    useEffect(() => {
        const stats = {
            p1: { ...gameInfoEmptyStats },
            p2: { ...gameInfoEmptyStats },
        };

        if (gameInfo != null && gameInfo?.legData?.length > 0) {
            [0, 1].forEach((playerIndex) => {
                const playerInfo = gameInfo.statsData[playerIndex];

                stats[`p${playerIndex + 1}`].average =
                    (playerInfo.allScore / playerInfo.allDarts) * 3;
            });

            gameInfo?.legData?.forEach?.((leg) => {
                const legWinnerRounds = leg.playerData[leg.winner].length;
                const lastRoundDarts = leg.playerData[leg.winner][legWinnerRounds - 1].score;
                const legWinnerDarts = (legWinnerRounds - 2) * 3 + Math.abs(lastRoundDarts);
                const winnerStatsPrefix = `p${leg.winner + 1}`;
                const prevBest = stats[winnerStatsPrefix].bestLeg;
                const prevWorst = stats[winnerStatsPrefix].worstLeg;

                stats[winnerStatsPrefix].legsWin += 1;
                stats[winnerStatsPrefix].bestLeg =
                    prevBest === 0 ? legWinnerDarts : Math.min(legWinnerDarts, prevBest);
                stats[winnerStatsPrefix].worstLeg = Math.max(legWinnerDarts, prevWorst);

                [0, 1].forEach((playerIndex) => {
                    const playerKey = `p${playerIndex + 1}`;
                    const legsLength = leg.playerData[playerIndex].length;

                    leg.playerData[playerIndex].forEach((pData, index) => {
                        if (pData.score >= 100 && pData.score <= 140) {
                            stats[playerKey]['100'] += 1;
                        } else if (pData.score >= 140 && pData.score < 180) {
                            stats[playerKey]['140'] += 1;
                        } else if (pData.score === 180) {
                            stats[playerKey]['180'] += 1;
                        }

                        if (legsLength - 1 === index && pData.score < 0) {
                            stats[playerKey].highFinish = Math.max(
                                leg?.playerData?.[playerIndex]?.[index - 1]?.left ?? 0,
                                stats[playerKey].highFinish
                            );
                        }
                    });
                });
            });

            setPlayersStats(stats);
        }

        return () => {
            setPlayersStats(null);
        };
    }, [gameInfo, setPlayersStats]);

    if (gameInfo == null) {
        return null;
    }

    return (
        <Modal dialogClassName="XL_MODAL" show={show} fullscreen={false} onHide={close}>
            <GameInfoModalPlayers onClick={close}>
                <GameInfoModalPlayer>
                    <GamePlayerStats>{gameInfo?.statsData?.[0]?.name}</GamePlayerStats>

                    <Title>Average</Title>
                    <StatValue>{playersStats?.p1?.average?.toFixed?.(2)}</StatValue>

                    {/* <Title>First 9</Title>
                    <StatValue>{playersStats?.p1?.first9?.toFixed?.(2)}</StatValue> */}
                    <hr />

                    {/* <Title>Sets</Title>
                    <StatValue>{playersStats?.p1?.setsWin}</StatValue> */}

                    <Title>Legs</Title>
                    <StatValue>{playersStats?.p1?.legsWin}</StatValue>

                    <hr />

                    <Title>100+</Title>
                    <StatValue>{playersStats?.p1?.['100']}</StatValue>

                    <Title>140+</Title>
                    <StatValue>{playersStats?.p1?.['140']}</StatValue>

                    <Title>180's</Title>
                    <StatValue>{playersStats?.p1?.['180']}</StatValue>

                    <hr />

                    <Title>High Finish </Title>
                    <StatValue>{playersStats?.p1?.highFinish}</StatValue>

                    <Title>Best Leg </Title>
                    <StatValue>{playersStats?.p1?.bestLeg}</StatValue>

                    <Title>Worst Leg </Title>
                    <StatValue>{playersStats?.p1?.worstLeg}</StatValue>
                </GameInfoModalPlayer>
                <GameInfoModalPlayer>
                    <GamePlayerStats>{gameInfo?.statsData?.[1]?.name}</GamePlayerStats>

                    <Title>Average</Title>
                    <StatValue>{playersStats?.p2?.average?.toFixed?.(2)}</StatValue>
                    {/* 
                    <Title>First 9</Title>
                    <StatValue>{playersStats?.p2?.first9?.toFixed?.(2)}</StatValue> */}
                    <hr />

                    {/* <Title>Sets</Title>
                    <StatValue>{playersStats?.p2?.setsWin}</StatValue> */}

                    <Title>Legs</Title>
                    <StatValue>{playersStats?.p2?.legsWin}</StatValue>

                    <hr />

                    <Title>100+</Title>
                    <StatValue>{playersStats?.p2?.['100']}</StatValue>

                    <Title>140+</Title>
                    <StatValue>{playersStats?.p2?.['140']}</StatValue>

                    <Title>180's</Title>
                    <StatValue>{playersStats?.p2?.['180']}</StatValue>

                    <hr />

                    <Title>High Finish </Title>
                    <StatValue>{playersStats?.p2?.highFinish}</StatValue>

                    <Title>Best Leg </Title>
                    <StatValue>{playersStats?.p2?.bestLeg}</StatValue>

                    <Title>Worst Leg </Title>
                    <StatValue>{playersStats?.p2?.worstLeg}</StatValue>
                </GameInfoModalPlayer>
            </GameInfoModalPlayers>
        </Modal>
    );
}
