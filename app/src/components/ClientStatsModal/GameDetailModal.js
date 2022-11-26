import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { config } from '../../config';
import {
    GameInfoModalPlayer,
    GameInfoModalPlayers,
    GamePlayerStats,
    StatValue,
    Title,
} from './index.style';

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
                                leg?.playerData?.[0]?.[index - 1]?.left ?? 0,
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
