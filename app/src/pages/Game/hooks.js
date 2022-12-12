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
export function useGameUpdater() {
    const { dispatchGetData } = useData();

    useInterval(() => {
        dispatchGetData();
    }, 5000);
}

/**
 * Watches when game is finished
 *
 * @export
 */
export function useEndGameWatcher() {
    const navigate = useNavigate();
    const { page } = useData();

    useEffect(() => {
        if (page !== 'game') {
            navigate('/');
        }
    }, [page, navigate]);
}
/**
 * Watches when game is finished
 *
 * @export
 */
export function useExitGameTimeout() {
    const { activity } = useData();
    const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);

    function close() {
        setShowTimeoutDialog(false);
    }

    useEffect(() => {
        if (activity !== 'game') {
            setShowTimeoutDialog(true);
        }
    }, [activity]);

    return {
        show: showTimeoutDialog,
        close,
    };
}

const SCORES_SEQUENCE = Object.values(SCORES_LIST);
const SCORES_SEQUENCE_LAST_INDEX = SCORES_SEQUENCE.length - 1;

/**
 * Swiping gesture handlers to change SCORES_LIST
 *
 * @export
 * @returns {*}
 */
export function useSwipeableScoreList() {
    const [scoreList, setScoreList] = useState(1);
    const swipeScoreList = useSwipeable({
        onSwiped: (ev) => {
            if (ev.dir === LEFT && scoreList < SCORES_SEQUENCE_LAST_INDEX) {
                setScoreList(scoreList + 1);
            }

            if (ev.dir === RIGHT && scoreList > 0) {
                setScoreList(scoreList - 1);
            }
        },
    });

    return {
        scoreList: SCORES_LIST[SCORES_SEQUENCE[scoreList]],
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

        if (scoreLeft <= 170) {
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
            // if (isOneDartCheckout(scoreLeft)) {
            //     result.push([
            //         {
            //             value: scoreLeft,
            //             style: 'finish',
            //         },
            //         {
            //             colspan: 2,
            //             value: 0,
            //             style: 'zero',
            //         },
            //     ]);
            // } else {
            //     result.push([
            //         {
            //             colspan: 3,
            //             value: 0,
            //             style: 'zero',
            //         },
            //     ]);
            // }
        }

        return result;
    }, [scoreLeft, scoreList]);

    return scores;
}
