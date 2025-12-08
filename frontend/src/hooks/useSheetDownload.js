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
 * Encontra partes correspondentes ao instrumento
 * Considera variacoes como "Trompete Bb 1", "Trompete Bb 2"
 */
export const findPartesCorrespondentes = (instrumento, partes) => {
  if (!instrumento || partes.length === 0) return [];

  const instrLower = instrumento.toLowerCase();
  const instrBase = instrLower.replace(/\s*(bb|eb)?\s*\d*$/i, '').trim();

  return partes.filter(p => {
    const parteLower = p.instrumento.toLowerCase();
    const parteBase = parteLower.replace(/\s*(bb|eb)?\s*\d*$/i, '').trim();

    return parteLower === instrLower ||
      parteLower.startsWith(instrLower) ||
      parteBase === instrBase ||
      instrLower.startsWith(parteBase);
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

    // Utilities
    findPartesCorrespondentes: (inst) => findPartesCorrespondentes(inst, partes),
    findParteExata: (inst) => findParteExata(inst, partes)
  };
};

export default useSheetDownload;
