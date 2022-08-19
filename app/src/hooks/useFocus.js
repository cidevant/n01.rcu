import { useRef } from 'react';

export function useFocus() {
    const htmlElRef = useRef(null);

    function setFocus() {
        htmlElRef.current && htmlElRef.current.focus();
    }

    return [htmlElRef, setFocus];
}
