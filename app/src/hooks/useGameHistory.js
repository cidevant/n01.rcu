import _ from 'lodash';
import { useEffect, useState, useMemo } from 'react';
import { config } from '../config';
import useData from './useData';

export function usePlayerId() {
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

    return userId;
}

export function usePlayerGameHistory(name, withPlayer) {
    const [stats, setStats] = useState();
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        if (!_.isEmpty(name)) {
            const withPlayerUrl = withPlayer == null ? '' : `&${withPlayer}`;
            const url = `${
                config.nakkaApiEndpoint
            }/n01/online/n01_history.php?cmd=history_list&skip=0&count=10${withPlayerUrl}&keyword=~${encodeURIComponent(
                `${name}`
            )}`;

            setLoading(true);
            fetch(url)
                .then((data) => data.json())
                .then((data) => {
                    setStats(
                        data.filter(
                            (game) => name.includes(game.p1name) || name.includes(game.p2name)
                        )
                    );
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        return () => {
            setStats(null);
            setLoading(null);
        };
    }, [name, withPlayer]);

    return {
        stats,
        loading,
    };
}
