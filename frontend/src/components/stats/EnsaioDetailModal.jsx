// ===== ENSAIO DETAIL MODAL =====
// Modal informativo de ensaio — design seguindo SheetDetailModal
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { API } from '@services/api';

const EnsaioDetailModal = ({ ensaio, isOpen, onClose }) => {
  const [partituras, setPartituras] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.documentElement.classList.add('modal-open');
      document.body.style.top = `-${scrollY}px`;
      return () => {
        document.documentElement.classList.remove('modal-open');
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const dataEnsaio = ensaio?.data_ensaio ?? null;
  useEffect(() => {
    if (!isOpen || !dataEnsaio) return;
    let active = true;
    setPartituras([]);
    setYoutubeUrl(null);
    setExpanded(false);
    const load = async () => {
      setLoading(true);
      try {
        const result = await API.getPartiturasEnsaio(dataEnsaio);
        if (!active) return;
        setPartituras(result.partituras || []);
        setYoutubeUrl(result.youtube_url || null);
      } catch {
        if (active) {
          setPartituras([]);
          setYoutubeUrl(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [isOpen, dataEnsaio]);

  if (!ensaio) return null;

  const [ano, mesIndex, dia] = ensaio.data_ensaio.split('-').map(Number);
  const dataUTC = new Date(Date.UTC(ano, mesIndex - 1, dia, 12, 0, 0));

  const diasSemana = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
  const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  const diaSemana = diasSemana[dataUTC.getUTCDay()].toUpperCase();

  const presente = ensaio.usuario_presente === 1;
  const hasYoutube = !!youtubeUrl;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 10000
            }}
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={isDesktop ? { opacity: 0, scale: 0.95 } : { y: '100%' }}
            animate={isDesktop ? { opacity: 1, scale: 1 } : { y: 0 }}
            exit={isDesktop ? { opacity: 0, scale: 0.95 } : { y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            style={{
              position: 'fixed',
              zIndex: 10001,
              background: 'var(--bg-card)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              ...(isDesktop ? {
                height: expanded ? '85vh' : '560px', maxHeight: '85vh'
              } : {
                maxHeight: '90vh'
              }),
              ...(isDesktop ? {
                top: '50%', left: '50%',
                x: '-50%', y: '-50%',
                width: '440px', maxWidth: '90vw',
                borderRadius: '20px'
              } : {
                bottom: 0, left: 0, right: 0,
                borderRadius: '20px 20px 0 0'
              })
            }}
          >
            {/* Handle — mobile only */}
            {!isDesktop && (
              <div style={{
                width: '40px', height: '4px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '2px',
                margin: '12px auto 0',
                flexShrink: 0
              }} />
            )}

            {/* ===== HEADER ===== */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(114,47,55,0.85) 0%, rgba(60,15,18,0.95) 100%)',
              padding: isDesktop ? '24px 20px 20px' : '16px 20px 20px',
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              {/* Padrão de fundo decorativo */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: '160px', height: '160px',
                background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute', bottom: '-20px', left: '-20px',
                width: '120px', height: '120px',
                background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />

              {/* Botão expandir — desktop only */}
              {isDesktop && (
                <button
                  onClick={() => setExpanded(e => !e)}
                  aria-label={expanded ? 'Recolher' : 'Expandir'}
                  style={{
                    position: 'absolute', top: '16px', right: '56px',
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {expanded ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/>
                      <line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                      <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                    </svg>
                  )}
                </button>
              )}

              {/* Botão fechar */}
              <button
                onClick={onClose}
                aria-label="Fechar"
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Ícone do ensaio */}
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: 'linear-gradient(145deg, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.1) 100%)',
                border: '1px solid rgba(212,175,55,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                  <line x1="8" y1="14" x2="8" y2="14" strokeWidth="2.5"/>
                  <line x1="12" y1="14" x2="12" y2="14" strokeWidth="2.5"/>
                  <line x1="16" y1="14" x2="16" y2="14" strokeWidth="2.5"/>
                  <line x1="8" y1="18" x2="8" y2="18" strokeWidth="2.5"/>
                  <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2.5"/>
                </svg>
              </div>

              {/* Título + badge presença */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h2 style={{
                  fontSize: '22px', fontWeight: '800',
                  color: '#F4E4BC', margin: 0, lineHeight: 1.2
                }}>
                  {ensaio.numero_ensaio ? `Ensaio #${ensaio.numero_ensaio}` : 'Ensaio'}
                </h2>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  fontSize: '12px', fontWeight: '700',
                  padding: '3px 10px', borderRadius: '20px', flexShrink: 0,
                  background: presente ? 'rgba(74,180,74,0.2)' : 'rgba(239,68,68,0.15)',
                  color: presente ? '#5DD85D' : '#FF6B6B',
                  border: `1px solid ${presente ? 'rgba(74,180,74,0.4)' : 'rgba(239,68,68,0.3)'}`
                }}>
                  {presente ? (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                  {presente ? 'Presente' : 'Ausente'}
                </span>
              </div>

              {/* Data */}
              <div style={{ marginTop: '2px' }}>
                <p style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '1px', color: 'rgba(244,228,188,0.4)', margin: '0 0 5px', textTransform: 'uppercase' }}>
                  {diaSemana}
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0' }}>
                  <span style={{ fontSize: '22px', fontWeight: '800', color: 'rgba(244,228,188,0.95)', lineHeight: 1 }}>
                    {String(dia).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '10px', color: 'rgba(212,175,55,0.5)', margin: '0 6px', fontWeight: '300' }}>●</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '2px', color: 'rgba(212,175,55,0.85)' }}>
                    {meses[mesIndex - 1]}
                  </span>
                  <span style={{ fontSize: '10px', color: 'rgba(212,175,55,0.5)', margin: '0 6px', fontWeight: '300' }}>●</span>
                  <span style={{ fontSize: '13px', fontWeight: '400', color: 'rgba(244,228,188,0.45)', letterSpacing: '1px' }}>
                    {ano}
                  </span>
                </div>
              </div>
            </div>

            {/* ===== BOTÃO REASSISTIR ===== */}
            <div style={{ padding: '16px 20px 0', flexShrink: 0 }}>
              {hasYoutube ? (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(255,0,0,0.15) 0%, rgba(180,0,0,0.1) 100%)',
                    border: '1px solid rgba(255,60,60,0.35)',
                    color: '#FF5252', textDecoration: 'none',
                    fontSize: '14px', fontWeight: '700',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,0,0,0.22) 0%, rgba(180,0,0,0.18) 100%)';
                    e.currentTarget.style.borderColor = 'rgba(255,60,60,0.55)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,0,0,0.15) 0%, rgba(180,0,0,0.1) 100%)';
                    e.currentTarget.style.borderColor = 'rgba(255,60,60,0.35)';
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Reassistir ensaio
                </a>
              ) : (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  width: '100%', padding: '12px 16px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.2)',
                  fontSize: '14px', fontWeight: '600',
                  cursor: 'not-allowed', boxSizing: 'border-box'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.4 }}>
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Gravação não disponível
                </div>
              )}
            </div>

            {/* ===== PARTITURAS ===== */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '16px 20px 24px',
              // Scrollbar personalizada — fina, discreta
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(212,175,55,0.25) transparent'
            }}>
              {/* Título da seção */}
              <p style={{
                fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
                letterSpacing: '1.2px', color: 'var(--text-muted)',
                marginBottom: '10px', marginTop: '2px'
              }}>
                {loading
                  ? 'Carregando...'
                  : `${partituras.length} partitura${partituras.length !== 1 ? 's' : ''} tocada${partituras.length !== 1 ? 's' : ''}`
                }
              </p>

              {/* Estado vazio */}
              {!loading && partituras.length === 0 && (
                <p style={{
                  fontSize: '14px', color: 'var(--text-muted)',
                  fontStyle: 'italic', textAlign: 'center', padding: '20px 0'
                }}>
                  Nenhuma partitura registrada
                </p>
              )}

              {/* Lista */}
              {!loading && partituras.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {partituras.map((partitura, index) => (
                    <div
                      key={partitura.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px 14px', borderRadius: '12px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      {/* Número */}
                      <div style={{
                        width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(145deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.06) 100%)',
                        border: '1px solid rgba(212,175,55,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: '800', color: '#D4AF37'
                      }}>
                        {index + 1}
                      </div>

                      {/* Título + Compositor */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: '14px', fontWeight: '600',
                          color: 'var(--text-primary)', margin: 0, marginBottom: '2px',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                          {partitura.titulo}
                        </p>
                        <p style={{
                          fontSize: '12px', color: 'var(--text-muted)', margin: 0,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                          {partitura.compositor}
                        </p>
                      </div>

                      {/* Chip de categoria */}
                      <span style={{
                        display: 'inline-block', flexShrink: 0,
                        fontSize: '11px', fontWeight: '600',
                        padding: '3px 9px', borderRadius: '8px',
                        background: `${partitura.categoria_cor}20`,
                        color: partitura.categoria_cor,
                        border: `1px solid ${partitura.categoria_cor}40`,
                        maxWidth: '88px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                        {partitura.categoria_nome}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default EnsaioDetailModal;
