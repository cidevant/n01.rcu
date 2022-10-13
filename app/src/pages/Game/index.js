import { FinishDartsModal } from '../../components/FinishDartsModal';
import { useEndGameWatcher, useGameUpdater, useScores, useSwipeableScoreList } from './hooks';
import { GameScoreList } from '../../components/GameScoreList';
import { SCORES_LIST } from '../../utils/game';
import styled from 'styled-components';
import useData from '../../hooks/useData';
import { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { config } from '../../config';
import { getAverage } from '../../utils/stats';

function Game() {
    const { scoreList, swipeScoreList, setScoreList } = useSwipeableScoreList();
    const scores = useScores(scoreList);

    useGameUpdater(scoreList, setScoreList);
    useEndGameWatcher();

    return (
        <Wrapper {...swipeScoreList}>
            <GameScoreList scores={scores} />
            {scoreList === SCORES_LIST.COMMON && <Opponent />}
            <FinishDartsModal />
        </Wrapper>
    );
}

export default Game;

function Opponent() {
    const { game } = useData();
    const [opponentStats, setOpponentStats] = useState();
    const opponent = game?.opponent;

    useEffect(() => {
        if (!_.isEmpty(opponent?.name)) {
            fetch(
                `${
                    config.nakkaApiEndpoint
                }/n01/online/n01_history.php?cmd=history_list&skip=0&count=60&keyword=~${encodeURIComponent(
                    `"${opponent?.name}"`
                )}`
            )
                .then((data) => data.json())
                .then((data) => {
                    const stats = data?.reduce(
                        (acc, stat) => {
                            const isP1 = stat.p1name === opponent?.name;
                            const isP2 = stat.p2name === opponent?.name;

                            if (isP1 || isP2) {
                                const key = isP1 ? 'p1' : 'p2';

                                acc.score += stat[`${key}allScore`];
                                acc.darts += stat[`${key}allDarts`];
                            }

                            return acc;
                        },
                        {
                            score: 0,
                            darts: 0,
                        }
                    );

                    setOpponentStats(stats);
                });
        }
    }, [opponent?.name]);

    const average = getAverage(opponentStats?.score, opponentStats?.darts);

    return (
        <OpponentName>
            {opponent?.name} ({average?.toFixed?.(2)})
        </OpponentName>
    );
}

const OpponentName = styled.div`
    text-align: center;
    font-size: 40px;
    font-weight: bold;
    margin-top: 30px;
`;

const Wrapper = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
`;
