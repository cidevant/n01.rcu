import _ from 'lodash';
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../../config';
import useData from '../../hooks/useData';
import useHomeInfo from '../../hooks/useHomeInfo';
import useInterval from '../../hooks/useInterval';

/**
 * Watches game start and redirects to game page
 *
 * @export
 * @param {*} activity
 */
export function useStartGameWatcher(activity) {
    const navigate = useNavigate();

    useEffect(() => {
        if (activity === 'game') {
            navigate('/game');
        }
    }, [activity, navigate]);
}

/**
 * Searches for opponents each 5 seconds
 *
 * @export
 * @param {*} activity
 */
export function useSearchPolling(activity) {
    const { dispatchFilter, dispatchScrollBottom, keepScrollingBottom } = useHomeInfo();

    useInterval(() => {
        if (activity === 'search') {
            dispatchFilter();

            if (keepScrollingBottom) {
                dispatchScrollBottom();
            }
        }
    }, 5000);
}

/**
 * Fetches stats when we have enough info about user
 *
 * @export
 */
export function useStats() {
    const prevStatsId = useRef();
    const { dispatchSetStats } = useHomeInfo();
    const { player } = useData();
    const statsId = useMemo(() => {
        if (player?.fid) {
            return `fid=${player.fid}`;
        }

        if (player?.gid) {
            return `gid=${player.gid}`;
        }

        if (player?.tid) {
            return `tid=${player.tid}`;
        }

        return null;
    }, [player]);

    useEffect(() => {
        if (!_.isEmpty(statsId) && prevStatsId.current !== statsId) {
            fetchStats(statsId).then(dispatchSetStats);

            prevStatsId.current = statsId;
        }
    }, [statsId, prevStatsId, dispatchSetStats]);
}

function fetchStats(id) {
    return fetch(`${config.nakkaApiEndpoint}/n01/online/n01_stats.php?cmd=stats_list&${id}`)
        .then((data) => data.json())
        .then((data) =>
            data.filter((game) => {
                const start = new Date(1664644619000);
                const end = new Date(1664644619000);
                const gameTime = game.time * 1000;

                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);

                return gameTime >= start.getTime() && gameTime <= end.getTime();
            })
        )
        .then((stats) => {
            if (_.isArray(stats) && !_.isEmpty(stats)) {
                return stats.reduce(
                    (acc, game, index) => {
                        const f9Score = (game.f9s / game.f9d) * 3;
                        const score = (game.score / game.darts) * 3;

                        acc.highFinish = Math.max(acc.highFinish, game.ho);
                        acc.bestLeg = Math.min(acc.bestLeg, game.bst);
                        acc.worstLeg = Math.max(acc.worstLeg, game.wst);
                        acc['100'] += game.t00;
                        acc['140'] += game.t40;
                        acc['180'] += game.t80;

                        acc.sets.win += Math.round(game.leg / 2) >= game.win;
                        acc.sets.total += 1;
                        acc.legs.win += game.win;
                        acc.legs.total += game.leg;

                        return acc;
                    },
                    {
                        date: Date.now(),
                        sets: {
                            win: 0,
                            total: 0,
                        },
                        legs: {
                            win: 0,
                            total: 0,
                        },
                        100: 0,
                        140: 0,
                        180: 0,
                        highFinish: 0,
                        bestLeg: 0,
                        worstLeg: 0,
                        score: 0,
                        f9Score: 0,
                    }
                );
            }

            return null;
        });
}
