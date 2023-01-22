import { useSelector, useDispatch } from 'react-redux';
import {
    sendInputScore,
    setFinishDarts,
    exitGame,
    toggleStats,
    refreshPage,
} from '../store/game.reducer';
import { validInputValue } from '../utils/game';

export function useGameInfo() {
    const dispatch = useDispatch();
    const { scoreLeft, finishDarts } = useSelector((state) => state.game);
    const currentPlayer = useSelector(
        (state) => state.client?.data?.game?.leg?.currentPlayer ?? -1
    );
    const playerIndex = useSelector((state) => state.client?.data?.game?.playerIndex ?? -2);

    function dispatchInputScore(num) {
        if (validInputValue(num, scoreLeft)) {
            dispatch(sendInputScore(num));
        }
    }

    function dispatchSetFinishDarts(id) {
        dispatch(setFinishDarts(id));
    }

    function dispatchExitGame() {
        dispatch(exitGame());
    }

    function dispatchToggleStats() {
        dispatch(toggleStats());
    }

    function dispatchRefreshPage() {
        dispatch(refreshPage());
    }

    return {
        scoreLeft,
        // scoreLeft: 332,
        finishDarts,
        currentPlayer,
        playerIndex,
        dispatchInputScore,
        dispatchToggleStats,
        dispatchRefreshPage,
        dispatchSetFinishDarts,
        dispatchExitGame,
    };
}

export default useGameInfo;
