// ===== RESET PIN MODAL =====
// Modal para resetar PIN de um usuario

import { useState } from 'react';

const ResetPinModal = ({ usuario, onReset, onClose }) => {
  const [newPin, setNewPin] = useState('1234');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        width: '100%',
        maxWidth: '360px'
      }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
          Resetar PIN
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', fontFamily: 'Outfit, sans-serif' }}>
          Resetar PIN de <strong>{usuario.nome}</strong>
        </p>

        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text-secondary)', fontFamily: 'Outfit, sans-serif' }}>
          Novo PIN (4 digitos)
        </label>
        <input
          type="text"
          maxLength={4}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '18px',
            textAlign: 'center',
            letterSpacing: '8px',
            marginBottom: '20px',
            fontFamily: 'Outfit, sans-serif'
          }}
          value={newPin}
          onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
        />

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{
            flex: 1,
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif'
          }}>
            Cancelar
          </button>
          <button
            onClick={() => onReset(usuario.id, newPin)}
            disabled={newPin.length !== 4}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent)',
              border: 'none',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              opacity: newPin.length !== 4 ? 0.5 : 1,
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            Resetar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPinModal;
