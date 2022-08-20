import { useSelector, useDispatch } from 'react-redux';
import { sendInputScore } from '../store/game.reducer';
import { validInputValue } from '../utils/game';

export function useGameInfo() {
    const dispatch = useDispatch();
    const { scoreLeft, match, finishDart } = useSelector((state) => state.game);
    const gameStarted = match != null;
    const opponent = {};

    function dispatchInputScore(val) {
        if (validInputValue(val, scoreLeft)) {
            dispatch(sendInputScore(val));
        }
    }

    return {
        gameStarted,
        opponent,
        scoreLeft,
        finishDart,
        match,
        dispatchInputScore,
    };
}
