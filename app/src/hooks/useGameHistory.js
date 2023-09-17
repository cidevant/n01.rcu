import _ from 'lodash';
import { useEffect, useState, useMemo, useCallback } from 'react';
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

    function search(_name) {
        if (!_.isEmpty(_name)) {
            const withPlayerUrl = withPlayer == null ? '' : `&${withPlayer}`;
            const url = `${
                config.nakkaApiEndpoint
            }/n01/online/n01_history.php?cmd=history_list&skip=0&count=10${withPlayerUrl}&keyword=~${encodeURIComponent(
                `${_name}`
            )}`;

            setLoading(true);
            fetch(url)
                .then((data) => data.json())
                .then((data) => {
                    const filtered =
                        withPlayerUrl == null
                            ? data.filter(
                                  (game) =>
                                      _name.includes(game.p1name) || _name.includes(game.p2name)
                              )
                            : data;

                    setStats(filtered);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }

    useEffect(() => {
        search(name);

        return () => {
            setStats(null);
            setLoading(null);
        };
    }, []);

    return {
        stats,
        loading,
        search,
    };
}
