import { useEffect, useState, useMemo, useCallback } from 'react';
import { useData } from '../../hooks/useData';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { useGameInfo } from '../../hooks/useGameInfo';
import { isOneDartCheckout } from '../../utils/game';
import { useInterval } from '../../hooks/useInterval';
import { SCORES_COMMON, SCORES_OUTS } from '../../utils/game';

export function useEndGameWatcher() {
    const navigate = useNavigate();
    const { activity } = useData();

    useEffect(() => {
        if (activity !== 'game') {
            navigate('/');
        }
    }, [activity, navigate]);
}

export function useGameUpdater() {
    const { dispatchGetData } = useData();

    useInterval(() => {
        dispatchGetData();
    }, 5000);
}

export function useGameHandlers(scores) {
    const [showFinishDarts, setShowFinishDarts] = useState(false);
    const { finishDarts, scoreLeft } = useGameInfo();

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
        showFinishDarts,
        closeFinishDartsModal,
    };
}
function getScoresByPage(scoreList) {
    if (scoreList === 'outs') {
        return SCORES_OUTS;
    }

    return SCORES_COMMON;
}

export function useScores(scoreList) {
    const { scoreLeft } = useGameInfo();
    const scores = useMemo(() => {
        const result = [...getScoresByPage(scoreList)];

        if (scoreLeft <= 180) {
            if (isOneDartCheckout(scoreLeft)) {
                result.push([
                    {
                        value: scoreLeft,
                        style: 'finish',
                    },
                    {
                        colspan: 2,
                        value: 0,
                        style: 'zero',
                    },
                ]);
            } else {
                result.push([
                    {
                        value: 0,
                        style: 'zero',
                    },
                ]);
            }
        }

        return result;
    }, [scoreLeft, scoreList]);

    return scores;
}

export function useSwipeableScoreList() {
    const [scoreList, setScoreList] = useState('common');
    const changeScoreList = useSwipeable({
        onSwiped: (ev) => {
            if (ev.dir === 'Left') {
                setScoreList('outs');
            }

            if (ev.dir === 'Right') {
                setScoreList('common');
            }
        },
    });

    return {
        scoreList,
        changeScoreList,
    };
}
