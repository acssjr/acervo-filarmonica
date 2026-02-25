// ===== CORRIGIR BOMBARDINOS MODAL =====
// Modal para correção em massa das partes de Bombardino
// Escaneia pasta do acervo, cruza com partituras no banco, e substitui partes

import { useState, useRef } from 'react';
import { useUI } from '@contexts/UIContext';
import { API } from '@services/api';
import { extrairInstrumento } from '@utils/instrumentParser';

const CorrigirBombardinosModal = ({ isOpen, onClose, onSuccess, partituras }) => {
    const { showToast } = useUI();
    const folderInputRef = useRef(null);
    const cancelledRef = useRef(false);

    // Steps: 'select' -> 'preview' -> 'processing' -> 'done'
    const [step, setStep] = useState('select');
    const [matches, setMatches] = useState([]);
    const [skipped, setSkipped] = useState([]);
    const [showSkipped, setShowSkipped] = useState(false);

    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [results, setResults] = useState({ success: 0, errors: [] });

    // Normaliza texto para comparação de títulos
    const normalizeTitle = (text) => {
        if (!text) return '';
        return text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[ºª°]/g, '')
            .replace(/n[°º.]?\s*/gi, 'n')
            .replace(/\./g, ' ')
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    };

    // Função para processar a lista de arquivos (seja via input ou drop)
    const processarConteudo = (files) => {
        if (!files || files.length === 0) return;

        // Agrupar arquivos por pasta pai (a que contém o arquivo)
        const folderMap = {};
        const skippedFolders = new Set();
        const allScannedFolders = new Set();

        for (const file of files) {
            const path = file.webkitRelativePath || file.name;
            const pathParts = path.split('/');

            if (pathParts.length < 2) continue;

            const folderName = pathParts[pathParts.length - 2];
            allScannedFolders.add(folderName);

            // Detectar instrumento
            const { instrumento } = extrairInstrumento(file.name);
            const instLower = instrumento.toLowerCase();

            // Abrangência maior: Bombardier, Euphonium, Eufônio, Barítono (Bb), etc.
            const keywords = ['bombardino', 'euphonium', 'eufonio', 'baritono', 'sib', 'sibemol'];
            const looksLikeBombardino = keywords.some(k => instLower.includes(k));

            if (!looksLikeBombardino) continue;

            if (!folderMap[folderName]) {
                folderMap[folderName] = { folderName, files: [] };
            }
            folderMap[folderName].files.push({ file, instrumento });
        }

        // Identificar pastas que foram ignoradas por não terem bombardinos
        for (const f of allScannedFolders) {
            if (!folderMap[f]) skippedFolders.add(f);
        }

        // Cruzar nomes de pastas com títulos de partituras
        const matched = [];
        const partituraTitleMap = {};

        // Criar mapa normalizado de partituras (match exato)
        for (const p of partituras) {
            const normalized = normalizeTitle(p.titulo);
            if (!partituraTitleMap[normalized]) {
                partituraTitleMap[normalized] = p;
            }
        }

        // Títulos ordenados por tamanho (maior primeiro) para busca por inclusão/prefixo
        const sortedDatabasePartituras = [...partituras].sort((a, b) => b.titulo.length - a.titulo.length);

        for (const [folderName, data] of Object.entries(folderMap)) {
            const normalizedFolder = normalizeTitle(folderName);

            // 1. TENTA MATCH EXATO
            let partitura = partituraTitleMap[normalizedFolder];

            // 2. TENTA EXTRAIR TÍTULO (caso a pasta seja "Titulo - Compositor")
            if (!partitura && folderName.includes(' - ')) {
                const titlePart = folderName.split(' - ')[0].trim();
                partitura = partituraTitleMap[normalizeTitle(titlePart)];
            }

            // 3. TENTA BUSCA POR PREFIXO (Se o título do banco é o início do nome da pasta)
            if (!partitura) {
                partitura = sortedDatabasePartituras.find(p => {
                    const normP = normalizeTitle(p.titulo);
                    // Match se a pasta COMESSA com o título do banco (ex: "Amalia de Araujo - ..." começa com "Amalia de Araujo")
                    return normalizedFolder.startsWith(normP);
                });
            }

            // 4. TENTA BUSCA POR INCLUSÃO (Último recurso)
            if (!partitura) {
                partitura = sortedDatabasePartituras.find(p => {
                    const normP = normalizeTitle(p.titulo);
                    return normalizedFolder.includes(normP);
                });
            }

            matched.push({
                folderName: data.folderName,
                files: data.files,
                partitura: partitura || null,
                matched: !!partitura
            });
        }

        // Ordenar: matched primeiro, depois unmatched
        matched.sort((a, b) => {
            if (a.matched && !b.matched) return -1;
            if (!a.matched && b.matched) return 1;
            return a.folderName.localeCompare(b.folderName);
        });

        if (matched.length === 0 && skippedFolders.size === 0) {
            showToast('Nenhuma pasta válida ou arquivo de Bombardino encontrado', 'warning');
            return;
        }

        setMatches(matched);
        setSkipped([...skippedFolders].sort());
        setStep('preview');

        // Limpar input para permitir re-seleção
        if (folderInputRef.current) folderInputRef.current.value = '';
    };

    // Handler para seleção via botão/input
    const handleFolderSelect = (event) => {
        const files = Array.from(event.target.files);
        processarConteudo(files);
    };

    // Handlers para Drag & Drop
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const items = e.dataTransfer.items;
        if (!items) return;

        const files = [];
        const readEntry = async (entry, path = '') => {
            if (entry.isFile) {
                const file = await new Promise(resolve => entry.file(resolve));
                // Simulamos o webkitRelativePath para manter compatibilidade com a lógica existente
                Object.defineProperty(file, 'webkitRelativePath', {
                    value: path + file.name,
                    writable: false
                });
                files.push(file);
            } else if (entry.isDirectory) {
                const reader = entry.createReader();
                const entries = await new Promise(resolve => {
                    reader.readEntries(resolve);
                });
                for (const childEntry of entries) {
                    await readEntry(childEntry, path + entry.name + '/');
                }
            }
        };

        const promises = [];
        for (const item of items) {
            const entry = item.webkitGetAsEntry();
            if (entry) {
                promises.push(readEntry(entry));
            }
        }

        await Promise.all(promises);
        processarConteudo(files);
    };

    // Processar correções em massa
    const handleProcess = async () => {
        const toProcess = matches.filter(m => m.matched);
        if (toProcess.length === 0) {
            showToast('Nenhuma partitura encontrada para corrigir', 'error');
            return;
        }

        cancelledRef.current = false;
        setStep('processing');
        setProgress({ current: 0, total: toProcess.length });

        const resultData = { success: 0, errors: [] };

        for (let i = 0; i < toProcess.length; i++) {
            if (cancelledRef.current) break;
            const match = toProcess[i];
            setProgress({ current: i + 1, total: toProcess.length });

            try {
                const formData = new FormData();
                formData.append('total_arquivos', match.files.length.toString());

                for (let j = 0; j < match.files.length; j++) {
                    formData.append(`arquivo_${j}`, match.files[j].file);
                    formData.append(`instrumento_${j}`, match.files[j].instrumento);
                }

                await API.corrigirBombardinosPartitura(match.partitura.id, formData);
                resultData.success++;
            } catch (err) {
                resultData.errors.push({
                    titulo: match.partitura.titulo,
                    error: err.message || 'Erro desconhecido'
                });
            }
        }

        if (!cancelledRef.current) {
            setResults(resultData);
            setStep('done');
            // Notificar sucesso para recarregar dados
            if (onSuccess && resultData.success > 0) {
                onSuccess();
            }
        }
    };

    const handleReset = () => {
        setStep('select');
        setMatches([]);
        setProgress({ current: 0, total: 0 });
        setResults({ success: 0, errors: [] });
    };

    const handleClose = () => {
        if (step === 'processing') return;
        cancelledRef.current = true;
        handleReset();
        onClose();
    };

    const matchedCount = matches.filter(m => m.matched).length;
    const unmatchedCount = matches.filter(m => !m.matched).length;
    const totalFiles = matches.reduce((sum, m) => sum + m.files.length, 0);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={handleClose}
                style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 9999,
                    animation: 'fadeIn 0.2s ease'
                }}
            />

            {/* Modal */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="bombardinos-modal-title"
                style={{
                    position: 'fixed',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '720px',
                    maxHeight: '85vh',
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
                    zIndex: 10000,
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'Outfit, sans-serif',
                    animation: 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px', height: '40px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                            </svg>
                        </div>
                        <div>
                            <h2 id="bombardinos-modal-title" style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                                Corrigir Bombardinos
                            </h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                                Substituir partes de Bombardino em massa
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={step === 'processing'}
                        aria-label="Fechar modal"
                        style={{
                            width: '36px', height: '36px',
                            borderRadius: '50%',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-secondary)',
                            cursor: step === 'processing' ? 'not-allowed' : 'pointer',
                            opacity: step === 'processing' ? 0.5 : 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}
                >

                    {/* Step 1: Select Folder */}
                    {step === 'select' && (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            border: isDragging ? '2px dashed #D4AF37' : '2px dashed transparent',
                            background: isDragging ? 'rgba(212, 175, 55, 0.05)' : 'transparent',
                            borderRadius: '12px',
                            transition: 'all 0.2s'
                        }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4, marginBottom: '20px' }}>
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                            </svg>
                            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                                Selecione a pasta raiz do acervo
                            </h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                                Selecione a pasta que contém as subpastas de cada partitura.<br />
                                O sistema vai filtrar apenas os arquivos de Bombardino e cruzar<br />
                                com as partituras cadastradas pelo titulo.
                            </p>
                            <label style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                    <path d="M12 11v6M9 14h6" />
                                </svg>
                                Selecionar Pasta
                                <input
                                    ref={folderInputRef}
                                    type="file"
                                    webkitdirectory={true}
                                    directory={true}
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={handleFolderSelect}
                                />
                            </label>
                        </div>
                    )}

                    {/* Step 2: Preview Matches */}
                    {step === 'preview' && (
                        <div>
                            {/* Summary */}
                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                marginBottom: '20px',
                                flexWrap: 'wrap'
                            }}>
                                <div style={{
                                    flex: 1,
                                    minWidth: '140px',
                                    padding: '14px 16px',
                                    borderRadius: '12px',
                                    background: 'rgba(39, 174, 96, 0.1)',
                                    border: '1px solid rgba(39, 174, 96, 0.2)'
                                }}>
                                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#27ae60' }}>{matchedCount}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Partituras encontradas</div>
                                </div>
                                <div style={{
                                    flex: 1,
                                    minWidth: '140px',
                                    padding: '14px 16px',
                                    borderRadius: '12px',
                                    background: 'rgba(212, 175, 55, 0.1)',
                                    border: '1px solid rgba(212, 175, 55, 0.2)'
                                }}>
                                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#D4AF37' }}>{totalFiles}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Arquivos de bombardino</div>
                                </div>
                                {unmatchedCount > 0 && (
                                    <div style={{
                                        flex: 1,
                                        minWidth: '140px',
                                        padding: '14px 16px',
                                        borderRadius: '12px',
                                        background: 'rgba(231, 76, 60, 0.1)',
                                        border: '1px solid rgba(231, 76, 60, 0.2)'
                                    }}>
                                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#e74c3c' }}>{unmatchedCount}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sem correspondencia</div>
                                    </div>
                                )}
                            </div>

                            {/* Match List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {matches.map((match, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 14px',
                                        borderRadius: '10px',
                                        background: match.matched ? 'var(--bg-secondary)' : 'rgba(231, 76, 60, 0.05)',
                                        border: `1px solid ${match.matched ? 'var(--border)' : 'rgba(231, 76, 60, 0.2)'}`,
                                        fontSize: '13px'
                                    }}>
                                        {/* Status icon */}
                                        <div style={{
                                            width: '28px', height: '28px',
                                            borderRadius: '50%',
                                            background: match.matched ? 'rgba(39, 174, 96, 0.15)' : 'rgba(231, 76, 60, 0.15)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            {match.matched ? (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            ) : (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            )}
                                        </div>

                                        {/* Folder name */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontWeight: '500',
                                                color: match.matched ? 'var(--text-primary)' : 'var(--text-muted)',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {match.folderName}
                                            </div>
                                            {!match.matched && (
                                                <div style={{ fontSize: '11px', color: '#e74c3c', marginTop: '2px' }}>
                                                    Título não encontrado no acervo
                                                </div>
                                            )}
                                        </div>

                                        {/* Files info */}
                                        <div style={{
                                            display: 'flex',
                                            gap: '6px',
                                            flexShrink: 0
                                        }}>
                                            {match.files.map((f, fi) => (
                                                <span key={fi} style={{
                                                    padding: '3px 8px',
                                                    borderRadius: '6px',
                                                    background: 'rgba(212, 175, 55, 0.1)',
                                                    border: '1px solid rgba(212, 175, 55, 0.2)',
                                                    fontSize: '11px',
                                                    color: '#D4AF37',
                                                    fontWeight: '500',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {f.instrumento}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Skipped Folders (Optional) */}
                            {
                                skipped.length > 0 && (
                                    <div style={{ marginTop: '20px' }}>
                                        <button
                                            onClick={() => setShowSkipped(!showSkipped)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--text-muted)',
                                                fontSize: '11px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '4px 0'
                                            }}
                                        >
                                            <svg
                                                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                style={{ transform: showSkipped ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}
                                            >
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                            {showSkipped ? 'Ocultar' : 'Mostrar'} {skipped.length} pastas ignoradas (sem bombardino detectado)
                                        </button>

                                        {showSkipped && (
                                            <div style={{
                                                marginTop: '8px',
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                                gap: '6px',
                                                padding: '12px',
                                                background: 'rgba(0,0,0,0.1)',
                                                borderRadius: '8px',
                                                maxHeight: '150px',
                                                overflowY: 'auto'
                                            }}>
                                                {skipped.map((folder, i) => (
                                                    <div key={i} style={{
                                                        fontSize: '11px',
                                                        color: 'var(--text-muted)',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}>
                                                        • {folder}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                        </div>
                    )}

                    {/* Step 3: Processing */}
                    {step === 'processing' && (
                        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" style={{ animation: 'spin 1s linear infinite', marginBottom: '20px' }}>
                                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                            </svg>
                            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                                Processando...
                            </h3>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                                {progress.current} de {progress.total} partituras
                            </p>
                            {/* Progress bar */}
                            <div style={{
                                width: '100%',
                                maxWidth: '300px',
                                height: '6px',
                                borderRadius: '3px',
                                background: 'var(--bg-secondary)',
                                margin: '0 auto',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`,
                                    height: '100%',
                                    borderRadius: '3px',
                                    background: 'linear-gradient(90deg, #D4AF37, #B8860B)',
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Done */}
                    {step === 'done' && (
                        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '20px' }}>
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                                Correção concluída
                            </h3>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                                {results.success} partitura{results.success !== 1 ? 's' : ''} corrigida{results.success !== 1 ? 's' : ''} com sucesso
                            </p>
                            {results.errors.length > 0 && (
                                <div style={{
                                    textAlign: 'left',
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                    background: 'rgba(231, 76, 60, 0.08)',
                                    border: '1px solid rgba(231, 76, 60, 0.2)',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#e74c3c', marginBottom: '8px' }}>
                                        {results.errors.length} erro{results.errors.length !== 1 ? 's' : ''}:
                                    </div>
                                    {results.errors.map((err, i) => (
                                        <div key={i} style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '2px 0' }}>
                                            {err.titulo}: {err.error}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '16px 24px',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    {step === 'preview' && (
                        <>
                            <button
                                onClick={handleReset}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-primary)',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    fontFamily: 'Outfit, sans-serif'
                                }}
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleProcess}
                                disabled={matchedCount === 0}
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '10px',
                                    background: matchedCount > 0
                                        ? 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)'
                                        : 'linear-gradient(135deg, rgba(212, 175, 55, 0.5) 0%, rgba(184, 134, 11, 0.5) 100%)',
                                    border: 'none',
                                    color: '#fff',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    cursor: matchedCount > 0 ? 'pointer' : 'not-allowed',
                                    fontFamily: 'Outfit, sans-serif',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                </svg>
                                Corrigir {matchedCount} partitura{matchedCount !== 1 ? 's' : ''}
                            </button>
                        </>
                    )}
                    {step === 'done' && (
                        <button
                            onClick={handleClose}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                border: 'none',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                fontFamily: 'Outfit, sans-serif'
                            }}
                        >
                            Fechar
                        </button>
                    )}
                </div>

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
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
        `}</style>
            </div>
        </>
    );
};

export default CorrigirBombardinosModal;
