import React, { useState } from 'react';
import { FinishDartsModal } from '../../components/FinishDartsModal';
import { useEndGameWatcher, useGameHandlers, useGameUpdater } from './hooks';
import { SCORES_COMMON, SCORES_OUTS } from '../../utils/game';
import { GameScoreList } from '../../components/GameScoreList';
import { useSwipeable } from 'react-swipeable';

function getScoresByPage(page) {
    if (page === 'outs') {
        return SCORES_OUTS;
    }

    return SCORES_COMMON;
}

function Game() {
    useEndGameWatcher();
    useGameUpdater();

    const [scorePage, setScorePage] = useState('common');
    const scores = getScoresByPage(scorePage);

    const { scoresList, longPressHandlers, showFinishDarts, closeFinishDartsModal } =
        useGameHandlers(scores);

    const handlers = useSwipeable({
        onSwiped: (ev) => {
            if (ev.dir === 'Left' && scorePage === 'common') {
                setScorePage('outs');
            }

            if (ev.dir === 'Right' && scorePage === 'outs') {
                setScorePage('common');
            }
        },
    });

    return (
        <>
            <GameScoreList
                scores={scoresList}
                handlers={handlers}
                longPressHandlers={longPressHandlers}
            />
            <FinishDartsModal show={showFinishDarts} close={closeFinishDartsModal} />
        </>
    );
}

export default Game;
