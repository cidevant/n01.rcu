import { useSelector } from 'react-redux';

export function useGameInfo() {
    const { match, scoreLeft, finishDart } = useSelector((state) => state.game);
    const gameStarted = match != null;
    const opponent = {};

    return [gameStarted, opponent, scoreLeft, finishDart];
}
