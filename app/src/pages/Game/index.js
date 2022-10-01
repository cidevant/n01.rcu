import { FinishDartsModal } from '../../components/FinishDartsModal';
import { useEndGameWatcher, useGameUpdater, useScores, useSwipeableScoreList } from './hooks';
import { GameScoreList } from '../../components/GameScoreList';

function Game() {
    const { scoreList, swipeScoreList, setScoreList } = useSwipeableScoreList();
    const scores = useScores(scoreList);

    useEndGameWatcher();
    useGameUpdater(scoreList, setScoreList);

    return (
        <>
            <GameScoreList scores={scores} swipeHandlers={swipeScoreList} />
            <FinishDartsModal />
        </>
    );
}

export default Game;
