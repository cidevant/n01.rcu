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
    const { scoreList, changeScoreList } = useSwipeableScoreList();
    const scores = useScores(scoreList);

    useEndGameWatcher();
    useGameUpdater();

    return (
        <>
            <GameScoreList scores={scores} swipeHandlers={changeScoreList} />
            <FinishDartsModal show={showFinishDarts} close={closeFinishDartsModal} />
        </>
    );
}

export default Game;
