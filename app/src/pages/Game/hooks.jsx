import { useEffect, useState } from 'react';
import { useData } from '../../hooks/useData';
import { useNavigate } from 'react-router-dom';
import { useSwipeable, LEFT, RIGHT } from 'react-swipeable';
import { useGameInfo } from '../../hooks/useGameInfo';
import { isOneDartCheckout, SCORES, SCORE_LIST } from '../../utils/game';
import { useInterval } from '../../hooks/useInterval';

export function useGameUpdater(scoreList, setScoreList) {
    const { dispatchGetData } = useData();
    const { scoreLeft } = useGameInfo();

    useInterval(() => {
        dispatchGetData();
    }, 5000);

    useEffect(() => {
        if (scoreList === SCORE_LIST.COMMON && scoreLeft < 100) {
            setScoreList(SCORE_LIST.OUTS);
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

export function useSwipeableScoreList() {
    const { scoreLeft } = useGameInfo();
    const [scoreList, setScoreList] = useState(SCORE_LIST.COMMON);
    const swipeScoreList = useSwipeable({
        onSwiped: (ev) => {
            if (scoreList === SCORE_LIST.OUTS && scoreLeft < 100) {
                return;
            }

            if (ev.dir === LEFT) {
                setScoreList(SCORE_LIST.OUTS);
            }

            if (ev.dir === RIGHT) {
                setScoreList(SCORE_LIST.COMMON);
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
