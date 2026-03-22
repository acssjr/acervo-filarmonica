// ===== usePressAnimation =====
// Hook GSAP para feedback tátil de pressão em cards e botões
// Uso: const { ref, handlers } = usePressAnimation()
// Espalhar handlers no elemento: <div ref={ref} {...handlers}>

import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';

export const usePressAnimation = ({ scale = 0.95, ease = 'back.out(2)' } = {}) => {
  const ref = useRef(null);

  const onPressDown = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, { scale, duration: 0.1, ease: 'power2.out', overwrite: true });
  }, [scale]);

  const onPressUp = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, { scale: 1, duration: 0.35, ease, overwrite: true });
  }, [ease]);

  return {
    ref,
    handlers: {
      onPointerDown: onPressDown,
      onPointerUp: onPressUp,
      onPointerLeave: onPressUp,
      onPointerCancel: onPressUp,
    },
  };
};
