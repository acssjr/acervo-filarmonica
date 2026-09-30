// ===== MODAL =====
// Modal genérico reutilizável com animações de entrada e saída

import { Icons } from '@constants/icons';
import { useEffect, useId, useRef } from 'react';
import IconButton from './IconButton';
import useAnimatedVisibility from '@hooks/useAnimatedVisibility';

const Modal = ({ isOpen, onClose, title, children }) => {
  const { shouldRender, isExiting } = useAnimatedVisibility(isOpen, 200);
  const titleId = useId();
  const dialog = useRef(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!shouldRender) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.focus();
    const key = event => {
      if (event.key === 'Escape') { event.preventDefault(); close.current(); }
      if (event.key !== 'Tab') return;
      const available = [...dialog.current.querySelectorAll('button, input, textarea, select, a[href], [tabindex]')]
        .filter(el => el.tabIndex >= 0 && !el.matches(':disabled') && !el.closest('[inert]') && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden');
      const controls = available.filter(el => {
        if (!el.matches('input[type="radio"]') || !el.name) return true;
        const group = available.filter(other => other.matches('input[type="radio"]') && other.name === el.name && other.form === el.form);
        return el === (group.find(other => other.checked) || group[0]);
      });
      const first = controls[0]; const last = controls[controls.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = overflow; previous?.focus(); };
  }, [shouldRender]);

  if (!shouldRender) return null;

  const backdropAnimation = isExiting
    ? 'modalBackdropOut 0.2s ease forwards'
    : 'modalBackdropIn 0.2s ease';

  const contentAnimation = isExiting
    ? 'slideDownModal 0.2s ease forwards'
    : 'slideUpModal 0.3s ease';

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-end', zIndex: 2000, animation: backdropAnimation
    }} onClick={onClose}>
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} style={{
        background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        width: '100%', maxWidth: '430px', maxHeight: '85vh', overflow: 'auto',
        margin: '0 auto', animation: contentAnimation
      }} onClick={e => e.stopPropagation()}>
        <div style={{ width: '36px', height: '4px', background: 'var(--border)', borderRadius: '2px', margin: '10px auto' }} />
        <div style={{ padding: '0 20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 id={titleId} style={{ fontSize: '20px', fontWeight: '700' }}>{title}</h2>
            <IconButton icon={Icons.Close} onClick={onClose} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
