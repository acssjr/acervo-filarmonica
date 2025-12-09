// ===== UPLOAD PASTA MODAL =====
// Modal para upload de pasta com múltiplas partes de partitura
// Suporte a drag & drop e clique para selecionar pasta

import { useState, useEffect } from 'react';
import { useUI } from '@contexts/UIContext';
import { API } from '@services/api';
import CategoryIcon from '@components/common/CategoryIcon';
import LottieAnimation from '@components/animations/LottieAnimation';
import { extrairInstrumento } from '@utils/instrumentParser';
import { parsearNomePasta, detectarCategoria } from '@utils/metadataParser';

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1.5px solid var(--border)',
  background: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  fontSize: '14px',
  fontFamily: 'Outfit, sans-serif',
  outline: 'none',
  transition: 'border-color 0.2s'
};

const UploadPastaModal = ({ isOpen, onClose, onSuccess }) => {
  const { showToast } = useUI();
  const [files, setFiles] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Estados de progresso do upload
  const [uploadPhase, setUploadPhase] = useState('idle'); // idle | preparing | uploading | processing | complete | error
  const [uploadProgress, setUploadProgress] = useState(0);
  const [completedFiles, setCompletedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Campos editáveis
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [compositor, setCompositor] = useState('');
  const [arranjador, setArranjador] = useState('');
  const [ano, setAno] = useState('');
  const [showCatDropdown, setShowCatDropdown] = useState(false);

  // Contadores
  const reconhecidos = parsedData.filter(p => p.reconhecido).length;
  const naoReconhecidos = parsedData.filter(p => !p.reconhecido).length;

  // Carrega categorias
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const cats = await API.getCategorias();
        setCategorias(cats || []);
      } catch (_e) {
        console.error('Erro ao carregar categorias');
      }
    };
    if (isOpen) loadCategorias();
  }, [isOpen]);

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      setFiles([]);
      setFolderName('');
      setParsedData([]);
      setTitulo('');
      setCategoria('');
      setCompositor('');
      setArranjador('');
      setAno('');
      setUploadPhase('idle');
      setUploadProgress(0);
      setCompletedFiles([]);
      setErrorMessage('');
    }
  }, [isOpen]);

  // Processa os arquivos (comum para input e drag & drop)
  const processFiles = (pdfFiles, folderPath) => {
    if (pdfFiles.length === 0) {
      showToast('Nenhum arquivo PDF encontrado na pasta', 'error');
      return;
    }

    setFiles(pdfFiles);

    const pathParts = folderPath.split('/');
    const pastaName = pathParts.length > 0 ? pathParts[0] : 'Pasta sem nome';
    setFolderName(pastaName);

    const { titulo: tit, categoriaDetectada, compositor: comp, arranjador: arr } = parsearNomePasta(pastaName);
    setTitulo(tit);
    setCompositor(comp);
    setArranjador(arr || '');

    let catId;
    if (categoriaDetectada && categoriaDetectada.toLowerCase() === 'arranjo') {
      catId = 'arranjo';
    } else {
      catId = detectarCategoria(categoriaDetectada || pastaName, categorias);
    }
    setCategoria(catId);

    const parsed = pdfFiles.map(file => {
      const { instrumento, reconhecido } = extrairInstrumento(file.name);
      return {
        file,
        nomeOriginal: file.name,
        instrumento,
        reconhecido
      };
    });

    setParsedData(parsed);
  };

  // Processa os arquivos quando selecionados via input
  const handleFolderSelect = (e) => {
    const fileList = Array.from(e.target.files);
    if (fileList.length === 0) return;

    const pdfFiles = fileList.filter(f => f.name.toLowerCase().endsWith('.pdf'));
    const firstPath = pdfFiles[0]?.webkitRelativePath || pdfFiles[0]?.name || '';

    processFiles(pdfFiles, firstPath);
  };

  // Função recursiva para ler todos os arquivos de uma pasta (drag & drop)
  const readAllEntriesRecursively = async (entry, path = '') => {
    const files = [];

    if (entry.isFile) {
      const file = await new Promise((resolve) => entry.file(resolve));
      // Adiciona o path relativo ao arquivo
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
        const childFiles = await readAllEntriesRecursively(
          childEntry,
          path + entry.name + '/'
        );
        files.push(...childFiles);
      }
    }

    return files;
  };

  // Handlers de Drag & Drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Só remove o estado se realmente saiu da área
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

    // Procura por uma pasta nos itens
    let folderEntry = null;
    let folderName = '';

    for (const item of items) {
      const entry = item.webkitGetAsEntry?.();
      if (entry?.isDirectory) {
        folderEntry = entry;
        folderName = entry.name;
        break;
      }
    }

    if (!folderEntry) {
      // Se não encontrou pasta, tenta usar arquivos soltos
      const droppedFiles = Array.from(e.dataTransfer.files);
      const pdfFiles = droppedFiles.filter(f => f.name.toLowerCase().endsWith('.pdf'));

      if (pdfFiles.length === 0) {
        showToast('Arraste uma pasta contendo arquivos PDF', 'error');
        return;
      }

      // Usa os arquivos soltos
      processFiles(pdfFiles, pdfFiles[0].name);
      return;
    }

    // Lê todos os arquivos da pasta recursivamente
    try {
      const allFiles = await readAllEntriesRecursively(folderEntry, '');
      const pdfFiles = allFiles.filter(f => f.name.toLowerCase().endsWith('.pdf'));

      if (pdfFiles.length === 0) {
        showToast('Nenhum arquivo PDF encontrado na pasta', 'error');
        return;
      }

      processFiles(pdfFiles, folderName + '/');
    } catch (err) {
      console.error('Erro ao ler pasta:', err);
      showToast('Erro ao ler a pasta arrastada', 'error');
    }
  };

  // Simula progresso visual dos arquivos durante upload
  const simulateFileProgress = (totalFiles) => {
    return new Promise((resolve) => {
      let completed = 0;
      const interval = setInterval(() => {
        if (completed < totalFiles) {
          completed++;
          setCompletedFiles(prev => [...prev, completed - 1]);
          setUploadProgress(Math.round((completed / totalFiles) * 100));
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 150); // Simula ~150ms por arquivo para feedback visual
    });
  };

  // Upload com fases visuais
  const handleUpload = async () => {
    if (!titulo.trim()) {
      showToast('Título é obrigatório', 'error');
      return;
    }
    if (!categoria) {
      showToast('Categoria é obrigatória', 'error');
      return;
    }
    if (parsedData.length === 0) {
      showToast('Nenhum arquivo para enviar', 'error');
      return;
    }

    setUploading(true);
    setCompletedFiles([]);
    setUploadProgress(0);
    setErrorMessage('');

    try {
      // Fase 1: Preparando arquivos
      setUploadPhase('preparing');
      await new Promise(r => setTimeout(r, 500)); // Pequeno delay para mostrar a fase

      const formData = new FormData();
      formData.append('titulo', titulo.trim());
      formData.append('compositor', compositor.trim());
      formData.append('arranjador', arranjador.trim());
      formData.append('categoria', categoria);
      formData.append('ano', ano);
      formData.append('total_arquivos', parsedData.length.toString());

      parsedData.forEach((item, index) => {
        formData.append(`arquivo_${index}`, item.file);
        formData.append(`instrumento_${index}`, item.instrumento);
      });

      // Fase 2: Enviando arquivos
      setUploadPhase('uploading');

      // Inicia simulação de progresso visual em paralelo com o upload real
      const progressPromise = simulateFileProgress(parsedData.length);
      const uploadPromise = API.uploadPastaPartitura(formData);

      // Aguarda ambos: progresso visual e upload real
      const [result] = await Promise.all([uploadPromise, progressPromise]);

      // Fase 3: Processando no servidor
      setUploadPhase('processing');
      await new Promise(r => setTimeout(r, 800)); // Simula processamento

      // Fase 4: Completo
      setUploadPhase('complete');
      setUploadProgress(100);

      // Aguarda animação de sucesso antes de fechar
      await new Promise(r => setTimeout(r, 1500));

      showToast(result.message || 'Partitura criada com sucesso!');
      onSuccess?.();
      onClose();
    } catch (err) {
      setUploadPhase('error');
      setErrorMessage(err.message || 'Erro no upload');
      showToast(err.message || 'Erro no upload', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  const selectedCat = categorias.find(c => c.id === categoria);

  return (
    <div onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'relative',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        padding: '24px',
        overflowX: 'hidden',
        overflowY: uploading ? 'hidden' : 'auto',
        fontFamily: 'Outfit, sans-serif'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Upload de Pasta
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Selecione uma pasta contendo os PDFs das partes da partitura
        </p>

        {/* Seletor de pasta - Dropzone elegante com Drag & Drop */}
        <div
          className="upload-dropzone"
          onClick={() => document.getElementById('folder-input')?.click()}
          style={{
            border: isDragging
              ? '2px dashed #D4AF37'
              : files.length > 0
                ? '2px solid rgba(212, 175, 55, 0.4)'
                : '2px dashed var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '40px 30px',
            textAlign: 'center',
            marginBottom: '20px',
            background: isDragging
              ? 'linear-gradient(145deg, rgba(212, 175, 55, 0.15) 0%, rgba(184, 134, 11, 0.08) 100%)'
              : files.length > 0
                ? 'linear-gradient(145deg, rgba(212, 175, 55, 0.05) 0%, rgba(184, 134, 11, 0.02) 100%)'
                : 'var(--bg-primary)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            transform: isDragging ? 'scale(1.02)' : 'scale(1)',
            boxShadow: isDragging ? '0 8px 32px rgba(212, 175, 55, 0.2)' : 'none'
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onMouseEnter={e => {
            if (!files.length && !isDragging) {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
              e.currentTarget.style.background = 'linear-gradient(145deg, rgba(212, 175, 55, 0.08) 0%, rgba(184, 134, 11, 0.03) 100%)';
            }
          }}
          onMouseLeave={e => {
            if (!files.length && !isDragging) {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'var(--bg-primary)';
            }
          }}
        >
          <input
            type="file"
            webkitdirectory=""
            directory=""
            multiple
            onChange={handleFolderSelect}
            style={{ display: 'none' }}
            id="folder-input"
          />
          <div style={{ cursor: 'pointer', display: 'block' }}>
            {/* Ícone de pasta SVG animado */}
            <div style={{
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'center',
              animation: isDragging
                ? 'pulse 0.8s ease-in-out infinite'
                : files.length > 0
                  ? 'none'
                  : 'floatUpDown 3s ease-in-out infinite'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: isDragging
                  ? 'linear-gradient(145deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.1) 100%)'
                  : files.length > 0
                    ? 'linear-gradient(145deg, rgba(39, 174, 96, 0.15) 0%, rgba(39, 174, 96, 0.05) 100%)'
                    : 'linear-gradient(145deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isDragging
                  ? '0 8px 32px rgba(212, 175, 55, 0.3)'
                  : '0 8px 32px rgba(212, 175, 55, 0.1)',
                transition: 'all 0.3s ease'
              }}>
                {isDragging ? (
                  // Ícone de drop (seta para baixo)
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                ) : files.length > 0 ? (
                  // Ícone de sucesso
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                ) : (
                  // Ícone de pasta
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    <line x1="12" y1="11" x2="12" y2="17" style={{ opacity: 0.6 }}/>
                    <line x1="9" y1="14" x2="15" y2="14" style={{ opacity: 0.6 }}/>
                  </svg>
                )}
              </div>
            </div>

            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: isDragging ? '#D4AF37' : files.length > 0 ? '#27ae60' : 'var(--text-primary)',
              marginBottom: '8px',
              transition: 'color 0.3s ease'
            }}>
              {isDragging
                ? 'Solte a pasta aqui!'
                : folderName || 'Arraste uma pasta ou clique para selecionar'}
            </div>

            <div style={{
              fontSize: '13px',
              color: isDragging ? '#D4AF37' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'color 0.3s ease'
            }}>
              {isDragging ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Pasta contendo arquivos PDF
                </>
              ) : files.length > 0 ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  {files.length} arquivo(s) PDF encontrado(s)
                </>
              ) : (
                'Padrão: "Título - Categoria - Compositor"'
              )}
            </div>
          </div>

          {/* Efeito de brilho decorativo */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 60%)',
            pointerEvents: 'none',
            opacity: files.length > 0 ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }} />
        </div>

        {/* Estilos de animação */}
        <style>{`
          @keyframes floatUpDown {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes progressBar {
            0% { background-position: 0% 0%; }
            100% { background-position: 200% 0%; }
          }
          @keyframes checkmarkPop {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes successPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.4); }
            50% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(39, 174, 96, 0); }
          }
        `}</style>

        {/* Overlay de Progresso do Upload */}
        {uploading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(var(--bg-card-rgb, 26, 26, 36), 0.97)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            zIndex: 10
          }}>
            {/* Container circular com animação Lottie */}
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: uploadPhase === 'error'
                ? 'linear-gradient(145deg, rgba(231, 76, 60, 0.15) 0%, rgba(231, 76, 60, 0.05) 100%)'
                : uploadPhase === 'complete'
                  ? 'linear-gradient(145deg, rgba(39, 174, 96, 0.15) 0%, rgba(39, 174, 96, 0.05) 100%)'
                  : 'linear-gradient(145deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: uploadPhase === 'error'
                ? '0 4px 24px rgba(231, 76, 60, 0.15)'
                : uploadPhase === 'complete'
                  ? '0 4px 24px rgba(39, 174, 96, 0.15)'
                  : '0 4px 24px rgba(212, 175, 55, 0.1)'
            }}>
              {uploadPhase === 'preparing' && (
                <LottieAnimation name="scan" size={100} />
              )}
              {uploadPhase === 'uploading' && (
                <LottieAnimation name="upload" size={100} />
              )}
              {uploadPhase === 'processing' && (
                <LottieAnimation name="scan" size={100} />
              )}
              {uploadPhase === 'complete' && (
                <LottieAnimation name="success" size={100} loop={false} />
              )}
              {uploadPhase === 'error' && (
                <LottieAnimation name="error" size={100} loop={false} />
              )}
            </div>

            {/* Título da fase */}
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: uploadPhase === 'error' ? '#e74c3c' : uploadPhase === 'complete' ? '#27ae60' : 'var(--text-primary)',
              marginBottom: '8px',
              animation: 'fadeInUp 0.3s ease-out'
            }}>
              {uploadPhase === 'preparing' && 'Preparando arquivos...'}
              {uploadPhase === 'uploading' && 'Enviando arquivos...'}
              {uploadPhase === 'processing' && 'Processando no servidor...'}
              {uploadPhase === 'complete' && 'Upload concluído!'}
              {uploadPhase === 'error' && 'Erro no upload'}
            </div>

            {/* Subtítulo/descrição */}
            <div style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              {uploadPhase === 'preparing' && `Organizando ${parsedData.length} arquivo(s)...`}
              {uploadPhase === 'uploading' && `${completedFiles.length} de ${parsedData.length} arquivos`}
              {uploadPhase === 'processing' && 'Salvando partitura no acervo...'}
              {uploadPhase === 'complete' && `${parsedData.length} arquivo(s) enviado(s) com sucesso!`}
              {uploadPhase === 'error' && errorMessage}
            </div>

            {/* Barra de progresso */}
            {(uploadPhase === 'uploading' || uploadPhase === 'processing') && (
              <div style={{
                width: '100%',
                maxWidth: '300px',
                height: '8px',
                background: 'var(--bg-primary)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '24px'
              }}>
                <div style={{
                  width: uploadPhase === 'processing' ? '100%' : `${uploadProgress}%`,
                  height: '100%',
                  background: uploadPhase === 'processing'
                    ? 'linear-gradient(90deg, #D4AF37, #B8860B, #D4AF37)'
                    : 'linear-gradient(90deg, #D4AF37, #B8860B)',
                  backgroundSize: uploadPhase === 'processing' ? '200% 100%' : '100% 100%',
                  animation: uploadPhase === 'processing' ? 'progressBar 1.5s linear infinite' : 'none',
                  borderRadius: '4px',
                  transition: 'width 0.15s ease-out'
                }} />
              </div>
            )}

            {/* Lista de arquivos com status */}
            {uploadPhase === 'uploading' && (
              <div style={{
                width: '100%',
                maxWidth: '350px',
                maxHeight: '200px',
                overflowY: 'auto',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                border: '1px solid var(--border)'
              }}>
                {parsedData.map((item, idx) => {
                  const isCompleted = completedFiles.includes(idx);
                  const isCurrent = completedFiles.length === idx;
                  return (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px',
                      borderRadius: '6px',
                      background: isCurrent ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                      marginBottom: '4px',
                      transition: 'all 0.2s ease'
                    }}>
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isCompleted ? '#27ae60' : isCurrent ? '#D4AF37' : 'var(--border)',
                        transition: 'all 0.2s ease'
                      }}>
                        {isCompleted ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'checkmarkPop 0.3s ease-out' }}>
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        ) : isCurrent ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                            <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/>
                            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                          </svg>
                        ) : (
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                        )}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: isCompleted ? '#27ae60' : isCurrent ? '#D4AF37' : 'var(--text-muted)',
                        fontWeight: isCurrent ? '500' : '400',
                        flex: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.instrumento}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Botão de tentar novamente em caso de erro */}
            {uploadPhase === 'error' && (
              <button
                onClick={() => {
                  setUploadPhase('idle');
                  setUploading(false);
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                </svg>
                Tentar novamente
              </button>
            )}
          </div>
        )}

        {/* Preview dos dados detectados */}
        {parsedData && parsedData.length > 0 && !uploading && (
          <>
            {/* Campos editáveis */}
            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid var(--border)'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Dados da Partitura (edite se necessário)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Título *
                  </label>
                  <input type="text" style={inputStyle} value={titulo} onChange={e => setTitulo(e.target.value)} />
                </div>

                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Categoria *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCatDropdown(!showCatDropdown)}
                    style={{
                      ...inputStyle, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {selectedCat && (
                        <span style={{
                          width: '20px', height: '20px', borderRadius: '4px',
                          background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '1px solid rgba(212, 175, 55, 0.2)'
                        }}>
                          <CategoryIcon categoryId={selectedCat.id} size={12} color="#D4AF37" />
                        </span>
                      )}
                      {selectedCat ? selectedCat.nome : 'Selecione...'}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{
                      transform: showCatDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {showCatDropdown && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0,
                      background: 'var(--bg-secondary)', border: '1.5px solid var(--border)',
                      borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      zIndex: 20, maxHeight: '200px', overflowY: 'auto'
                    }}>
                      {categorias.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => { setCategoria(cat.id); setShowCatDropdown(false); }}
                          style={{
                            width: '100%', padding: '10px 12px', border: 'none',
                            background: categoria === cat.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                            color: categoria === cat.id ? '#D4AF37' : 'var(--text-primary)',
                            fontSize: '13px', textAlign: 'left', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            transition: 'background 0.15s'
                          }}
                        >
                          <span style={{
                            width: '20px', height: '20px', borderRadius: '4px',
                            background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(212, 175, 55, 0.2)'
                          }}>
                            <CategoryIcon categoryId={cat.id} size={12} color="#D4AF37" />
                          </span>
                          {cat.nome}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Compositor
                  </label>
                  <input type="text" style={inputStyle} value={compositor} onChange={e => setCompositor(e.target.value)} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Arranjador
                  </label>
                  <input type="text" style={inputStyle} value={arranjador} onChange={e => setArranjador(e.target.value)} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Ano
                  </label>
                  <input type="number" style={inputStyle} placeholder="Ex: 1950" value={ano} onChange={e => setAno(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Lista de arquivos detectados */}
            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"/>
                    <circle cx="6" cy="18" r="3"/>
                    <circle cx="18" cy="16" r="3"/>
                  </svg>
                  Partes Detectadas
                </h3>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                  <span style={{ color: '#27ae60', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {reconhecidos} reconhecido(s)
                  </span>
                  {naoReconhecidos > 0 && (
                    <span style={{ color: '#e67e22', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      {naoReconhecidos} não reconhecido(s)
                    </span>
                  )}
                </div>
              </div>

              <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {parsedData.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '6px',
                    border: item.reconhecido ? '1px solid var(--border)' : '1px solid #e67e22'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                      <span style={{ color: item.reconhecido ? '#27ae60' : '#e67e22', display: 'flex', alignItems: 'center' }}>
                        {item.reconhecido ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                          </svg>
                        )}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.nomeOriginal}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      background: item.reconhecido ? 'rgba(39, 174, 96, 0.1)' : 'rgba(230, 126, 34, 0.1)',
                      color: item.reconhecido ? '#27ae60' : '#e67e22',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}>
                      → {item.instrumento}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Botões */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-secondary)';
              e.currentTarget.style.borderColor = 'var(--text-secondary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg-primary)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || !parsedData || parsedData.length === 0}
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: 'var(--radius-sm)',
              background: (uploading || !parsedData || parsedData.length === 0)
                ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.5) 0%, rgba(184, 134, 11, 0.5) 100%)'
                : 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
              border: 'none',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: (uploading || !parsedData || parsedData.length === 0) ? 'not-allowed' : 'pointer',
              fontFamily: 'Outfit, sans-serif',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: (uploading || !parsedData || parsedData.length === 0)
                ? 'none'
                : '0 4px 14px rgba(212, 175, 55, 0.3)'
            }}
            onMouseEnter={e => {
              if (!uploading && parsedData?.length > 0) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = (uploading || !parsedData || parsedData.length === 0)
                ? 'none'
                : '0 4px 14px rgba(212, 175, 55, 0.3)';
            }}
          >
            {uploading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                </svg>
                Enviando...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Fazer Upload ({parsedData?.length || 0} arquivos)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPastaModal;
