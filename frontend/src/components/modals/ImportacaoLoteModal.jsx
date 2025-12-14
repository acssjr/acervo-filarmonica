// ===== IMPORTACAO LOTE MODAL =====
// Modal fullscreen para importação massiva de partituras
// Estados: SELECTION -> ANALYZING -> FEEDBACK -> REVIEW -> UPLOADING -> COMPLETE

import { useState, useEffect, useCallback, useRef } from 'react';
import { useUI } from '@contexts/UIContext';
import { API } from '@services/api';
import LottieAnimation from '@components/animations/LottieAnimation';
import { processarLote, processarFileList, filtrarPorStatus, calcularResultado } from '@utils/batchParser';
import { uploadLote, estimarTempo, gerarResumo } from '@utils/uploadBatch';

// Estados do modal
const STATES = {
  SELECTION: 'selection',
  ANALYZING: 'analyzing',
  FEEDBACK: 'feedback',
  REVIEW: 'review',
  UPLOADING: 'uploading',
  COMPLETE: 'complete'
};

// Tabs de revisão
const TABS = {
  ALL: 'all',
  READY: 'ready',
  ATTENTION: 'attention',
  PROBLEM: 'problem'
};

const ImportacaoLoteModal = ({ isOpen, onClose, onSuccess, onOpenUploadPasta, initialItems }) => {
  const { showToast } = useUI();

  // Estado principal
  const [modalState, setModalState] = useState(STATES.SELECTION);
  const [categorias, setCategorias] = useState([]);

  // Dados de análise
  const [pastas, setPastas] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [analyzeProgress, setAnalyzeProgress] = useState({ processadas: 0, total: 0, percentual: 0 });
  const [partiturasExistentes, setPartiturasExistentes] = useState([]);

  // Revisão
  const [activeTab, setActiveTab] = useState(TABS.ALL);
  const [pastaExpandida, setPastaExpandida] = useState(null);

  // Upload
  const [uploadProgress, setUploadProgress] = useState({ processadas: 0, total: 0, percentual: 0, pastaAtual: '' });
  const [uploadResultados, setUploadResultados] = useState(null);
  const [funnyPhraseIndex, setFunnyPhraseIndex] = useState(0);

  // Frases engraçadas para mostrar durante o upload
  const funnyPhrases = [
    'Adicionando os últimos detalhes...',
    'Refinando a visualização das partituras...',
    'Escrevendo o próximo Dobrado Tusca...',
    'Removendo o Dobrado Ludgero da próxima apresentação...',
    'Ratando a primeira nota de Preta Pretinha...',
    'Esperando João Viana voltar do banheiro...',
    'Deixando Julielson menos durinho no pandeiro...',
    'Afinando os pistões virtuais...',
    'Procurando a partitura perdida do saxofone...',
    'Ajustando o compasso que ninguém acerta...',
    'Adicionando mais uma fermata só de sacanagem...',
    'Verificando se o bombardino está acordado...',
    'Calibrando o volume da tuba...',
    'Inserindo pausas estratégicas para o café...',
    'Convencendo o maestro que está tudo certo...',
    'Organizando as estantes de partitura...'
  ];

  // UI
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Handler para abrir o seletor de pasta (usa getElementById como no UploadPastaModal)
  const handleClickToSelect = () => {
    console.log('=== DEBUG: handleClickToSelect chamado ===');
    const input = document.getElementById('batch-folder-input');
    console.log('input via getElementById:', input);
    if (input) {
      input.value = ''; // Reset para permitir re-seleção
      input.click();
      console.log('=== DEBUG: click() executado ===');
    } else {
      console.error('=== DEBUG: input é null! ===');
    }
  };

  // Carrega categorias e partituras existentes
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, partituras] = await Promise.all([
          API.getCategorias(),
          API.getPartituras()
        ]);
        setCategorias(cats || []);
        setPartiturasExistentes(partituras || []);
      } catch {
        console.error('Erro ao carregar dados');
      }
    };
    if (isOpen) loadData();
  }, [isOpen]);

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      setModalState(STATES.SELECTION);
      setPastas([]);
      setEstatisticas(null);
      setAnalyzeProgress({ processadas: 0, total: 0, percentual: 0 });
      setActiveTab(TABS.ALL);
      setPastaExpandida(null);
      setUploadProgress({ processadas: 0, total: 0, percentual: 0, pastaAtual: '' });
      setUploadResultados(null);
      setFunnyPhraseIndex(0);
    }
  }, [isOpen]);

  // Alterna frases engraçadas durante upload
  useEffect(() => {
    if (modalState === STATES.UPLOADING) {
      const interval = setInterval(() => {
        setFunnyPhraseIndex(prev => (prev + 1) % funnyPhrases.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [modalState, funnyPhrases.length]);

  // Processa items pré-carregados (drag & drop global)
  useEffect(() => {
    const processInitialItems = async () => {
      if (!isOpen || !initialItems || initialItems.length === 0 || categorias.length === 0 || partiturasExistentes === null) return;
      if (modalState !== STATES.SELECTION) return; // Só processa se estiver no estado inicial

      setModalState(STATES.ANALYZING);

      try {
        const { pastas: pastasAnalisadas, estatisticas: stats } = await processarLote(
          initialItems,
          categorias,
          partiturasExistentes,
          setAnalyzeProgress
        );

        if (pastasAnalisadas.length === 0) {
          showToast('Nenhuma pasta com PDFs encontrada', 'error');
          setModalState(STATES.SELECTION);
          return;
        }

        setPastas(pastasAnalisadas);
        setEstatisticas(stats);

        setModalState(STATES.FEEDBACK);
        setTimeout(() => {
          setModalState(STATES.REVIEW);
        }, 2500);

      } catch (err) {
        console.error('Erro na análise:', err);
        showToast('Erro ao analisar pastas', 'error');
        setModalState(STATES.SELECTION);
      }
    };

    processInitialItems();
  }, [isOpen, initialItems, categorias, partiturasExistentes, modalState, showToast]);

  // Handlers de Drag & Drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    if (!items || items.length === 0) return;

    // Inicia análise
    setModalState(STATES.ANALYZING);

    try {
      const { pastas: pastasAnalisadas, estatisticas: stats } = await processarLote(
        items,
        categorias,
        partiturasExistentes,
        setAnalyzeProgress
      );

      if (pastasAnalisadas.length === 0) {
        showToast('Nenhuma pasta com PDFs encontrada', 'error');
        setModalState(STATES.SELECTION);
        return;
      }

      setPastas(pastasAnalisadas);
      setEstatisticas(stats);

      // Mostra feedback por 2 segundos
      setModalState(STATES.FEEDBACK);
      setTimeout(() => {
        setModalState(STATES.REVIEW);
      }, 2500);

    } catch (err) {
      console.error('Erro na análise:', err);
      showToast('Erro ao analisar pastas', 'error');
      setModalState(STATES.SELECTION);
    }
  };

  // Handler de input file (fallback)
  const handleFileSelect = async (e) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setModalState(STATES.ANALYZING);

    try {
      const { pastas: pastasAnalisadas, estatisticas: stats } = await processarFileList(
        fileList,
        categorias,
        partiturasExistentes,
        setAnalyzeProgress
      );

      if (pastasAnalisadas.length === 0) {
        showToast('Nenhuma pasta com PDFs encontrada', 'error');
        setModalState(STATES.SELECTION);
        return;
      }

      setPastas(pastasAnalisadas);
      setEstatisticas(stats);

      setModalState(STATES.FEEDBACK);
      setTimeout(() => {
        setModalState(STATES.REVIEW);
      }, 2500);

    } catch (err) {
      console.error('Erro na análise:', err);
      showToast('Erro ao analisar pastas', 'error');
      setModalState(STATES.SELECTION);
    }
  };

  // Toggle seleção de pasta
  const togglePastaSelecionada = useCallback((pastaId) => {
    setPastas(prev => prev.map(p =>
      p.id === pastaId ? { ...p, selecionada: !p.selecionada } : p
    ));
  }, []);

  // Selecionar/deselecionar todas
  const toggleTodas = useCallback((selecionar) => {
    setPastas(prev => prev.map(p => ({ ...p, selecionada: selecionar })));
  }, []);

  // Editar categoria de uma pasta
  const editarCategoria = useCallback((pastaId, novaCategoria) => {
    setPastas(prev => prev.map(p => {
      if (p.id !== pastaId) return p;

      const atualizada = { ...p, categoria: novaCategoria };

      // Recalcula status
      if (novaCategoria && p.status === 'attention' && p.statusMotivo === 'Categoria não detectada') {
        atualizada.status = 'ready';
        atualizada.statusMotivo = null;
      }

      return atualizada;
    }));
  }, []);

  // Editar título de uma pasta
  const editarTitulo = useCallback((pastaId, novoTitulo) => {
    setPastas(prev => prev.map(p =>
      p.id === pastaId ? { ...p, titulo: novoTitulo } : p
    ));
  }, []);

  // Editar compositor de uma pasta
  const editarCompositor = useCallback((pastaId, novoCompositor) => {
    setPastas(prev => prev.map(p =>
      p.id === pastaId ? { ...p, compositor: novoCompositor } : p
    ));
  }, []);

  // Editar arranjador de uma pasta
  const editarArranjador = useCallback((pastaId, novoArranjador) => {
    setPastas(prev => prev.map(p =>
      p.id === pastaId ? { ...p, arranjador: novoArranjador } : p
    ));
  }, []);

  // Iniciar upload
  const iniciarUpload = async () => {
    const pastasParaUpload = pastas.filter(p => p.selecionada && p.status !== 'problem');

    if (pastasParaUpload.length === 0) {
      showToast('Nenhuma partitura selecionada para upload', 'error');
      return;
    }

    setModalState(STATES.UPLOADING);
    setUploadProgress({ processadas: 0, total: pastasParaUpload.length, percentual: 0, pastaAtual: '' });

    try {
      const { resultados, estatisticas: stats } = await uploadLote(
        pastasParaUpload,
        {
          onProgress: setUploadProgress,
          onPastaError: ({ pasta, error }) => {
            console.error(`Erro no upload de ${pasta.titulo}:`, error);
          }
        }
      );

      setUploadResultados({ resultados, estatisticas: stats });
      setModalState(STATES.COMPLETE);

      if (stats.sucesso > 0) {
        onSuccess?.();
      }

    } catch (err) {
      console.error('Erro no upload:', err);
      showToast('Erro durante o upload', 'error');
      setModalState(STATES.REVIEW);
    }
  };

  // Abrir pasta com problema no modal individual
  const abrirPastaNoModalIndividual = (pasta) => {
    if (onOpenUploadPasta) {
      onOpenUploadPasta(pasta);
      // Remove a pasta da lista atual
      setPastas(prev => prev.filter(p => p.id !== pasta.id));
    }
  };

  // Filtra pastas para exibição
  const pastasFiltradas = filtrarPorStatus(pastas, activeTab);

  // Contadores por status
  const contadores = {
    all: pastas.length,
    ready: pastas.filter(p => p.status === 'ready').length,
    attention: pastas.filter(p => p.status === 'attention').length,
    problem: pastas.filter(p => p.status === 'problem').length
  };

  // Pastas selecionadas para upload (exclui problemas)
  const pastasSelecionadas = pastas.filter(p => p.selecionada && p.status !== 'problem');

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: modalState === STATES.REVIEW ? '900px' : '600px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'Outfit, sans-serif',
          transition: 'max-width 0.3s ease'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '4px'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                <path d="M12 11v6M9 14h6"/>
              </svg>
              Importação em Lote
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {modalState === STATES.SELECTION && 'Arraste uma pasta contendo várias partituras'}
              {modalState === STATES.ANALYZING && 'Analisando estrutura das pastas...'}
              {modalState === STATES.FEEDBACK && 'Análise concluída!'}
              {modalState === STATES.REVIEW && `${contadores.all} partitura${contadores.all !== 1 ? 's' : ''} detectada${contadores.all !== 1 ? 's' : ''}`}
              {modalState === STATES.UPLOADING && 'Enviando partituras...'}
              {modalState === STATES.COMPLETE && 'Upload finalizado!'}
            </p>
          </div>

          {/* Botão fechar */}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-primary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Input de arquivo com ID para acesso via getElementById */}
        <input
          ref={fileInputRef}
          id="batch-folder-input"
          type="file"
          webkitdirectory=""
          directory=""
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px'
        }}>
          {/* SELECTION STATE */}
          {modalState === STATES.SELECTION && (
            <div
              onClick={handleClickToSelect}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                display: 'block',
                border: isDragging ? '2px dashed #D4AF37' : '2px dashed var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '60px 40px',
                textAlign: 'center',
                background: isDragging
                  ? 'linear-gradient(145deg, rgba(212, 175, 55, 0.15) 0%, rgba(184, 134, 11, 0.08) 100%)'
                  : 'var(--bg-primary)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: isDragging ? 'scale(1.02)' : 'scale(1)'
              }}
            >

              <div style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 24px',
                borderRadius: '24px',
                background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  <path d="M12 11v6M9 14h6" opacity="0.6"/>
                </svg>
              </div>

              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: isDragging ? '#D4AF37' : 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                {isDragging ? 'Solte as pastas aqui!' : 'Arraste uma pasta ou clique para selecionar'}
              </div>

              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Selecione uma pasta contendo subpastas de partituras
              </div>

              <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'var(--text-muted)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                  Múltiplas pastas
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  </svg>
                  Arquivos PDF
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Detecção automática
                </span>
              </div>
            </div>
          )}

          {/* ANALYZING STATE */}
          {modalState === STATES.ANALYZING && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              {/* Container com fundo para melhor visibilidade */}
              <div style={{
                width: '140px',
                height: '140px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.12) 0%, rgba(184, 134, 11, 0.06) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 24px rgba(212, 175, 55, 0.08)'
              }}>
                <LottieAnimation name="scan" size={100} />
              </div>

              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                Preparando arquivos...
              </div>

              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                {analyzeProgress.total > 0
                  ? `Organizando ${analyzeProgress.total} arquivo(s)...`
                  : 'Lendo estrutura de diretórios...'}
              </div>

              {analyzeProgress.total > 0 && (
                <div style={{
                  width: '100%',
                  maxWidth: '300px',
                  height: '6px',
                  background: 'rgba(212, 175, 55, 0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  margin: '0 auto'
                }}>
                  <div style={{
                    width: `${analyzeProgress.percentual}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #D4AF37, #B8860B)',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease-out'
                  }} />
                </div>
              )}
            </div>
          )}

          {/* FEEDBACK STATE */}
          {modalState === STATES.FEEDBACK && estatisticas && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              {(() => {
                const resultado = calcularResultado(estatisticas);
                const bgColor = resultado.tipo === 'success'
                  ? 'rgba(39, 174, 96, 0.1)'
                  : resultado.tipo === 'partial'
                    ? 'rgba(230, 126, 34, 0.1)'
                    : 'rgba(231, 76, 60, 0.1)';
                return (
                  <>
                    {/* Container com fundo colorido baseado no resultado */}
                    <div style={{
                      width: '160px',
                      height: '160px',
                      margin: '0 auto 24px',
                      borderRadius: '50%',
                      background: bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 24px ${bgColor}`
                    }}>
                      <LottieAnimation
                        name={resultado.tipo === 'success' ? 'success' : resultado.tipo === 'partial' ? 'attention' : 'error'}
                        size={120}
                        loop={false}
                      />
                    </div>

                    <div style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: resultado.tipo === 'success' ? '#27ae60' : resultado.tipo === 'partial' ? '#e67e22' : '#e74c3c',
                      marginBottom: '8px'
                    }}>
                      {resultado.tipo === 'success' && 'Tudo pronto!'}
                      {resultado.tipo === 'partial' && 'Quase lá!'}
                      {resultado.tipo === 'failure' && 'Precisa de atenção'}
                    </div>

                    <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
                      {estatisticas.prontas} de {estatisticas.total} partitura{estatisticas.total !== 1 ? 's' : ''} pronta{estatisticas.prontas !== 1 ? 's' : ''} para upload
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* REVIEW STATE */}
          {modalState === STATES.REVIEW && (
            <>
              {/* Tabs */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '20px',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '12px'
              }}>
                {[
                  { key: TABS.ALL, label: 'Todas', count: contadores.all },
                  { key: TABS.READY, label: 'Prontas', count: contadores.ready, color: '#27ae60' },
                  { key: TABS.ATTENTION, label: 'Atenção', count: contadores.attention, color: '#e67e22' },
                  { key: TABS.PROBLEM, label: 'Problemas', count: contadores.problem, color: '#e74c3c' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      background: activeTab === tab.key
                        ? (tab.color ? `${tab.color}20` : 'rgba(212, 175, 55, 0.15)')
                        : 'transparent',
                      color: activeTab === tab.key
                        ? (tab.color || '#D4AF37')
                        : 'var(--text-secondary)',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab.label}
                    <span style={{
                      background: tab.color ? `${tab.color}30` : 'var(--bg-primary)',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '11px'
                    }}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Ações em massa */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '16px',
                fontSize: '13px'
              }}>
                <button
                  onClick={() => toggleTodas(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#D4AF37',
                    cursor: 'pointer',
                    padding: '4px 8px'
                  }}
                >
                  Selecionar todas
                </button>
                <button
                  onClick={() => toggleTodas(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '4px 8px'
                  }}
                >
                  Limpar seleção
                </button>
              </div>

              {/* Lista de pastas */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {pastasFiltradas.map(pasta => (
                  <div
                    key={pasta.id}
                    style={{
                      background: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${pasta.status === 'ready' ? 'var(--border)' : pasta.status === 'attention' ? '#e67e22' : '#e74c3c'}`
                    }}
                  >
                    {/* Cabeçalho da pasta */}
                    <div
                      onClick={() => setPastaExpandida(pastaExpandida === pasta.id ? null : pasta.id)}
                      style={{
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={pasta.selecionada}
                        onChange={(e) => {
                          e.stopPropagation();
                          togglePastaSelecionada(pasta.id);
                        }}
                        disabled={pasta.status === 'problem'}
                        style={{ cursor: pasta.status === 'problem' ? 'not-allowed' : 'pointer' }}
                      />

                      {/* Ícone de status */}
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: pasta.status === 'ready' ? 'rgba(39, 174, 96, 0.15)' : pasta.status === 'attention' ? 'rgba(230, 126, 34, 0.15)' : 'rgba(231, 76, 60, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {pasta.status === 'ready' && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                        {pasta.status === 'attention' && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e67e22" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                          </svg>
                        )}
                        {pasta.status === 'problem' && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                          </svg>
                        )}
                      </span>

                      {/* Título e info */}
                      <div style={{ flex: 1, minWidth: '100px', overflow: 'hidden' }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: '1.4',
                          marginBottom: '6px'
                        }}>
                          {pasta.titulo || pasta.nomePasta || 'Sem título'}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flexWrap: 'wrap'
                        }}>
                          {/* Tag de arquivos */}
                          <span style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border)'
                          }}>
                            {pasta.arquivos.length} arquivo{pasta.arquivos.length !== 1 ? 's' : ''}
                          </span>

                          {/* Tag de categoria - clicável para edição rápida */}
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              // Abre um prompt simples para selecionar categoria
                              const select = e.currentTarget.querySelector('select');
                              if (select) select.click();
                            }}
                            style={{
                              fontSize: '11px',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              background: pasta.categoria ? 'rgba(212, 175, 55, 0.1)' : 'rgba(230, 126, 34, 0.1)',
                              color: pasta.categoria ? '#D4AF37' : '#e67e22',
                              border: `1px solid ${pasta.categoria ? 'rgba(212, 175, 55, 0.3)' : 'rgba(230, 126, 34, 0.3)'}`,
                              cursor: 'pointer',
                              fontWeight: '500',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              position: 'relative'
                            }}
                          >
                            {categorias.find(c => c.id === pasta.categoria)?.nome || 'Categoria'}
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="6 9 12 15 18 9"/>
                            </svg>
                            <select
                              value={pasta.categoria || ''}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                editarCategoria(pasta.id, e.target.value);
                              }}
                              style={{
                                position: 'absolute',
                                opacity: 0,
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="">Categoria</option>
                              {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nome}</option>
                              ))}
                            </select>
                          </span>

                          {/* Tag de status/problema */}
                          {pasta.statusMotivo && (
                            <span style={{
                              fontSize: '11px',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              background: pasta.status === 'attention' ? 'rgba(230, 126, 34, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                              color: pasta.status === 'attention' ? '#e67e22' : '#e74c3c',
                              border: `1px solid ${pasta.status === 'attention' ? 'rgba(230, 126, 34, 0.3)' : 'rgba(231, 76, 60, 0.3)'}`
                            }}>
                              {pasta.statusMotivo}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Botões para pastas com problema */}
                      {pasta.status === 'problem' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {/* Botão Forçar Duplicada - apenas para duplicatas */}
                          {pasta.duplicada && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Força a pasta a ser tratada como pronta (override)
                                setPastas(prev => prev.map(p =>
                                  p.id === pasta.id
                                    ? { ...p, status: 'attention', statusMotivo: 'Duplicada (forçado)', selecionada: true }
                                    : p
                                ));
                              }}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: '1px solid #e67e22',
                                background: 'rgba(230, 126, 34, 0.1)',
                                color: '#e67e22',
                                fontSize: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 9v4M12 17h.01"/>
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                              </svg>
                              Forçar
                            </button>
                          )}
                          {/* Botão Resolver - para outros problemas */}
                          {!pasta.duplicada && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                abrirPastaNoModalIndividual(pasta);
                              }}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: '1px solid #e74c3c',
                                background: 'rgba(231, 76, 60, 0.1)',
                                color: '#e74c3c',
                                fontSize: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                              Resolver
                            </button>
                          )}
                        </div>
                      )}

                      {/* Seta expandir */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--text-muted)"
                        strokeWidth="2"
                        style={{
                          transform: pastaExpandida === pasta.id ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }}
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>

                    {/* Detalhes expandidos */}
                    {pastaExpandida === pasta.id && (
                      <div style={{
                        padding: '12px 16px',
                        background: 'var(--bg-secondary)',
                        borderTop: '1px solid var(--border)'
                      }}>
                        {/* Campos de edição */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '10px',
                          marginBottom: '12px'
                        }}>
                          {/* Título */}
                          <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{
                              display: 'block',
                              fontSize: '11px',
                              color: 'var(--text-muted)',
                              marginBottom: '3px',
                              fontWeight: '500'
                            }}>
                              Título
                            </label>
                            <input
                              type="text"
                              value={pasta.titulo || ''}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => editarTitulo(pasta.id, e.target.value)}
                              placeholder="Nome da partitura"
                              style={{
                                width: '100%',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: '1px solid var(--border)',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                fontSize: '13px',
                                fontWeight: '500'
                              }}
                            />
                          </div>

                          {/* Compositor */}
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '11px',
                              color: 'var(--text-muted)',
                              marginBottom: '3px',
                              fontWeight: '500'
                            }}>
                              Compositor
                            </label>
                            <input
                              type="text"
                              value={pasta.compositor || ''}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => editarCompositor(pasta.id, e.target.value)}
                              placeholder="Nome do compositor"
                              style={{
                                width: '100%',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: '1px solid var(--border)',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                fontSize: '13px'
                              }}
                            />
                          </div>

                          {/* Arranjador */}
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '11px',
                              color: 'var(--text-muted)',
                              marginBottom: '3px',
                              fontWeight: '500'
                            }}>
                              Arranjador
                            </label>
                            <input
                              type="text"
                              value={pasta.arranjador || ''}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => editarArranjador(pasta.id, e.target.value)}
                              placeholder="Nome do arranjador"
                              style={{
                                width: '100%',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: '1px solid var(--border)',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                fontSize: '13px'
                              }}
                            />
                          </div>
                        </div>

                        {/* Lista de arquivos */}
                        <div style={{ fontSize: '12px' }}>
                          <div style={{
                            color: 'var(--text-secondary)',
                            marginBottom: '8px'
                          }}>
                            Arquivos detectados:
                          </div>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                            gap: '6px'
                          }}>
                            {pasta.arquivos.map((arq, idx) => (
                              <div
                                key={idx}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '4px',
                                  background: arq.reconhecido ? 'rgba(39, 174, 96, 0.1)' : 'rgba(230, 126, 34, 0.1)',
                                  color: arq.reconhecido ? '#27ae60' : '#e67e22',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                {arq.reconhecido ? (
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12"/>
                                  </svg>
                                ) : (
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="8" x2="12" y2="12"/>
                                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                                  </svg>
                                )}
                                {arq.instrumento}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* UPLOADING STATE */}
          {modalState === STATES.UPLOADING && (
            <div style={{ textAlign: 'center', padding: '40px 40px 32px' }}>
              {/* Container com fundo para animação */}
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 28px',
                borderRadius: '50%',
                background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.12) 0%, rgba(184, 134, 11, 0.06) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 24px rgba(212, 175, 55, 0.08)'
              }}>
                <LottieAnimation name="upload" size={80} />
              </div>

              <div style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                Enviando partituras
              </div>

              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                {uploadProgress.processadas} de {uploadProgress.total} concluída{uploadProgress.processadas !== 1 ? 's' : ''}
              </div>

              {/* Frase engraçada animada */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '32px',
                minHeight: '24px'
              }}>
                <span
                  className="sparkle-icon"
                  style={{
                    fontSize: '16px',
                    animation: 'sparkle 1.5s ease-in-out infinite'
                  }}
                >
                  ✨
                </span>
                <span
                  key={funnyPhraseIndex}
                  style={{
                    fontSize: '13px',
                    color: '#D4AF37',
                    fontStyle: 'italic',
                    animation: 'fadeInSlide 0.5s ease-out'
                  }}
                >
                  {funnyPhrases[funnyPhraseIndex]}
                </span>
                <span
                  className="sparkle-icon"
                  style={{
                    fontSize: '16px',
                    animation: 'sparkle 1.5s ease-in-out infinite 0.5s'
                  }}
                >
                  ✨
                </span>
              </div>

              {/* Barra de progresso moderna com indicador de partitura atual */}
              <div style={{
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                {/* Container da barra */}
                <div style={{
                  position: 'relative',
                  height: '8px',
                  background: 'var(--bg-primary)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '16px'
                }}>
                  {/* Barra de progresso com gradiente e brilho */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: `${uploadProgress.percentual}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #D4AF37 0%, #F4D03F 50%, #D4AF37 100%)',
                    backgroundSize: '200% 100%',
                    borderRadius: '4px',
                    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: 'shimmer 2s linear infinite'
                  }} />
                  {/* Brilho animado na ponta */}
                  <div style={{
                    position: 'absolute',
                    left: `calc(${uploadProgress.percentual}% - 20px)`,
                    top: 0,
                    width: '20px',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    borderRadius: '4px',
                    opacity: uploadProgress.percentual > 0 && uploadProgress.percentual < 100 ? 1 : 0,
                    transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                </div>

                {/* Card da partitura atual sendo enviada */}
                {(() => {
                  const pastasParaUpload = pastas.filter(p => p.selecionada && p.status !== 'problem');
                  const pastaAtual = pastasParaUpload[uploadProgress.processadas];
                  if (!pastaAtual) return null;

                  return (
                    <div style={{
                      background: 'var(--bg-primary)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      border: '1px solid rgba(212, 175, 55, 0.2)'
                    }}>
                      {/* Spinner */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(212, 175, 55, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          border: '2px solid rgba(212, 175, 55, 0.3)',
                          borderTopColor: '#D4AF37',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite'
                        }} />
                      </div>

                      {/* Info da partitura */}
                      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginBottom: '2px'
                        }}>
                          {pastaAtual.titulo}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span>{pastaAtual.arquivos?.length || 0} arquivo{(pastaAtual.arquivos?.length || 0) !== 1 ? 's' : ''}</span>
                          <span style={{ opacity: 0.5 }}>•</span>
                          <span style={{ color: '#D4AF37' }}>Enviando...</span>
                        </div>
                      </div>

                      {/* Percentual */}
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#D4AF37',
                        fontVariantNumeric: 'tabular-nums'
                      }}>
                        {uploadProgress.percentual}%
                      </div>
                    </div>
                  );
                })()}

                {/* Indicadores de progresso minimalistas */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '20px'
                }}>
                  {pastas
                    .filter(p => p.selecionada && p.status !== 'problem')
                    .map((pasta, idx) => {
                      const isCompleted = idx < uploadProgress.processadas;
                      const isCurrent = idx === uploadProgress.processadas;
                      return (
                        <div
                          key={pasta.id}
                          title={pasta.titulo}
                          style={{
                            width: isCurrent ? '24px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            background: isCompleted
                              ? '#27ae60'
                              : isCurrent
                                ? 'linear-gradient(90deg, #D4AF37, #F4D03F)'
                                : 'var(--bg-secondary)',
                            transition: 'all 0.3s ease',
                            cursor: 'default'
                          }}
                        />
                      );
                    })}
                </div>
              </div>

              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
                @keyframes shimmer {
                  0% { background-position: 200% 0; }
                  100% { background-position: -200% 0; }
                }
                @keyframes sparkle {
                  0%, 100% {
                    opacity: 1;
                    transform: scale(1) rotate(0deg);
                  }
                  50% {
                    opacity: 0.6;
                    transform: scale(1.2) rotate(180deg);
                  }
                }
                @keyframes fadeInSlide {
                  0% {
                    opacity: 0;
                    transform: translateY(8px);
                  }
                  100% {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
            </div>
          )}

          {/* COMPLETE STATE */}
          {modalState === STATES.COMPLETE && uploadResultados && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              {(() => {
                const resumo = gerarResumo(uploadResultados.estatisticas);
                const bgColor = resumo.tipo === 'success'
                  ? 'rgba(39, 174, 96, 0.1)'
                  : resumo.tipo === 'partial'
                    ? 'rgba(230, 126, 34, 0.1)'
                    : 'rgba(231, 76, 60, 0.1)';
                return (
                  <>
                    {/* Container com fundo colorido */}
                    <div style={{
                      width: '160px',
                      height: '160px',
                      margin: '0 auto 24px',
                      borderRadius: '50%',
                      background: bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 24px ${bgColor}`
                    }}>
                      <LottieAnimation
                        name={resumo.tipo === 'success' ? 'success' : resumo.tipo === 'partial' ? 'attention' : 'error'}
                        size={120}
                        loop={false}
                      />
                    </div>

                    <div style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: resumo.tipo === 'success' ? '#27ae60' : resumo.tipo === 'partial' ? '#e67e22' : '#e74c3c',
                      marginBottom: '8px'
                    }}>
                      {resumo.tipo === 'success' && 'Upload concluído!'}
                      {resumo.tipo === 'partial' && 'Upload parcial'}
                      {resumo.tipo === 'error' && 'Falha no upload'}
                    </div>

                    <div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {resumo.mensagem}
                    </div>

                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Tempo total: {resumo.duracao}
                    </div>

                    {/* Lista de erros (se houver) */}
                    {uploadResultados.estatisticas.erro > 0 && (
                      <div style={{
                        marginTop: '24px',
                        padding: '16px',
                        background: 'rgba(231, 76, 60, 0.1)',
                        borderRadius: '12px',
                        textAlign: 'left',
                        maxWidth: '350px',
                        margin: '24px auto 0'
                      }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#e74c3c',
                          marginBottom: '8px'
                        }}>
                          Erros encontrados:
                        </div>
                        {uploadResultados.resultados
                          .filter(r => !r.success)
                          .map((r, idx) => (
                            <div key={idx} style={{
                              fontSize: '12px',
                              color: 'var(--text-secondary)',
                              marginBottom: '4px'
                            }}>
                              • {r.titulo}: {r.error}
                            </div>
                          ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Footer */}
        {(modalState === STATES.REVIEW || modalState === STATES.COMPLETE) && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            {modalState === STATES.REVIEW && (
              <>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {pastasSelecionadas.length} de {pastas.filter(p => p.status !== 'problem').length} selecionada{pastasSelecionadas.length !== 1 ? 's' : ''}
                  {pastasSelecionadas.length > 0 && (
                    <span style={{ marginLeft: '8px' }}>
                      ({estimarTempo(
                        pastasSelecionadas.length,
                        pastasSelecionadas.reduce((acc, p) => acc + p.arquivos.length, 0)
                      ).tempoFormatado})
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={onClose}
                    style={{
                      padding: '12px 24px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={iniciarUpload}
                    disabled={pastasSelecionadas.length === 0}
                    style={{
                      padding: '12px 24px',
                      borderRadius: 'var(--radius-sm)',
                      background: pastasSelecionadas.length === 0
                        ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.5) 0%, rgba(184, 134, 11, 0.5) 100%)'
                        : 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: pastasSelecionadas.length === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Enviar {pastasSelecionadas.length} partitura{pastasSelecionadas.length !== 1 ? 's' : ''}
                  </button>
                </div>
              </>
            )}

            {modalState === STATES.COMPLETE && (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: '12px 32px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportacaoLoteModal;
