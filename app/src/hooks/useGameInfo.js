import { useSelector, useDispatch } from 'react-redux';
import { sendInputScore, setFinishDarts } from '../store/game.reducer';
import { validInputValue } from '../utils/game';
import { useNetworkInfo } from './useNetworkInfo';

const opponent = {};

export function useGameInfo() {
    const dispatch = useDispatch();
    const [isConnected, isPaired] = useNetworkInfo();
    const { scoreLeft, match, finishDarts } = useSelector((state) => state.game);
    const gameStarted = isConnected && isPaired && match != null && scoreLeft >= 0;

    function dispatchInputScore(num) {
        if (validInputValue(num, scoreLeft)) {
            dispatch(sendInputScore(num));
        }
    }

    function dispatchSetFinishDarts(id) {
        dispatch(setFinishDarts(id));
    }

    // return {
    //     gameStarted: true,
    //     opponent,
    //     scoreLeft: 33,
    //     finishDarts,
    //     match: {},
    //     dispatchInputScore,
    //     dispatchSetFinishDarts,
    // };

    return {
        gameStarted,
        opponent,
        scoreLeft,
        finishDarts,
        match,
        dispatchInputScore,
        dispatchSetFinishDarts,
    };
}
