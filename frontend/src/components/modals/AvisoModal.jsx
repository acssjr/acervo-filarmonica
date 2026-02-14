// ===== AVISO MODAL =====
// Modal Limpo e Premium (Card Centralizado com Fundo Desfocado)

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';
import { API } from '@services/api';

/**
 * Helper para formatar o texto do aviso
 */
const formatMessage = (text) => {
    if (!text) return '';

    const formatted = text.split(/!!(.*?)!!/g).map((part, i) =>
        i % 2 === 1 ? <span key={`h-${i}`} style={{ color: '#D4AF37', fontWeight: '800' }}>{part}</span> : part
    );

    return formatted.map((part, i) => {
        if (typeof part !== 'string') return part;
        return part.split(/\*\*(.*?)\*\*/g).map((subPart, j) =>
            j % 2 === 1 ? <strong key={`b-${i}-${j}`} style={{ fontWeight: '800', color: '#fff' }}>{subPart}</strong> : subPart
        );
    });
};

const AvisoModal = () => {
    const [avisos, setAvisos] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const [dismissing, setDismissing] = useState(false);

    useEffect(() => {
        const checkAvisos = async () => {
            try {
                // Check local storage primarily for instant load
                const readAvisos = JSON.parse(localStorage.getItem('read_avisos') || '[]');

                const data = await API.getAvisosNaoLidos();
                if (data && data.length > 0) {
                    // Filter out locally read avisos just in case API is lagging
                    const validAvisos = data.filter(a => !readAvisos.includes(a.id));

                    if (validAvisos.length > 0) {
                        setAvisos(validAvisos);
                        setIsOpen(true);
                    }
                }
            } catch (e) {
                console.warn('Erro ao checar avisos:', e);
            }
        };
        checkAvisos();
    }, []);

    const handleDismiss = useCallback(async () => {
        if (dismissing) return;
        setDismissing(true);

        const aviso = avisos[currentIndex];

        // Optimistic update: Mark as read locally immediately
        if (aviso) {
            const readAvisos = JSON.parse(localStorage.getItem('read_avisos') || '[]');
            if (!readAvisos.includes(aviso.id)) {
                readAvisos.push(aviso.id);
                localStorage.setItem('read_avisos', JSON.stringify(readAvisos));
            }

            // Sync with backend in background
            API.marcarAvisoLido(aviso.id).catch(() => { });
        }

        // Wait a tiny bit for animation smoothness
        setTimeout(() => {
            if (currentIndex < avisos.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setDismissing(false);
            } else {
                setIsOpen(false);
                setDismissing(false);
            }
        }, 300);

    }, [avisos, currentIndex, dismissing]);

    const aviso = avisos[currentIndex];
    const hasMultiple = avisos.length > 1;

    const isFestive = useMemo(() => {
        if (!aviso) return false;
        const search = (aviso.titulo + aviso.mensagem).toLowerCase();
        return search.includes('carnaval') || search.includes('folia');
    }, [aviso]);

    return (
        <AnimatePresence>
            {isOpen && aviso && (
                <div style={{
                    position: 'fixed', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999,
                    padding: '24px',
                }}>
                    {/* Backdrop com Blur Intenso para Foco Total */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                        }}
                    />

                    {/* Modal Card - Compacto e Centralizado */}
                    <motion.div
                        layout
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            background: 'linear-gradient(145deg, #2D0A0E 0%, #1A0507 100%)',
                            borderRadius: '24px',
                            width: '100%',
                            maxWidth: '420px',
                            maxHeight: '85vh', // <--- LIMITA ALTURA MÁXIMA
                            display: 'flex', flexDirection: 'column', // <--- Flex container
                            boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(212, 175, 55, 0.15)',
                            position: 'relative',
                            zIndex: 10
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Flux Border Animation (Framer Motion) */}
                        <motion.div
                            style={{
                                position: 'absolute', inset: 0, padding: '2px', borderRadius: '24px',
                                background: 'linear-gradient(90deg, #B8860B, #D4AF37, #F4E4BC, #D4AF37, #B8860B)',
                                backgroundSize: '200% 100%',
                                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                maskComposite: 'exclude',
                                WebkitMaskComposite: 'xor',
                                pointerEvents: 'none',
                                zIndex: 15
                            }}
                            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Conteúdo com Scroll se necessário */}
                        <div style={{
                            padding: '32px 24px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                            position: 'relative', zIndex: 2,
                            overflowY: 'auto', // <--- Scroll interno
                            scrollbarWidth: 'none', // Oculta scrollbar firefox
                            msOverflowStyle: 'none'  // Oculta scrollbar IE
                        }}
                            className="no-scrollbar" // Classe para ocultar scrollbar webkit via CSS global se existir
                        >

                            <motion.div
                                initial={{ rotate: -15, scale: 0.8 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                style={{
                                    width: '60px', height: '60px', // Reduzido (era 72)
                                    minHeight: '60px', // Previne encolhimento
                                    borderRadius: '18px',
                                    background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '20px',
                                    boxShadow: '0 10px 30px rgba(184, 134, 11, 0.4)',
                                    flexShrink: 0
                                }}
                            >
                                {isFestive ? <Sparkles size={30} color="#1A0507" /> : <Bell size={30} color="#1A0507" />}
                            </motion.div>

                            <div style={{
                                fontSize: '10px', fontWeight: '900',
                                color: '#D4AF37', textTransform: 'uppercase',
                                letterSpacing: '3px',
                                fontFamily: 'Outfit, sans-serif',
                                marginBottom: '12px',
                                flexShrink: 0
                            }}>
                                Comunicado Oficial
                                {hasMultiple && ` • ${currentIndex + 1} de ${avisos.length}`}
                            </div>

                            <motion.h2
                                key={`title-${currentIndex}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    fontSize: '24px', fontWeight: '800', // Reduzido (era 26)
                                    color: '#fff',
                                    marginBottom: '20px',
                                    fontFamily: 'Outfit, sans-serif',
                                    lineHeight: '1.2',
                                    textShadow: '0 4px 15px rgba(0,0,0,0.5)',
                                    flexShrink: 0
                                }}
                            >{aviso.titulo}</motion.h2>

                            <motion.div
                                key={`msg-${currentIndex}`}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    borderRadius: '16px',
                                    padding: '20px', // Reduzido (era 24)
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    marginBottom: '24px',
                                    flexShrink: 0 // Impede que a caixa de texto suma, prefere scroll
                                }}
                            >
                                <p style={{
                                    fontSize: '15px', // Reduzido (era 16)
                                    color: 'rgba(255,255,255,0.95)',
                                    lineHeight: '1.6',
                                    fontFamily: 'Outfit, sans-serif',
                                    margin: 0,
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {formatMessage(aviso.mensagem)}
                                </p>
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleDismiss}
                                style={{
                                    width: '100%',
                                    padding: '16px', // Reduzido (era 18)
                                    borderRadius: '14px',
                                    background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                    border: 'none',
                                    color: '#1A0507',
                                    fontSize: '14px', // Reduzido (era 15)
                                    fontWeight: '900',
                                    cursor: 'pointer',
                                    fontFamily: 'Outfit, sans-serif',
                                    boxShadow: '0 12px 35px rgba(184, 134, 11, 0.35)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                    flexShrink: 0
                                }}
                            >
                                {hasMultiple && currentIndex < avisos.length - 1 ? (
                                    <>Próximo Aviso <ChevronRight size={18} /></>
                                ) : (
                                    <>Confirmar Leitura <CheckCircle size={18} /></>
                                )}
                            </motion.button>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AvisoModal;
