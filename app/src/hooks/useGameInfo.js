import { useSelector, useDispatch } from 'react-redux';
import { sendInputScore } from '../store/game.reducer';
import { validInputValue } from '../utils/game';
import { useNetworkInfo } from './useNetworkInfo';

const opponent = {};

export function useGameInfo() {
    const dispatch = useDispatch();
    const [isConnected, isPaired] = useNetworkInfo();
    const { scoreLeft, match, finishDart } = useSelector((state) => state.game);
    const gameStarted =
        isConnected && isPaired && match != null && scoreLeft != null && scoreLeft >= 0;

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
