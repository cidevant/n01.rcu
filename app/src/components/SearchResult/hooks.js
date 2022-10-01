import useHomeInfo from '../../hooks/useHomeInfo';

import { useState, useEffect } from 'react';

export function useLoadingSpinner() {
    const { loading } = useHomeInfo();
    const [showSpinner, setShowSpinner] = useState(loading);

    useEffect(() => {
        let timeout;

        if (loading) {
            setShowSpinner(true);
        } else {
            timeout = setTimeout(() => {
                setShowSpinner(false);
            }, 800);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [loading]);

    return showSpinner;
}
