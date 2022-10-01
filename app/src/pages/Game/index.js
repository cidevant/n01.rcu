import { FinishDartsModal } from '../../components/FinishDartsModal';
import {
    useEndGameWatcher,
    useGameHandlers,
    useGameUpdater,
    useScores,
    useSwipeableScoreList,
} from './hooks';
import { GameScoreList } from '../../components/GameScoreList';

function Game() {
    const { showFinishDarts, closeFinishDartsModal } = useGameHandlers();
    const { scoreList, swipeScoreList, setScoreList } = useSwipeableScoreList();
    const scores = useScores(scoreList);

    useEndGameWatcher();
    useGameUpdater(scoreList, setScoreList);

    return (
        <>
            <GameScoreList scores={scores} swipeHandlers={swipeScoreList} />
            <FinishDartsModal show={showFinishDarts} close={closeFinishDartsModal} />
        </>
    );
}

export default Game;
