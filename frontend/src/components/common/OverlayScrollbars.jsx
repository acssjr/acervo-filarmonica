import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './overlay-scrollbars.css';

// Native scrolling remains in place; only its visual chrome is overlaid.
export default function OverlayScrollbars() {
  const [bars, setBars] = useState([]);
  const target = useRef(null);
  const hide = useRef(null);
  const dragging = useRef(null);
  const refresh = useRef(() => {});
  useEffect(() => {
    let frame;
    const root = document.scrollingElement;
    target.current = root;
    const update = () => {
      const el = target.current;
      if (!el?.isConnected || (el === root && getComputedStyle(document.body).overflow === 'hidden')) { setBars([]); return; }
      const rect = el === root ? { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight } : el.getBoundingClientRect();
      const top = Math.max(0, rect.top); const left = Math.max(0, rect.left);
      const bottom = Math.min(window.innerHeight, rect.bottom); const right = Math.min(window.innerWidth, rect.right);
      const next = [];
      const css = getComputedStyle(el);
      for (const axis of ['y', 'x']) {
        if (el !== root && !/auto|scroll/.test(axis === 'y' ? css.overflowY : css.overflowX)) continue;
        if (el === root && axis === 'x' && css.overflowX === 'hidden') continue;
        const length = axis === 'y' ? bottom - top - 8 : right - left - 8;
        const client = axis === 'y' ? el.clientHeight : el.clientWidth;
        const total = axis === 'y' ? el.scrollHeight : el.scrollWidth;
        const offset = axis === 'y' ? el.scrollTop : el.scrollLeft;
        const range = total - client;
        if (range < 2 || length < 32) continue;
        const thumb = Math.max(24, length * client / total);
        next.push({ axis, length, thumb, range, offset: (length - thumb) * offset / range,
          style: axis === 'y' ? { top: top + 4, left: right - 12, height: length, width: 12 } : { left: left + 4, top: bottom - 12, width: length, height: 12 } });
      }
      setBars(next);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); clearTimeout(hide.current); hide.current = setTimeout(() => { if (!dragging.current) setBars([]); }, 1600); };
    refresh.current = schedule;
    const scroll = event => { if (!dragging.current) target.current = event.target === document ? root : event.target; schedule(); };
    const hover = event => {
      if (dragging.current || event.target.closest?.('[data-overlay-scrollbar]')) return;
      let el = event.target;
      while (el && el !== document.body) {
        if (el instanceof HTMLElement && (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2)) {
          const css = getComputedStyle(el);
          if (/auto|scroll/.test(css.overflowY + css.overflowX)) { target.current = el; schedule(); return; }
        }
        el = el.parentElement;
      }
      target.current = root; schedule();
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    document.addEventListener('scroll', scroll, true);
    document.addEventListener('pointerover', hover);
    window.addEventListener('resize', schedule);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); clearTimeout(hide.current); document.removeEventListener('scroll', scroll, true); document.removeEventListener('pointerover', hover); window.removeEventListener('resize', schedule); };
  }, []);
  return createPortal(<div aria-hidden="true">{bars.map(bar => <div data-overlay-scrollbar key={bar.axis} className={`acervo-scrollbar ${bar.axis}`} style={bar.style} onPointerEnter={() => clearTimeout(hide.current)}>
    <div className="acervo-scrollbar-thumb" style={bar.axis === 'y' ? { height: bar.thumb, transform: `translateY(${bar.offset}px)` } : { width: bar.thumb, transform: `translateX(${bar.offset}px)` }}
      onPointerDown={event => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); dragging.current = { start: bar.axis === 'y' ? event.clientY : event.clientX, offset: bar.axis === 'y' ? target.current.scrollTop : target.current.scrollLeft }; clearTimeout(hide.current); }}
      onPointerMove={event => { if (!dragging.current) return; const delta = (bar.axis === 'y' ? event.clientY : event.clientX) - dragging.current.start; const offset = dragging.current.offset + delta * bar.range / (bar.length - bar.thumb); if (bar.axis === 'y') target.current.scrollTop = offset; else target.current.scrollLeft = offset; refresh.current(); }}
      onPointerUp={() => { dragging.current = null; refresh.current(); }} onLostPointerCapture={() => { dragging.current = null; refresh.current(); }} />
  </div>)}</div>, document.body);
}
