"use client";

// ===== USE SHEET DOWNLOAD HOOK =====
// Hook para gerenciar download de partituras
// Extraido de SheetDetailModal para melhor testabilidade

import { useState, useCallback } from "react";
import { API_BASE_URL } from "@constants/api";
import Storage from "@lib/storage";

// ===== Types =====

export interface Parte {
  id: string | number;
  instrumento: string;
  [key: string]: unknown;
}

export interface Sheet {
  id: string;
  title: string;
  composer?: string;
  category?: string;
  downloads?: number;
  year?: string | number;
  featured?: boolean;
}

export interface PdfViewerState {
  isOpen: boolean;
  url: string | null;
  title: string;
  instrument: string;
}

export interface UseSheetDownloadOptions {
  showToast: (message: string, type?: string) => void;
  selectedSheet: Sheet | null;
  partes?: Parte[];
}

// ===== Helpers =====

/**
 * Salva um blob como arquivo para download
 * Compativel com navegadores modernos e IE/Edge legado
 */
const saveBlob = (blob: Blob, filename: string): void => {
  // Metodo 1: msSaveBlob para IE/Edge legado
  const nav = window.navigator as Navigator & {
    msSaveBlob?: (blob: Blob, defaultName?: string) => boolean;
  };
  if (nav.msSaveBlob) {
    nav.msSaveBlob(blob, filename);
    return;
  }

  // Metodo 2: Criar link com blob URL
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";

  // Importante: adicionar ao DOM antes de clicar
  document.body.appendChild(link);

  // Usar setTimeout para garantir que o DOM foi atualizado
  setTimeout(() => {
    link.click();
    // Limpar apos um tempo maior
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 250);
  }, 0);
};

/**
 * Normaliza nome de instrumento para comparacao
 * Converte variantes como "Saxofone Alto" -> "sax alto"
 */
const normalizeInstrumento = (nome: string): string => {
  return nome
    .toLowerCase()
    .replace(/\./g, "") // Remove pontos: "Sax." -> "Sax"
    .replace(/saxofone/g, "sax") // Normaliza Saxofone -> Sax
    .replace(/clarineta/g, "clarinete") // Variante
    .replace(/\s+/g, " ") // Colapsa espacos
    .trim();
};

/**
 * Extrai tonalidade de um nome de instrumento normalizado
 * Ex: "trompa f" -> "f", "trompete bb 1" -> "bb", "clarinete" -> null
 */
const extractTonalidade = (nome: string): string | null => {
  const match = nome.match(/\s+(bb|eb|f|c)\b/i);
  return match ? match[1].toLowerCase() : null;
};

/**
 * Encontra partes correspondentes ao instrumento
 * Considera variacoes como "Trompete Bb 1", "Trompete Bb 2"
 * E normaliza nomes: "Saxofone Soprano" -> "Sax Soprano"
 * IMPORTANTE: Nao mistura tonalidades (Trompa F nao baixa Trompa Eb)
 */
export const findPartesCorrespondentes = (
  instrumento: string,
  partes: Parte[]
): Parte[] => {
  if (!instrumento || partes.length === 0) return [];

  const instrNorm = normalizeInstrumento(instrumento);
  const instrTonalidade = extractTonalidade(instrNorm);
  const instrBase = instrNorm.replace(/\s*(bb|eb|f|c)?\s*\d*$/i, "").trim();

  return partes.filter((p) => {
    const parteNorm = normalizeInstrumento(p.instrumento);
    const parteTonalidade = extractTonalidade(parteNorm);
    const parteBase = parteNorm.replace(/\s*(bb|eb|f|c)?\s*\d*$/i, "").trim();

    // Se ambos tem tonalidade e sao diferentes, nao combina
    // Ex: Trompa F nao baixa Trompa Eb
    if (
      instrTonalidade &&
      parteTonalidade &&
      instrTonalidade !== parteTonalidade
    ) {
      return false;
    }

    return (
      parteNorm === instrNorm ||
      parteNorm.startsWith(instrNorm) ||
      parteBase === instrBase ||
      instrNorm.startsWith(parteBase)
    );
  });
};

/**
 * Encontra parte exata pelo nome do instrumento
 */
