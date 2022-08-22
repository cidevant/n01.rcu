import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    sendScrollBottom,
    sendFilterByAverage,
    sendStartGame,
    setFilterByAverage,
} from '../store/home.reducer';
import { useNetworkInfo } from './useNetworkInfo';
import { useGameInfo } from './useGameInfo';

export function useHomeInfo() {
    const dispatch = useDispatch();
    const [isConnected, isPaired] = useNetworkInfo();
    const { gameStarted } = useGameInfo();
    const info = useSelector((state) => state.home);
    const searchAvailable = useMemo(
        () =>
            gameStarted === false &&
            isConnected &&
            isPaired &&
            info.onSearchPage === true &&
            info.joinedSearch,
        [isConnected, isPaired, info.onSearchPage, gameStarted, info.joinedSearch]
    );

    function dispatchFilter() {
        dispatch(sendFilterByAverage(info.filter));
    }

    function dispatchSetFilter(filter) {
        dispatch(setFilterByAverage(filter));
    }

    function dispatchScrollBottom() {
        dispatch(sendScrollBottom());
    }

    function dispatchStartGame(id) {
        dispatch(sendStartGame(id));
    }

    return {
        searchAvailable,
        players: info.players,
        filter: info.filter,
        joinedSearch: info.joinedSearch,
        lastGamePlayerId: info.lastGamePlayerId,
        dispatchSetFilter,
        dispatchFilter,
        dispatchScrollBottom,
        dispatchStartGame,
    };
}

export default useHomeInfo;
