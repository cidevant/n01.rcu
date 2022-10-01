import { useRef, useState, useEffect, useCallback } from 'react';

export function useLongPress(callback = () => {}, releaseCallback = () => {}, ms = 300) {
    const ref = useRef();
    const [startLongPress, setStartLongPress] = useState(false);
    const start = useCallback((e) => {
        ref.current = e;
        setStartLongPress(true);
    }, []);
    const stop = useCallback(
        (e) => {
            releaseCallback?.(e);
            setStartLongPress(false);
        },
        [releaseCallback]
    );

    useEffect(() => {
        let timerId;

        if (startLongPress && ref.current != null) {
            timerId = setTimeout(() => {
                callback(ref.current);
                ref.current = null;
            }, ms);
        } else {
            clearTimeout(timerId);
        }

        return () => {
            clearTimeout(timerId);
        };
    }, [callback, ms, startLongPress]);

    return {
        onMouseDown: start,
        onMouseUp: stop,
        onMouseLeave: stop,
        onTouchStart: start,
        onTouchEnd: stop,
    };
}

export default useLongPress;
