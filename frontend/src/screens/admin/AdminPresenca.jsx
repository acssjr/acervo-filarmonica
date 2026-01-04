// ===== ADMIN PRESENÇA =====
// Gerenciamento de presenças em ensaios + partituras tocadas

import { useState, useEffect, useMemo } from 'react';
import { useUI } from '@contexts/UIContext';
import { API } from '@services/api';
import { COLORS } from '@constants/colors';
import { UserListSkeleton } from '@components/common/Skeleton';

// ===== SVG ICONS MODERNOS =====
const CalendarIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CheckCircleIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const XCircleIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const MusicIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const UsersIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SearchIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const TrashIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const EditIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const RefreshIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" />
    <polyline points="23 20 23 14 17 14" />
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
  </svg>
);

const PlusIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const AdminPresenca = () => {
  const { showToast } = useUI();
  const [usuarios, setUsuarios] = useState([]);

  // Função para encontrar o último ensaio (última segunda ou quarta que já passou)
  const getUltimoEnsaio = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataAtual = new Date(hoje);

    // Procurar a última segunda ou quarta que já passou
    while (true) {
      const diaSemana = dataAtual.getDay();

      // Se for segunda (1) ou quarta (3)
      if (diaSemana === 1 || diaSemana === 3) {
        return dataAtual.toISOString().split('T')[0];
      }

      // Voltar 1 dia
      dataAtual.setDate(dataAtual.getDate() - 1);

      // Segurança: não voltar mais de 7 dias
      const diff = Math.abs(hoje - dataAtual) / (1000 * 60 * 60 * 24);
      if (diff > 7) {
        return hoje.toISOString().split('T')[0];
      }
    }
  };

  const [dataEnsaio, setDataEnsaio] = useState(getUltimoEnsaio());
  const [selecionados, setSelecionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [modoMarcacao, setModoMarcacao] = useState('ausentes'); // 'presentes' ou 'ausentes'

  // Estado para gestão de partituras
  const [partituras, setPartituras] = useState([]);
  const [partiturasEnsaio, setPartiturasEnsaio] = useState([]);
  const [buscaPartitura, setBuscaPartitura] = useState('');
  const [loadingPartituras, setLoadingPartituras] = useState(false);

  // Estado para edição/exclusão
  const [ensaioEditando, setEnsaioEditando] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);

  // Carregar dados
  const loadData = async () => {
    setLoading(true);
    try {
      const [users, presencas, todasPartituras] = await Promise.all([
        API.getUsuarios(),
        API.getTodasPresencas(),
        API.getPartituras()
      ]);

      // Filtrar apenas músicos ativos (excluir admins)
      const musicos = (users || []).filter(u => u.admin === 0 && u.ativo === 1);
      setUsuarios(musicos);
      setHistorico(presencas?.ensaios || []);
      setPartituras(todasPartituras?.partituras || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      showToast('Erro ao carregar dados', 'error');
    }
    setLoading(false);
  };

  // Carregar partituras do ensaio selecionado
  const loadPartiturasEnsaio = async (data) => {
    try {
      const result = await API.getPartiturasEnsaio(data);
      setPartiturasEnsaio(result.partituras || []);
    } catch (error) {
      console.error('Erro ao carregar partituras do ensaio:', error);
      setPartiturasEnsaio([]);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carregar partituras quando data mudar
  useEffect(() => {
    if (dataEnsaio) {
      loadPartiturasEnsaio(dataEnsaio);
    }
  }, [dataEnsaio]);

  // Toggle seleção individual
  const toggleUsuario = (usuarioId) => {
    setSelecionados(prev =>
      prev.includes(usuarioId)
        ? prev.filter(id => id !== usuarioId)
        : [...prev, usuarioId]
    );
  };

  // Marcar todos
  const marcarTodos = () => {
    setSelecionados(usuarios.map(u => u.id));
  };

  // Desmarcar todos
  const desmarcarTodos = () => {
    setSelecionados([]);
  };

  // Inverter seleção
  const inverterSelecao = () => {
    const naoSelecionados = usuarios.filter(u => !selecionados.includes(u.id)).map(u => u.id);
    setSelecionados(naoSelecionados);
  };

  // Marcar presença
  const handleMarcarPresenca = async () => {
    if (selecionados.length === 0) {
      showToast('Selecione pelo menos um músico', 'warning');
      return;
    }

    // Se modo = ausentes, inverter para registrar os presentes
    const idsParaRegistrar = modoMarcacao === 'ausentes'
      ? usuarios.filter(u => !selecionados.includes(u.id)).map(u => u.id)
      : selecionados;

    if (idsParaRegistrar.length === 0) {
      showToast('Nenhum músico presente para registrar', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      await API.registrarPresencas(dataEnsaio, idsParaRegistrar);

      showToast(
        `Presença registrada: ${idsParaRegistrar.length} músico${idsParaRegistrar.length !== 1 ? 's' : ''}`,
        'success'
      );

      // Limpar seleção e recarregar dados
      setSelecionados([]);
      await loadData();
    } catch (error) {
      console.error('Erro ao marcar presença:', error);
      showToast(error.message || 'Erro ao marcar presença', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Adicionar partitura ao ensaio
  const handleAdicionarPartitura = async (partituraId) => {
    try {
      setLoadingPartituras(true);
      await API.addPartituraEnsaio(dataEnsaio, partituraId);
      showToast('Partitura adicionada', 'success');
      await loadPartiturasEnsaio(dataEnsaio);
      setBuscaPartitura('');
    } catch (error) {
      console.error('Erro ao adicionar partitura:', error);
      showToast(error.message || 'Erro ao adicionar partitura', 'error');
    } finally {
      setLoadingPartituras(false);
    }
  };

  // Remover partitura do ensaio
  const handleRemoverPartitura = async (id) => {
    try {
      setLoadingPartituras(true);
      await API.removePartituraEnsaio(dataEnsaio, id);
      showToast('Partitura removida', 'success');
      await loadPartiturasEnsaio(dataEnsaio);
    } catch (error) {
      console.error('Erro ao remover partitura:', error);
      showToast(error.message || 'Erro ao remover partitura', 'error');
    } finally {
      setLoadingPartituras(false);
    }
  };

  // Editar ensaio
  const handleEditarEnsaio = (ensaio) => {
    setEnsaioEditando(ensaio);
    setModalEdicaoAberto(true);
  };

  // Excluir ensaio
  const handleExcluirEnsaio = async (ensaio) => {
    if (!confirm(`Excluir ensaio de ${ensaio.data_formatada}?`)) {
      return;
    }

    try {
      // TODO: Criar endpoint DELETE /api/ensaios/:data para excluir tudo
      // Por enquanto, vamos mostrar mensagem
      showToast('Funcionalidade de exclusão será implementada no backend', 'warning');
    } catch (error) {
      console.error('Erro ao excluir ensaio:', error);
      showToast(error.message || 'Erro ao excluir ensaio', 'error');
    }
  };

  // Data máxima = hoje
  const dataMaxima = useMemo(() => {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0];
  }, []);

  // Filtrar partituras pela busca
  const partiturasFiltered = useMemo(() => {
    if (!buscaPartitura.trim()) return [];

    const termo = buscaPartitura.toLowerCase();
    const idsJaAdicionados = new Set(partiturasEnsaio.map(p => p.partitura_id));

    return partituras
      .filter(p => !idsJaAdicionados.has(p.id))
      .filter(p =>
        p.titulo.toLowerCase().includes(termo) ||
        p.compositor.toLowerCase().includes(termo)
      )
      .slice(0, 5); // Máximo 5 resultados
  }, [buscaPartitura, partituras, partiturasEnsaio]);

  // Contar presentes/ausentes com base no modo
  const contadorTexto = useMemo(() => {
    if (modoMarcacao === 'presentes') {
      return `${selecionados.length} selecionado${selecionados.length !== 1 ? 's' : ''}`;
    } else {
      const presentes = usuarios.length - selecionados.length;
      return `${presentes} presente${presentes !== 1 ? 's' : ''}, ${selecionados.length} ausente${selecionados.length !== 1 ? 's' : ''}`;
    }
  }, [modoMarcacao, selecionados.length, usuarios.length]);

  if (loading) return <UserListSkeleton />;

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '12px',
          color: 'var(--text-primary)',
          letterSpacing: '-0.5px'
        }}>
          Controle de Presença
        </h1>
        <p style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '16px',
          color: 'var(--text-muted)',
          lineHeight: '1.5'
        }}>
          Registre a presença dos músicos e gerencie as partituras tocadas nos ensaios
        </p>
      </div>

      {/* Controles Principais */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* Data do Ensaio */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <CalendarIcon size={24} color="#D4AF37" />
            <label style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              Data do Ensaio
            </label>
          </div>
          <input
            type="date"
            value={dataEnsaio}
            max={dataMaxima}
            onChange={(e) => setDataEnsaio(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              color: 'var(--text-primary)',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
              colorScheme: 'dark'
            }}
          />
        </div>

        {/* Modo de Marcação */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            {modoMarcacao === 'presentes' ? (
              <CheckCircleIcon size={24} color={COLORS.success} />
            ) : (
              <XCircleIcon size={24} color="#E85A4F" />
            )}
            <label style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              Modo de Marcação
            </label>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setModoMarcacao('presentes')}
              style={{
                flex: 1,
                padding: '14px 20px',
                background: modoMarcacao === 'presentes' ? COLORS.success : 'var(--bg)',
                color: modoMarcacao === 'presentes' ? '#FFFFFF' : 'var(--text-primary)',
                border: `2px solid ${modoMarcacao === 'presentes' ? COLORS.success : 'var(--border)'}`,
                borderRadius: '10px',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <CheckCircleIcon size={18} />
              Presentes
            </button>
            <button
              onClick={() => setModoMarcacao('ausentes')}
              style={{
                flex: 1,
                padding: '14px 20px',
                background: modoMarcacao === 'ausentes' ? '#E85A4F' : 'var(--bg)',
                color: modoMarcacao === 'ausentes' ? '#FFFFFF' : 'var(--text-primary)',
                border: `2px solid ${modoMarcacao === 'ausentes' ? '#E85A4F' : 'var(--border)'}`,
                borderRadius: '10px',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <XCircleIcon size={18} />
              Ausentes
            </button>
          </div>
        </div>
      </div>

      {/* Grid Principal: Músicos + Partituras */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* Seção: Músicos */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '28px'
        }}>
          {/* Header da Seção */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <UsersIcon size={24} color="#D4AF37" />
              <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Músicos ({contadorTexto})
              </h2>
            </div>

            {/* Botões de Controle */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={marcarTodos}
                style={{
                  padding: '8px 14px',
                  background: 'var(--bg)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Marcar Todos
              </button>
              <button
                onClick={desmarcarTodos}
                style={{
                  padding: '8px 14px',
                  background: 'var(--bg)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Limpar
              </button>
              <button
                onClick={inverterSelecao}
                style={{
                  padding: '8px 14px',
                  background: 'var(--bg)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RefreshIcon size={14} />
                Inverter
              </button>
            </div>
          </div>

          {/* Lista de Músicos */}
          <div style={{
            maxHeight: '500px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {usuarios.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-muted)',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px'
              }}>
                Nenhum músico cadastrado
              </div>
            ) : (
              usuarios.map((usuario) => {
                const isSelected = selecionados.includes(usuario.id);
                const accentColor = modoMarcacao === 'presentes' ? COLORS.success : '#E85A4F';

                return (
                  <label
                    key={usuario.id}
                    className="usuario-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 16px',
                      background: isSelected ? `${accentColor}10` : 'var(--bg)',
                      border: `1px solid ${isSelected ? accentColor : 'var(--border)'}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'Outfit, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = `${accentColor}05`;
                        e.currentTarget.style.borderColor = accentColor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'var(--bg)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleUsuario(usuario.id)}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: accentColor,
                        cursor: 'pointer'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: '2px'
                      }}>
                        {usuario.nome}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: 'var(--text-muted)'
                      }}>
                        {usuario.instrumento_nome}
                      </div>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>

        {/* Seção: Partituras Tocadas */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '28px'
        }}>
          {/* Header da Seção */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <MusicIcon size={24} color="#D4AF37" />
              <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Partituras Tocadas ({partiturasEnsaio.length})
              </h2>
            </div>

            {/* Campo de Busca */}
            <div style={{ position: 'relative' }}>
              <SearchIcon
                size={18}
                color="#D4AF37"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="text"
                placeholder="Buscar partitura..."
                value={buscaPartitura}
                onChange={(e) => setBuscaPartitura(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  color: 'var(--text-primary)',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Resultados da Busca */}
            {buscaPartitura.trim() && (
              <div style={{
                marginTop: '12px',
                maxHeight: '200px',
                overflowY: 'auto',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                background: 'var(--bg)'
              }}>
                {partiturasFiltered.length === 0 ? (
                  <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '13px',
                    fontFamily: 'Outfit, sans-serif'
                  }}>
                    Nenhuma partitura encontrada
                  </div>
                ) : (
                  partiturasFiltered.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleAdicionarPartitura(p.id)}
                      disabled={loadingPartituras}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--border)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontFamily: 'Outfit, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'background 0.2s'
                      }}
                    >
                      <PlusIcon size={16} color="#D4AF37" />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'var(--text-primary)',
                          marginBottom: '2px'
                        }}>
                          {p.titulo}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: 'var(--text-muted)'
                        }}>
                          {p.compositor}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Lista de Partituras do Ensaio */}
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {partiturasEnsaio.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-muted)',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px'
              }}>
                Nenhuma partitura adicionada
              </div>
            ) : (
              partiturasEnsaio.map((p, index) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 16px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    fontFamily: 'Outfit, sans-serif'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(145deg, #D4AF37, #F4E4BC)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '14px',
                    color: '#3D1011',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {p.titulo}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {p.compositor}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoverPartitura(p.id)}
                    disabled={loadingPartituras}
                    style={{
                      padding: '8px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      transition: 'color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <TrashIcon size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Botão de Ação Principal */}
      <button
        onClick={handleMarcarPresenca}
        disabled={submitting || selecionados.length === 0}
        style={{
          width: '100%',
          padding: '18px 24px',
          background: modoMarcacao === 'presentes' ? COLORS.success : '#E85A4F',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '12px',
          fontFamily: 'Outfit, sans-serif',
          fontSize: '16px',
          fontWeight: '700',
          cursor: submitting || selecionados.length === 0 ? 'not-allowed' : 'pointer',
          opacity: submitting || selecionados.length === 0 ? 0.5 : 1,
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '48px'
        }}
      >
        {modoMarcacao === 'presentes' ? (
          <CheckCircleIcon size={22} />
        ) : (
          <XCircleIcon size={22} />
        )}
        {submitting ? 'Registrando...' : `Marcar ${contadorTexto}`}
      </button>

      {/* Histórico de Ensaios */}
      <div>
        <h2 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '24px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '24px',
          letterSpacing: '-0.3px'
        }}>
          Ensaios Anteriores
        </h2>

        {historico.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '15px'
          }}>
            Nenhum ensaio registrado
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {historico.map((ensaio) => (
              <div
                key={ensaio.data}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '24px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'linear-gradient(145deg, #D4AF37, #F4E4BC)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '800',
                    color: '#3D1011',
                    fontFamily: 'Outfit, sans-serif',
                    lineHeight: 1
                  }}>
                    {(() => {
                      try {
                        const [, , dia] = ensaio.data.split('-');
                        return dia || '?';
                      } catch {
                        return '?';
                      }
                    })()}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#3D1011',
                    fontFamily: 'Outfit, sans-serif',
                    textTransform: 'uppercase',
                    marginTop: '2px'
                  }}>
                    {(() => {
                      try {
                        const [, mes] = ensaio.data.split('-');
                        const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
                        return meses[parseInt(mes) - 1] || '?';
                      } catch {
                        return '?';
                      }
                    })()}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    fontFamily: 'Outfit, sans-serif',
                    marginBottom: '6px'
                  }}>
                    {ensaio.data_formatada}
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    fontFamily: 'Outfit, sans-serif'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <UsersIcon size={16} />
                      {ensaio.total_presentes} presente{ensaio.total_presentes !== 1 ? 's' : ''}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MusicIcon size={16} />
                      {ensaio.total_partituras} música{ensaio.total_partituras !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEditarEnsaio(ensaio)}
                    style={{
                      padding: '10px 18px',
                      background: 'var(--bg)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <EditIcon size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluirEnsaio(ensaio)}
                    style={{
                      padding: '10px',
                      background: 'var(--bg)',
                      color: '#E85A4F',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <TrashIcon size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Edição (placeholder) */}
      {modalEdicaoAberto && ensaioEditando && (
        <div
          onClick={() => setModalEdicaoAberto(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%'
            }}
          >
            <h3 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '16px'
            }}>
              Editar Ensaio - {ensaioEditando.data_formatada}
            </h3>
            <p style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14px',
              color: 'var(--text-muted)',
              marginBottom: '24px'
            }}>
              Funcionalidade de edição será implementada em breve.
            </p>
            <button
              onClick={() => setModalEdicaoAberto(false)}
              style={{
                padding: '12px 24px',
                background: COLORS.primary,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPresenca;
