import { useSelector, useDispatch } from 'react-redux';
import { sendInputScore, setFinishDarts, exitGame } from '../store/game.reducer';
import { validInputValue } from '../utils/game';

export function useGameInfo() {
    const dispatch = useDispatch();
    const { scoreLeft, finishDarts } = useSelector((state) => state.game);

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

    return {
        scoreLeft,
        // scoreLeft: 332,
        finishDarts,
        dispatchInputScore,
        dispatchSetFinishDarts,
        dispatchExitGame,
    };
}

export default useGameInfo;
