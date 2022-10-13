import { useEffect, useState } from 'react';
import { useData } from '../../hooks/useData';
import { useNavigate } from 'react-router-dom';
import { useSwipeable, LEFT, RIGHT } from 'react-swipeable';
import { useGameInfo } from '../../hooks/useGameInfo';
import { isOneDartCheckout, SCORES, SCORES_LIST } from '../../utils/game';
import { useInterval } from '../../hooks/useInterval';
import { useMemo } from 'react';

/**
 * Polls game info and switches SCORES_LIST if score is less than 100
 *
 * @export
 * @param {*} scoreList
 * @param {*} setScoreList
 */
export function useGameUpdater(scoreList, setScoreList) {
    const { dispatchGetData } = useData();
    const { scoreLeft } = useGameInfo();

    useInterval(() => {
        dispatchGetData();
    }, 5000);

    useEffect(() => {
        if (scoreList === SCORES_LIST.COMMON && scoreLeft < 100) {
            setScoreList(SCORES_LIST.OUTS);
        } else if (scoreList === SCORES_LIST.OUTS && scoreLeft === 501) {
            setScoreList(SCORES_LIST.COMMON);
        }
    }, [scoreLeft, scoreList, setScoreList]);
}

/**
 * Watches when game is finished
 *
 * @export
 */
export function useEndGameWatcher() {
    const navigate = useNavigate();
    const { activity } = useData();

    useEffect(() => {
        if (activity !== 'game') {
            navigate('/');
        }
    }, [activity, navigate]);
}

/**
 * Swiping gesture handlers to change SCORES_LIST
 *
 * @export
 * @returns {*}
 */
export function useSwipeableScoreList() {
    const { scoreLeft } = useGameInfo();
    const [scoreList, setScoreList] = useState(SCORES_LIST.COMMON);
    const swipeScoreList = useSwipeable({
        onSwiped: (ev) => {
            if (scoreList === SCORES_LIST.OUTS && scoreLeft < 100) {
                return;
            }

            if (ev.dir === LEFT) {
                setScoreList(SCORES_LIST.OUTS);
            }

            if (ev.dir === RIGHT) {
                setScoreList(SCORES_LIST.COMMON);
            }
        },
    });

    return {
        scoreList,
        setScoreList,
        swipeScoreList,
    };
}

/**
 * Returns scores based on current SCORES_LIST
 *
 * @export
 * @param {*} scoreList
 * @returns {Array<any>}
 */
export function useScores(scoreList) {
    // return SCORES[scoreList];

    const { scoreLeft } = useGameInfo();
    const scores = useMemo(() => {
        const result = [...SCORES[scoreList]];

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
