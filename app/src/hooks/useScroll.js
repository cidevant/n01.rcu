import { useState, useEffect } from 'react';

export default function useScroll() {
    const [scrollTop, setScrollTop] = useState(0);
    const listenToScroll = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

        setScrollTop(winScroll);
    };

    useEffect(() => {
        window.addEventListener('scroll', listenToScroll);

        return () => window.removeEventListener('scroll', listenToScroll);
    }, []);

    return [scrollTop];
}
