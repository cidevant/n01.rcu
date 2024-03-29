import { FinishDartsModal } from '../../components/FinishDartsModal';
import {
    useEndGameWatcher,
    useExitGameTimeout,
    useGameUpdater,
    useScores,
    useSwipeableScoreList,
} from './hooks';
import { GameScoreList } from '../../components/GameScoreList';
import styled from 'styled-components';
import InputKeyboard from '../../components/InputKeyboard';
import ExitTimeoutModal from '../../components/ExitTimeoutModal/ExitTimeoutModal';

function Game() {
    const { scoreList, swipeScoreList, scoreSceneName } = useSwipeableScoreList();
    const scores = useScores(scoreList, scoreSceneName);
    const { show, close } = useExitGameTimeout();

    useGameUpdater();
    useEndGameWatcher();

    return (
        <>
            <Wrapper {...swipeScoreList}>
                <GameScoreList scores={scores} />
                <FinishDartsModal />
                {show && <ExitTimeoutModal close={close} />}
            </Wrapper>
            <InputKeyboard />
        </>
    );
}

export default Game;

const Wrapper = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
`;
