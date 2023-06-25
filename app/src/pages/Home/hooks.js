import _ from 'lodash';
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../../config';
import useData from '../../hooks/useData';
import useHomeInfo from '../../hooks/useHomeInfo';
import { usePlayerId } from '../../hooks/useGameHistory';

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

    useEffect(() => {
        if (activity === 'search') {
            dispatchFilter(filter);
            dispatchScrollBottom(keepScrollingBottom);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activity]);
}

/**
 * Fetches stats when enough info about user
 *
 * @export
 */
export function useStats() {
    const prevStatsId = useRef();
    const { dispatchSetStats, dispatchSetGames } = useHomeInfo();
    const userId = usePlayerId();

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
