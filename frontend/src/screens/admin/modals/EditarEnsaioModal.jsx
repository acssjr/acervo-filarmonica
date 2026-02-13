import { useState, useEffect, useCallback } from 'react';
import API from '../../../services/api';

// Icons - use simple SVG inline icons to avoid import issues
const SearchIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

const XIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

const PlusIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="M12 5v14"/>
  </svg>
);

const COLORS = {
  gold: { primary: '#D4AF37', light: '#F4E4BC', dark: '#B8960C' },
  red: '#E85A4F',
  green: '#4CAF50',
};

const formatDatePt = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  return `${day} de ${meses[month - 1]} de ${year}`;
};

const EditarEnsaioModal = ({ ensaio, usuarios, onClose, onUpdate, addNotification }) => {
  const [abaAtiva, setAbaAtiva] = useState('presencas');
  const [loading, setLoading] = useState(true);
  const [detalhe, setDetalhe] = useState(null);
  const [buscaMusico, setBuscaMusico] = useState('');
  const [buscaPartitura, setBuscaPartitura] = useState('');
  const [partiturasDisponiveis, setPartiturasDisponiveis] = useState([]);
  const [buscandoPartituras, setBuscandoPartituras] = useState(false);

  // Load detailed rehearsal data
  const carregarDetalhe = useCallback(async () => {
    try {
      setLoading(true);
      const data = await API.getDetalheEnsaio(ensaio.data_ensaio);
      setDetalhe(data);
    } catch (error) {
      addNotification?.('Erro ao carregar detalhes do ensaio', 'error');
    } finally {
      setLoading(false);
    }
  }, [ensaio.data_ensaio, addNotification]);

  useEffect(() => { carregarDetalhe(); }, [carregarDetalhe]);

  // Presence management
  const handleRemoverPresenca = async (usuarioId) => {
    // Optimistic update
    setDetalhe(prev => ({
      ...prev,
      presentes: prev.presentes.filter(p => p.usuario_id !== usuarioId),
      total_presentes: prev.total_presentes - 1
    }));
    try {
      await API.removerPresenca(ensaio.data_ensaio, usuarioId);
      onUpdate?.();
    } catch (error) {
      carregarDetalhe(); // Rollback
      addNotification?.('Erro ao remover presença', 'error');
    }
  };

  const handleAdicionarPresenca = async (usuarioId) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    if (!usuario) return;
    // Optimistic update
    setDetalhe(prev => ({
      ...prev,
      presentes: [...prev.presentes, { usuario_id: usuarioId, nome: usuario.nome, instrumento_nome: usuario.instrumento_nome || '' }].sort((a, b) => a.nome.localeCompare(b.nome)),
      total_presentes: prev.total_presentes + 1
    }));
    setBuscaMusico('');
    try {
      await API.registrarPresencas(ensaio.data_ensaio, [usuarioId]);
      onUpdate?.();
    } catch (error) {
      carregarDetalhe(); // Rollback
      addNotification?.('Erro ao adicionar presença', 'error');
    }
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
      setPartiturasDisponiveis((result.partituras || []).filter(p => !jaAdicionadas.has(p.id)));
    } catch {
      setPartiturasDisponiveis([]);
    } finally {
      setBuscandoPartituras(false);
    }
  };

  const handleAdicionarPartitura = async (partituraId) => {
    const partitura = partiturasDisponiveis.find(p => p.id === partituraId);
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
    try {
      await API.addPartituraEnsaio(ensaio.data_ensaio, partituraId);
      onUpdate?.();
    } catch (error) {
      carregarDetalhe();
      addNotification?.('Erro ao adicionar partitura', 'error');
    }
  };

  const handleRemoverPartitura = async (epId, _partituraId) => {
    setDetalhe(prev => ({
      ...prev,
      partituras: prev.partituras.filter(p => p.id !== epId),
      total_partituras: prev.total_partituras - 1
    }));
    try {
      await API.removePartituraEnsaio(ensaio.data_ensaio, epId);
      onUpdate?.();
    } catch (error) {
      carregarDetalhe();
      addNotification?.('Erro ao remover partitura', 'error');
    }
  };

  // Filtered lists
  const presenteIds = new Set((detalhe?.presentes || []).map(p => p.usuario_id));
  const ausentes = usuarios
    .filter(u => !presenteIds.has(u.id) && u.ativo !== false)
    .filter(u => !buscaMusico || u.nome.toLowerCase().includes(buscaMusico.toLowerCase()));

  const percentual = usuarios.length > 0
    ? Math.min(100, Math.round(((detalhe?.total_presentes || 0) / usuarios.length) * 100))
    : 0;

  return (
    <div onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '16px', maxWidth: '640px', width: '100%',
        maxHeight: '85vh', display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
        }}>
          <div>
            <h3 style={{
              fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: '700',
              color: 'var(--text-primary)', margin: 0
            }}>
              Editar Ensaio
            </h3>
            <p style={{
              fontFamily: 'Outfit, sans-serif', fontSize: '14px', color: 'var(--text-muted)',
              margin: '4px 0 0'
            }}>
              {formatDatePt(ensaio.data_ensaio)}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
            padding: '4px'
          }}>
            <XIcon size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '0', padding: '16px 24px 0',
          borderBottom: '1px solid var(--border)'
        }}>
          {[
            { id: 'presencas', label: `Presenças (${detalhe?.total_presentes || 0})` },
            { id: 'partituras', label: `Partituras (${detalhe?.total_partituras || 0})` }
          ].map(tab => (
            <button key={tab.id} onClick={() => setAbaAtiva(tab.id)} style={{
              padding: '10px 20px', fontFamily: 'Outfit, sans-serif', fontSize: '14px',
              fontWeight: abaAtiva === tab.id ? '600' : '400', border: 'none', background: 'none',
              color: abaAtiva === tab.id ? COLORS.gold.primary : 'var(--text-muted)',
              borderBottom: abaAtiva === tab.id ? `2px solid ${COLORS.gold.primary}` : '2px solid transparent',
              cursor: 'pointer', transition: 'all 0.15s', marginBottom: '-1px'
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif' }}>
              Carregando...
            </div>
          ) : !detalhe ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif' }}>
              Erro ao carregar dados
            </div>
          ) : abaAtiva === 'presencas' ? (
            <div>
              {/* Summary bar */}
              <div style={{
                fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif',
                marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  {detalhe.total_presentes}
                </span>
                presentes de {usuarios.length} ativos ({percentual}%)
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
                    width: '100%', padding: '10px 12px 10px 36px', fontFamily: 'Outfit, sans-serif',
                    fontSize: '14px', border: '1px solid var(--border)', borderRadius: '8px',
                    background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Absent musicians (when searching) */}
              {buscaMusico && ausentes.length > 0 && (
                <div style={{
                  marginBottom: '16px', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden'
                }}>
                  <div style={{
                    fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)',
                    fontFamily: 'Outfit, sans-serif', padding: '8px 12px',
                    background: 'var(--bg)', textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    Ausentes
                  </div>
                  {ausentes.slice(0, 8).map(u => (
                    <div key={u.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', borderTop: '1px solid var(--border)',
                      fontSize: '14px', fontFamily: 'Outfit, sans-serif'
                    }}>
                      <div>
                        <span style={{ color: 'var(--text-primary)' }}>{u.nome}</span>
                        {u.instrumento_nome && (
                          <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '8px' }}>
                            {u.instrumento_nome}
                          </span>
                        )}
                      </div>
                      <button onClick={() => handleAdicionarPresenca(u.id)} style={{
                        background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
                        padding: '4px 8px', cursor: 'pointer', color: COLORS.green,
                        display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px',
                        fontFamily: 'Outfit, sans-serif'
                      }}>
                        <PlusIcon size={14} color={COLORS.green} /> Adicionar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Present musicians list */}
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{
                  fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)',
                  fontFamily: 'Outfit, sans-serif', padding: '8px 12px',
                  background: 'var(--bg)', textTransform: 'uppercase', letterSpacing: '0.5px'
                }}>
                  Presentes
                </div>
                {(detalhe.presentes || []).map(p => (
                  <div key={p.usuario_id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', borderTop: '1px solid var(--border)',
                    fontSize: '14px', fontFamily: 'Outfit, sans-serif'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-primary)' }}>{p.nome}</span>
                      {p.instrumento_nome && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '8px' }}>
                          {p.instrumento_nome}
                        </span>
                      )}
                    </div>
                    <button onClick={() => handleRemoverPresenca(p.usuario_id)} style={{
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
                {(detalhe.presentes || []).length === 0 && (
                  <div style={{
                    padding: '24px', textAlign: 'center', color: 'var(--text-muted)',
                    fontSize: '14px', fontFamily: 'Outfit, sans-serif'
                  }}>
                    Nenhum músico presente
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Partituras tab */
            <div>
              {/* Search to add partituras */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
                  <SearchIcon size={16} color="var(--text-muted)" />
                </div>
                <input
                  type="text" value={buscaPartitura} onChange={e => buscarPartituras(e.target.value)}
                  placeholder="Buscar partitura para adicionar..."
                  style={{
                    width: '100%', padding: '10px 12px 10px 36px', fontFamily: 'Outfit, sans-serif',
                    fontSize: '14px', border: '1px solid var(--border)', borderRadius: '8px',
                    background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Search results */}
              {buscaPartitura.length >= 2 && partiturasDisponiveis.length > 0 && (
                <div style={{
                  marginBottom: '16px', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden'
                }}>
                  <div style={{
                    fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)',
                    fontFamily: 'Outfit, sans-serif', padding: '8px 12px',
                    background: 'var(--bg)', textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    Resultados
                  </div>
                  {partiturasDisponiveis.map(p => (
                    <div key={p.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', borderTop: '1px solid var(--border)',
                      fontSize: '14px', fontFamily: 'Outfit, sans-serif'
                    }}>
                      <div>
                        <span style={{ color: 'var(--text-primary)' }}>{p.titulo}</span>
                        {p.compositor && (
                          <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '8px' }}>
                            {p.compositor}
                          </span>
                        )}
                        {p.categoria_nome && (
                          <span style={{
                            fontSize: '10px', padding: '2px 6px', borderRadius: '4px',
                            background: 'rgba(212,175,55,0.15)', color: COLORS.gold.primary,
                            marginLeft: '8px', fontWeight: '600'
                          }}>
                            {p.categoria_nome}
                          </span>
                        )}
                      </div>
                      <button onClick={() => handleAdicionarPartitura(p.id)} style={{
                        background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
                        padding: '4px 8px', cursor: 'pointer', color: COLORS.green,
                        display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px',
                        fontFamily: 'Outfit, sans-serif'
                      }}>
                        <PlusIcon size={14} color={COLORS.green} /> Adicionar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {buscandoPartituras && (
                <div style={{ textAlign: 'center', padding: '8px', color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'Outfit' }}>
                  Buscando...
                </div>
              )}

              {/* Current partituras list */}
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{
                  fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)',
                  fontFamily: 'Outfit, sans-serif', padding: '8px 12px',
                  background: 'var(--bg)', textTransform: 'uppercase', letterSpacing: '0.5px'
                }}>
                  Partituras do ensaio
                </div>
                {(detalhe?.partituras || []).map(p => (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', borderTop: '1px solid var(--border)',
                    fontSize: '14px', fontFamily: 'Outfit, sans-serif'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-primary)' }}>{p.titulo}</span>
                      {p.compositor && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '8px' }}>
                          {p.compositor}
                        </span>
                      )}
                      {p.categoria_nome && (
                        <span style={{
                          fontSize: '10px', padding: '2px 6px', borderRadius: '4px',
                          background: 'rgba(212,175,55,0.15)', color: COLORS.gold.primary,
                          marginLeft: '8px', fontWeight: '600'
                        }}>
                          {p.categoria_nome}
                        </span>
                      )}
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
                    fontSize: '14px', fontFamily: 'Outfit, sans-serif'
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
          <span style={{
            fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif'
          }}>
            {detalhe?.total_presentes || 0} presentes ({percentual}%) · {detalhe?.total_partituras || 0} partituras
          </span>
          <button onClick={onClose} style={{
            padding: '10px 24px', background: COLORS.gold.primary, color: '#FFFFFF',
            border: 'none', borderRadius: '8px', fontFamily: 'Outfit, sans-serif',
            fontSize: '14px', fontWeight: '600', cursor: 'pointer'
          }}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarEnsaioModal;
