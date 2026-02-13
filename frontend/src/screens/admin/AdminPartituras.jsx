// ===== ADMIN PARTITURAS =====
// Gerenciamento de partituras com expansao inline e preview de PDF

import { useState, useEffect, useMemo, useRef, useCallback, lazy, Suspense } from 'react';

// Flag para debug - remover em produção
const DEBUG_TUTORIAL = false;
import { useUI } from '@contexts/UIContext';
import { API } from '@services/api';
import CategoryIcon from '@components/common/CategoryIcon';
import { PartesGridSkeleton } from '@components/common/Skeleton';
import UploadPastaModal from './components/UploadPastaModal';
import TutorialOverlay, { useTutorial } from '@components/onboarding/TutorialOverlay';
import RepertorioSelectorModal from '@components/modals/RepertorioSelectorModal';
import Storage from '@services/storage';
import { API_BASE_URL } from '@constants/api';

const PDFViewerModal = lazy(() => import('@components/modals/PDFViewerModal'));
const ImportacaoLoteModal = lazy(() => import('@components/modals/ImportacaoLoteModal'));

// Helper para detectar instrumento pelo nome do arquivo
const detectInstrumento = (filename) => {
  const name = filename.toLowerCase().replace(/\.pdf$/i, '');

  const patterns = [
    { pattern: /grade|regente|maestro|partitura.*geral/i, name: 'Grade' },
    { pattern: /flauta|flaut/i, name: 'Flauta' },
    { pattern: /requinta/i, name: 'Requinta' },
    { pattern: /clarinete?\s*(bb|si\s*b)?\s*[123]|clar.*[123]/i, name: (m) => `Clarinete Bb ${m[0].match(/[123]/)?.[0] || '1'}` },
    { pattern: /clarinete|clar/i, name: 'Clarinete' },
    { pattern: /sax.*alto|alto.*sax/i, name: 'Sax Alto' },
    { pattern: /sax.*tenor|tenor.*sax/i, name: 'Sax Tenor' },
    { pattern: /sax.*bar[ií]tono|bar[ií]tono.*sax/i, name: 'Sax Barítono' },
    { pattern: /sax.*soprano|soprano.*sax/i, name: 'Sax Soprano' },
    { pattern: /trompete?\s*[123]|trump.*[123]/i, name: (m) => `Trompete ${m[0].match(/[123]/)?.[0] || '1'}` },
    { pattern: /trompete|trump/i, name: 'Trompete' },
    { pattern: /trombone\s*[123]/i, name: (m) => `Trombone ${m[0].match(/[123]/)?.[0] || '1'}` },
    { pattern: /trombone/i, name: 'Trombone' },
    { pattern: /bombardino|euph|flicorne/i, name: 'Bombardino' },
    { pattern: /tuba|sousafone|bass/i, name: 'Tuba' },
    { pattern: /caixa.*clara|snare/i, name: 'Caixa Clara' },
    { pattern: /bumbo|bass.*drum/i, name: 'Bumbo' },
    { pattern: /prato/i, name: 'Pratos' },
    { pattern: /percuss/i, name: 'Percussão' },
    { pattern: /horn|trompa/i, name: 'Trompa' },
  ];

  for (const { pattern, name: instrName } of patterns) {
    const match = name.match(pattern);
    if (match) {
      return typeof instrName === 'function' ? instrName(match) : instrName;
    }
  }

  // Se nao detectou, usa o nome do arquivo limpo
  return name.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim() || 'Parte';
};

