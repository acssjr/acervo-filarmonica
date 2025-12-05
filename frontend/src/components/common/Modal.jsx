// ===== MODAL =====
// Modal genérico reutilizável

import { Icons } from '@constants/icons';
import IconButton from './IconButton';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-end', zIndex: 2000, animation: 'fadeIn 0.2s ease'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        width: '100%', maxWidth: '430px', maxHeight: '85vh', overflow: 'auto',
        margin: '0 auto', animation: 'slideUp 0.3s ease'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ width: '36px', height: '4px', background: 'var(--border)', borderRadius: '2px', margin: '10px auto' }} />
        <div style={{ padding: '0 20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: '20px', fontWeight: '700' }}>{title}</h2>
            <IconButton icon={Icons.Close} onClick={onClose} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
