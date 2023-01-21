import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    sendScrollBottom,
    sendFilterByAverage,
    sendStartGame,
    setFilterByAverage,
    setKeepScrollingBottom,
    setStats,
    setGames,
} from '../store/home.reducer';

export function useHomeInfo() {
    const dispatch = useDispatch();
    const { players, filter, keepScrollingBottom, loading, stats, games } = useSelector(
        (state) => state.home
    );
    const dispatchFilter = useCallback(() => {
        dispatch(sendFilterByAverage(filter));
    }, [dispatch, filter]);

    function dispatchSetStats(payload) {
        dispatch(setStats(payload));
    }

    function dispatchSetGames(payload) {
        dispatch(setGames(payload));
    }
    function dispatchSetFilter(filter) {
        dispatch(setFilterByAverage(filter));
    }

    function dispatchKeepScrollingBottom(value) {
        dispatch(setKeepScrollingBottom(value));
    }

    function dispatchScrollBottom(value) {
        dispatch(sendScrollBottom(value));
    }

    function dispatchStartGame(id) {
        dispatch(sendStartGame(id));
    }

    return {
        loading,
        players,
        filter,
        keepScrollingBottom,
        stats,
        games,
        dispatchSetFilter,
        dispatchFilter,
        dispatchScrollBottom,
        dispatchStartGame,
        dispatchSetStats,
        dispatchSetGames,
        dispatchKeepScrollingBottom,
    };
}

export default useHomeInfo;
