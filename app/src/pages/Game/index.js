import { FinishDartsModal } from '../../components/FinishDartsModal';
import {
    useEndGameWatcher,
    useFinishDartModal,
    useGameUpdater,
    useScores,
    useSwipeableScoreList,
} from './hooks';
import { GameScoreList } from '../../components/GameScoreList';

function Game() {
    const { show, close } = useFinishDartModal();
    const { scoreList, swipeScoreList, setScoreList } = useSwipeableScoreList();
    const scores = useScores(scoreList);

    useEndGameWatcher();
    useGameUpdater(scoreList, setScoreList);

    return (
        <>
            <GameScoreList scores={scores} swipeHandlers={swipeScoreList} />
            <FinishDartsModal show={show} close={close} />
        </>
    );
}

export default Game;
