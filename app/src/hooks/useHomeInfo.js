import { useSelector, useDispatch } from 'react-redux';
import { sendScrollBottom, sendFilterByAverage, sendStartGame } from '../store/home.reducer';
import { useNetworkInfo } from './useNetworkInfo';
import { useGameInfo } from './useGameInfo';

export function useHomeInfo() {
    const dispatch = useDispatch();
    const [isConnected, isPaired] = useNetworkInfo();
    const { gameStarted } = useGameInfo();
    const info = useSelector((state) => state.home);
    const searchAvailable =
        isConnected && isPaired && info.onSearchPage === true && gameStarted === false;

    function dispatchFilter(filter) {
        dispatch(sendFilterByAverage(filter ? filter : info.filter));
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
        lastGamePlayerId: info.lastGamePlayerId,
        dispatchFilter,
        dispatchScrollBottom,
        dispatchStartGame,
    };
}

export default useHomeInfo;