export const findParteExata = (
  instrumento: string,
  partes: Parte[]
): Parte | undefined => {
  return partes.find(
    (p) => p.instrumento.toLowerCase() === instrumento.toLowerCase()
  );
};

/**
 * Hook para gerenciar downloads de partituras
 */
export const useSheetDownload = ({
  showToast,
  selectedSheet,
  partes = [],
}: UseSheetDownloadOptions) => {
  const [downloading, setDownloading] = useState(false);
  const [confirmInstrument, setConfirmInstrument] = useState<string | null>(
    null
  );
  const [selectedParte, setSelectedParte] = useState<Parte | null>(null);
  const [showPartePicker, setShowPartePicker] = useState(false);
  const [partesDisponiveis, setPartesDisponiveis] = useState<Parte[]>([]);

  // Estado para o visualizador de PDF embutido (mobile)
  const [pdfViewer, setPdfViewer] = useState<PdfViewerState>({
    isOpen: false,
    url: null,
    title: "",
    instrument: "",
  });

  /**
   * Download direto de uma parte especifica
   */
  const downloadParteDireta = useCallback(
    async (parte: Parte) => {
      if (downloading || !selectedSheet) return;
      setDownloading(true);

      showToast(
        `Preparando "${selectedSheet.title}" - ${parte.instrumento}...`
      );

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/download/parte/${parte.id}`,
          {
            headers: {
              Authorization: `Bearer ${Storage.get<string | null>("authToken", null)}`,
            },
          }
        );

        if (response.ok) {
          // Extrair nome do arquivo do header Content-Disposition se disponivel
          let filename = `${selectedSheet.title} - ${parte.instrumento}.pdf`;
          const contentDisposition =
            response.headers.get("Content-Disposition");
          if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            if (match) filename = match[1];
          }

          const blob = await response.blob();
          // Criar blob com tipo explicito para PDF
          const pdfBlob = new Blob([blob], { type: "application/pdf" });

          // Usar funcao de save dedicada
          saveBlob(pdfBlob, filename);

          showToast("Download iniciado!");
        } else {
          const error = await response.json().catch(() => ({}));
          showToast(
            (error as { error?: string }).error || "Erro ao baixar arquivo",
            "error"
          );
        }
      } catch (e) {
        console.error("Erro no download:", e);
        showToast("Erro ao baixar arquivo", "error");
      }

      setDownloading(false);
      setShowPartePicker(false);
      setConfirmInstrument(null);
    },
    [downloading, selectedSheet, showToast]
  );

  /**
   * Download do arquivo completo da partitura (fallback)
   */
  const downloadCompleto = useCallback(async () => {
    if (downloading || !selectedSheet) return;
    setDownloading(true);

    showToast(`Preparando "${selectedSheet.title}"...`);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/download/${selectedSheet.id}`,
        {
          headers: {
            Authorization: `Bearer ${Storage.get<string | null>("authToken", null)}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const pdfBlob = new Blob([blob], { type: "application/pdf" });
        saveBlob(pdfBlob, `${selectedSheet.title}.pdf`);
        showToast("Iniciando download...");
      } else {
        showToast("Erro ao baixar arquivo", "error");
      }
    } catch (e) {
      console.error("Erro no download:", e);
      showToast("Erro ao baixar arquivo", "error");
    }

    setDownloading(false);
  }, [downloading, selectedSheet, showToast]);

  /**
   * Seleciona um instrumento e decide o fluxo de download
   */
  const handleSelectInstrument = useCallback(
    (instrument: string) => {
      const correspondentes = findPartesCorrespondentes(instrument, partes);

      if (correspondentes.length === 0) {
        // Nenhuma parte encontrada - vai para confirmacao
        setConfirmInstrument(instrument);
      } else if (correspondentes.length === 1) {
        // Apenas uma parte - download direto
        downloadParteDireta(correspondentes[0]);
      } else {
        // Multiplas partes - mostrar picker
        setPartesDisponiveis(correspondentes);
        setShowPartePicker(true);
        setConfirmInstrument(instrument);
      }
    },
    [partes, downloadParteDireta]
  );

  /**
   * Seleciona uma parte especifica pelo nome exato
   */
  const handleSelectParteEspecifica = useCallback(
    (instrumento: string) => {
      const parte = findParteExata(instrumento, partes);
      if (parte) {
        setConfirmInstrument(instrumento);
        setSelectedParte(parte);
      } else {
        showToast("Parte não encontrada", "error");
      }
    },
    [partes, showToast]
  );

  /**
   * Confirma e executa o download
   */
  const handleConfirmDownload = useCallback(async () => {
    if (selectedParte) {
      await downloadParteDireta(selectedParte);
      setConfirmInstrument(null);
      setSelectedParte(null);
      return;
    }

    const correspondentes = findPartesCorrespondentes(
      confirmInstrument!,
      partes
    );

    if (correspondentes.length > 0) {
      await downloadParteDireta(correspondentes[0]);
    } else {
      await downloadCompleto();
    }

    setConfirmInstrument(null);
  }, [
    selectedParte,
    confirmInstrument,
    partes,
    downloadParteDireta,
    downloadCompleto,
  ]);

  /**
   * Cancela o fluxo de download
   */
  const handleCancelDownload = useCallback(() => {
    setConfirmInstrument(null);
    setSelectedParte(null);
    setShowPartePicker(false);
    setPartesDisponiveis([]);
  }, []);

  /**
   * Fecha o picker de partes
   */
  const closePartePicker = useCallback(() => {
    setShowPartePicker(false);
    setConfirmInstrument(null);
  }, []);

  /**
   * Imprime uma parte especifica
   */
  const printParte = useCallback(
    async (parte: Parte) => {
      if (downloading || !selectedSheet) return;
      setDownloading(true);

      showToast(
        `Preparando impressão "${selectedSheet.title}" - ${parte.instrumento}...`
      );

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/download/parte/${parte.id}`,
          {
            headers: {
              Authorization: `Bearer ${Storage.get<string | null>("authToken", null)}`,
            },
          }
        );

        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const printWindow = window.open(blobUrl, "_blank");
          if (printWindow) {
            printWindow.onload = () => {
              printWindow.print();
            };
          }
          showToast("Abrindo impressão...");
        } else {
          const error = await response.json().catch(() => ({}));
          showToast(
            (error as { error?: string }).error ||
              "Erro ao preparar impressão",
            "error"
          );
        }
      } catch (e) {
        console.error("Erro na impressao:", e);
        showToast("Erro ao preparar impressão", "error");
      }

      setDownloading(false);
    },
    [downloading, selectedSheet, showToast]
  );

  /**
   * Inicia fluxo de impressao para um instrumento
   */
  const handlePrintInstrument = useCallback(
    (instrument: string) => {
      const correspondentes = findPartesCorrespondentes(instrument, partes);

      if (correspondentes.length === 0) {
        showToast("Parte não encontrada para impressão", "error");
      } else if (correspondentes.length === 1) {
        printParte(correspondentes[0]);
      } else {
        // Usa primeira parte para simplicidade
        printParte(correspondentes[0]);
      }
    },
    [partes, printParte, showToast]
  );

  /**
   * Visualiza uma parte especifica (abre no modal embutido)
   */
  const viewParte = useCallback(
    async (parte: Parte) => {
      if (downloading || !selectedSheet) return;
      setDownloading(true);

      showToast(
        `Carregando "${selectedSheet.title}" - ${parte.instrumento}...`
      );

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/download/parte/${parte.id}`,
          {
            headers: {
              Authorization: `Bearer ${Storage.get<string | null>("authToken", null)}`,
            },
          }
        );

        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);

          // Abre no modal embutido
          setPdfViewer({
            isOpen: true,
            url: blobUrl,
            title: selectedSheet.title,
            instrument: parte.instrumento,
          });
        } else {
          const error = await response.json().catch(() => ({}));
          showToast(
            (error as { error?: string }).error || "Erro ao abrir arquivo",
            "error"
          );
        }
      } catch (e) {
        console.error("Erro ao visualizar:", e);
        showToast("Erro ao abrir arquivo", "error");
      }

      setDownloading(false);
    },
    [downloading, selectedSheet, showToast]
  );

  /**
   * Fecha o visualizador de PDF embutido
   */
  const closePdfViewer = useCallback(() => {
    // Revogar URL do blob para liberar memoria
    if (pdfViewer.url) {
      URL.revokeObjectURL(pdfViewer.url);
    }
    setPdfViewer({
      isOpen: false,
      url: null,
      title: "",
      instrument: "",
    });
  }, [pdfViewer.url]);

  /**
   * Inicia fluxo de visualizacao para um instrumento
   */
  const handleViewInstrument = useCallback(
    (instrument: string) => {
      const correspondentes = findPartesCorrespondentes(instrument, partes);

      if (correspondentes.length === 0) {
        showToast("Parte não encontrada", "error");
      } else if (correspondentes.length === 1) {
        viewParte(correspondentes[0]);
      } else {
        viewParte(correspondentes[0]);
      }
    },
    [partes, viewParte, showToast]
  );

  /**
   * Verifica se o navegador suporta compartilhamento de arquivos
   */
  const canShareFiles = useCallback((): boolean => {
    if (!navigator.share || !navigator.canShare) return false;
    // Testa se pode compartilhar arquivos PDF
    const testFile = new File([""], "test.pdf", { type: "application/pdf" });
    return navigator.canShare({ files: [testFile] });
  }, []);

  /**
   * Compartilha uma parte especifica via Web Share API
   */
  const shareParte = useCallback(
    async (parte: Parte) => {
      if (downloading || !selectedSheet) return;
      setDownloading(true);

      showToast(
        `Preparando "${selectedSheet.title}" - ${parte.instrumento}...`
      );

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/download/parte/${parte.id}`,
          {
            headers: {
              Authorization: `Bearer ${Storage.get<string | null>("authToken", null)}`,
            },
          }
        );

        if (response.ok) {
          const blob = await response.blob();
          const filename = `${selectedSheet.title} - ${parte.instrumento}.pdf`;
          const file = new File([blob], filename, {
            type: "application/pdf",
          });

          // Verifica se pode compartilhar arquivos
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `${selectedSheet.title} - ${parte.instrumento}`,
              text: `Partitura: ${selectedSheet.title}\nParte: ${parte.instrumento}`,
            });
            showToast("Compartilhado com sucesso!");
          } else {
            // Fallback: baixa o arquivo se nao suportar compartilhamento
            showToast(
              "Compartilhamento nao suportado. Baixando arquivo...",
              "error"
            );
            const pdfBlob = new Blob([blob], { type: "application/pdf" });
            saveBlob(pdfBlob, filename);
          }
        } else {
          const error = await response.json().catch(() => ({}));
          showToast(
            (error as { error?: string }).error ||
              "Erro ao preparar arquivo",
            "error"
          );
        }
      } catch (e) {
        // AbortError acontece quando usuario cancela o share
        if ((e as DOMException).name !== "AbortError") {
          console.error("Erro no compartilhamento:", e);
          showToast("Erro ao compartilhar arquivo", "error");
        }
      }

      setDownloading(false);
    },
    [downloading, selectedSheet, showToast]
  );

  /**
   * Inicia fluxo de compartilhamento para um instrumento
   */
  const handleShareInstrument = useCallback(
    (instrument: string) => {
      const correspondentes = findPartesCorrespondentes(instrument, partes);

      if (correspondentes.length === 0) {
        showToast("Parte não encontrada para compartilhar", "error");
      } else if (correspondentes.length === 1) {
        shareParte(correspondentes[0]);
      } else {
        // Usa primeira parte para simplicidade
        shareParte(correspondentes[0]);
      }
    },
    [partes, shareParte, showToast]
  );

  return {
    // State
    downloading,
    confirmInstrument,
    selectedParte,
    showPartePicker,
    partesDisponiveis,
    pdfViewer,

    // Actions
    downloadParteDireta,
    handleSelectInstrument,
    handleSelectParteEspecifica,
    handleConfirmDownload,
    handleCancelDownload,
    closePartePicker,
    printParte,
    handlePrintInstrument,
    viewParte,
    handleViewInstrument,
    closePdfViewer,
    shareParte,
    handleShareInstrument,
    canShareFiles,

    // Utilities
    findPartesCorrespondentes: (inst: string) =>
      findPartesCorrespondentes(inst, partes),
    findParteExata: (inst: string) => findParteExata(inst, partes),
  };
};

export default useSheetDownload;
