import { useEffect } from 'react';

// Contador global para suportar múltiplos overlays sobrepostos
let lockCount = 0;
let savedScrollY = 0;

/**
 * Hook to lock body scroll when a modal is open.
 * Re-entrant: multiple overlays can call this simultaneously without conflicts.
 */
export const useScrollLock = (lock = true) => {
    useEffect(() => {
        if (!lock) return;

        lockCount++;

        if (lockCount === 1) {
            // Primeiro a travar — captura posição atual
            savedScrollY = window.scrollY;
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

            document.body.style.position = 'fixed';
            document.body.style.top = `-${savedScrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
            document.documentElement.classList.add('modal-open');
        }

        return () => {
            lockCount--;

            if (lockCount === 0) {
                // Último a liberar — restaura estado
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                document.documentElement.classList.remove('modal-open');
                window.scrollTo(0, savedScrollY);
            }
        };
    }, [lock]);
};
