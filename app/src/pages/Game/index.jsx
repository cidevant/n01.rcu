import { FinishDartsModal } from '../../components/FinishDartsModal';
import { useEndGameWatcher, useGameHandlers, useGameUpdater } from './hooks';
import { SCORES } from '../../utils/game';
import { GameScoreList } from '../../components/GameScoreList';

function Game() {
    useEndGameWatcher();
    useGameUpdater();

    const { scoresList, longPressHandlers, showFinishDarts, closeFinishDartsModal } =
        useGameHandlers(SCORES);

    return (
        <>
            <GameScoreList scores={scoresList} longPressHandlers={longPressHandlers} />
            <FinishDartsModal show={showFinishDarts} close={closeFinishDartsModal} />
        </>
    );
}

export default Game;
