import { useEffect } from 'react';

export const useViewportHeight = () => {
    useEffect(() => {
        const setVH = () => {
            const vh = window.visualViewport?.height || window.innerHeight;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVH();

        window.addEventListener('resize', setVH);
        window.visualViewport?.addEventListener('resize', setVH);

        return () => {
            window.removeEventListener('resize', setVH);
            window.visualViewport?.removeEventListener('resize', setVH);
        };
    }, []);
};