const AdminPartituras = () => {
  const { showToast } = useUI();
  const [partituras, setPartituras] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImportacaoLote, setShowImportacaoLote] = useState(false);

  // Estado para drag & drop global na tela
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState(null); // Arquivos pré-carregados para os modais
  const [droppedItems, setDroppedItems] = useState(null); // Items do dataTransfer para ImportacaoLote
  const dragCounterRef = useRef(0); // Para controlar eventos de drag aninhados

  // Estado para expansao inline
  const [expandedId, setExpandedId] = useState(null);
  const [partes, setPartes] = useState([]);
  const [loadingPartes, setLoadingPartes] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [addingPart, setAddingPart] = useState(false);
  const addFileInputRef = useRef(null);

  // Estado para pre-visualizacao do PDF (modal)
  const [previewParte, setPreviewParte] = useState(null); // { parteId, blobUrl, instrumento }
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);

  // Cache de contagem de partes por partitura
  const [partesCount, setPartesCount] = useState({});

  // Estado para modal de edição
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPartitura, setEditingPartitura] = useState(null);
  const [editForm, setEditForm] = useState({ titulo: '', compositor: '', arranjador: '', categoria_id: '' });
  const [savingEdit, setSavingEdit] = useState(false);

  // Estado para repertório
  const [repertorios, setRepertorios] = useState([]); // Todos os repertórios
  const [repertorioAtivo, setRepertorioAtivo] = useState(null);
  const [partiturasInRepertorio, setPartiturasInRepertorio] = useState(new Set());
  const [showRepertorioModal, setShowRepertorioModal] = useState(false);
  const [selectedPartituraForRepertorio, setSelectedPartituraForRepertorio] = useState(null);
  const [loadingRepertorios, setLoadingRepertorios] = useState(false);

  // Funções para modal de edição
  const openEditModal = (partitura) => {
    setEditingPartitura(partitura);
    setEditForm({
      titulo: partitura.titulo || '',
      compositor: partitura.compositor || '',
      arranjador: partitura.arranjador || '',
      categoria_id: partitura.categoria_id || ''
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingPartitura(null);
    setEditForm({ titulo: '', compositor: '', arranjador: '', categoria_id: '' });
  };

  const saveEditModal = async () => {
    if (!editingPartitura) return;

    setSavingEdit(true);
    try {
      const updateData = {
        ...editingPartitura,
        titulo: editForm.titulo || editingPartitura.titulo,
        compositor: editForm.compositor || null,
        arranjador: editForm.arranjador || null,
        categoria_id: editForm.categoria_id || editingPartitura.categoria_id
      };
      await API.updatePartitura(editingPartitura.id, updateData);

      // Atualiza estado local
      setPartituras(prev => prev.map(p =>
        p.id === editingPartitura.id ? {
          ...p,
          titulo: editForm.titulo || p.titulo,
          compositor: editForm.compositor || null,
          arranjador: editForm.arranjador || null,
          categoria_id: editForm.categoria_id || p.categoria_id
        } : p
      ));

      showToast('Partitura atualizada com sucesso!');
      closeEditModal();
    } catch (err) {
      showToast(err.message || 'Erro ao salvar', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  // Ação pendente após tutorial (ex: abrir modal de upload quando veio pelo atalho)
  const [pendingAction, setPendingAction] = useState(null);

  // Ref para rastrear se o tutorial já foi mostrado (distingue "nunca apareceu" de "foi fechado")
  const tutorialWasShown = useRef(false);

  // Tutorial de onboarding
  // tutorialPending = true durante o delay antes do tutorial aparecer (bloqueia interações)
  const [showTutorial, setShowTutorial, tutorialPending] = useTutorial(partituras, loading);

  // Rastrear quando o tutorial aparece
  useEffect(() => {
    if (showTutorial) {
      tutorialWasShown.current = true;
      if (DEBUG_TUTORIAL) console.warn('[Tutorial] Marcado como mostrado');
    }
  }, [showTutorial]);

  // Normalização avançada para busca (estilo YouTube)
  // - Remove acentos e diacríticos
  // - Normaliza "nº", "n°", "no." para "n" (número)
  // - Remove caracteres especiais mantendo espaços
  // - Permite busca "n 6" encontrar "Nº 6", "Número 6", etc.
  const normalizeText = (text) => {
    if (!text) return '';
    return text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[ºª°]/g, '') // Remove indicadores ordinais
      .replace(/n[°º.]?\s*/gi, 'n') // "nº ", "n° ", "n. " → "n"
      .replace(/\./g, ' ') // Pontos viram espaços
      .replace(/\s+/g, ' ') // Colapsa espaços múltiplos
      .trim();
  };

  // Verifica se todos os termos da busca estão presentes (em qualquer ordem)
  const matchesSearch = useCallback((text, query) => {
    if (!query) return true;
    const normalizedText = normalizeText(text);
    const queryTerms = normalizeText(query).split(' ').filter(t => t.length > 0);
    // Todos os termos devem estar presentes
    return queryTerms.every(term => normalizedText.includes(term));
  }, []);

  // ===== DRAG & DROP GLOBAL =====
  // Função para ler entradas de diretório recursivamente
  const readAllEntriesRecursively = async (entry, path = '') => {
    const files = [];
    if (entry.isFile) {
      const file = await new Promise((resolve) => entry.file(resolve));
      Object.defineProperty(file, 'webkitRelativePath', {
        value: path + file.name,
        writable: false
      });
      files.push(file);
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const entries = await new Promise((resolve) => {
        const allEntries = [];
        const readEntries = () => {
          reader.readEntries((results) => {
            if (results.length === 0) {
              resolve(allEntries);
            } else {
              allEntries.push(...results);
              readEntries();
            }
          });
        };
        readEntries();
      });
      for (const childEntry of entries) {
        const childFiles = await readAllEntriesRecursively(childEntry, path + entry.name + '/');
        files.push(...childFiles);
      }
    }
    return files;
  };

  // Handlers de drag & drop global
  const handleGlobalDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDraggingOver(true);
    }
  }, []);

  const handleGlobalDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDraggingOver(false);
    }
  }, []);

  const handleGlobalDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleGlobalDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    dragCounterRef.current = 0;

    const items = e.dataTransfer.items;
    if (!items || items.length === 0) return;

    // Conta quantas pastas foram soltas
    const folderEntries = [];
    for (const item of items) {
      const entry = item.webkitGetAsEntry?.();
      if (entry?.isDirectory) {
        folderEntries.push(entry);
      }
    }

    if (folderEntries.length === 0) {
      showToast('Arraste uma pasta contendo arquivos PDF', 'error');
      return;
    }

    // Verifica se é uma pasta com subpastas (lote) ou pasta simples
    if (folderEntries.length === 1) {
      const mainFolder = folderEntries[0];
      const reader = mainFolder.createReader();

      const entries = await new Promise((resolve) => {
        const allEntries = [];
        const readEntries = () => {
          reader.readEntries((results) => {
            if (results.length === 0) {
              resolve(allEntries);
            } else {
              allEntries.push(...results);
              readEntries();
            }
          });
        };
        readEntries();
      });

      // Conta subpastas que contêm PDFs
      const subFolders = entries.filter(e => e.isDirectory);
      const hasPDFsInRoot = entries.some(e => e.isFile && e.name.toLowerCase().endsWith('.pdf'));

      if (subFolders.length > 0 && !hasPDFsInRoot) {
        // Tem subpastas e não tem PDFs na raiz -> Importação em Lote
        // Passa os items originais para o modal de lote processar
        setDroppedItems(items);
        setShowImportacaoLote(true);
      } else if (hasPDFsInRoot) {
        // Tem PDFs na raiz -> Upload de Pasta simples
        const allFiles = await readAllEntriesRecursively(mainFolder, '');
        const pdfFiles = allFiles.filter(f => f.name.toLowerCase().endsWith('.pdf'));

        if (pdfFiles.length === 0) {
          showToast('Nenhum arquivo PDF encontrado na pasta', 'error');
          return;
        }

        setDroppedFiles({ files: pdfFiles, folderName: mainFolder.name });
        setShowUploadModal(true);
      } else {
        // Pasta vazia ou sem PDFs
        showToast('Nenhum arquivo PDF encontrado na pasta', 'error');
      }
    } else {
      // Múltiplas pastas soltas -> Importação em Lote
      setDroppedItems(items);
      setShowImportacaoLote(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- readAllEntriesRecursively é função recursiva estável
  }, [showToast]);

  // Registra os event listeners globais
  useEffect(() => {
    const container = document.body;
    container.addEventListener('dragenter', handleGlobalDragEnter);
    container.addEventListener('dragleave', handleGlobalDragLeave);
    container.addEventListener('dragover', handleGlobalDragOver);
    container.addEventListener('drop', handleGlobalDrop);

    return () => {
      container.removeEventListener('dragenter', handleGlobalDragEnter);
      container.removeEventListener('dragleave', handleGlobalDragLeave);
      container.removeEventListener('dragover', handleGlobalDragOver);
      container.removeEventListener('drop', handleGlobalDrop);
    };
  }, [handleGlobalDragEnter, handleGlobalDragLeave, handleGlobalDragOver, handleGlobalDrop]);

  // Limpa arquivos pré-carregados quando modais fecham
  useEffect(() => {
    if (!showUploadModal) {
      setDroppedFiles(null);
    }
  }, [showUploadModal]);

  useEffect(() => {
    if (!showImportacaoLote) {
      setDroppedItems(null);
    }
  }, [showImportacaoLote]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [parts, cats] = await Promise.all([
        API.getPartituras(),
        API.getCategorias()
      ]);
      setPartituras(parts || []);
      setCategorias(cats || []);
    } catch {
      showToast('Erro ao carregar dados', 'error');
    }
    setLoading(false);
  };

  // Carregar todos os repertórios
  const loadRepertorios = async () => {
    setLoadingRepertorios(true);
    try {
      const [reps, repDetails] = await Promise.all([
        API.getRepertorios(),
        API.getRepertorioAtivo().catch(() => null)
      ]);
      setRepertorios(reps || []);
      const active = reps?.find(r => r.ativo === 1);
      setRepertorioAtivo(active || null);

      // Se tem repertório ativo e conseguiu carregar detalhes, atualizar partituras
      if (active && repDetails?.partituras) {
        setPartiturasInRepertorio(new Set(repDetails.partituras.map(p => p.id)));
      } else {
        setPartiturasInRepertorio(new Set());
      }
    } catch {
      // Silencioso - repertório pode não existir
    } finally {
      setLoadingRepertorios(false);
    }
  };

  // Abrir modal de repertório
  const openRepertorioModal = (partitura) => {
    // Se já está no repertório ativo, remover diretamente
    if (repertorioAtivo && partiturasInRepertorio.has(partitura.id)) {
      removeFromRepertorio(repertorioAtivo.id, partitura.id);
      return;
    }

    // Se só tem um repertório e é o ativo, adicionar diretamente
    if (repertorios.length === 1 && repertorioAtivo) {
      addToRepertorio(repertorioAtivo, partitura.id);
      return;
    }

    // Caso contrário, abrir modal para escolher
    setSelectedPartituraForRepertorio(partitura);
    setShowRepertorioModal(true);
  };

  // Adicionar partitura ao repertório (UI otimista)
  const addToRepertorio = async (repertorio, partituraId) => {
    // UI otimista: atualiza imediatamente
    if (repertorio.ativo === 1) {
      setPartiturasInRepertorio(prev => new Set([...prev, partituraId]));
    }
    setShowRepertorioModal(false);
    setSelectedPartituraForRepertorio(null);

    try {
      await API.addPartituraToRepertorio(repertorio.id, partituraId);
      showToast(`Adicionada ao "${repertorio.nome}"`);
    } catch (err) {
      // Reverte em caso de erro
      if (repertorio.ativo === 1) {
        setPartiturasInRepertorio(prev => {
          const next = new Set(prev);
          next.delete(partituraId);
          return next;
        });
      }
      showToast(err.message || 'Erro ao adicionar', 'error');
    }
  };

  // Remover partitura do repertório (UI otimista)
  const removeFromRepertorio = async (repertorioId, partituraId) => {
    // UI otimista: atualiza imediatamente
    setPartiturasInRepertorio(prev => {
      const next = new Set(prev);
      next.delete(partituraId);
      return next;
    });

    try {
      await API.removePartituraFromRepertorio(repertorioId, partituraId);
      showToast('Removida do repertório');
    } catch (err) {
      // Reverte em caso de erro
      setPartiturasInRepertorio(prev => new Set([...prev, partituraId]));
      showToast(err.message || 'Erro ao remover', 'error');
    }
  };

  // Criar novo repertório e adicionar a partitura
  const createRepertorioAndAdd = async (nome) => {
    try {
      const result = await API.createRepertorio({ nome, ativo: true });
      showToast('Repertório criado!');

      // Recarregar repertórios
      await loadRepertorios();

      // Adicionar partitura ao novo repertório
      if (selectedPartituraForRepertorio && result.id) {
        await API.addPartituraToRepertorio(result.id, selectedPartituraForRepertorio.id);
        setPartiturasInRepertorio(new Set([selectedPartituraForRepertorio.id]));
        showToast(`"${selectedPartituraForRepertorio.titulo}" adicionada!`);
      }

      setShowRepertorioModal(false);
      setSelectedPartituraForRepertorio(null);
    } catch (err) {
      showToast(err.message || 'Erro ao criar repertório', 'error');
      throw err;
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps -- carrega apenas na montagem
  useEffect(() => { loadData(); loadRepertorios(); }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail === 'novo') {
        showToast('Funcao de criar partitura em desenvolvimento');
      }
      if (e.detail === 'pasta') {
        // Verifica se tutorial foi completado diretamente no Storage
        const tutorialCompleted = Storage.get('tutorial_admin_partituras_completed', false);
        const isMobile = window.innerWidth < 768;

        // Se tutorial não foi completado e não é mobile, SEMPRE guarda a ação
        // O modal só abre após o tutorial ser fechado
        if (!tutorialCompleted && !isMobile) {
          setPendingAction('openUploadModal');
        } else {
          setShowUploadModal(true);
        }
      }
    };
    window.addEventListener('admin-partituras-action', handler);
    return () => window.removeEventListener('admin-partituras-action', handler);
  }, [showToast]);

  // Executar ação pendente após tutorial ser fechado
  // Só executa quando o tutorial foi realmente mostrado e fechado (não apenas "ainda não apareceu")
  useEffect(() => {
    if (!pendingAction) return;

    const tutorialCompleted = Storage.get('tutorial_admin_partituras_completed', false);

    // Debug
    if (DEBUG_TUTORIAL) {
      console.warn('[Tutorial] Check pendingAction:', {
        loading,
        tutorialCompleted,
        showTutorial,
        tutorialPending,
        tutorialWasShown: tutorialWasShown.current,
        pendingAction
      });
    }

    // Condições para executar a ação pendente:
    // 1. Loading terminou
    // 2. Uma dessas:
    //    a) Tutorial foi completado no passado (já está no Storage)
    //    b) Tutorial foi mostrado NESTA sessão e agora está fechado
    const tutorialClosedThisSession = tutorialWasShown.current && !showTutorial && !tutorialPending;
    const canExecute = !loading && (tutorialCompleted || tutorialClosedThisSession);

    if (canExecute) {
      if (DEBUG_TUTORIAL) console.warn('[Tutorial] Executando ação pendente:', pendingAction);
      if (pendingAction === 'openUploadModal') {
        setShowUploadModal(true);
      }
      setPendingAction(null);
    }
  }, [showTutorial, tutorialPending, pendingAction, loading]);

  // Carregar partes quando expandir
  const loadPartes = useCallback(async (partituraId) => {
    setLoadingPartes(true);
    setPreviewParte(null); // Fecha preview ao trocar de partitura
    try {
      const data = await API.getPartesPartitura(partituraId);
      setPartes(data || []);
      // Atualiza cache de contagem
      setPartesCount(prev => ({ ...prev, [partituraId]: (data || []).length }));
    } catch {
      showToast('Erro ao carregar partes', 'error');
    } finally {
      setLoadingPartes(false);
    }
  }, [showToast]);

  // Toggle expansao
  const toggleExpand = (partitura) => {
    if (expandedId === partitura.id) {
      setExpandedId(null);
      setPartes([]);
      setPreviewParte(null);
    } else {
      setExpandedId(partitura.id);
      loadPartes(partitura.id);
    }
  };

  // Fechar preview
  const closePreview = useCallback(() => {
    if (previewParte?.blobUrl) {
      URL.revokeObjectURL(previewParte.blobUrl);
    }
    setPreviewParte(null);
    setShowPDFModal(false);
  }, [previewParte]);

  // Visualizar PDF no modal com autenticacao (usando ID da parte)
  // Usa XMLHttpRequest com headers especiais para evitar interceptacao por gerenciadores de download (IDM, etc)
  const handleViewPart = useCallback(async (parte) => {
    // Se ja esta visualizando esta parte, fecha
    if (previewParte?.parteId === parte.id && showPDFModal) {
      closePreview();
      return;
    }

    setLoadingPreview(true);
    // Limpa preview anterior se houver
    if (previewParte?.blobUrl) {
      URL.revokeObjectURL(previewParte.blobUrl);
    }

    try {
      const token = Storage.get('authToken', null);
      // Endpoint correto: /api/download/parte/:parteId
      const url = `${API_BASE_URL}/api/download/parte/${parte.id}`;

      // Usa XMLHttpRequest em vez de fetch para evitar interceptacao por IDM e outros gerenciadores
      // Os headers X-Requested-With e Accept fazem o IDM ignorar a requisicao
      const blobUrl = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer'; // arraybuffer eh menos interceptado que blob

        // Headers que fazem gerenciadores de download ignorarem a requisicao
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Accept', 'application/pdf, application/octet-stream');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            // Converte arraybuffer para blob e cria URL
            const blob = new Blob([xhr.response], { type: 'application/pdf' });
            resolve(URL.createObjectURL(blob));
          } else {
            // Tenta extrair mensagem de erro
            try {
              const decoder = new TextDecoder('utf-8');
              const text = decoder.decode(xhr.response);
              const errorData = JSON.parse(text);
              reject(new Error(errorData.error || `HTTP ${xhr.status}`));
            } catch {
              reject(new Error(`Erro ao carregar PDF (${xhr.status})`));
            }
          }
        };

        xhr.onerror = function() {
          reject(new Error('Erro de conexao ao carregar PDF'));
        };

        xhr.ontimeout = function() {
          reject(new Error('Timeout ao carregar PDF'));
        };

        xhr.send();
      });

      setPreviewParte({ parteId: parte.id, blobUrl, instrumento: parte.instrumento });
      setShowPDFModal(true);
    } catch (err) {
      showToast(err.message || 'Erro ao abrir PDF', 'error');
    } finally {
      setLoadingPreview(false);
    }
  }, [previewParte, showPDFModal, closePreview, showToast]);

  // Substituir parte
  const handleReplacePart = async (partituraId, parteId, file) => {
    if (!file) return;
    setUploading(parteId);
    try {
      const formData = new FormData();
      formData.append('arquivo', file);
      await API.replacePartePartitura(partituraId, parteId, formData);
      showToast('Parte substituida com sucesso!');
      await loadPartes(partituraId);
    } catch (err) {
      showToast(err.message || 'Erro ao substituir parte', 'error');
    } finally {
      setUploading(null);
    }
  };

  // Deletar parte
  const handleDeletePart = async (partituraId, parteId) => {
    if (!confirm('Remover esta parte da partitura?')) return;
    setDeleting(parteId);
    try {
      await API.deletePartePartitura(partituraId, parteId);
      showToast('Parte removida com sucesso!');
      await Promise.all([
        loadPartes(partituraId),
        loadData()
      ]);
    } catch (err) {
      showToast(err.message || 'Erro ao remover parte', 'error');
    } finally {
      setDeleting(null);
    }
  };

  // Adicionar nova parte (deteccao automatica do instrumento)
  const handleAddPart = async (partituraId, file) => {
    if (!file) return;

    const instrumento = detectInstrumento(file.name);

    setAddingPart(true);
    try {
      const formData = new FormData();
      formData.append('arquivo', file);
      formData.append('instrumento', instrumento);
      await API.addPartePartitura(partituraId, formData);
      showToast(`Parte "${instrumento}" adicionada!`);
      await Promise.all([
        loadPartes(partituraId),
        loadData()
      ]);
    } catch (err) {
      showToast(err.message || 'Erro ao adicionar parte', 'error');
    } finally {
      setAddingPart(false);
    }
  };

  // Filtragem com busca avançada
  const filtered = useMemo(() => {
    let results = partituras;
    if (filterCategoria) {
      results = results.filter(p => p.categoria_id === filterCategoria);
    }
    if (search) {
      results = results.filter(p =>
        matchesSearch(p.titulo, search) || matchesSearch(p.compositor, search)
      );
    }
    return results.sort((a, b) => a.titulo?.localeCompare(b.titulo, 'pt-BR'));
  }, [partituras, search, filterCategoria, matchesSearch]);

  // Expande primeira partitura (para tutorial)
  const expandFirstPartitura = useCallback(() => {
    if (filtered.length > 0 && expandedId !== filtered[0].id) {
      setExpandedId(filtered[0].id);
      loadPartes(filtered[0].id);
    }
  }, [filtered, expandedId, loadPartes]);

  // Colapsa primeira partitura (para tutorial - mostrar que está fechada)
  const collapseFirstPartitura = useCallback(() => {
    if (expandedId !== null) {
      setExpandedId(null);
      setPartes([]);
    }
  }, [expandedId]);

  // Agrupar por letra inicial
  const groupedByLetter = filtered.reduce((acc, p) => {
    const letter = p.titulo?.charAt(0)?.toUpperCase() || '#';
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(p);
    return acc;
  }, {});

  const sortedLetters = Object.keys(groupedByLetter).sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const handleDelete = async (id) => {
    if (!confirm('Remover esta partitura?')) return;
    try {
      await API.deletePartitura(id);
      showToast('Partitura removida!');
      if (expandedId === id) setExpandedId(null);
      loadData();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const toggleDestaque = async (partitura) => {
    const novoDestaque = partitura.destaque === 1 ? 0 : 1;
    setPartituras(prev => prev.map(p =>
      p.id === partitura.id ? { ...p, destaque: novoDestaque } : p
    ));
    try {
      await API.updatePartitura(partitura.id, { ...partitura, destaque: novoDestaque });
      showToast(novoDestaque ? 'Adicionado aos destaques!' : 'Removido dos destaques');
    } catch (e) {
      setPartituras(prev => prev.map(p =>
        p.id === partitura.id ? { ...p, destaque: partitura.destaque } : p
      ));
      showToast(e.message, 'error');
    }
  };

  const getCategoriaInfo = (id) => categorias.find(c => c.id === id) || {};
  const selectedCategoria = categorias.find(c => c.id === filterCategoria);

  return (
    <div className="page-transition" style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          fontFamily: 'Outfit, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
          Partituras
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            data-tutorial="upload-pasta"
            onClick={() => window.adminNav?.('partituras', 'pasta')}
            disabled={tutorialPending || showTutorial}
            className="btn-primary-hover"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '12px',
              background: (tutorialPending || showTutorial)
                ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.5) 0%, rgba(184, 134, 11, 0.5) 100%)'
                : 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
              color: '#fff',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: (tutorialPending || showTutorial) ? 'not-allowed' : 'pointer',
              fontFamily: 'Outfit, sans-serif',
              opacity: (tutorialPending || showTutorial) ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload de Pasta
          </button>
          <button
            onClick={() => setShowImportacaoLote(true)}
            disabled={tutorialPending || showTutorial}
            className="btn-secondary-hover"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '12px',
              background: (tutorialPending || showTutorial)
                ? 'rgba(212, 175, 55, 0.3)'
                : 'rgba(212, 175, 55, 0.15)',
              color: (tutorialPending || showTutorial) ? 'var(--text-muted)' : '#D4AF37',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: (tutorialPending || showTutorial) ? 'not-allowed' : 'pointer',
              fontFamily: 'Outfit, sans-serif',
              opacity: (tutorialPending || showTutorial) ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              <path d="M12 11v6M9 14h6"/>
            </svg>
            Importar Lote
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <div className="search-bar">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar por titulo ou compositor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="clear-btn" onClick={() => setSearch('')}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Dropdown de categoria */}
        <div style={{ position: 'relative', minWidth: '200px' }}>
          <button
            type="button"
            onClick={() => setShowCatDropdown(!showCatDropdown)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1.5px solid var(--border)',
              background: 'var(--bg-card)',
              color: selectedCategoria ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '14px',
              fontFamily: 'Outfit, sans-serif',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {selectedCategoria && (
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(212, 175, 55, 0.2)'
                }}>
                  <CategoryIcon categoryId={selectedCategoria.id} size={14} color="#D4AF37" />
                </span>
              )}
              {selectedCategoria ? selectedCategoria.nome : 'Todas categorias'}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{
              transform: showCatDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
              flexShrink: 0
            }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {showCatDropdown && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              background: 'var(--bg-secondary)',
              border: '1.5px solid var(--border)',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              zIndex: 100,
              maxHeight: '280px',
              overflowY: 'auto'
            }}>
              <button
                onClick={() => { setFilterCategoria(''); setShowCatDropdown(false); }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: !filterCategoria ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                  color: !filterCategoria ? '#D4AF37' : 'var(--text-primary)',
                  fontSize: '14px',
                  fontFamily: 'Outfit, sans-serif',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                Todas categorias
              </button>
              {categorias.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setFilterCategoria(cat.id); setShowCatDropdown(false); }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: filterCategoria === cat.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                    color: filterCategoria === cat.id ? '#D4AF37' : 'var(--text-primary)',
                    fontSize: '14px',
                    fontFamily: 'Outfit, sans-serif',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(212, 175, 55, 0.2)'
                  }}>
                    <CategoryIcon categoryId={cat.id} size={14} color="#D4AF37" />
                  </span>
                  {cat.nome}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px', color: 'var(--text-secondary)', fontSize: '14px', fontFamily: 'Outfit, sans-serif' }}>
        {filtered.length} partitura(s) {search && `para "${search}"`}
      </div>

      {/* Lista agrupada por letra */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)', fontFamily: 'Outfit, sans-serif' }}>
          Carregando...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-secondary)',
          fontFamily: 'Outfit, sans-serif'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.5, marginBottom: '16px' }}>
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <p style={{ margin: 0 }}>Nenhuma partitura encontrada</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {sortedLetters.map((letter) => (
            <div key={letter}>
              {/* Header da letra */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '2px solid var(--border)'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#fff',
                  fontFamily: 'Outfit, sans-serif',
                  boxShadow: '0 2px 6px rgba(212, 175, 55, 0.3)'
                }}>
                  {letter}
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif' }}>
                  {groupedByLetter[letter].length} {groupedByLetter[letter].length === 1 ? 'partitura' : 'partituras'}
                </span>
              </div>

              {/* Lista de partituras desta letra */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {groupedByLetter[letter].map((p) => {
                  const cat = getCategoriaInfo(p.categoria_id);
                  const isExpanded = expandedId === p.id;

                  return (
                    <div key={p.id} style={{
                      background: 'var(--bg-secondary)',
                      borderRadius: '16px',
                      border: isExpanded ? '1px solid rgba(52, 152, 219, 0.4)' : '1px solid var(--border)',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease'
                    }}>
                      {/* Linha principal - clicavel para expandir */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 16px',
                          cursor: 'pointer'
                        }}
                      >
                        <div
                          onClick={() => toggleExpand(p)}
                          style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}
                        >
                          {/* Seta de expansao */}
                          <svg
                            data-tutorial={filtered.indexOf(p) === 0 ? 'expand-button' : undefined}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--text-muted)"
                            strokeWidth="2"
                            style={{
                              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s',
                              flexShrink: 0
                            }}
                          >
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>

                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(212, 175, 55, 0.2)',
                            flexShrink: 0
                          }}>
                            <CategoryIcon categoryId={cat.id || p.categoria_id} size={22} color="#D4AF37" />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{
                              fontWeight: '600',
                              color: 'var(--text-primary)',
                              marginBottom: '2px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '15px'
                            }}>
                              {p.titulo}
                              {p.destaque === 1 && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#D4AF37" stroke="#D4AF37" strokeWidth="1">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                </svg>
                              )}
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                              {p.compositor || 'Sem compositor'} • {cat.nome || 'Sem categoria'} {p.ano && `• ${p.ano}`}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                  <polyline points="7 10 12 15 17 10"/>
                                  <line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                                {p.downloads || 0}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                  <polyline points="14 2 14 8 20 8"/>
                                </svg>
                                {partesCount[p.id] !== undefined ? partesCount[p.id] : (p.total_partes || '?')} partes
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Botoes de acao */}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button onClick={() => toggleDestaque(p)} title={p.destaque === 1 ? 'Remover destaque' : 'Destacar'} className="btn-icon-hover" style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: p.destaque === 1 ? 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' : 'var(--bg-primary)',
                            border: p.destaque === 1 ? 'none' : '1px solid var(--border)',
                            color: p.destaque === 1 ? '#fff' : 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill={p.destaque === 1 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => openRepertorioModal(p)}
                            title={partiturasInRepertorio.has(p.id) ? 'Remover do Repertorio' : 'Adicionar ao Repertorio'}
                            className="btn-purple-hover"
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              background: partiturasInRepertorio.has(p.id)
                                ? 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)'
                                : 'rgba(155, 89, 182, 0.1)',
                              border: partiturasInRepertorio.has(p.id) ? 'none' : '1px solid rgba(155, 89, 182, 0.3)',
                              color: partiturasInRepertorio.has(p.id) ? '#fff' : '#9b59b6',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {partiturasInRepertorio.has(p.id) ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                              </svg>
                            )}
                          </button>
                          <button onClick={() => openEditModal(p)} title="Editar" className="btn-info-hover" style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'rgba(52, 152, 219, 0.1)',
                            border: '1px solid rgba(52, 152, 219, 0.3)',
                            color: '#3498db',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(p.id)} title="Excluir" className="btn-danger-hover" style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'rgba(231, 76, 60, 0.1)',
                            border: '1px solid rgba(231, 76, 60, 0.3)',
                            color: '#e74c3c',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Area expandida - partes */}
                      {isExpanded && (
                        <div style={{
                          borderTop: '1px solid var(--border)',
                          background: 'var(--bg-primary)',
                          padding: '12px'
                        }}>
                          {loadingPartes ? (
                            <PartesGridSkeleton count={8} />
                          ) : partes.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                              Nenhuma parte encontrada
                            </div>
                          ) : (
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                              gap: '6px',
                              marginBottom: '8px'
                            }}>
                              {partes.map((parte, parteIndex) => {
                                const isViewing = previewParte?.parteId === parte.id;
                                const isLoading = loadingPreview && !isViewing;

                                return (
                                  <div
                                    key={parte.id}
                                    onClick={() => !loadingPreview && handleViewPart(parte)}
                                    className="parte-item list-item-animate"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '6px 8px',
                                      background: isViewing ? 'rgba(52, 152, 219, 0.15)' : 'var(--bg-secondary)',
                                      borderRadius: '6px',
                                      border: isViewing ? '1px solid rgba(52, 152, 219, 0.4)' : '1px solid var(--border)',
                                      cursor: loadingPreview ? 'wait' : 'pointer',
                                      transition: 'all 0.15s ease',
                                      minHeight: '32px',
                                      animationDelay: `${parteIndex * 0.02}s`
                                    }}
                                  >
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      flex: 1,
                                      minWidth: 0
                                    }}>
                                      {isLoading ? (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}>
                                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                                          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                                        </svg>
                                      ) : (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isViewing ? '#3498db' : '#D4AF37'} strokeWidth="1.5" style={{ flexShrink: 0 }}>
                                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                          <polyline points="14 2 14 8 20 8"/>
                                        </svg>
                                      )}
                                      <span style={{
                                        fontSize: '12px',
                                        color: isViewing ? '#3498db' : 'var(--text-primary)',
                                        fontWeight: isViewing ? '500' : '400',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                      }}>
                                        {parte.instrumento}
                                      </span>
                                    </div>
                                    <div
                                      data-tutorial={partes.indexOf(parte) === 0 ? 'action-buttons' : undefined}
                                      style={{
                                        display: 'flex',
                                        gap: '4px',
                                        marginLeft: '8px',
                                        padding: '2px',
                                        borderRadius: '6px',
                                        background: 'var(--bg-primary)'
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      onMouseEnter={(e) => {
                                        // Impede que o hover do item pai seja ativado
                                        e.currentTarget.parentElement.style.background = isViewing ? 'rgba(52, 152, 219, 0.15)' : 'var(--bg-secondary)';
                                        e.currentTarget.parentElement.style.borderColor = isViewing ? 'rgba(52, 152, 219, 0.4)' : 'var(--border)';
                                      }}
                                    >
                                      <label
                                        data-tutorial={partes.indexOf(parte) === 0 ? 'btn-replace' : undefined}
                                        title="Substituir arquivo"
                                        className="action-btn action-btn-replace"
                                        style={{
                                          width: '24px',
                                          height: '24px',
                                          borderRadius: '4px',
                                          background: 'rgba(212, 175, 55, 0.1)',
                                          border: '1px solid rgba(212, 175, 55, 0.2)',
                                          color: '#D4AF37',
                                          cursor: uploading === parte.id ? 'wait' : 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          transition: 'all 0.15s ease'
                                        }}
                                      >
                                        {uploading === parte.id ? (
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                                            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                                          </svg>
                                        ) : (
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 1l4 4-4 4"/>
                                            <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                                            <path d="M7 23l-4-4 4-4"/>
                                            <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                                          </svg>
                                        )}
                                        <input
                                          type="file"
                                          accept=".pdf"
                                          style={{ display: 'none' }}
                                          onChange={(e) => {
                                            if (e.target.files[0]) {
                                              handleReplacePart(p.id, parte.id, e.target.files[0]);
                                            }
                                            e.target.value = '';
                                          }}
                                          disabled={uploading === parte.id}
                                        />
                                      </label>
                                      <button
                                        data-tutorial={partes.indexOf(parte) === 0 ? 'btn-delete' : undefined}
                                        onClick={() => handleDeletePart(p.id, parte.id)}
                                        disabled={deleting === parte.id}
                                        title="Remover parte"
                                        className="action-btn action-btn-delete"
                                        style={{
                                          width: '24px',
                                          height: '24px',
                                          borderRadius: '4px',
                                          background: 'rgba(231, 76, 60, 0.1)',
                                          border: '1px solid rgba(231, 76, 60, 0.2)',
                                          color: '#e74c3c',
                                          cursor: deleting === parte.id ? 'wait' : 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          transition: 'all 0.15s ease'
                                        }}
                                      >
                                        {deleting === parte.id ? (
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                                            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                                          </svg>
                                        ) : (
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6"/>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                          </svg>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Botao adicionar parte - mais compacto */}
                          <label
                            data-tutorial="add-parte"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              background: 'transparent',
                              border: '1px dashed var(--border)',
                              color: 'var(--text-muted)',
                              fontSize: '12px',
                              cursor: addingPart ? 'wait' : 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >
                            {addingPart ? (
                              <>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                                </svg>
                                Adicionando...
                              </>
                            ) : (
                              <>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="12" y1="5" x2="12" y2="19"/>
                                  <line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                                Adicionar parte
                              </>
                            )}
                            <input
                              ref={addFileInputRef}
                              type="file"
                              accept=".pdf"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  handleAddPart(p.id, e.target.files[0]);
                                }
                                e.target.value = '';
                              }}
                              disabled={addingPart}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overlay de Drag & Drop Global */}
      {isDraggingOver && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        >
          <div style={{
            width: '140px',
            height: '140px',
            borderRadius: '32px',
            background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.2) 0%, rgba(184, 134, 11, 0.1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            border: '2px dashed #D4AF37',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>

          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#D4AF37',
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            Solte a pasta aqui
          </div>

          <div style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            maxWidth: '300px'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>1 pasta com PDFs</strong> → Upload simples
            </div>
            <div>
              <strong>Pasta com subpastas</strong> → Importação em lote
            </div>
          </div>

          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.05); opacity: 0.8; }
            }
          `}</style>
        </div>
      )}

      {/* Modal de Upload de Pasta */}
      <UploadPastaModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={() => {
          loadData();
          setShowUploadModal(false);
        }}
        categorias={categorias}
        initialFiles={droppedFiles}
      />

      {/* Modal de Importação em Lote */}
      <Suspense fallback={null}>
        <ImportacaoLoteModal
          isOpen={showImportacaoLote}
          onClose={() => setShowImportacaoLote(false)}
          onSuccess={() => {
            loadData();
          }}
          onOpenUploadPasta={() => {
            setShowImportacaoLote(false);
            // TODO: Abrir UploadPastaModal com dados pré-preenchidos
            setShowUploadModal(true);
          }}
          initialItems={droppedItems}
        />
      </Suspense>

      {/* Modal de Visualizacao de PDF */}
      <Suspense fallback={null}>
        <PDFViewerModal
          isOpen={showPDFModal}
          onClose={closePreview}
          pdfUrl={previewParte?.blobUrl}
          title={previewParte?.instrumento || 'Visualizador de PDF'}
          onDownload={() => previewParte?.blobUrl && window.open(previewParte.blobUrl, '_blank')}
        />
      </Suspense>

      {/* Tutorial de Onboarding */}
      <TutorialOverlay
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onExpandFirst={expandFirstPartitura}
        onCollapseFirst={collapseFirstPartitura}
      />

      {/* Modal de Seleção de Repertório */}
      <RepertorioSelectorModal
        isOpen={showRepertorioModal}
        onClose={() => {
          setShowRepertorioModal(false);
          setSelectedPartituraForRepertorio(null);
        }}
        onSelect={(repertorio) => addToRepertorio(repertorio, selectedPartituraForRepertorio?.id)}
        onCreate={createRepertorioAndAdd}
        repertorios={repertorios}
        partituraTitulo={selectedPartituraForRepertorio?.titulo}
        loading={loadingRepertorios}
      />

      {/* Modal de Edição de Partitura */}
      {editModalOpen && editingPartitura && (
        <>
          {/* Overlay */}
          <div
            onClick={closeEditModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
              animation: 'fadeIn 0.2s ease'
            }}
          />

          {/* Modal */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'var(--bg-card)',
              borderRadius: '24px',
              padding: '0',
              zIndex: 1001,
              width: '440px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
              animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Header do Modal */}
            <div style={{
              padding: '24px 24px 20px',
              borderBottom: '1px solid var(--border)',
              background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-card) 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}>
                  <CategoryIcon categoryId={editingPartitura.categoria_id} size={28} color="#D4AF37" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    fontFamily: 'Outfit, sans-serif'
                  }}>
                    Editar Partitura
                  </h2>
                  <p style={{
                    margin: '4px 0 0',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    fontFamily: 'Outfit, sans-serif',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {editingPartitura.titulo}
                  </p>
                </div>
                <button
                  onClick={closeEditModal}
                  className="btn-icon-hover"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '12px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Corpo do Modal */}
            <div style={{ padding: '24px' }}>
              {/* Campo Título */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                  fontFamily: 'Outfit, sans-serif'
                }}>
                  Título da Partitura
                </label>
                <input
                  type="text"
                  value={editForm.titulo}
                  onChange={(e) => setEditForm(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Nome da partitura"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    fontFamily: 'Outfit, sans-serif',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#D4AF37';
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Campo Compositor */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                  fontFamily: 'Outfit, sans-serif'
                }}>
                  Compositor
                </label>
                <input
                  type="text"
                  value={editForm.compositor}
                  onChange={(e) => setEditForm(prev => ({ ...prev, compositor: e.target.value }))}
                  placeholder="Nome do compositor"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    fontFamily: 'Outfit, sans-serif',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#D4AF37';
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Campo Arranjador */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                  fontFamily: 'Outfit, sans-serif'
                }}>
                  Arranjador
                </label>
                <input
                  type="text"
                  value={editForm.arranjador}
                  onChange={(e) => setEditForm(prev => ({ ...prev, arranjador: e.target.value }))}
                  placeholder="Nome do arranjador (opcional)"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    fontFamily: 'Outfit, sans-serif',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#D4AF37';
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Campo Categoria */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                  fontFamily: 'Outfit, sans-serif'
                }}>
                  Categoria
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={editForm.categoria_id}
                    onChange={(e) => setEditForm(prev => ({ ...prev, categoria_id: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      paddingRight: '44px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--border)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '15px',
                      fontFamily: 'Outfit, sans-serif',
                      outline: 'none',
                      cursor: 'pointer',
                      appearance: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#D4AF37';
                      e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Sem categoria</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                  <div style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: 'var(--text-muted)'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={closeEditModal}
                  className="btn-ghost-hover"
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontSize: '15px',
                    fontWeight: '600',
                    fontFamily: 'Outfit, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={saveEditModal}
                  disabled={savingEdit || !editForm.titulo.trim()}
                  className="btn-primary-hover"
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    background: savingEdit || !editForm.titulo.trim()
                      ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.5) 0%, rgba(184, 134, 11, 0.5) 100%)'
                      : 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: '600',
                    fontFamily: 'Outfit, sans-serif',
                    cursor: savingEdit || !editForm.titulo.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    boxShadow: savingEdit || !editForm.titulo.trim() ? 'none' : '0 4px 12px rgba(212, 175, 55, 0.3)'
                  }}
                >
                  {savingEdit ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                      </svg>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                      </svg>
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Estilos */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .parte-item:hover {
          background: rgba(212, 175, 55, 0.08) !important;
          border-color: rgba(212, 175, 55, 0.3) !important;
        }

        /* Hover individual para botao de substituir */
        .action-btn-replace:hover {
          background: rgba(212, 175, 55, 0.25) !important;
          border-color: rgba(212, 175, 55, 0.5) !important;
          transform: scale(1.05);
        }

        /* Hover individual para botao de deletar */
        .action-btn-delete:hover {
          background: rgba(231, 76, 60, 0.25) !important;
          border-color: rgba(231, 76, 60, 0.5) !important;
          transform: scale(1.05);
        }

        .action-btn:active {
          transform: scale(0.95);
        }

        .parte-item:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default AdminPartituras;
