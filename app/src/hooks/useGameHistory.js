import _ from 'lodash';
import { useEffect, useState } from 'react';
import { config } from '../config';

export function usePlayerGameHistory(name) {
    const [stats, setStats] = useState();
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        if (!_.isEmpty(name)) {
            setLoading(true);
            fetch(
                `${
                    config.nakkaApiEndpoint
                }/n01/online/n01_history.php?cmd=history_list&skip=0&count=10&keyword=~${encodeURIComponent(
                    `"${name}"`
                )}`
            )
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
    }, [name]);

    return {
        stats,
        loading,
    };
}
