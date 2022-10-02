import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    sendScrollBottom,
    sendFilterByAverage,
    sendStartGame,
    setFilterByAverage,
    setKeepScrollingBottom,
    setStats,
} from '../store/home.reducer';

export function useHomeInfo() {
    const dispatch = useDispatch();
    const { players, filter, keepScrollingBottom, loading, stats } = useSelector(
        (state) => state.home
    );
    const dispatchFilter = useCallback(() => {
        dispatch(sendFilterByAverage(filter));
    }, [dispatch, filter]);

    function dispatchSetStats(payload) {
        dispatch(setStats(payload));
    }

    function dispatchSetFilter(filter) {
        dispatch(setFilterByAverage(filter));
    }

    function dispatchKeepScrollingBottom(value) {
        dispatch(setKeepScrollingBottom(value));
    }

    function dispatchScrollBottom() {
        dispatch(sendScrollBottom());
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
        dispatchSetFilter,
        dispatchFilter,
        dispatchScrollBottom,
        dispatchStartGame,
        dispatchSetStats,
        dispatchKeepScrollingBottom,
    };
}

export default useHomeInfo;
