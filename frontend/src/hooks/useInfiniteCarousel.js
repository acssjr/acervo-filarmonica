// ===== useInfiniteCarousel =====
// RAF + CSS transform — GPU-accelerated, Pointer Events unificado
//
// Princípios:
// - transform: translateX (não scrollLeft) → sem problemas Safari/iOS
// - Pointer Events API → mouse e touch unificados
// - Delta-time → velocidade independente de frame rate
// - Todo estado mutável num único ref → zero stale closures
// - touch-action: pan-y → scroll vertical nativo preservado
// - Inércia via GSAP: ao soltar o drag, desacelera naturalmente (power3.out)

import { useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';

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
    pos: 0,           // posição atual em px
    half: 0,          // metade do scrollWidth (ponto de reset seamless)
    rafId: null,
    timerId: null,
    inertiaTween: null,
    drag: false,
    dragStartX: 0,
    dragStartPos: 0,
    // rastreamento de velocidade para inércia
    lastX: 0,
    lastTs: 0,
    velocity: 0,      // px/ms — média exponencial móvel
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
    // Cancela inércia em andamento ao iniciar novo drag
    if (st.current.inertiaTween) {
      st.current.inertiaTween.kill();
      st.current.inertiaTween = null;
    }
    stopScroll();
    if (st.current.timerId != null) clearTimeout(st.current.timerId);
    st.current.drag = true;
    st.current.dragStartX = e.clientX;
    st.current.dragStartPos = st.current.pos;
    st.current.lastX = e.clientX;
    st.current.lastTs = performance.now();
    st.current.velocity = 0;
  }, [stopScroll]);

  const onPointerMove = useCallback((e) => {
    if (!st.current.drag) return;
    const now = performance.now();
    const dt = now - st.current.lastTs;
    if (dt > 0) {
      // Média exponencial móvel — suaviza jitter do pointermove
      const raw = (st.current.lastX - e.clientX) / dt; // px/ms, positivo = direção →
      st.current.velocity = st.current.velocity * 0.6 + raw * 0.4;
    }
    st.current.lastX = e.clientX;
    st.current.lastTs = now;
    const delta = st.current.dragStartX - e.clientX;
    st.current.pos = wrap(st.current.dragStartPos + delta);
    commit();
  }, [wrap, commit]);

  const onPointerEnd = useCallback(() => {
    if (!st.current.drag) return;
    st.current.drag = false;

    const velocity = st.current.velocity; // px/ms
    const MIN_VELOCITY = 0.08; // px/ms — limiar mínimo para disparar inércia

    if (Math.abs(velocity) > MIN_VELOCITY) {
      // Anima um proxy e usa onUpdate para wrapping contínuo
      const proxy = { pos: st.current.pos };
      const target = st.current.pos + velocity * 320; // escala: duração × amortecimento

      st.current.inertiaTween = gsap.to(proxy, {
        pos: target,
        duration: 0.85,
        ease: 'power3.out',
        onUpdate: () => {
          st.current.pos = wrap(proxy.pos);
          commit();
        },
        onComplete: () => {
          st.current.inertiaTween = null;
          scheduleResume();
        },
      });
    } else {
      scheduleResume();
    }
  }, [wrap, commit, scheduleResume]);

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
      if (stRef.inertiaTween) stRef.inertiaTween.kill();
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
