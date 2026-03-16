import { useEffect } from 'react';

/**
 * Hook to lock body scroll when a modal is open.
 * Uses a standardized pattern to avoid conflicts between multiple modals.
 */
export const useScrollLock = (lock = true) => {
    useEffect(() => {
        if (!lock) return;

        const originalStyle = window.getComputedStyle(document.body).overflow;
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        const scrollY = window.scrollY;

        // Lock scroll
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollBarWidth}px`;
        document.documentElement.classList.add('modal-open');

        // iOS specific top-jumping fix if needed
        // document.body.style.position = 'fixed';
        // document.body.style.top = `-${scrollY}px`;
        // document.body.style.width = '100%';

        return () => {
            // Restore scroll
            document.body.style.overflow = originalStyle;
            document.body.style.paddingRight = '0';
            document.documentElement.classList.remove('modal-open');

            // if (document.body.style.position === 'fixed') {
            //   document.body.style.position = '';
            //   document.body.style.top = '';
            //   window.scrollTo(0, scrollY);
            // }
        };
    }, [lock]);
};
