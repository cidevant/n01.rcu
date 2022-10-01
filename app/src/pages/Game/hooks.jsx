import { useEffect, useState, useMemo, useCallback } from 'react';
import { useData } from '../../hooks/useData';
import { useNavigate } from 'react-router-dom';
import { useGameInfo } from '../../hooks/useGameInfo';
import { useLongPress } from '../../hooks/useLongPress';
import { isOneDartCheckout } from '../../utils/game';
import { useInterval } from '../../hooks/useInterval';

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

    // list of scores
    const scoresList = useMemo(() => {
        const result = [...scores];

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
    }, [scoreLeft, scores]);

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
        scoresList,
        showFinishDarts,
        closeFinishDartsModal,
    };
}
