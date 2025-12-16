// ===== USE SHEET DOWNLOAD HOOK =====
// Hook para gerenciar download de partituras
// Extraido de SheetDetailModal para melhor testabilidade

import { useState, useCallback } from 'react';
import { API_BASE_URL } from '@constants/api';
import { Storage } from '@services/storage';

/**
 * Salva um blob como arquivo para download
 * Compativel com navegadores modernos e IE/Edge legado
 */
const saveBlob = (blob, filename) => {
  // Metodo 1: msSaveBlob para IE/Edge legado
  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(blob, filename);
    return;
  }

  // Metodo 2: Criar link com blob URL
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

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
const normalizeInstrumento = (nome) => {
  return nome.toLowerCase()
    .replace(/\./g, '') // Remove pontos: "Sax." -> "Sax"
    .replace(/saxofone/g, 'sax') // Normaliza Saxofone -> Sax
    .replace(/clarineta/g, 'clarinete') // Variante
    .replace(/\s+/g, ' ') // Colapsa espacos
    .trim();
};

/**
 * Encontra partes correspondentes ao instrumento
 * Considera variacoes como "Trompete Bb 1", "Trompete Bb 2"
 * E normaliza nomes: "Saxofone Soprano" -> "Sax Soprano"
 */
export const findPartesCorrespondentes = (instrumento, partes) => {
  if (!instrumento || partes.length === 0) return [];

  const instrNorm = normalizeInstrumento(instrumento);
  const instrBase = instrNorm.replace(/\s*(bb|eb|c)?\s*\d*$/i, '').trim();

  return partes.filter(p => {
    const parteNorm = normalizeInstrumento(p.instrumento);
    const parteBase = parteNorm.replace(/\s*(bb|eb|c)?\s*\d*$/i, '').trim();

    return parteNorm === instrNorm ||
      parteNorm.startsWith(instrNorm) ||
      parteBase === instrBase ||
      instrNorm.startsWith(parteBase);
  });
};

/**
 * Encontra parte exata pelo nome do instrumento
 */
export const findParteExata = (instrumento, partes) => {
  return partes.find(p => p.instrumento.toLowerCase() === instrumento.toLowerCase());
};

/**
 * Hook para gerenciar downloads de partituras
 * @param {Object} options - Opcoes do hook
 * @param {Function} options.showToast - Funcao para exibir toast messages
 * @param {Object} options.selectedSheet - Partitura selecionada
 * @param {Array} options.partes - Lista de partes disponiveis
 */
