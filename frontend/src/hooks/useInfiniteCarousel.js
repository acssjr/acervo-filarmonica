// ===== useInfiniteCarousel =====
// RAF + CSS transform — GPU-accelerated, Pointer Events unificado
//
// Princípios:
// - transform: translateX (não scrollLeft) → sem problemas Safari/iOS
// - Pointer Events API → mouse e touch unificados
// - Delta-time → velocidade independente de frame rate
// - Todo estado mutável num único ref → zero stale closures
// - touch-action: pan-y → scroll vertical nativo preservado

import { useRef, useCallback, useEffect } from 'react';

/**
 * @param {number}  speed        px por frame a 60fps  (padrão 0.4)
 * @param {number}  resumeDelay  ms até retomar após interação (padrão 4000)
 * @param {boolean} enabled      ativa/desativa o scroll automático
 */
export const useInfiniteCarousel = ({
  speed = 0.4,
  resumeDelay = 4000,
  enabled = true,
} = {}) => {
  const innerRef = useRef(null);

  // Estado mutável centralizado — evita stale closures por completo
  const st = useRef({
    pos: 0,         // posição atual em px
    half: 0,        // metade do scrollWidth (ponto de reset seamless)
    rafId: null,
    timerId: null,
    drag: false,
    dragStartX: 0,
    dragStartPos: 0,
    speed,
    resumeDelay,
  });

  // Sincroniza props mutáveis sem re-criar callbacks
  st.current.speed = speed;
  st.current.resumeDelay = resumeDelay;

  // ── Utilitários (sem deps de closures, só refs) ──────────────────────

  const measureHalf = useCallback(() => {
    const el = innerRef.current;
    if (el) st.current.half = el.scrollWidth / 2;
  }, []);

  const commit = useCallback(() => {
    const el = innerRef.current;
    if (el) el.style.transform = `translateX(${-st.current.pos}px)`;
  }, []);

  const wrap = useCallback((pos) => {
    const h = st.current.half;
    if (h <= 0) return pos;
    return ((pos % h) + h) % h;
  }, []);

  // ── Auto-scroll ──────────────────────────────────────────────────────

  const stopScroll = useCallback(() => {
    if (st.current.rafId != null) {
      cancelAnimationFrame(st.current.rafId);
      st.current.rafId = null;
    }
  }, []);

  const startScroll = useCallback(() => {
    stopScroll();
    let lastTs = null;

    const tick = (ts) => {
      // Inicializa timestamp no primeiro frame
      if (lastTs === null) {
        lastTs = ts;
        st.current.rafId = requestAnimationFrame(tick);
        return;
      }

      // Cap de 50ms previne salto após o tab ficar em background
      const dt = Math.min(ts - lastTs, 50);
      lastTs = ts;

      if (st.current.half <= 0) measureHalf();

      if (st.current.half > 0) {
        st.current.pos = wrap(st.current.pos + st.current.speed * (dt / 16.667));
        commit();
      }

      st.current.rafId = requestAnimationFrame(tick);
    };

    st.current.rafId = requestAnimationFrame(tick);
  }, [stopScroll, measureHalf, wrap, commit]);

  // Ref estável — timers sempre chamam a versão mais recente
  const startScrollRef = useRef(startScroll);
  startScrollRef.current = startScroll;

  const scheduleResume = useCallback(() => {
    if (st.current.timerId != null) clearTimeout(st.current.timerId);
    st.current.timerId = setTimeout(() => {
      st.current.pos = wrap(st.current.pos);
      startScrollRef.current();
    }, st.current.resumeDelay);
  }, [wrap]);

  // ── Pointer handlers (mouse + touch unificado) ───────────────────────

  const onPointerDown = useCallback((e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    stopScroll();
    if (st.current.timerId != null) clearTimeout(st.current.timerId);
    st.current.drag = true;
    st.current.dragStartX = e.clientX;
    st.current.dragStartPos = st.current.pos;
  }, [stopScroll]);

  const onPointerMove = useCallback((e) => {
    if (!st.current.drag) return;
    const delta = st.current.dragStartX - e.clientX;
    st.current.pos = wrap(st.current.dragStartPos + delta);
    commit();
  }, [wrap, commit]);

  const onPointerEnd = useCallback(() => {
    if (!st.current.drag) return;
    st.current.drag = false;
    scheduleResume();
  }, [scheduleResume]);

  // ── Lifecycle ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!enabled) {
      stopScroll();
      return;
    }

    // Aguarda a primeira pintura para ter scrollWidth correto
    const initRaf = requestAnimationFrame(() => {
      measureHalf();
      if (st.current.half > 0) startScroll();
    });

    const stRef = st.current;
    return () => {
      cancelAnimationFrame(initRaf);
      stopScroll();
      if (stRef.timerId != null) clearTimeout(stRef.timerId);
    };
  }, [enabled, startScroll, stopScroll, measureHalf]);

  // ── API pública ──────────────────────────────────────────────────────

  return {
    innerRef,
    // Espalhar no container externo (overflow: hidden)
    outerProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerLeave: onPointerEnd,   // segurança para drags rápidos
      onPointerCancel: onPointerEnd,
    },
  };
};
