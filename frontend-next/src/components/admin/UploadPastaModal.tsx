"use client";

// ===== UPLOAD PASTA MODAL =====
// Modal para upload de pasta com multiplas partes de partitura
// Layout: Header fixo + Conteudo scrollavel + Footer fixo

import { useState, useEffect } from 'react';
import { useUI } from '@/contexts/UIContext';
import { API } from '@/lib/api';
import CategoryIcon from '@/components/common/CategoryIcon';
// Augment input attributes to allow webkitdirectory
declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

import LottieAnimation from '@/components/animations/LottieAnimation';
import { extrairInstrumento } from '@/utils/instrumentParser';
import { analisarMetadados } from '@/utils/metadataParser';

// ===== Interfaces =====

interface Categoria {
  id: string;
  nome: string;
}

interface ParsedFile {
  file: File;
  nomeOriginal: string;
  instrumento: string;
  reconhecido: boolean;
}

interface InitialFiles {
  files: File[];
  folderName: string;
}

interface FileSystemEntryLike {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
  file: (callback: (file: File) => void) => void;
  createReader: () => {
    readEntries: (callback: (entries: FileSystemEntryLike[]) => void) => void;
  };
}

interface UploadPastaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  categorias?: Categoria[];
  initialFiles?: InitialFiles | null;
}

type UploadPhase = 'idle' | 'preparing' | 'uploading' | 'processing' | 'complete' | 'error';

