import _ from 'lodash';

const { useState, useEffect } = require('react');
const { config } = require('../../config');
const { default: useData } = require('../../hooks/useData');
const { getAverage } = require('../../utils/stats');

export function useOpponentStats() {
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

    return {
        average,
        opponent,
    };
}
