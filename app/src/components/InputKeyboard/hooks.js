import _ from 'lodash';
import { usePlayerGameHistory } from '../../hooks/useGameHistory';
import { useState, useEffect } from 'react';
import { getAverage } from '../../utils/stats';

export function useOpponentAverage(name) {
    const [opponentStats, setOpponentStats] = useState();
    const { stats } = usePlayerGameHistory(name);

    useEffect(() => {
        if (!_.isEmpty(stats)) {
            setOpponentStats(
                stats?.reduce(
                    (acc, stat) => {
                        const isP1 = stat.p1name === name;
                        const isP2 = stat.p2name === name;

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
                )
            );
        }
    }, [stats, name]);

    return {
        average: getAverage(opponentStats?.score, opponentStats?.darts),
    };
}
