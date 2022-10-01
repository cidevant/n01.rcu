import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useHomeInfo from '../../hooks/useHomeInfo';
import useInterval from '../../hooks/useInterval';

export function useStartGameWatcher(activity) {
    const navigate = useNavigate();

    useEffect(() => {
        if (activity === 'game') {
            navigate('/game');
        }
    }, [activity, navigate]);
}

export function useSearchPolling(activity) {
    const { dispatchFilter, dispatchScrollBottom, keepScrollingBottom } = useHomeInfo();

    useInterval(() => {
        if (activity === 'search') {
            dispatchFilter();

            if (keepScrollingBottom) {
                dispatchScrollBottom();
            }
        }
    }, 5000);
}
