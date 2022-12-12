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
export function useStartGameWatcher(page) {
    const navigate = useNavigate();

    useEffect(() => {
        if (page === 'game') {
            navigate('/game');
        }
    }, [page, navigate]);
}

/**
 * Searches for opponents each 5 seconds
 *
 * @export
 * @param {*} activity
 */
export function useSearchPolling(activity) {
    const { dispatchFilter, dispatchScrollBottom, keepScrollingBottom, filter } = useHomeInfo();
    const updateInterval =
        filter?.updateInterval > 0 && filter?.updateInterval < 1000
            ? filter?.updateInterval * 1000
            : 5000;

    useInterval(() => {
        if (activity === 'search') {
            dispatchFilter();

            if (keepScrollingBottom) {
                dispatchScrollBottom();
            }
        }
    }, updateInterval);
}

/**
 * Fetches stats when enough info about user
 *
 * @export
 */
export function useStats() {
    const prevStatsId = useRef();
    const { dispatchSetStats, dispatchSetGames } = useHomeInfo();
    const { player } = useData();
    const userId = useMemo(() => {
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
        if (!_.isEmpty(userId) && prevStatsId.current !== userId) {
            fetch(`${config.nakkaApiEndpoint}/n01/online/n01_stats.php?cmd=stats_list&${userId}`)
                .then((data) => data.json())
                .then(dispatchSetStats);

            fetch(
                `${config.nakkaApiEndpoint}/n01/online/n01_history.php?cmd=history_list&skip=0&count=100&${userId}`
            )
                .then((data) => data.json())
                .then(dispatchSetGames);

            prevStatsId.current = userId;
        }
    }, [userId, prevStatsId, dispatchSetStats, dispatchSetGames]);
}
