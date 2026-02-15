"use client";

// ===== IMPORTACAO LOTE MODAL =====
// Modal fullscreen para importacao massiva de partituras
// Estados: SELECTION -> ANALYZING -> FEEDBACK -> REVIEW -> UPLOADING -> COMPLETE

import { useState, useEffect, useCallback, useRef, type DragEvent, type ChangeEvent } from "react";
import { useUI } from "@contexts/UIContext";
import { API } from "@lib/api";

import { processarLote, processarFileList, filtrarPorStatus, calcularResultado } from "@utils/batchParser";
import { uploadLote, estimarTempo, gerarResumo } from "@utils/uploadBatch";

// Estados do modal
const STATES = {
  SELECTION: "selection",
  ANALYZING: "analyzing",
  FEEDBACK: "feedback",
  REVIEW: "review",
  UPLOADING: "uploading",
  COMPLETE: "complete",
} as const;

type ModalState = (typeof STATES)[keyof typeof STATES];

// Tabs de revisao
const TABS = {
  ALL: "all",
  READY: "ready",
  ATTENTION: "attention",
  PROBLEM: "problem",
} as const;

type TabKey = (typeof TABS)[keyof typeof TABS];

interface Arquivo {
  reconhecido: boolean;
  instrumento: string;
}

interface Pasta {
  id: string;
  titulo: string;
  nomePasta?: string;
  compositor: string;
  arranjador: string;
  categoria: string;
  status: "ready" | "attention" | "problem";
  statusMotivo: string | null;
  selecionada: boolean;
  duplicada?: boolean;
  arquivos: Arquivo[];
}

interface Estatisticas {
  total: number;
  prontas: number;
}

interface AnalyzeProgress {
  processadas: number;
  total: number;
  percentual: number;
}

interface UploadProgress {
  processadas: number;
  total: number;
  percentual: number;
  pastaAtual: string;
}

interface UploadResultados {
  resultados: Array<{ success: boolean; titulo: string; error?: string }>;
  estatisticas: { sucesso: number; erro: number };
}

interface Categoria {
  id: string;
  nome: string;
}

interface ImportacaoLoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onOpenUploadPasta?: (pasta: Pasta) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialEntries?: any[] | null;
}

