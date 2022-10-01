import { FinishDartsModal } from '../../components/FinishDartsModal';
import { useEndGameWatcher, useGameUpdater, useScores, useSwipeableScoreList } from './hooks';
import { GameScoreList } from '../../components/GameScoreList';

function Game() {
    const { scoreList, swipeScoreList, setScoreList } = useSwipeableScoreList();
    const scores = useScores(scoreList);

    useGameUpdater(scoreList, setScoreList);
    useEndGameWatcher();

    return (
        <>
            <GameScoreList scores={scores} swipeHandlers={swipeScoreList} />
            <FinishDartsModal />
        </>
    );
}

export default Game;
