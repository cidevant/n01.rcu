import { useEffect, useState, useMemo, useCallback } from 'react';
import { useData } from '../../hooks/useData';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { useGameInfo } from '../../hooks/useGameInfo';
import { isOneDartCheckout, SCORES, SCORE_LISTS } from '../../utils/game';
import { useInterval } from '../../hooks/useInterval';

export function useGameUpdater(scoreList, setScoreList) {
    const { dispatchGetData } = useData();
    const { scoreLeft } = useGameInfo();

    useInterval(() => {
        dispatchGetData();
    }, 5000);

    useEffect(() => {
        if (scoreList === SCORE_LISTS.COMMON && scoreLeft < 100) {
            setScoreList(SCORE_LISTS.OUTS);
        }
    }, [scoreLeft, scoreList, setScoreList]);
}

export function useFinishDartModal(scores) {
    const [showFinishDarts, setShowFinishDarts] = useState(false);
    const { finishDarts } = useGameInfo();

    // finish darts
    useEffect(() => {
        if (finishDarts?.length > 0) {
            setShowFinishDarts(true);
        }
    }, [finishDarts, showFinishDarts, setShowFinishDarts]);

    // close finish darts modal
    const closeFinishDartsModal = useCallback(() => {
        setShowFinishDarts(false);
    }, [setShowFinishDarts]);

    return {
        show: showFinishDarts,
        close: closeFinishDartsModal,
    };
}

export function useEndGameWatcher() {
    const navigate = useNavigate();
    const { activity } = useData();

    useEffect(() => {
        if (activity !== 'game') {
            navigate('/');
        }
    }, [activity, navigate]);
}

export function useSwipeableScoreList() {
    const { scoreLeft } = useGameInfo();
    const [scoreList, setScoreList] = useState(SCORE_LISTS.COMMON);
    const swipeScoreList = useSwipeable({
        onSwiped: (ev) => {
            if (scoreList === SCORE_LISTS.OUTS && scoreLeft < 100) {
                return;
            }

            if (ev.dir === 'Left') {
                setScoreList(SCORE_LISTS.OUTS);
            }

            if (ev.dir === 'Right') {
                setScoreList(SCORE_LISTS.COMMON);
            }
        },
    });

    return {
        scoreList,
        setScoreList,
        swipeScoreList,
    };
}

export function useScores(scoreList) {
    return SCORES[scoreList];

    // const { scoreLeft } = useGameInfo();
    // const scores = useMemo(() => {
    //     const result = [...SCORES[scoreList]];

    //     if (scoreLeft <= 180) {
    //         // result.unshift([
    //         //     {
    //         //         value: 0,
    //         //         style: 'zero',
    //         //         colspan: 3,
    //         //     },
    //         // ]);
    //         if (isOneDartCheckout(scoreLeft)) {
    //             result.push([
    //                 {
    //                     value: scoreLeft,
    //                     style: 'finish',
    //                 },
    //                 {
    //                     colspan: 2,
    //                     value: 0,
    //                     style: 'zero',
    //                 },
    //             ]);
    //         } else {
    //             result.push([
    //                 {
    //                     value: 0,
    //                     style: 'zero',
    //                 },
    //             ]);
    //         }
    //     }

    //     return result;
    // }, [scoreLeft, scoreList]);

    // return scores;
}
