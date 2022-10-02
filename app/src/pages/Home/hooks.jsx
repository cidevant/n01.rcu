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
        if (prevStatsId.current !== statsId) {
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
        );
}