const ImportacaoLoteModal = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenUploadPasta,
  initialEntries,
}: ImportacaoLoteModalProps) => {
  const { showToast } = useUI();

  // Estado principal
  const [modalState, setModalState] = useState<ModalState>(STATES.SELECTION);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Dados de analise
  const [pastas, setPastas] = useState<Pasta[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [analyzeProgress, setAnalyzeProgress] = useState<AnalyzeProgress>({
    processadas: 0,
    total: 0,
    percentual: 0,
  });
  const [partiturasExistentes, setPartiturasExistentes] = useState<unknown[]>([]);

  // Revisao
  const [activeTab, setActiveTab] = useState<TabKey>(TABS.ALL);
  const [pastaExpandida, setPastaExpandida] = useState<string | null>(null);

  // Upload
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    processadas: 0,
    total: 0,
    percentual: 0,
    pastaAtual: "",
  });
  const [uploadResultados, setUploadResultados] = useState<UploadResultados | null>(null);
  const [funnyPhraseIndex, setFunnyPhraseIndex] = useState(0);

  // Frases engraçadas para mostrar durante o upload
  const funnyPhrases = [
    "Adicionando os últimos detalhes...",
    "Refinando a visualização das partituras...",
    "Escrevendo o próximo Dobrado Tusca...",
    "Removendo o Dobrado Ludgero da próxima apresentação...",
    "Ratando a primeira nota de Preta Pretinha...",
    "Esperando João Viana voltar do banheiro...",
    "Deixando Julielson menos durinho no pandeiro...",
    "Afinando os pistões virtuais...",
    "Procurando a partitura perdida do saxofone...",
    "Ajustando o compasso que ninguém acerta...",
    "Adicionando mais uma fermata só de sacanagem...",
    "Verificando se o bombardino está acordado...",
    "Calibrando o volume da tuba...",
    "Inserindo pausas estratégicas para o café...",
    "Convencendo o maestro que está tudo certo...",
    "Organizando as estantes de partitura...",
  ];

  // UI
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handler para abrir o seletor de pasta
  const handleClickToSelect = () => {
    const input = document.getElementById("batch-folder-input") as HTMLInputElement | null;
    if (input) {
      input.value = "";
      input.click();
    }
  };

  // Carrega categorias e partituras existentes
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, partituras] = await Promise.all([API.getCategorias(), API.getPartituras()]);
        setCategorias(cats || []);
        setPartiturasExistentes(partituras || []);
      } catch {
        // silently fail
      }
    };
    if (isOpen) loadData();
  }, [isOpen]);

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      if (feedbackTimeoutRef.current !== null) {
        clearTimeout(feedbackTimeoutRef.current);
        feedbackTimeoutRef.current = null;
      }
      setModalState(STATES.SELECTION);
      setPastas([]);
      setEstatisticas(null);
      setAnalyzeProgress({ processadas: 0, total: 0, percentual: 0 });
      setActiveTab(TABS.ALL);
      setPastaExpandida(null);
      setUploadProgress({ processadas: 0, total: 0, percentual: 0, pastaAtual: "" });
      setUploadResultados(null);
      setFunnyPhraseIndex(0);
    }
  }, [isOpen]);

  // Alterna frases engracadas durante upload
  useEffect(() => {
    if (modalState === STATES.UPLOADING) {
      const interval = setInterval(() => {
        setFunnyPhraseIndex((prev) => (prev + 1) % funnyPhrases.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [modalState, funnyPhrases.length]);

  // Processa items pre-carregados (drag & drop global)
  useEffect(() => {
    const processInitialItems = async () => {
      if (!isOpen || !initialEntries || initialEntries.length === 0 || categorias.length === 0) return;
      if (modalState !== STATES.SELECTION) return;

      setModalState(STATES.ANALYZING);

      try {
        const { pastas: pastasAnalisadas, estatisticas: stats } = await processarLote(
          initialEntries,
          categorias,
          partiturasExistentes,
          setAnalyzeProgress
        );

        if (pastasAnalisadas.length === 0) {
          showToast("Nenhuma pasta com PDFs encontrada", "error");
          setModalState(STATES.SELECTION);
          return;
        }

        setPastas(pastasAnalisadas);
        setEstatisticas(stats);

        setModalState(STATES.FEEDBACK);
        feedbackTimeoutRef.current = setTimeout(() => {
          feedbackTimeoutRef.current = null;
          setModalState(STATES.REVIEW);
        }, 2500);
      } catch (err) {
        console.error("Erro na analise:", err);
        showToast("Erro ao analisar pastas", "error");
        setModalState(STATES.SELECTION);
      }
    };

    processInitialItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialEntries, categorias, partiturasExistentes]);

  // Handlers de Drag & Drop
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    if (!items || items.length === 0) return;

    setModalState(STATES.ANALYZING);

    try {
      const { pastas: pastasAnalisadas, estatisticas: stats } = await processarLote(
        items,
        categorias,
        partiturasExistentes,
        setAnalyzeProgress
      );

      if (pastasAnalisadas.length === 0) {
        showToast("Nenhuma pasta com PDFs encontrada", "error");
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
      console.error("Erro na analise:", err);
      showToast("Erro ao analisar pastas", "error");
      setModalState(STATES.SELECTION);
    }
  };

  // Handler de input file (fallback)
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
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
        showToast("Nenhuma pasta com PDFs encontrada", "error");
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
      console.error("Erro na analise:", err);
      showToast("Erro ao analisar pastas", "error");
      setModalState(STATES.SELECTION);
    }
  };

  // Toggle selecao de pasta
  const togglePastaSelecionada = useCallback((pastaId: string) => {
    setPastas((prev) => prev.map((p) => (p.id === pastaId ? { ...p, selecionada: !p.selecionada } : p)));
  }, []);

  // Selecionar/deselecionar todas
  const toggleTodas = useCallback((selecionar: boolean) => {
    setPastas((prev) => prev.map((p) => ({ ...p, selecionada: selecionar })));
  }, []);

  // Editar categoria de uma pasta
  const editarCategoria = useCallback((pastaId: string, novaCategoria: string) => {
    setPastas((prev) =>
      prev.map((p) => {
        if (p.id !== pastaId) return p;

        const atualizada = { ...p, categoria: novaCategoria };

        if (novaCategoria && p.status === "attention" && p.statusMotivo === "Categoria nao detectada") {
          atualizada.status = "ready";
          atualizada.statusMotivo = null;
        }

        return atualizada;
      })
    );
  }, []);

  // Editar titulo de uma pasta
  const editarTitulo = useCallback((pastaId: string, novoTitulo: string) => {
    setPastas((prev) => prev.map((p) => (p.id === pastaId ? { ...p, titulo: novoTitulo } : p)));
  }, []);

  // Editar compositor de uma pasta
  const editarCompositor = useCallback((pastaId: string, novoCompositor: string) => {
    setPastas((prev) => prev.map((p) => (p.id === pastaId ? { ...p, compositor: novoCompositor } : p)));
  }, []);

  // Editar arranjador de uma pasta
  const editarArranjador = useCallback((pastaId: string, novoArranjador: string) => {
    setPastas((prev) => prev.map((p) => (p.id === pastaId ? { ...p, arranjador: novoArranjador } : p)));
  }, []);

  // Iniciar upload
  const iniciarUpload = async () => {
    const pastasParaUpload = pastas.filter((p) => p.selecionada && p.status !== "problem");

    if (pastasParaUpload.length === 0) {
      showToast("Nenhuma partitura selecionada para upload", "error");
      return;
    }

    setModalState(STATES.UPLOADING);
    setUploadProgress({ processadas: 0, total: pastasParaUpload.length, percentual: 0, pastaAtual: "" });

    try {
      const { resultados, estatisticas: stats } = await uploadLote(pastasParaUpload, {
        onProgress: setUploadProgress,
        onPastaError: ({ pasta, error }: { pasta: Pasta; error: unknown }) => {
          console.error(`Erro no upload de ${pasta.titulo}:`, error);
        },
      });

      setUploadResultados({ resultados, estatisticas: stats });
      setModalState(STATES.COMPLETE);

      if (stats.sucesso > 0) {
        onSuccess?.();
      }
    } catch (err) {
      console.error("Erro no upload:", err);
      showToast("Erro durante o upload", "error");
      setModalState(STATES.REVIEW);
    }
  };

  // Abrir pasta com problema no modal individual
  const abrirPastaNoModalIndividual = (pasta: Pasta) => {
    if (onOpenUploadPasta) {
      onOpenUploadPasta(pasta);
      setPastas((prev) => prev.filter((p) => p.id !== pasta.id));
    }
  };

  // Filtra pastas para exibicao
  const pastasFiltradas: Pasta[] = filtrarPorStatus(pastas, activeTab);

  // Contadores por status
  const contadores = {
    all: pastas.length,
    ready: pastas.filter((p) => p.status === "ready").length,
    attention: pastas.filter((p) => p.status === "attention").length,
    problem: pastas.filter((p) => p.status === "problem").length,
  };

  // Pastas selecionadas para upload (exclui problemas)
  const pastasSelecionadas = pastas.filter((p) => p.selecionada && p.status !== "problem");

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.9)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: modalState === STATES.REVIEW ? "900px" : "600px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: "Outfit, sans-serif",
          transition: "max-width 0.3s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "4px",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                <path d="M12 11v6M9 14h6" />
              </svg>
              Importacao em Lote
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              {modalState === STATES.SELECTION && "Arraste uma pasta contendo varias partituras"}
              {modalState === STATES.ANALYZING && "Analisando estrutura das pastas..."}
              {modalState === STATES.FEEDBACK && "Analise concluida!"}
              {modalState === STATES.REVIEW &&
                `${contadores.all} partitura${contadores.all !== 1 ? "s" : ""} detectada${contadores.all !== 1 ? "s" : ""}`}
              {modalState === STATES.UPLOADING && "Enviando partituras..."}
              {modalState === STATES.COMPLETE && "Upload finalizado!"}
            </p>
          </div>

          {/* Botao fechar */}
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Input de arquivo com ID para acesso via getElementById */}
        <input
          ref={fileInputRef}
          id="batch-folder-input"
          type="file"
          {...{ webkitdirectory: "", directory: "" }}
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "24px",
          }}
        >
          {/* SELECTION STATE */}
          {modalState === STATES.SELECTION && (
            <div
              onClick={handleClickToSelect}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                display: "block",
                border: isDragging ? "2px dashed #D4AF37" : "2px dashed var(--border)",
                borderRadius: "12px",
                padding: "60px 40px",
                textAlign: "center",
                background: isDragging
                  ? "linear-gradient(145deg, rgba(212, 175, 55, 0.15) 0%, rgba(184, 134, 11, 0.08) 100%)"
                  : "var(--bg-primary)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: isDragging ? "scale(1.02)" : "scale(1)",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  margin: "0 auto 24px",
                  borderRadius: "24px",
                  background: "linear-gradient(145deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  <path d="M12 11v6M9 14h6" opacity="0.6" />
                </svg>
              </div>

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: isDragging ? "#D4AF37" : "var(--text-primary)",
                  marginBottom: "8px",
                }}
              >
                {isDragging ? "Solte as pastas aqui!" : "Arraste uma pasta ou clique para selecionar"}
              </div>

              <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>
                Selecione uma pasta contendo subpastas de partituras
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "center",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  Multiplas pastas
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  </svg>
                  Arquivos PDF
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Deteccao automatica
                </span>
              </div>
            </div>
          )}

          {/* ANALYZING STATE */}
          {modalState === STATES.ANALYZING && (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div
                style={{
                  width: "140px",
                  height: "140px",
                  margin: "0 auto 24px",
                  borderRadius: "50%",
                  background: "linear-gradient(145deg, rgba(212, 175, 55, 0.12) 0%, rgba(184, 134, 11, 0.06) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 24px rgba(212, 175, 55, 0.08)",
                }}
              >
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                  style={{ animation: "spin 2s linear infinite" }}
                >
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                </svg>
              </div>

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                }}
              >
                Preparando arquivos...
              </div>

              <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>
                {analyzeProgress.total > 0
                  ? `Organizando ${analyzeProgress.total} arquivo(s)...`
                  : "Lendo estrutura de diretorios..."}
              </div>

              {analyzeProgress.total > 0 && (
                <div
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    height: "6px",
                    background: "rgba(212, 175, 55, 0.1)",
                    borderRadius: "3px",
                    overflow: "hidden",
                    margin: "0 auto",
                  }}
                >
                  <div
                    style={{
                      width: `${analyzeProgress.percentual}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #D4AF37, #B8860B)",
                      borderRadius: "3px",
                      transition: "width 0.3s ease-out",
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* FEEDBACK STATE */}
          {modalState === STATES.FEEDBACK && estatisticas && (
            <div style={{ textAlign: "center", padding: "40px" }}>
              {(() => {
                const resultado = calcularResultado(estatisticas);
                const bgColor =
                  resultado.tipo === "success"
                    ? "rgba(39, 174, 96, 0.1)"
                    : resultado.tipo === "partial"
                      ? "rgba(230, 126, 34, 0.1)"
                      : "rgba(231, 76, 60, 0.1)";
                return (
                  <>
                    <div
                      style={{
                        width: "160px",
                        height: "160px",
                        margin: "0 auto 24px",
                        borderRadius: "50%",
                        background: bgColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 4px 24px ${bgColor}`,
                      }}
                    >
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>

                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color:
                          resultado.tipo === "success"
                            ? "#27ae60"
                            : resultado.tipo === "partial"
                              ? "#e67e22"
                              : "#e74c3c",
                        marginBottom: "8px",
                      }}
                    >
                      {resultado.tipo === "success" && "Tudo pronto!"}
                      {resultado.tipo === "partial" && "Quase la!"}
                      {resultado.tipo === "failure" && "Precisa de atencao"}
                    </div>

                    <div style={{ fontSize: "16px", color: "var(--text-secondary)" }}>
                      {estatisticas.prontas} de {estatisticas.total} partitura
                      {estatisticas.total !== 1 ? "s" : ""} pronta{estatisticas.prontas !== 1 ? "s" : ""} para upload
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
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "20px",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "12px",
                }}
              >
                {(
                  [
                    { key: TABS.ALL, label: "Todas", count: contadores.all, color: undefined },
                    { key: TABS.READY, label: "Prontas", count: contadores.ready, color: "#27ae60" },
                    { key: TABS.ATTENTION, label: "Atencao", count: contadores.attention, color: "#e67e22" },
                    { key: TABS.PROBLEM, label: "Problemas", count: contadores.problem, color: "#e74c3c" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "20px",
                      border: "none",
                      background:
                        activeTab === tab.key
                          ? tab.color
                            ? `${tab.color}20`
                            : "rgba(212, 175, 55, 0.15)"
                          : "transparent",
                      color: activeTab === tab.key ? (tab.color || "#D4AF37") : "var(--text-secondary)",
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.2s",
                    }}
                  >
                    {tab.label}
                    <span
                      style={{
                        background: tab.color ? `${tab.color}30` : "var(--bg-primary)",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "11px",
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Acoes em massa */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "16px",
                  fontSize: "13px",
                }}
              >
                <button
                  onClick={() => toggleTodas(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#D4AF37",
                    cursor: "pointer",
                    padding: "4px 8px",
                  }}
                >
                  Selecionar todas
                </button>
                <button
                  onClick={() => toggleTodas(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    padding: "4px 8px",
                  }}
                >
                  Limpar selecao
                </button>
              </div>

              {/* Lista de pastas */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {pastasFiltradas.map((pasta) => (
                  <div
                    key={pasta.id}
                    style={{
                      background: "var(--bg-primary)",
                      borderRadius: "12px",
                      border: `1px solid ${pasta.status === "ready" ? "var(--border)" : pasta.status === "attention" ? "#e67e22" : "#e74c3c"}`,
                    }}
                  >
                    {/* Cabecalho da pasta */}
                    <div
                      onClick={() => setPastaExpandida(pastaExpandida === pasta.id ? null : pasta.id)}
                      style={{
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
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
                        disabled={pasta.status === "problem"}
                        style={{ cursor: pasta.status === "problem" ? "not-allowed" : "pointer" }}
                      />

                      {/* Icone de status */}
                      <span
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background:
                            pasta.status === "ready"
                              ? "rgba(39, 174, 96, 0.15)"
                              : pasta.status === "attention"
                                ? "rgba(230, 126, 34, 0.15)"
                                : "rgba(231, 76, 60, 0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {pasta.status === "ready" && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                        {pasta.status === "attention" && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e67e22" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                        )}
                        {pasta.status === "problem" && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                        )}
                      </span>

                      {/* Titulo e info */}
                      <div style={{ flex: 1, minWidth: "100px", overflow: "hidden" }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "var(--text-primary)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            lineHeight: "1.4",
                            marginBottom: "6px",
                          }}
                        >
                          {pasta.titulo || pasta.nomePasta || "Sem titulo"}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "11px",
                              padding: "2px 8px",
                              borderRadius: "10px",
                              background: "var(--bg-secondary)",
                              color: "var(--text-secondary)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            {pasta.arquivos.length} arquivo{pasta.arquivos.length !== 1 ? "s" : ""}
                          </span>

                          {/* Tag de categoria */}
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              const select = (e.currentTarget as HTMLElement).querySelector("select");
                              if (select) select.click();
                            }}
                            style={{
                              fontSize: "11px",
                              padding: "2px 8px",
                              borderRadius: "10px",
                              background: pasta.categoria ? "rgba(212, 175, 55, 0.1)" : "rgba(230, 126, 34, 0.1)",
                              color: pasta.categoria ? "#D4AF37" : "#e67e22",
                              border: `1px solid ${pasta.categoria ? "rgba(212, 175, 55, 0.3)" : "rgba(230, 126, 34, 0.3)"}`,
                              cursor: "pointer",
                              fontWeight: "500",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              position: "relative" as const,
                            }}
                          >
                            {categorias.find((c) => c.id === pasta.categoria)?.nome || "Categoria"}
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                            <select
                              value={pasta.categoria || ""}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                editarCategoria(pasta.id, e.target.value);
                              }}
                              style={{
                                position: "absolute" as const,
                                opacity: 0,
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                cursor: "pointer",
                              }}
                            >
                              <option value="">Categoria</option>
                              {categorias.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.nome}
                                </option>
                              ))}
                            </select>
                          </span>

                          {/* Tag de status/problema */}
                          {pasta.statusMotivo && (
                            <span
                              style={{
                                fontSize: "11px",
                                padding: "2px 8px",
                                borderRadius: "10px",
                                background:
                                  pasta.status === "attention" ? "rgba(230, 126, 34, 0.1)" : "rgba(231, 76, 60, 0.1)",
                                color: pasta.status === "attention" ? "#e67e22" : "#e74c3c",
                                border: `1px solid ${pasta.status === "attention" ? "rgba(230, 126, 34, 0.3)" : "rgba(231, 76, 60, 0.3)"}`,
                              }}
                            >
                              {pasta.statusMotivo}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Botoes para pastas com problema */}
                      {pasta.status === "problem" && (
                        <div style={{ display: "flex", gap: "8px" }}>
                          {pasta.duplicada && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPastas((prev) =>
                                  prev.map((p) =>
                                    p.id === pasta.id
                                      ? {
                                          ...p,
                                          status: "attention" as const,
                                          statusMotivo: "Duplicada (forcado)",
                                          selecionada: true,
                                        }
                                      : p
                                  )
                                );
                              }}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "6px",
                                border: "1px solid #e67e22",
                                background: "rgba(230, 126, 34, 0.1)",
                                color: "#e67e22",
                                fontSize: "12px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 9v4M12 17h.01" />
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                              </svg>
                              Forcar
                            </button>
                          )}
                          {!pasta.duplicada && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                abrirPastaNoModalIndividual(pasta);
                              }}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "6px",
                                border: "1px solid #e74c3c",
                                background: "rgba(231, 76, 60, 0.1)",
                                color: "#e74c3c",
                                fontSize: "12px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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
                          transform: pastaExpandida === pasta.id ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>

                    {/* Detalhes expandidos */}
                    {pastaExpandida === pasta.id && (
                      <div
                        style={{
                          padding: "12px 16px",
                          background: "var(--bg-secondary)",
                          borderTop: "1px solid var(--border)",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "10px",
                            marginBottom: "12px",
                          }}
                        >
                          <div style={{ gridColumn: "1 / -1" }}>
                            <label
                              style={{
                                display: "block",
                                fontSize: "11px",
                                color: "var(--text-muted)",
                                marginBottom: "3px",
                                fontWeight: "500",
                              }}
                            >
                              Titulo
                            </label>
                            <input
                              type="text"
                              value={pasta.titulo || ""}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => editarTitulo(pasta.id, e.target.value)}
                              placeholder="Nome da partitura"
                              style={{
                                width: "100%",
                                padding: "8px 10px",
                                borderRadius: "6px",
                                border: "1px solid var(--border)",
                                background: "var(--bg-primary)",
                                color: "var(--text-primary)",
                                fontSize: "13px",
                                fontWeight: "500",
                              }}
                            />
                          </div>

                          <div>
                            <label
                              style={{
                                display: "block",
                                fontSize: "11px",
                                color: "var(--text-muted)",
                                marginBottom: "3px",
                                fontWeight: "500",
                              }}
                            >
                              Compositor
                            </label>
                            <input
                              type="text"
                              value={pasta.compositor || ""}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => editarCompositor(pasta.id, e.target.value)}
                              placeholder="Nome do compositor"
                              style={{
                                width: "100%",
                                padding: "8px 10px",
                                borderRadius: "6px",
                                border: "1px solid var(--border)",
                                background: "var(--bg-primary)",
                                color: "var(--text-primary)",
                                fontSize: "13px",
                              }}
                            />
                          </div>

                          <div>
                            <label
                              style={{
                                display: "block",
                                fontSize: "11px",
                                color: "var(--text-muted)",
                                marginBottom: "3px",
                                fontWeight: "500",
                              }}
                            >
                              Arranjador
                            </label>
                            <input
                              type="text"
                              value={pasta.arranjador || ""}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => editarArranjador(pasta.id, e.target.value)}
                              placeholder="Nome do arranjador"
                              style={{
                                width: "100%",
                                padding: "8px 10px",
                                borderRadius: "6px",
                                border: "1px solid var(--border)",
                                background: "var(--bg-primary)",
                                color: "var(--text-primary)",
                                fontSize: "13px",
                              }}
                            />
                          </div>
                        </div>

                        {/* Lista de arquivos */}
                        <div style={{ fontSize: "12px" }}>
                          <div style={{ color: "var(--text-secondary)", marginBottom: "8px" }}>
                            Arquivos detectados:
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                              gap: "6px",
                            }}
                          >
                            {pasta.arquivos.map((arq, idx) => (
                              <div
                                key={idx}
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: "4px",
                                  background: arq.reconhecido ? "rgba(39, 174, 96, 0.1)" : "rgba(230, 126, 34, 0.1)",
                                  color: arq.reconhecido ? "#27ae60" : "#e67e22",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                {arq.reconhecido ? (
                                  <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                ) : (
                                  <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
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
            <div style={{ textAlign: "center", padding: "40px 40px 32px" }}>
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  margin: "0 auto 28px",
                  borderRadius: "50%",
                  background: "linear-gradient(145deg, rgba(212, 175, 55, 0.12) 0%, rgba(184, 134, 11, 0.06) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 24px rgba(212, 175, 55, 0.08)",
                }}
              >
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                  style={{ animation: "spin 2s linear infinite" }}
                >
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                </svg>
              </div>

              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "6px",
                }}
              >
                Enviando partituras
              </div>

              <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "16px" }}>
                {uploadProgress.processadas} de {uploadProgress.total} concluida
                {uploadProgress.processadas !== 1 ? "s" : ""}
              </div>

              {/* Frase engracada animada */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "32px",
                  minHeight: "24px",
                }}
              >
                <span
                  key={funnyPhraseIndex}
                  style={{
                    fontSize: "13px",
                    color: "#D4AF37",
                    fontStyle: "italic",
                  }}
                >
                  {funnyPhrases[funnyPhraseIndex]}
                </span>
              </div>

              {/* Barra de progresso */}
              <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
                <div
                  style={{
                    position: "relative",
                    height: "8px",
                    background: "var(--bg-primary)",
                    borderRadius: "4px",
                    overflow: "hidden",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: `${uploadProgress.percentual}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #D4AF37 0%, #F4D03F 50%, #D4AF37 100%)",
                      backgroundSize: "200% 100%",
                      borderRadius: "4px",
                      transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      animation: "shimmer 2s linear infinite",
                    }}
                  />
                </div>

                {/* Indicadores de progresso */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "6px",
                    marginTop: "20px",
                  }}
                >
                  {pastas
                    .filter((p) => p.selecionada && p.status !== "problem")
                    .map((p, idx) => {
                      const isCompleted = idx < uploadProgress.processadas;
                      const isCurrent = idx === uploadProgress.processadas;
                      return (
                        <div
                          key={p.id}
                          title={p.titulo}
                          style={{
                            width: isCurrent ? "24px" : "8px",
                            height: "8px",
                            borderRadius: "4px",
                            background: isCompleted
                              ? "#27ae60"
                              : isCurrent
                                ? "linear-gradient(90deg, #D4AF37, #F4D03F)"
                                : "var(--bg-secondary)",
                            transition: "all 0.3s ease",
                            cursor: "default",
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
              `}</style>
            </div>
          )}

          {/* COMPLETE STATE */}
          {modalState === STATES.COMPLETE && uploadResultados && (
            <div style={{ textAlign: "center", padding: "40px" }}>
              {(() => {
                const resumo = gerarResumo(uploadResultados.estatisticas);
                const bgColor =
                  resumo.tipo === "success"
                    ? "rgba(39, 174, 96, 0.1)"
                    : resumo.tipo === "partial"
                      ? "rgba(230, 126, 34, 0.1)"
                      : "rgba(231, 76, 60, 0.1)";
                return (
                  <>
                    <div
                      style={{
                        width: "160px",
                        height: "160px",
                        margin: "0 auto 24px",
                        borderRadius: "50%",
                        background: bgColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 4px 24px ${bgColor}`,
                      }}
                    >
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>

                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color:
                          resumo.tipo === "success"
                            ? "#27ae60"
                            : resumo.tipo === "partial"
                              ? "#e67e22"
                              : "#e74c3c",
                        marginBottom: "8px",
                      }}
                    >
                      {resumo.tipo === "success" && "Upload concluido!"}
                      {resumo.tipo === "partial" && "Upload parcial"}
                      {resumo.tipo === "error" && "Falha no upload"}
                    </div>

                    <div style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                      {resumo.mensagem}
                    </div>

                    <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Tempo total: {resumo.duracao}</div>

                    {uploadResultados.estatisticas.erro > 0 && (
                      <div
                        style={{
                          marginTop: "24px",
                          padding: "16px",
                          background: "rgba(231, 76, 60, 0.1)",
                          borderRadius: "12px",
                          textAlign: "left",
                          maxWidth: "350px",
                          margin: "24px auto 0",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#e74c3c",
                            marginBottom: "8px",
                          }}
                        >
                          Erros encontrados:
                        </div>
                        {uploadResultados.resultados
                          .filter((r) => !r.success)
                          .map((r, idx) => (
                            <div
                              key={idx}
                              style={{
                                fontSize: "12px",
                                color: "var(--text-secondary)",
                                marginBottom: "4px",
                              }}
                            >
                              &bull; {r.titulo}: {r.error}
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
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            {modalState === STATES.REVIEW && (
              <>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  {pastasSelecionadas.length} de {pastas.filter((p) => p.status !== "problem").length} selecionada
                  {pastasSelecionadas.length !== 1 ? "s" : ""}
                  {pastasSelecionadas.length > 0 && (
                    <span style={{ marginLeft: "8px" }}>
                      (
                      {
                        estimarTempo(
                          pastasSelecionadas.length,
                          pastasSelecionadas.reduce((acc: number, p: Pasta) => acc + p.arquivos.length, 0)
                        ).tempoFormatado
                      }
                      )
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={onClose}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "12px",
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={iniciarUpload}
                    disabled={pastasSelecionadas.length === 0}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "12px",
                      background:
                        pastasSelecionadas.length === 0
                          ? "linear-gradient(135deg, rgba(212, 175, 55, 0.5) 0%, rgba(184, 134, 11, 0.5) 100%)"
                          : "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
                      border: "none",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: pastasSelecionadas.length === 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Enviar {pastasSelecionadas.length} partitura{pastasSelecionadas.length !== 1 ? "s" : ""}
                  </button>
                </div>
              </>
            )}

            {modalState === STATES.COMPLETE && (
              <div style={{ width: "100%", textAlign: "center" }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: "12px 32px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
                    border: "none",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
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
