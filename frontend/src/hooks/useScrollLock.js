import { useEffect } from 'react';

/**
 * Hook to lock body scroll when a modal is open.
 * Uses a standardized pattern to avoid conflicts between multiple modals.
 */
export const useScrollLock = (lock = true) => {
    useEffect(() => {
        if (!lock) return;

        const scrollY = window.scrollY;
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

        // Lock: fix position so the page doesn't jump on any browser/OS
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollBarWidth}px`;
        document.documentElement.classList.add('modal-open');

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            document.documentElement.classList.remove('modal-open');
            // Restore exact scroll position
            window.scrollTo(0, scrollY);
        };
    }, [lock]);
};
