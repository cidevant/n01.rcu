import { useState, useEffect } from 'react';

export default function useHideOnScroll(heightToHideFrom = 200) {
    const [visibility, setIsVisible] = useState(true);
    const listenToScroll = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

        if (winScroll > heightToHideFrom) {
            visibility && setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', listenToScroll);

        return () => window.removeEventListener('scroll', listenToScroll);
    }, []);

    return [visibility];
}
