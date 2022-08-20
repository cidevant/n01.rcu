import { useSelector, useDispatch } from 'react-redux';
import { sendInputScore } from '../store/game.reducer';
import { validInputValue } from '../utils/game';

const opponent = {};

export function useGameInfo() {
    const dispatch = useDispatch();
    const { scoreLeft, match, finishDart } = useSelector((state) => state.game);
    const gameStarted = match != null;

    function dispatchInputScore(num) {
        if (validInputValue(num, scoreLeft)) {
            dispatch(sendInputScore(num));
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
