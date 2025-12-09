// ===== UPLOAD PASTA MODAL =====
// Modal para upload de pasta com múltiplas partes de partitura
// Layout: Header fixo + Conteúdo scrollável + Footer fixo

import { useState, useEffect } from 'react';
import { useUI } from '@contexts/UIContext';
import { API } from '@services/api';
import CategoryIcon from '@components/common/CategoryIcon';
import LottieAnimation from '@components/animations/LottieAnimation';
import { extrairInstrumento } from '@utils/instrumentParser';
import { parsearNomePasta, detectarCategoria } from '@utils/metadataParser';

const UploadPastaModal = ({ isOpen, onClose, onSuccess, initialFiles }) => {
  const { showToast } = useUI();
  const [files, setFiles] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Estados de progresso do upload
  const [uploadPhase, setUploadPhase] = useState('idle');
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

  // Processa arquivos pré-carregados (drag & drop global)
  useEffect(() => {
    if (isOpen && initialFiles && initialFiles.files && initialFiles.files.length > 0 && categorias.length > 0) {
      processFiles(initialFiles.files, initialFiles.folderName + '/');
    }
  }, [isOpen, initialFiles, categorias]);

  // Processa os arquivos
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
      return { file, nomeOriginal: file.name, instrumento, reconhecido };
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

  // Função recursiva para ler arquivos de pasta (drag & drop)
  const readAllEntriesRecursively = async (entry, path = '') => {
    const files = [];
    if (entry.isFile) {
      const file = await new Promise((resolve) => entry.file(resolve));
      Object.defineProperty(file, 'webkitRelativePath', { value: path + file.name, writable: false });
      files.push(file);
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const entries = await new Promise((resolve) => {
        const allEntries = [];
        const readEntries = () => {
          reader.readEntries((results) => {
            if (results.length === 0) resolve(allEntries);
            else { allEntries.push(...results); readEntries(); }
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

  // Handlers de Drag & Drop
  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    if (!items || items.length === 0) return;

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
      const droppedFiles = Array.from(e.dataTransfer.files);
      const pdfFiles = droppedFiles.filter(f => f.name.toLowerCase().endsWith('.pdf'));
      if (pdfFiles.length === 0) {
        showToast('Arraste uma pasta contendo arquivos PDF', 'error');
        return;
      }
      processFiles(pdfFiles, pdfFiles[0].name);
      return;
    }

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

  // Simula progresso visual
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
      }, 150);
    });
  };

  // Upload
  const handleUpload = async () => {
    if (!titulo.trim()) { showToast('Título é obrigatório', 'error'); return; }
    if (!categoria) { showToast('Categoria é obrigatória', 'error'); return; }
    if (parsedData.length === 0) { showToast('Nenhum arquivo para enviar', 'error'); return; }

    setUploading(true);
    setCompletedFiles([]);
    setUploadProgress(0);
    setErrorMessage('');

    try {
      setUploadPhase('preparing');
      await new Promise(r => setTimeout(r, 500));

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

      setUploadPhase('uploading');
      const progressPromise = simulateFileProgress(parsedData.length);
      const uploadPromise = API.uploadPastaPartitura(formData);
      const [result] = await Promise.all([uploadPromise, progressPromise]);

      setUploadPhase('processing');
      await new Promise(r => setTimeout(r, 800));

      setUploadPhase('complete');
      setUploadProgress(100);
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
  const hasFiles = parsedData.length > 0;

  return (
    <div onClick={onClose} style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'relative',
        background: 'var(--bg-card)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: hasFiles ? '700px' : '500px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'Outfit, sans-serif',
        transition: 'max-width 0.3s ease'
      }}>
        {/* ===== HEADER FIXO ===== */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(184, 134, 11, 0.1) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                Upload de Pasta
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                {hasFiles ? `${parsedData.length} arquivo(s) detectado(s)` : 'Arraste ou selecione uma pasta'}
              </p>
            </div>
          </div>

          {/* Botão X para fechar */}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ===== OVERLAY DE UPLOAD ===== */}
        {uploading && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(var(--bg-card-rgb, 26, 26, 36), 0.98)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            zIndex: 10
          }}>
            <div style={{
              width: '120px', height: '120px',
              borderRadius: '50%',
              background: uploadPhase === 'error' ? 'rgba(231, 76, 60, 0.1)' : uploadPhase === 'complete' ? 'rgba(39, 174, 96, 0.1)' : 'rgba(212, 175, 55, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px'
            }}>
              {uploadPhase === 'preparing' && <LottieAnimation name="scan" size={80} />}
              {uploadPhase === 'uploading' && <LottieAnimation name="upload" size={80} />}
              {uploadPhase === 'processing' && <LottieAnimation name="scan" size={80} />}
              {uploadPhase === 'complete' && <LottieAnimation name="success" size={80} loop={false} />}
              {uploadPhase === 'error' && <LottieAnimation name="error" size={80} loop={false} />}
            </div>

            <div style={{ fontSize: '16px', fontWeight: '600', color: uploadPhase === 'error' ? '#e74c3c' : uploadPhase === 'complete' ? '#27ae60' : 'var(--text-primary)', marginBottom: '8px' }}>
              {uploadPhase === 'preparing' && 'Preparando...'}
              {uploadPhase === 'uploading' && 'Enviando arquivos...'}
              {uploadPhase === 'processing' && 'Processando...'}
              {uploadPhase === 'complete' && 'Concluído!'}
              {uploadPhase === 'error' && 'Erro no upload'}
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {uploadPhase === 'uploading' && `${completedFiles.length} de ${parsedData.length}`}
              {uploadPhase === 'error' && errorMessage}
            </div>

            {(uploadPhase === 'uploading' || uploadPhase === 'processing') && (
              <div style={{ width: '200px', height: '6px', background: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${uploadProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #D4AF37, #B8860B)',
                  borderRadius: '3px',
                  transition: 'width 0.15s'
                }} />
              </div>
            )}

            {uploadPhase === 'error' && (
              <button onClick={() => { setUploadPhase('idle'); setUploading(false); }} style={{
                marginTop: '16px',
                padding: '10px 20px',
                borderRadius: '8px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                cursor: 'pointer'
              }}>
                Tentar novamente
              </button>
            )}
          </div>
        )}

        {/* ===== CONTEÚDO SCROLLÁVEL ===== */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px'
        }}>
          {/* Dropzone - compacto se já tem arquivos */}
          {!hasFiles ? (
            <div
              onClick={() => document.getElementById('folder-input')?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: isDragging ? '2px dashed #D4AF37' : '2px dashed var(--border)',
                borderRadius: '12px',
                padding: '48px 24px',
                textAlign: 'center',
                background: isDragging ? 'rgba(212, 175, 55, 0.08)' : 'var(--bg-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <input type="file" webkitdirectory="" directory="" multiple onChange={handleFolderSelect} style={{ display: 'none' }} id="folder-input" />

              <div style={{
                width: '64px', height: '64px',
                margin: '0 auto 16px',
                borderRadius: '16px',
                background: 'rgba(212, 175, 55, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  <line x1="12" y1="11" x2="12" y2="17" opacity="0.6"/>
                  <line x1="9" y1="14" x2="15" y2="14" opacity="0.6"/>
                </svg>
              </div>

              <div style={{ fontSize: '15px', fontWeight: '600', color: isDragging ? '#D4AF37' : 'var(--text-primary)', marginBottom: '6px' }}>
                {isDragging ? 'Solte aqui!' : 'Arraste uma pasta ou clique'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Pasta com PDFs das partes da partitura
              </div>
            </div>
          ) : (
            <>
              {/* Resumo da pasta selecionada */}
              <div
                onClick={() => document.getElementById('folder-input')?.click()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'rgba(39, 174, 96, 0.08)',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  cursor: 'pointer',
                  border: '1px solid rgba(39, 174, 96, 0.2)'
                }}
              >
                <input type="file" webkitdirectory="" directory="" multiple onChange={handleFolderSelect} style={{ display: 'none' }} id="folder-input" />
                <div style={{
                  width: '36px', height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(39, 174, 96, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#27ae60', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {folderName}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {parsedData.length} PDF(s) • Clique para trocar
                  </div>
                </div>
              </div>

              {/* Formulário de dados */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Dados da Partitura
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {/* Título */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-secondary)' }}>Título *</label>
                    <input
                      type="text"
                      value={titulo}
                      onChange={e => setTitulo(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Categoria */}
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-secondary)' }}>Categoria *</label>
                    <button
                      type="button"
                      onClick={() => setShowCatDropdown(!showCatDropdown)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {selectedCat && <CategoryIcon categoryId={selectedCat.id} size={14} color="#D4AF37" />}
                        {selectedCat ? selectedCat.nome : 'Selecione...'}
                      </span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showCatDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>

                    {showCatDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0, right: 0,
                        marginTop: '4px',
                        background: 'var(--bg-secondary)',
                        border: '1.5px solid var(--border)',
                        borderRadius: '8px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                        zIndex: 20,
                        maxHeight: '180px',
                        overflowY: 'auto'
                      }}>
                        {categorias.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => { setCategoria(cat.id); setShowCatDropdown(false); }}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: 'none',
                              background: categoria === cat.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                              color: categoria === cat.id ? '#D4AF37' : 'var(--text-primary)',
                              fontSize: '13px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            <CategoryIcon categoryId={cat.id} size={14} color={categoria === cat.id ? '#D4AF37' : 'var(--text-secondary)'} />
                            {cat.nome}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Compositor */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-secondary)' }}>Compositor</label>
                    <input
                      type="text"
                      value={compositor}
                      onChange={e => setCompositor(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Arranjador */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-secondary)' }}>Arranjador</label>
                    <input
                      type="text"
                      value={arranjador}
                      onChange={e => setArranjador(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Ano */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-secondary)' }}>Ano</label>
                    <input
                      type="number"
                      placeholder="Ex: 1950"
                      value={ano}
                      onChange={e => setAno(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Lista de partes detectadas */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                    Partes Detectadas
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                    <span style={{ color: '#27ae60' }}>✓ {reconhecidos}</span>
                    {naoReconhecidos > 0 && <span style={{ color: '#e67e22' }}>⚠ {naoReconhecidos}</span>}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: '8px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  padding: '4px'
                }}>
                  {parsedData.map((item, idx) => (
                    <div key={idx} style={{
                      padding: '10px 12px',
                      background: item.reconhecido ? 'rgba(39, 174, 96, 0.08)' : 'rgba(230, 126, 34, 0.08)',
                      borderRadius: '8px',
                      border: `1px solid ${item.reconhecido ? 'rgba(39, 174, 96, 0.2)' : 'rgba(230, 126, 34, 0.3)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ color: item.reconhecido ? '#27ae60' : '#e67e22', fontSize: '12px' }}>
                        {item.reconhecido ? '✓' : '?'}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: item.reconhecido ? 'var(--text-primary)' : '#e67e22',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.instrumento}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ===== FOOTER FIXO ===== */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          flexShrink: 0
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-primary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Cancelar
          </button>

          <button
            onClick={handleUpload}
            disabled={uploading || !hasFiles}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              background: (!hasFiles || uploading) ? 'rgba(212, 175, 55, 0.3)' : 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
              border: 'none',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: (!hasFiles || uploading) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              boxShadow: hasFiles && !uploading ? '0 4px 12px rgba(212, 175, 55, 0.3)' : 'none'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            {hasFiles ? `Enviar ${parsedData.length} arquivo(s)` : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPastaModal;
