// ===== CHANGE PIN MODAL =====
// Modal para alterar PIN em 3 etapas

import { useState, useEffect, useRef, createRef } from 'react';
import { useUI } from '@contexts/UIContext';
import { API } from '@services/api';
import { Storage } from '@services/storage';
import { MESSAGES } from '@constants/messages';
import { COLORS, COLORS_RGBA } from '@constants/colors';
import { TIMING } from '@constants/config';
import useAnimatedVisibility from '@hooks/useAnimatedVisibility';

const ChangePinModal = ({ isOpen = true, onClose }) => {
  const { shouldRender, isExiting } = useAnimatedVisibility(isOpen, 200);
  const { showToast } = useUI();
  const [isLoading, setIsLoading] = useState(false);

  const [currentPin, setCurrentPin] = useState(['', '', '', '']);
  const [newPin, setNewPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [step, setStep] = useState(1); // 1: PIN atual, 2: Novo PIN, 3: Confirmar
  const [error, setError] = useState('');

  // Refs estaveis usando useRef
  const currentPinRefs = useRef([createRef(), createRef(), createRef(), createRef()]).current;
  const newPinRefs = useRef([createRef(), createRef(), createRef(), createRef()]).current;
  const confirmPinRefs = useRef([createRef(), createRef(), createRef(), createRef()]).current;

  // Foca no primeiro input ao abrir
  useEffect(() => {
    currentPinRefs[0].current?.focus();
  }, []);

  const handlePinInput = (index, value, pinArray, setPinArray, refs, onComplete) => {
    if (value && !/^\d$/.test(value)) return;

    const newPinArray = [...pinArray];
    newPinArray[index] = value;
    setPinArray(newPinArray);
    setError('');

    // Auto-pula para proximo campo
    if (value && index < 3) {
      setTimeout(() => refs[index + 1].current?.focus(), 10);
    }

    // Completa quando digitar o 4o digito
    if (value && index === 3) {
      setTimeout(() => onComplete(newPinArray.join('')), 100);
    }
  };

  const handleKeyDown = (index, e, refs) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  // Avança para próximo step quando PIN atual é digitado
  const handleCurrentPinComplete = (pin) => {
    // Não valida localmente - a API vai verificar
    setStep(2);
    setTimeout(() => newPinRefs[0].current?.focus(), 100);
  };

  // Avança para confirmação quando novo PIN é digitado
  const handleNewPinComplete = (pin) => {
    // Verifica se é igual ao atual (validação básica local)
    if (pin === currentPin.join('')) {
      setError(MESSAGES.error.samePinError);
      setNewPin(['', '', '', '']);
      setTimeout(() => newPinRefs[0].current?.focus(), TIMING.focusDelay);
      return;
    }
    setStep(3);
    setTimeout(() => confirmPinRefs[0].current?.focus(), TIMING.focusDelay);
  };

  const confirmNewPin = async (pin) => {
    if (pin !== newPin.join('')) {
      setError(MESSAGES.error.pinMismatch);
      setConfirmPin(['', '', '', '']);
      confirmPinRefs[0].current?.focus();
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await API.changePin(currentPin.join(''), pin);

      if (result.success) {
        // Atualiza o token local com o novo PIN
        Storage.set('authToken', result.token);
        showToast(MESSAGES.success.pinChanged);
        onClose();
      } else {
        setError(result.error || MESSAGES.error.generic);
        setConfirmPin(['', '', '', '']);
        confirmPinRefs[0].current?.focus();
      }
    } catch (err) {
      // Se o erro é "PIN atual incorreto", volta para step 1
      const errorMsg = err.message || MESSAGES.error.connectionFailed;
      if (errorMsg.includes(MESSAGES.error.invalidPin)) {
        setStep(1);
        setCurrentPin(['', '', '', '']);
        setNewPin(['', '', '', '']);
        setConfirmPin(['', '', '', '']);
        setError(MESSAGES.pin.incorrectRetry);
        setTimeout(() => currentPinRefs[0].current?.focus(), TIMING.focusDelay);
      } else {
        setError(errorMsg);
        setConfirmPin(['', '', '', '']);
        confirmPinRefs[0].current?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const PinInputGroup = ({ pin, setPin, refs, onComplete, label }) => (
    <div>
      <label style={{
        display: 'block',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '13px',
        fontWeight: '600',
        color: 'var(--text-muted)',
        marginBottom: '12px',
        textAlign: 'center'
      }}>{label}</label>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        {pin.map((digit, index) => (
          <input
            key={index}
            ref={refs[index]}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handlePinInput(index, e.target.value, pin, setPin, refs, onComplete)}
            onKeyDown={e => handleKeyDown(index, e, refs)}
            disabled={isLoading}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: digit ? COLORS_RGBA.gold.bg15 : 'var(--bg-card)',
              border: digit ? '2px solid var(--primary)' : '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '20px',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: '700',
              textAlign: 'center',
              outline: 'none',
              opacity: isLoading ? 0.6 : 1
            }}
          />
        ))}
      </div>
    </div>
  );

  if (!shouldRender) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      padding: '20px',
      animation: isExiting
        ? 'modalBackdropOut 0.2s ease forwards'
        : 'modalBackdropIn 0.2s ease'
    }}>
      <div style={{
        background: 'var(--bg-primary)',
        borderRadius: '20px',
        padding: '32px',
        width: '100%',
        maxWidth: '360px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        animation: isExiting
          ? 'modalScaleOut 0.2s ease forwards'
          : 'modalScaleIn 0.25s ease'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Alterar PIN
          </h3>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '4px'
          }}>✕</button>
        </div>

        {/* Steps indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: step >= s ? 'var(--primary)' : 'var(--border)',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        {/* Step content */}
        {step === 1 && (
          <PinInputGroup
            pin={currentPin}
            setPin={setCurrentPin}
            refs={currentPinRefs}
            onComplete={handleCurrentPinComplete}
            label={MESSAGES.pin.currentLabel}
          />
        )}

        {step === 2 && (
          <PinInputGroup
            pin={newPin}
            setPin={setNewPin}
            refs={newPinRefs}
            onComplete={handleNewPinComplete}
            label={MESSAGES.pin.newLabel}
          />
        )}

        {step === 3 && (
          <PinInputGroup
            pin={confirmPin}
            setPin={setConfirmPin}
            refs={confirmPinRefs}
            onComplete={confirmNewPin}
            label={MESSAGES.pin.confirmLabel}
          />
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div style={{
            marginTop: '16px',
            textAlign: 'center'
          }}>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '13px', color: 'var(--text-muted)' }}>
              {MESSAGES.loading.changingPin}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: COLORS_RGBA.error.bg10,
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '13px', color: COLORS.error.light }}>{error}</p>
          </div>
        )}

        {/* Cancel button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          style={{
            width: '100%',
            marginTop: '24px',
            padding: '14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            color: 'var(--text-muted)',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ChangePinModal;
