import { useRef, useState, useEffect, useCallback } from 'react';

export default function useLongPress(callback = () => {}, releaseCallback = () => {}, ms = 300) {
    const [startLongPress, setStartLongPress] = useState(false);
    const ref = useRef();

    useEffect(() => {
        let timerId;

        if (startLongPress && ref.current != null) {
            timerId = setTimeout(() => {
                ref.current.target.classList.add('ok');
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

    const start = useCallback((e) => {
        ref.current = e;
        setStartLongPress(true);
    }, []);

    const stop = useCallback((e) => {
        releaseCallback?.(e);
        setStartLongPress(false);
    }, []);

    return {
        onMouseDown: start,
        onMouseUp: stop,
        onMouseLeave: stop,
        onTouchStart: start,
        onTouchEnd: stop,
    };
}