export const useSheetDownload = ({ showToast, selectedSheet, partes = [] }) => {
  const [downloading, setDownloading] = useState(false);
  const [confirmInstrument, setConfirmInstrument] = useState(null);
  const [selectedParte, setSelectedParte] = useState(null);
  const [showPartePicker, setShowPartePicker] = useState(false);
  const [partesDisponiveis, setPartesDisponiveis] = useState([]);

  /**
   * Download direto de uma parte especifica
   */
  const downloadParteDireta = useCallback(async (parte) => {
    if (downloading || !selectedSheet) return;
    setDownloading(true);

    showToast(`Preparando "${selectedSheet.title}" - ${parte.instrumento}...`);

    try {
      const response = await fetch(`${API_BASE_URL}/api/download/parte/${parte.id}`, {
        headers: { 'Authorization': `Bearer ${Storage.get('authToken')}` }
      });

      if (response.ok) {
        // Extrair nome do arquivo do header Content-Disposition se disponivel
        let filename = `${selectedSheet.title} - ${parte.instrumento}.pdf`;
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match) filename = match[1];
        }

        const blob = await response.blob();
        // Criar blob com tipo explicito para PDF
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });

        // Usar funcao de save dedicada
        saveBlob(pdfBlob, filename);

        showToast('Download iniciado!');
      } else {
        const error = await response.json().catch(() => ({}));
        showToast(error.error || 'Erro ao baixar arquivo', 'error');
      }
    } catch (e) {
      console.error('Erro no download:', e);
      showToast('Erro ao baixar arquivo', 'error');
    }

    setDownloading(false);
    setShowPartePicker(false);
    setConfirmInstrument(null);
  }, [downloading, selectedSheet, showToast]);

  /**
   * Download do arquivo completo da partitura (fallback)
   */
  const downloadCompleto = useCallback(async () => {
    if (downloading || !selectedSheet) return;
    setDownloading(true);

    showToast(`Preparando "${selectedSheet.title}"...`);

    try {
      const response = await fetch(`${API_BASE_URL}/api/download/${selectedSheet.id}`, {
        headers: { 'Authorization': `Bearer ${Storage.get('authToken')}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        saveBlob(pdfBlob, `${selectedSheet.title}.pdf`);
        showToast('Iniciando download...');
      } else {
        showToast('Erro ao baixar arquivo', 'error');
      }
    } catch (e) {
      console.error('Erro no download:', e);
      showToast('Erro ao baixar arquivo', 'error');
    }

    setDownloading(false);
  }, [downloading, selectedSheet, showToast]);

  /**
   * Seleciona um instrumento e decide o fluxo de download
   */
  const handleSelectInstrument = useCallback((instrument) => {
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
  }, [partes, downloadParteDireta]);

  /**
   * Seleciona uma parte especifica pelo nome exato
   */
  const handleSelectParteEspecifica = useCallback((instrumento) => {
    const parte = findParteExata(instrumento, partes);
    if (parte) {
      setConfirmInstrument(instrumento);
      setSelectedParte(parte);
    } else {
      showToast('Parte não encontrada', 'error');
    }
  }, [partes, showToast]);

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

    const correspondentes = findPartesCorrespondentes(confirmInstrument, partes);

    if (correspondentes.length > 0) {
      await downloadParteDireta(correspondentes[0]);
    } else {
      await downloadCompleto();
    }

    setConfirmInstrument(null);
  }, [selectedParte, confirmInstrument, partes, downloadParteDireta, downloadCompleto]);

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
  const printParte = useCallback(async (parte) => {
    if (downloading || !selectedSheet) return;
    setDownloading(true);

    showToast(`Preparando impressão "${selectedSheet.title}" - ${parte.instrumento}...`);

    try {
      const response = await fetch(`${API_BASE_URL}/api/download/parte/${parte.id}`, {
        headers: { 'Authorization': `Bearer ${Storage.get('authToken')}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const printWindow = window.open(blobUrl, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
        showToast('Abrindo impressão...');
      } else {
        const error = await response.json().catch(() => ({}));
        showToast(error.error || 'Erro ao preparar impressão', 'error');
      }
    } catch (e) {
      console.error('Erro na impressão:', e);
      showToast('Erro ao preparar impressão', 'error');
    }

    setDownloading(false);
  }, [downloading, selectedSheet, showToast]);

  /**
   * Inicia fluxo de impressão para um instrumento
   */
  const handlePrintInstrument = useCallback((instrument) => {
    const correspondentes = findPartesCorrespondentes(instrument, partes);

    if (correspondentes.length === 0) {
      showToast('Parte não encontrada para impressão', 'error');
    } else if (correspondentes.length === 1) {
      printParte(correspondentes[0]);
    } else {
      // Usa primeira parte para simplicidade
      printParte(correspondentes[0]);
    }
  }, [partes, printParte, showToast]);

  return {
    // State
    downloading,
    confirmInstrument,
    selectedParte,
    showPartePicker,
    partesDisponiveis,

    // Actions
    downloadParteDireta,
    handleSelectInstrument,
    handleSelectParteEspecifica,
    handleConfirmDownload,
    handleCancelDownload,
    closePartePicker,
    printParte,
    handlePrintInstrument,

    // Utilities
    findPartesCorrespondentes: (inst) => findPartesCorrespondentes(inst, partes),
    findParteExata: (inst) => findParteExata(inst, partes)
  };
};

export default useSheetDownload;
