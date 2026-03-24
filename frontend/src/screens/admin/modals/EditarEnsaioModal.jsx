import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import API from '../../../services/api';
import Skeleton from '../../../components/common/Skeleton';
import { useScrollLock } from '../../../hooks/useScrollLock';

gsap.registerPlugin(useGSAP);

// Icons - use simple SVG inline icons to avoid import issues
const SearchIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
);

const XIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

const PlusIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="M12 5v14" />
  </svg>
);

const COLORS = {
  gold: { primary: '#D4AF37', light: '#F4E4BC', dark: '#B8960C' },
  red: '#E74C3C',
  green: '#34C759',
  bgCard: 'var(--bg-card)',
  border: 'var(--border)'
};

const formatDatePt = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  return `${day} de ${meses[month - 1]} de ${year}`;
};

const EditarEnsaioModal = ({ ensaio, usuarios, onClose, onUpdate, addNotification }) => {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const tlRef = useRef(null);
  const isAnimatingClose = useRef(false);

  const [abaAtiva, setAbaAtiva] = useState('presencas');
  const [loading, setLoading] = useState(true);
  const [detalhe, setDetalhe] = useState(null);
  const [buscaMusico, setBuscaMusico] = useState('');
  const [buscaPartitura, setBuscaPartitura] = useState('');
  const [partiturasDisponiveis, setPartiturasDisponiveis] = useState([]);
  const [buscandoPartituras, setBuscandoPartituras] = useState(false);
  const [repertorioAtivo, setRepertorioAtivo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [originalYoutubeUrl, setOriginalYoutubeUrl] = useState('');

  // States for batch saving
  const [originalPresenteIds, setOriginalPresenteIds] = useState(new Set());
  const [partiturasRemovidasIds, setPartiturasRemovidasIds] = useState(new Set());
  const [hasChanges, setHasChanges] = useState(false);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);

  // Drag-to-reorder state
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Load detailed rehearsal data
  const carregarDetalhe = useCallback(async () => {
    try {
      setLoading(true);
      const data = await API.getDetalheEnsaio(ensaio.data_ensaio);
      setDetalhe(data);
      setLoading(false); // Move to here to keep header visible while sub-requests happen if needed

      // Initialize tracking state only once
      setOriginalPresenteIds(new Set((data.presentes || []).map(p => p.usuario_id)));
      setPartiturasRemovidasIds(new Set());
      setHasChanges(false);

      // Also fetch youtube_url for this ensaio
      API.getPartiturasEnsaio(ensaio.data_ensaio).then(res => {
        const url = res.youtube_url || '';
        setYoutubeUrl(url);
        setOriginalYoutubeUrl(url);
      }).catch((err) => {
        console.error('Failed to fetch YouTube URL for ensaio:', ensaio.data_ensaio, err);
      });

    } catch (error) {
      addNotification?.('Erro ao carregar detalhes do ensaio', 'error');
    }
  }, [ensaio.data_ensaio, addNotification]);

  // When details load, save original state for diffing


  // Centralized Scroll Lock
  useScrollLock();

  // GSAP open animation
  useGSAP(() => {
    const tl = gsap.timeline();
    tlRef.current = tl;

    tl.fromTo(overlayRef.current,
      { opacity: 0, backdropFilter: 'blur(0px)' },
      { opacity: 1, backdropFilter: 'blur(4px)', duration: 0.35, ease: 'power2.out' }
    ).fromTo(cardRef.current,
      { y: 24, scale: 0.96, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.45, ease: 'expo.out' },
      '<0.05'
    );
  }, { scope: overlayRef });

  const handleClose = useCallback(() => {
    if (isAnimatingClose.current) return;
    isAnimatingClose.current = true;
    // Dedicated exit — faster and lighter than reversing the entrance
    const exitTl = gsap.timeline({
      onComplete: onClose,
      defaults: { ease: 'power2.in' }
    });
    exitTl
      .to(cardRef.current, { y: 12, scale: 0.97, opacity: 0, duration: 0.18 })
      .to(overlayRef.current, { opacity: 0, duration: 0.14 }, '<0.03');
  }, [onClose]);

  useEffect(() => {
    carregarDetalhe();
    API.getRepertorioAtivo().then(r => setRepertorioAtivo(r || null)).catch(() => {});
  }, [carregarDetalhe]);

  // Presence management
  const handleRemoverPresenca = (usuarioId) => {
    setDetalhe(prev => ({
      ...prev,
      presentes: prev.presentes.filter(p => p.usuario_id !== usuarioId),
      total_presentes: prev.total_presentes - 1
    }));
    setHasChanges(true);
  };

  const handleAdicionarPresenca = (usuarioId) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    if (!usuario) return;

    setDetalhe(prev => ({
      ...prev,
      presentes: [...prev.presentes, { usuario_id: usuarioId, nome: usuario.nome, instrumento_nome: usuario.instrumento_nome || '' }].sort((a, b) => a.nome.localeCompare(b.nome)),
      total_presentes: prev.total_presentes + 1
    }));
    setBuscaMusico('');
    setHasChanges(true);
  };

  // Partitura management
  const buscarPartituras = async (termo) => {
    setBuscaPartitura(termo);
    if (termo.length < 2) {
      setPartiturasDisponiveis([]);
      return;
    }
    setBuscandoPartituras(true);
    try {
      const result = await API.getPartituras({ busca: termo });
      const jaAdicionadas = new Set((detalhe?.partituras || []).map(p => p.partitura_id));
      setPartiturasDisponiveis((result || []).filter(p => !jaAdicionadas.has(p.id)));
    } catch {
      setPartiturasDisponiveis([]);
    } finally {
      setBuscandoPartituras(false);
    }
  };

  const handleAdicionarPartitura = (partituraId, sourceList = null) => {
    const lista = sourceList || partiturasDisponiveis;
    const partitura = lista.find(p => p.id === partituraId);
    if (!partitura) return;
    setDetalhe(prev => ({
      ...prev,
      partituras: [...prev.partituras, {
        id: `optimistic-${Date.now()}`,
        partitura_id: partituraId,
        titulo: partitura.titulo,
        compositor: partitura.compositor,
        categoria_nome: partitura.categoria_nome,
        _optimistic: true
      }],
      total_partituras: prev.total_partituras + 1
    }));
    setPartiturasDisponiveis(prev => prev.filter(p => p.id !== partituraId));
    setBuscaPartitura('');
    setHasChanges(true);
  };

  const handleRemoverPartitura = (epId, _partituraId) => {
    // If it's a real record (not optimistic), mark for deletion
    if (!epId.toString().startsWith('optimistic-')) {
      setPartiturasRemovidasIds(prev => new Set(prev).add(_partituraId));
    }

    setDetalhe(prev => ({
      ...prev,
      partituras: prev.partituras.filter(p => p.id !== epId),
      total_partituras: prev.total_partituras - 1
    }));
    setHasChanges(true);
  };

  // Drag-to-reorder handlers
  const handleDragStart = (index) => setDragIndex(index);
  const handleDragOver = (e, index) => { e.preventDefault(); setDragOverIndex(index); };
  const handleDrop = (dropIndex) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const newList = [...(detalhe?.partituras || [])];
    const [moved] = newList.splice(dragIndex, 1);
    newList.splice(dropIndex, 0, moved);
    setDetalhe(prev => ({ ...prev, partituras: newList }));
    setHasOrderChanged(true);
    setHasChanges(true);
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => { setDragIndex(null); setDragOverIndex(null); };

  const handleSalvar = async () => {
    setSaving(true);
    try {
      const promises = [];

      // 1. Process Presences
      const currentIds = new Set(detalhe.presentes.map(p => p.usuario_id));
      const toAdd = [...currentIds].filter(id => !originalPresenteIds.has(id));
      const toRemove = [...originalPresenteIds].filter(id => !currentIds.has(id));

      if (toAdd.length > 0) {
        promises.push(API.registrarPresencas(ensaio.data_ensaio, toAdd));
      }
      toRemove.forEach(id => {
        promises.push(API.removerPresenca(ensaio.data_ensaio, id));
      });

      // 2. Process Partituras
      // Add new ones
      const partiturasToAdd = detalhe.partituras.filter(p => p._optimistic);
      partiturasToAdd.forEach(p => {
        promises.push(API.addPartituraEnsaio(ensaio.data_ensaio, p.partitura_id));
      });
      // Remove deleted ones
      partiturasRemovidasIds.forEach(id => {
        promises.push(API.removePartituraEnsaio(ensaio.data_ensaio, id));
      });

      await Promise.all(promises);

      // 3. Reorder if order changed
      if (hasOrderChanged) {
        const fresh = await API.getPartiturasEnsaio(ensaio.data_ensaio);
        const freshList = fresh.partituras || [];
        const desiredOrder = detalhe.partituras.map(p => p.partitura_id);
        const ordens = desiredOrder
          .map((partituraId, idx) => {
            const real = freshList.find(fp => fp.partitura_id === partituraId);
            return real ? { id: real.id, ordem: idx } : null;
          })
          .filter(Boolean);
        if (ordens.length > 0) {
          await API.reorderPartiturasEnsaio(ensaio.data_ensaio, ordens);
        }
      }

      // Save youtube URL if changed
      if (youtubeUrl !== originalYoutubeUrl) {
        await API.updateEnsaioConfig(ensaio.data_ensaio, youtubeUrl);
        setOriginalYoutubeUrl(youtubeUrl);
      }

      onUpdate?.(true); // Refreshes parent data silently to keep scroll
      handleClose();    // Closes modal with animation
      addNotification?.('Ensaio atualizado com sucesso', 'success');

    } catch (error) {
      console.error(error);
      addNotification?.('Erro ao salvar algumas alterações.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Filtered lists
  const presenteIds = new Set((detalhe?.presentes || []).map(p => p.usuario_id));
  const ausentes = usuarios
    .filter(u => !presenteIds.has(u.id) && u.ativo !== false)
    .filter(u => !buscaMusico || u.nome.toLowerCase().includes(buscaMusico.toLowerCase()));

  // Count logic excluding Regente
  const isRegente = (u) => (u.instrumento_nome && u.instrumento_nome.includes('Regente')) || (u.nome && u.nome.includes('Regente'));

  const presentesList = detalhe?.presentes || [];
  const presentesCount = presentesList.filter(p => !isRegente(p)).length;

  const totalAtivos = usuarios.filter(u => !isRegente(u)).length;

  const percentual = totalAtivos > 0
    ? Math.min(100, Math.round((presentesCount / totalAtivos) * 100))
    : 0;

  return (
    <div ref={overlayRef} onClick={handleClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div ref={cardRef} onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-card)', border: '1px solid rgba(212,175,55,0.2)', // Subtle gold border
        borderRadius: '16px', maxWidth: '640px', width: '100%',
        height: '680px', // More stable fixed height to prevent jumps
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(135deg, #4A1A1C 0%, #1A0507 100%)', // Solid Premium Dark Wine
          borderBottom: '1px solid #D4AF37', // Gold signature border
          borderRadius: '16px 16px 0 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(212,175,55,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(212,175,55,0.2)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold.primary} strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#F4E4BC', margin: 0 }}>
                  Ensaio {ensaio.numero_ensaio ? `#${ensaio.numero_ensaio}` : ''}
                </h3>
                <span style={{
                  fontSize: '10px', fontWeight: '700', color: COLORS.gold.primary,
                  padding: '2px 8px', borderRadius: '6px', background: 'rgba(212,175,55,0.15)',
                  border: '1px solid rgba(212,175,55,0.2)', textTransform: 'uppercase', letterSpacing: '0.5px'
                }}>
                  Modo Edição
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(244, 228, 188, 0.8)', margin: '2px 0 0', fontWeight: '500' }}>
                {formatDatePt(ensaio.data_ensaio)}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* YouTube URL - Link da Gravação (Compacta/Inline) */}
            <div style={{
              padding: '6px 12px',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              border: '1px solid rgba(212, 175, 55, 0.3)', // Gold border for input
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#E74C3C">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(231, 76, 60, 0.9)', textTransform: 'uppercase' }}>Gravação</span>
              </div>
              <input
                type="url"
                value={youtubeUrl}
                onChange={e => setYoutubeUrl(e.target.value)}
                placeholder="YouTube URL..."
                style={{
                  width: '140px', padding: '4px 8px', fontSize: '11px', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '4px',
                  background: 'rgba(0,0,0,0.3)', color: '#F4E4BC', outline: 'none'
                }}
              />
            </div>

            <button onClick={handleClose} style={{
              background: 'rgba(244, 228, 188, 0.1)', border: '1px solid rgba(244, 228, 188, 0.2)', cursor: 'pointer', color: '#F4E4BC',
              padding: '6px', borderRadius: '50%', display: 'flex'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '0', padding: '0 24px',
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(to bottom, rgba(212,175,55,0.05), transparent)' // Subtle gold tint
        }}>
          {[
            { id: 'presencas', label: `Músicos (${presentesCount})` },
            { id: 'partituras', label: `Partituras Tocadas (${detalhe?.total_partituras || 0})` }
          ].map(tab => (
            <button key={tab.id} onClick={() => setAbaAtiva(tab.id)} style={{
              padding: '14px 20px', fontSize: '13px',
              fontWeight: abaAtiva === tab.id ? '700' : '500', border: 'none', background: 'none',
              color: abaAtiva === tab.id ? COLORS.gold.primary : 'var(--text-muted)',
              borderBottom: abaAtiva === tab.id ? `2px solid ${COLORS.gold.primary}` : '2px solid transparent',
              cursor: 'pointer', transition: 'all 0.15s', marginBottom: '-1px',
              textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
          {loading && !detalhe ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                <Skeleton width="120px" height="36px" borderRadius="10px" />
                <Skeleton width="120px" height="36px" borderRadius="10px" />
              </div>
              <Skeleton width="100%" height="45px" borderRadius="10px" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Skeleton variant="circular" width="32px" height="32px" />
                    <Skeleton width="100%" height="48px" borderRadius="12px" />
                  </div>
                ))}
              </div>
            </div>
          ) : !detalhe && !loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', }}>
              Erro ao carregar dados
            </div>
          ) : abaAtiva === 'presencas' ? (
            <div>
              {/* Section Header for Músicos */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--border)'
              }}>
                <h2 style={{
                  fontSize: '15px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  margin: 0,
                  letterSpacing: '-0.2px'
                }}>
                  Músicos
                </h2>
                <span style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  background: 'rgba(212,175,55,0.08)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(212,175,55,0.1)'
                }}>
                  {presentesCount} presentes de {totalAtivos} ativos ({percentual}%)
                </span>
              </div>

              {/* Search to add */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
                  <SearchIcon size={16} color="var(--text-muted)" />
                </div>
                <input
                  type="text" value={buscaMusico} onChange={e => setBuscaMusico(e.target.value)}
                  placeholder="Buscar músico para adicionar..."
                  style={{
                    width: '100%', padding: '10px 12px 10px 36px', fontSize: '14px', border: '1px solid var(--border)', borderRadius: '8px',
                    background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Two lists layout */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* 2. SECTION: PRESENTES (REMOVER) */}
                <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '400px' }}>
                  <div style={{
                    fontSize: '11px', fontWeight: '700', color: COLORS.green,
                    padding: '10px 14px',
                    background: 'var(--bg-green-light)', textTransform: 'uppercase', letterSpacing: '0.5px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: '1px solid var(--border)'
                  }}>
                    <span>Presentes · Toque para remover</span>
                    <span style={{
                      background: COLORS.green, color: '#FFFFFF', // Guaranteed white text
                      borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: '800'
                    }}>{presentesCount}</span>
                  </div>
                  <div style={{ overflowY: 'auto' }} className="custom-scrollbar">
                    {(detalhe.presentes || []).map(p => (
                      <div key={p.usuario_id}
                        onClick={() => handleRemoverPresenca(p.usuario_id)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px 14px', borderBottom: '1px solid var(--border)',
                          fontSize: '14px', cursor: 'pointer', transition: 'background 0.1s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-green-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: COLORS.green, boxShadow: `0 0 6px ${COLORS.green}66`
                          }} />
                          <div>
                            <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{p.nome}</span>
                            {p.instrumento_nome && (
                              <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '6px' }}>
                                {p.instrumento_nome}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{
                          width: '24px', height: '24px', borderRadius: '6px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'
                        }}>
                          <XIcon size={16} />
                        </div>
                      </div>
                    ))}
                    {(detalhe.presentes || []).length === 0 && (
                      <div style={{
                        padding: '30px', textAlign: 'center', color: 'var(--text-muted)',
                        fontSize: '14px',
                      }}>
                        Nenhum músico presente
                      </div>
                    )}
                  </div>
                </div>

                {/* 1. SECTION: AUSENTES (ADICIONAR) - NOW RED */}
                {ausentes.length > 0 ? (
                  <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '300px' }}>
                    <div style={{
                      fontSize: '11px', fontWeight: '700', color: COLORS.red,
                      padding: '10px 14px',
                      background: 'var(--bg-red-light)', textTransform: 'uppercase', letterSpacing: '0.5px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      borderBottom: '1px solid var(--border)'
                    }}>
                      <span>Ausentes · Toque para adicionar</span>
                      <span style={{
                        background: COLORS.red, color: '#FFFFFF', // Guaranteed white text
                        borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: '800'
                      }}>{ausentes.length}</span>
                    </div>
                    <div style={{ overflowY: 'auto' }} className="custom-scrollbar">
                      {ausentes.map(u => (
                        <div key={u.id}
                          onClick={() => handleAdicionarPresenca(u.id)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 14px', borderBottom: '1px solid var(--border)',
                            fontSize: '14px', cursor: 'pointer', transition: 'background 0.1s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-red-hover)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '8px', height: '8px', borderRadius: '50%',
                              border: `1px solid ${COLORS.red}`
                            }} />
                            <div>
                              <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{u.nome}</span>
                              {u.instrumento_nome && (
                                <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '6px' }}>
                                  {u.instrumento_nome}
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={{
                            width: '24px', height: '24px', borderRadius: '6px', background: 'var(--bg-red-light)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.red
                          }}>
                            <PlusIcon size={14} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  buscaMusico && (
                    <div style={{ padding: '10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                      Nenhum músico encontrado com &quot;{buscaMusico}&quot;
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            /* Partituras tab */
            <div>
              {/* Section Header for Partituras */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--border)'
              }}>
                <h2 style={{
                  fontSize: '15px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  margin: 0,
                  letterSpacing: '-0.2px'
                }}>
                  Partituras Tocadas
                </h2>
                <span style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  background: 'rgba(212,175,55,0.08)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(212,175,55,0.1)'
                }}>
                  {detalhe?.total_partituras || 0} partituras
                </span>
              </div>

              {/* Search to add partituras */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
                  <SearchIcon size={16} color="var(--text-muted)" />
                </div>
                <input
                  type="text" value={buscaPartitura} onChange={e => buscarPartituras(e.target.value)}
                  placeholder="Buscar partitura para adicionar..."
                  style={{
                    width: '100%', padding: '10px 12px 10px 36px', fontSize: '14px', border: '1px solid var(--border)', borderRadius: '8px',
                    background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Sugestões do Repertório Ativo */}
              {!buscaPartitura && (() => {
                if (!repertorioAtivo?.partituras?.length) return null;
                const jaAdicionadas = new Set((detalhe?.partituras || []).map(p => p.partitura_id));
                const sugestoes = repertorioAtivo.partituras.filter(p => !jaAdicionadas.has(p.id));
                if (!sugestoes.length) return null;
                return (
                  <div style={{
                    marginBottom: '16px',
                    border: '1px solid rgba(212,175,55,0.25)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                  }}>
                    {/* Header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: 'rgba(212,175,55,0.08)',
                      borderBottom: '1px solid rgba(212,175,55,0.15)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill={COLORS.gold.primary} stroke="none">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                        </svg>
                        <span style={{ fontSize: '10px', fontWeight: '700', color: COLORS.gold.primary, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                          Repertório ativo — {repertorioAtivo.nome}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const jaAdicionadasNow = new Set((detalhe?.partituras || []).map(p => p.partitura_id));
                          const novas = sugestoes.filter(p => !jaAdicionadasNow.has(p.id)).map((p, i) => ({
                            id: `optimistic-${Date.now()}-${i}`,
                            partitura_id: p.id,
                            titulo: p.titulo,
                            compositor: p.compositor,
                            categoria_nome: p.categoria_nome,
                            _optimistic: true
                          }));
                          if (!novas.length) return;
                          setDetalhe(prev => ({
                            ...prev,
                            partituras: [...prev.partituras, ...novas],
                            total_partituras: prev.total_partituras + novas.length
                          }));
                          setHasChanges(true);
                        }}
                        style={{
                          fontSize: '11px', fontWeight: '700', color: COLORS.gold.primary,
                          background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
                          borderRadius: '6px', padding: '3px 8px', cursor: 'pointer'
                        }}
                      >
                        + Adicionar todas ({sugestoes.length})
                      </button>
                    </div>
                    {/* Lista */}
                    {sugestoes.map((p, idx) => (
                      <div
                        key={p.id}
                        onClick={() => handleAdicionarPartitura(p.id, repertorioAtivo.partituras)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '9px 14px', borderTop: idx === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)',
                          cursor: 'pointer', transition: 'background 0.12s',
                          background: 'rgba(255,255,255,0.02)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      >
                        <span style={{
                          fontSize: '10px', fontWeight: '800', color: 'rgba(212,175,55,0.5)',
                          minWidth: '18px', textAlign: 'center'
                        }}>{idx + 1}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{p.titulo}</span>
                          {p.compositor && (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>{p.compositor}</span>
                          )}
                          {p.categoria_nome && (
                            <span style={{
                              fontSize: '9px', padding: '1px 5px', borderRadius: '4px',
                              background: 'rgba(212,175,55,0.15)', color: COLORS.gold.primary,
                              marginLeft: '6px', fontWeight: '700'
                            }}>{p.categoria_nome}</span>
                          )}
                        </div>
                        <span style={{ fontSize: '11px', color: COLORS.green, fontWeight: '600', flexShrink: 0 }}>+ Adicionar</span>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Search results */}
              {buscaPartitura.length >= 2 && partiturasDisponiveis.length > 0 && (
                <div style={{
                  marginBottom: '16px',
                  border: '1px solid rgba(212,175,55,0.3)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.3)'
                }}>
                  <div style={{
                    fontSize: '10px', fontWeight: '700', color: COLORS.gold.primary,
                    padding: '7px 12px',
                    background: 'rgba(212,175,55,0.1)',
                    textTransform: 'uppercase', letterSpacing: '1px',
                    borderBottom: '1px solid rgba(212,175,55,0.2)'
                  }}>
                    Resultados
                  </div>
                  {partiturasDisponiveis.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleAdicionarPartitura(p.id)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.06)',
                        fontSize: '14px', cursor: 'pointer', transition: 'background 0.12s',
                        background: 'rgba(255,255,255,0.03)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{p.titulo}</span>
                        {p.compositor && (
                          <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '8px' }}>
                            {p.compositor}
                          </span>
                        )}
                        {p.categoria_nome && (
                          <span style={{
                            fontSize: '10px', padding: '2px 6px', borderRadius: '4px',
                            background: 'rgba(212,175,55,0.2)', color: COLORS.gold.primary,
                            marginLeft: '8px', fontWeight: '700'
                          }}>
                            {p.categoria_nome}
                          </span>
                        )}
                      </div>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '12px', fontWeight: '600', color: COLORS.green,
                        flexShrink: 0, marginLeft: '12px'
                      }}>
                        <PlusIcon size={13} color={COLORS.green} /> Adicionar
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {buscandoPartituras && (
                <div style={{ textAlign: 'center', padding: '8px', color: 'var(--text-muted)', fontSize: '13px', }}>
                  Buscando...
                </div>
              )}

              {/* Current partituras list */}
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{
                  fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)',
                  padding: '8px 12px',
                  background: 'var(--bg)', textTransform: 'uppercase', letterSpacing: '0.5px'
                }}>
                  Partituras tocadas no ensaio
                </div>
                {(detalhe?.partituras || []).map((p, index) => (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={() => handleDrop(index)}
                    onDragEnd={handleDragEnd}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 12px', borderTop: '1px solid var(--border)',
                      fontSize: '14px',
                      background: dragOverIndex === index && dragIndex !== index ? 'rgba(212,175,55,0.08)' : 'transparent',
                      cursor: 'grab',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                      {/* Drag handle */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, opacity: 0.5 }}>
                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                      </svg>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #D4AF37 0%, #B8960C 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '800', fontSize: '11px', color: '#1a1a1a', flexShrink: 0
                      }}>
                        {index + 1}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{
                          color: 'var(--text-primary)', fontWeight: '600',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                          {p.titulo}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{p.compositor}</span>
                          {p.categoria_nome && (
                            <span style={{
                              fontSize: '9px', padding: '1px 5px', borderRadius: '4px',
                              background: 'rgba(212,175,55,0.12)', color: COLORS.gold.primary,
                              fontWeight: '600'
                            }}>
                              {p.categoria_nome}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleRemoverPartitura(p.id, p.partitura_id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                      padding: '4px', borderRadius: '4px', transition: 'color 0.15s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = COLORS.red}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <XIcon size={16} />
                    </button>
                  </div>
                ))}
                {(detalhe?.partituras || []).length === 0 && (
                  <div style={{
                    padding: '24px', textAlign: 'center', color: 'var(--text-muted)',
                    fontSize: '14px',
                  }}>
                    Nenhuma partitura registrada
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
            <span>
              <strong style={{ color: 'var(--text-primary)', fontWeight: '800', fontSize: '15px' }}>{detalhe?.total_presentes || 0}</strong>
              <span style={{ marginLeft: '4px', textTransform: 'uppercase', fontSize: '11px', fontWeight: '500', letterSpacing: '0.5px' }}>Presentes</span>
              <span style={{ marginLeft: '4px', opacity: 0.7 }}>({percentual}%)</span>
            </span>
            <span style={{ opacity: 0.3 }}>·</span>
            <span>
              <strong style={{ color: 'var(--text-primary)', fontWeight: '800', fontSize: '15px' }}>{detalhe?.total_partituras || 0}</strong>
              <span style={{ marginLeft: '4px', textTransform: 'uppercase', fontSize: '11px', fontWeight: '500', letterSpacing: '0.5px' }}>Partituras Tocadas</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleClose} disabled={saving} style={{
              padding: '10px 24px', background: 'transparent', color: 'var(--text-muted)',
              border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}>
              Cancelar
            </button>

            <button onClick={handleSalvar} disabled={saving || (!hasChanges && youtubeUrl === originalYoutubeUrl)} style={{
              padding: '10px 24px',
              background: (saving || (!hasChanges && youtubeUrl === originalYoutubeUrl)) ? 'var(--border)' : COLORS.gold.primary,
              color: (saving || (!hasChanges && youtubeUrl === originalYoutubeUrl)) ? 'var(--text-muted)' : '#1A0507',
              border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700',
              cursor: (saving || (!hasChanges && youtubeUrl === originalYoutubeUrl)) ? 'default' : 'pointer',
              opacity: (saving || (!hasChanges && youtubeUrl === originalYoutubeUrl)) ? 0.7 : 1,
              transition: 'all 0.2s',
              boxShadow: (saving || (!hasChanges && youtubeUrl === originalYoutubeUrl)) ? 'none' : '0 4px 12px rgba(212, 175, 55, 0.3)'
            }}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarEnsaioModal;