const UploadPastaModal = ({ isOpen, onClose, onSuccess, initialFiles }: UploadPastaModalProps) => {
  const { showToast } = useUI();
  const [folderName, setFolderName] = useState('');
  const [parsedData, setParsedData] = useState<ParsedFile[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Estados de progresso do upload
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [completedFiles, setCompletedFiles] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
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

  // Campos editaveis
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
      } catch {
        console.error('Erro ao carregar categorias');
      }
    };
    if (isOpen) loadCategorias();
  }, [isOpen]);

  // Alterna frases engracadas durante upload
  useEffect(() => {
    if (uploading && (uploadPhase === 'uploading' || uploadPhase === 'processing')) {
      const interval = setInterval(() => {
        setFunnyPhraseIndex(prev => (prev + 1) % funnyPhrases.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [uploading, uploadPhase, funnyPhrases.length]);

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
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

  // Processa arquivos pre-carregados (drag & drop global)
  useEffect(() => {
    if (isOpen && initialFiles && initialFiles.files && initialFiles.files.length > 0 && categorias.length > 0) {
      processFiles(initialFiles.files, initialFiles.folderName + '/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialFiles, categorias]);

  // Processa os arquivos
  const processFiles = (pdfFiles: File[], folderPath: string) => {
    if (pdfFiles.length === 0) {
      showToast('Nenhum arquivo PDF encontrado na pasta', 'error');
      return;
    }

    const pathParts = folderPath.split('/');
    const pastaName = pathParts.length > 0 ? pathParts[0] : 'Pasta sem nome';
    setFolderName(pastaName);

    // Usa analise multi-camada para melhor deteccao
    const metadados = analisarMetadados(folderPath, pastaName, categorias);
    setTitulo(metadados.titulo);
    setCompositor(metadados.compositor);
    setArranjador(metadados.arranjador || '');
    setCategoria(metadados.categoria || '');

    const parsed = pdfFiles.map((file: File) => {
      const { instrumento, reconhecido } = extrairInstrumento(file.name);
      return { file, nomeOriginal: file.name, instrumento, reconhecido };
    });

    setParsedData(parsed);
  };

  // Processa os arquivos quando selecionados via input
  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(e.target.files || []);
    if (fileList.length === 0) return;
    const pdfFiles = fileList.filter(f => f.name.toLowerCase().endsWith('.pdf'));
    const firstFile = pdfFiles[0] as File & { webkitRelativePath?: string };
    const firstPath = firstFile?.webkitRelativePath || firstFile?.name || '';
    processFiles(pdfFiles, firstPath);
  };

  // Funcao recursiva para ler arquivos de pasta (drag & drop)
  const readAllEntriesRecursively = async (entry: FileSystemEntryLike, path: string = ''): Promise<File[]> => {
    const files: File[] = [];
    if (entry.isFile) {
      const file = await new Promise<File>((resolve) => entry.file(resolve));
      Object.defineProperty(file, 'webkitRelativePath', { value: path + file.name, writable: false });
      files.push(file);
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const entries = await new Promise<FileSystemEntryLike[]>((resolve) => {
        const allEntries: FileSystemEntryLike[] = [];
        const readEntries = () => {
          reader.readEntries((results: FileSystemEntryLike[]) => {
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
  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    if (!items || items.length === 0) return;

    let folderEntry: FileSystemEntryLike | null = null;
    let dropFolderName = '';

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const entry = item.webkitGetAsEntry?.() as FileSystemEntryLike | null;
      if (entry?.isDirectory) {
        folderEntry = entry;
        dropFolderName = entry.name;
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
      processFiles(pdfFiles, dropFolderName + '/');
    } catch (err) {
      console.error('Erro ao ler pasta:', err);
      showToast('Erro ao ler a pasta arrastada', 'error');
    }
  };

  // Simula progresso visual
  const simulateFileProgress = (totalFiles: number): Promise<void> => {
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
    if (!categoria) { showToast('Categoria e obrigatoria', 'error'); return; }
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
    } catch (err: unknown) {
      setUploadPhase('error');
      const message = err instanceof Error ? err.message : 'Erro no upload';
      setErrorMessage(message);
      showToast(message, 'error');
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

          {/* Botao X para fechar */}
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

        {/* ===== OVERLAY DE UPLOAD - REDESENHADO ===== */}
        {uploading && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(180deg, rgba(20, 20, 30, 0.98) 0%, rgba(15, 15, 25, 0.99) 100%)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            zIndex: 10,
            overflow: 'hidden'
          }}>
            {/* Efeitos de fundo animados */}
            {uploadPhase !== 'error' && uploadPhase !== 'complete' && (
              <>
                <div style={{
                  position: 'absolute',
                  width: '300px', height: '300px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
                  animation: 'pulse 3s ease-in-out infinite',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)'
                }} />
                <div style={{
                  position: 'absolute',
                  width: '400px', height: '400px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, transparent 70%)',
                  animation: 'pulse 3s ease-in-out infinite 0.5s',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)'
                }} />
              </>
            )}

            {/* Container principal com glassmorphism */}
            <div style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '24px',
              padding: '40px 48px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '400px',
              width: '100%'
            }}>
              {/* Icone/Animacao principal */}
              <div style={{
                width: '140px', height: '140px',
                borderRadius: '50%',
                background: uploadPhase === 'error'
                  ? 'linear-gradient(135deg, rgba(231, 76, 60, 0.15) 0%, rgba(192, 57, 43, 0.1) 100%)'
                  : uploadPhase === 'complete'
                    ? 'linear-gradient(135deg, rgba(39, 174, 96, 0.15) 0%, rgba(30, 130, 76, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(184, 134, 11, 0.08) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '24px',
                boxShadow: uploadPhase === 'error'
                  ? '0 0 40px rgba(231, 76, 60, 0.2)'
                  : uploadPhase === 'complete'
                    ? '0 0 40px rgba(39, 174, 96, 0.2)'
                    : '0 0 40px rgba(212, 175, 55, 0.15)',
                border: `2px solid ${uploadPhase === 'error' ? 'rgba(231, 76, 60, 0.3)' : uploadPhase === 'complete' ? 'rgba(39, 174, 96, 0.3)' : 'rgba(212, 175, 55, 0.2)'}`
              }}>
                {uploadPhase === 'preparing' && <LottieAnimation name="scan" size={90} />}
                {uploadPhase === 'uploading' && <LottieAnimation name="upload" size={90} />}
                {uploadPhase === 'processing' && <LottieAnimation name="scan" size={90} />}
                {uploadPhase === 'complete' && <LottieAnimation name="success" size={90} loop={false} />}
                {uploadPhase === 'error' && <LottieAnimation name="error" size={90} loop={false} />}
              </div>

              {/* Titulo da fase */}
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: uploadPhase === 'error' ? '#e74c3c' : uploadPhase === 'complete' ? '#27ae60' : '#fff',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                {uploadPhase === 'preparing' && 'Preparando upload...'}
                {uploadPhase === 'uploading' && `Enviando ${parsedData.length} arquivo${parsedData.length > 1 ? 's' : ''}...`}
                {uploadPhase === 'processing' && 'Finalizando...'}
                {uploadPhase === 'complete' && 'Upload Concluido!'}
                {uploadPhase === 'error' && 'Ops! Algo deu errado'}
              </div>

              {/* Frase engracada animada */}
              {(uploadPhase === 'uploading' || uploadPhase === 'processing' || uploadPhase === 'preparing') && (
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(212, 175, 55, 0.9)',
                  marginBottom: '24px',
                  textAlign: 'center',
                  minHeight: '20px',
                  fontStyle: 'italic',
                  transition: 'opacity 0.3s ease',
                  animation: 'fadeInOut 2.5s ease-in-out infinite'
                }}>
                  {funnyPhrases[funnyPhraseIndex]}
                </div>
              )}

              {/* Mensagem de erro */}
              {uploadPhase === 'error' && (
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(231, 76, 60, 0.9)',
                  marginBottom: '24px',
                  textAlign: 'center',
                  padding: '12px 16px',
                  background: 'rgba(231, 76, 60, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(231, 76, 60, 0.2)'
                }}>
                  {errorMessage}
                </div>
              )}

              {/* Mensagem de sucesso */}
              {uploadPhase === 'complete' && (
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(39, 174, 96, 0.9)',
                  marginBottom: '24px',
                  textAlign: 'center'
                }}>
                  Partitura adicionada ao acervo com sucesso!
                </div>
              )}

              {/* Barra de progresso estilizada */}
              {(uploadPhase === 'uploading' || uploadPhase === 'processing' || uploadPhase === 'preparing') && (
                <div style={{ width: '100%', marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    fontSize: '12px'
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {uploadPhase === 'uploading' ? `${completedFiles.length} de ${parsedData.length} arquivos` : 'Processando...'}
                    </span>
                    <span style={{ color: '#D4AF37', fontWeight: '600' }}>
                      {uploadProgress}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${uploadProgress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #D4AF37 0%, #F4D03F 50%, #D4AF37 100%)',
                      backgroundSize: '200% 100%',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease',
                      animation: 'shimmer 2s linear infinite',
                      boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
                    }} />
                  </div>
                </div>
              )}

              {/* Lista de arquivos sendo enviados (mini preview) */}
              {uploadPhase === 'uploading' && parsedData.length > 0 && (
                <div style={{
                  width: '100%',
                  maxHeight: '80px',
                  overflowY: 'auto',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  padding: '8px',
                  marginTop: '8px'
                }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {parsedData.slice(0, 10).map((item, idx) => (
                      <span key={idx} style={{
                        fontSize: '10px',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: completedFiles.includes(idx)
                          ? 'rgba(39, 174, 96, 0.2)'
                          : 'rgba(255, 255, 255, 0.05)',
                        color: completedFiles.includes(idx)
                          ? '#27ae60'
                          : 'var(--text-secondary)',
                        transition: 'all 0.3s ease'
                      }}>
                        {completedFiles.includes(idx) ? '\u2713 ' : ''}{item.instrumento}
                      </span>
                    ))}
                    {parsedData.length > 10 && (
                      <span style={{
                        fontSize: '10px',
                        padding: '3px 8px',
                        color: 'var(--text-secondary)'
                      }}>
                        +{parsedData.length - 10} mais...
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Botao tentar novamente */}
              {uploadPhase === 'error' && (
                <button onClick={() => { setUploadPhase('idle'); setUploading(false); }} style={{
                  marginTop: '8px',
                  padding: '12px 32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.2) 0%, rgba(192, 57, 43, 0.15) 100%)',
                  border: '1px solid rgba(231, 76, 60, 0.3)',
                  color: '#e74c3c',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(231, 76, 60, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(231, 76, 60, 0.2) 0%, rgba(192, 57, 43, 0.15) 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                  </svg>
                  Tentar novamente
                </button>
              )}
            </div>

            {/* CSS para animacoes */}
            <style>{`
              @keyframes pulse {
                0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.7; }
              }
              @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
              }
              @keyframes fadeInOut {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
              }
            `}</style>
          </div>
        )}

        {/* ===== CONTEUDO SCROLLAVEL ===== */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px'
        }}>
          {/* Dropzone - compacto se ja tem arquivos */}
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
                    {parsedData.length} PDF(s) \u2022 Clique para trocar
                  </div>
                </div>
              </div>

              {/* Formulario de dados */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Dados da Partitura
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {/* Titulo */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-secondary)' }}>Titulo *</label>
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
                    <span style={{ color: '#27ae60' }}>{'\u2713'} {reconhecidos}</span>
                    {naoReconhecidos > 0 && <span style={{ color: '#e67e22' }}>{'\u26A0'} {naoReconhecidos}</span>}
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
                        {item.reconhecido ? '\u2713' : '?'}
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
