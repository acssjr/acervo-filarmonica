import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useBellAnimation(iconRef, hasUnread) {
  const tlRef = useRef(null);

  useEffect(() => {
    if (!iconRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasUnread && !prefersReduced) {
      tlRef.current = gsap.timeline({ repeat: -1, repeatDelay: 8 });
      tlRef.current.to(iconRef.current, {
        rotation: 12, duration: 0.1, ease: 'power2.out',
        transformOrigin: '50% 0%'
      })
      .to(iconRef.current, { rotation: -8, duration: 0.12, ease: 'power2.inOut' })
      .to(iconRef.current, { rotation: 5, duration: 0.1, ease: 'power2.inOut' })
      .to(iconRef.current, { rotation: 0, duration: 0.15, ease: 'power2.out' });
    } else {
      tlRef.current?.kill();
      gsap.set(iconRef.current, { rotation: 0 });
    }

    return () => { tlRef.current?.kill(); };
  }, [hasUnread, iconRef]);
}
