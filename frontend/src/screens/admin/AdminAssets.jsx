import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trash2,
    Upload,
    Search,
    Folder,
    X,
    Check,
    Loader2,
    Info
} from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { useUI } from '@contexts/UIContext';
import { API } from '@services/api';
import { API_BASE_URL } from '@constants/api';

const ASSET_FOLDERS = [
    { id: 'backgrounds', name: 'Planos de Fundo', icon: '🖼️', prefix: 'backgrounds/' },
    { id: 'logos', name: 'Logos e Ícones', icon: '🎨', prefix: 'logos/' },
    { id: 'general', name: 'Geral', icon: '📂', prefix: 'general/' }
];

const AdminAssets = () => {
    const { showToast } = useUI();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentFolder, setCurrentFolder] = useState(ASSET_FOLDERS[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [deletingKey, setDeletingKey] = useState(null);

    // Estados para o Modal de Upload e Otimização
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [optimizedBlob, setOptimizedBlob] = useState(null);
    const [optimizationLoading, setOptimizationLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [optimizedUrl, setOptimizedUrl] = useState(null);

    // Opções de Otimização (Squoosh-like)
    const [quality, setQuality] = useState(0.8);
    const [maxWidth, setMaxWidth] = useState(1920);
    const [convertToWebP, setConvertToWebP] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef(null);

    const loadAssets = useCallback(async () => {
        setLoading(true);
        try {
            const data = await API.getAssets(currentFolder.prefix);
            setAssets(data.assets || []);
        } catch (error) {
            showToast('Erro ao carregar arquivos', 'error');
        } finally {
            setLoading(false);
        }
    }, [currentFolder, showToast]);

    useEffect(() => {
        loadAssets();
    }, [loadAssets]);

    // Cleanup URLs ao desmontar
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            if (optimizedUrl) URL.revokeObjectURL(optimizedUrl);
        };
    }, [previewUrl, optimizedUrl]);

    // Função para processar a imagem (Otimização)
    const processImage = useCallback(async (file, customQuality, customWidth, customWebP) => {
        if (!file) return;
        setOptimizationLoading(true);

        // Usar valor explicito ou estado atual
        const useWebP = customWebP !== undefined ? customWebP : convertToWebP;

        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: customWidth || maxWidth,
                useWebWorker: true,
                initialQuality: customQuality || quality,
                fileType: useWebP ? 'image/webp' : file.type
            };

            const compressedFile = await imageCompression(file, options);
            setOptimizedBlob(compressedFile);

            if (optimizedUrl) URL.revokeObjectURL(optimizedUrl);
            setOptimizedUrl(URL.createObjectURL(compressedFile));
        } catch (error) {
            console.error('Erro na otimização:', error);
            showToast('Erro ao otimizar imagem', 'error');
        } finally {
            setOptimizationLoading(false);
        }
    }, [quality, maxWidth, convertToWebP, optimizedUrl, showToast]);

    const cleanupUrls = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        if (optimizedUrl) {
            URL.revokeObjectURL(optimizedUrl);
            setOptimizedUrl(null);
        }
    };

    const handleCloseModal = () => {
        if (uploading) return;
        cleanupUrls();
        setShowUploadModal(false);
        setSelectedFile(null);
        setOptimizedBlob(null);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Por favor, selecione apenas imagens', 'warning');
            e.target.value = '';
            return;
        }

        setSelectedFile(file);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
        setShowUploadModal(true);
        e.target.value = '';

        // Iniciar otimização automática com defaults
        processImage(file);
    };

    const handleUpload = async () => {
        if (!optimizedBlob) return;
        setUploading(true);

        try {
            let fileName = selectedFile.name;
            if (convertToWebP) {
                fileName = fileName.replace(/\.[^/.]+$/, "") + ".webp";
            }

            await API.uploadAsset(optimizedBlob, currentFolder.id, fileName);
            showToast('Arquivo enviado e otimizado com sucesso!');
            
            // Cleanup e reset
            cleanupUrls();
            setShowUploadModal(false);
            loadAssets();

            // Resetar estados
            setSelectedFile(null);
            setOptimizedBlob(null);
        } catch (error) {
            showToast(error.message || 'Erro no upload', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (key) => {
        if (!confirm('Deseja excluir permanentemente este arquivo?')) return;
        setDeletingKey(key);
        try {
            await API.deleteAsset(key);
            showToast('Arquivo excluído');
            loadAssets();
        } catch (error) {
            showToast('Erro ao excluir arquivo', 'error');
        } finally {
            setDeletingKey(null);
        }
    };

    const filteredAssets = assets.filter(asset =>
        asset.key.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="admin-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                        Gerenciamento de Ativos
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Controle fotos, ícones e backgrounds do sistema</p>
                </div>

                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        background: 'var(--accent)',
                        color: 'white',
                        fontWeight: '600'
                    }}
                >
                    <Upload size={20} />
                    <span>Novo Upload</span>
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    accept="image/*"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }}>
                {/* Sidebar - Folders */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                        Pastas
                    </h3>
                    {ASSET_FOLDERS.map(folder => (
                        <button
                            key={folder.id}
                            onClick={() => setCurrentFolder(folder)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                background: currentFolder.id === folder.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                                border: 'none',
                                color: currentFolder.id === folder.id ? 'var(--accent)' : 'var(--text-primary)',
                                fontWeight: currentFolder.id === folder.id ? '700' : '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textAlign: 'left'
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>{folder.icon}</span>
                            <span>{folder.name}</span>
                        </button>
                    ))}

                    <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '8px' }}>
                            <Info size={16} />
                            <span style={{ fontSize: '13px', fontWeight: '700' }}>Dica</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                            Use a pasta <b>backgrounds</b> para as fotos da tela de login. O sistema carrega todas automaticamente.
                        </p>
                    </div>
                </div>

                {/* Content - Asset Grid */}
                <div>
                    {/* Search Bar */}
                    <div style={{ position: 'relative', marginBottom: '24px' }}>
                        <Search
                            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Buscar por nome do arquivo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 14px 14px 48px',
                                borderRadius: '14px',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-primary)',
                                fontSize: '15px'
                            }}
                        />
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                            <Loader2 className="animate-spin" size={48} color="var(--accent)" />
                        </div>
                    ) : filteredAssets.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                            {filteredAssets.map(asset => (
                                <motion.div
                                    layout
                                    key={asset.key}
                                    style={{
                                        background: 'var(--bg-secondary)',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        border: '1px solid var(--border)',
                                        position: 'relative',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
                                        <img
                                            src={`${API_BASE_URL}${asset.url}`}
                                            alt={asset.key}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            loading="lazy"
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            padding: '8px',
                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                            color: 'white',
                                            fontSize: '10px'
                                        }}>
                                            {formatSize(asset.size)}
                                        </div>
                                    </div>

                                    <div style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ overflow: 'hidden' }}>
                                            <p style={{
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                color: 'var(--text-primary)',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {asset.key.split('/').pop()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(asset.key)}
                                            disabled={deletingKey === asset.key}
                                            style={{
                                                padding: '8px',
                                                borderRadius: '8px',
                                                background: 'rgba(231, 76, 60, 0.1)',
                                                color: '#e74c3c',
                                                border: 'none',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {deletingKey === asset.key ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '100px 0',
                            background: 'var(--bg-secondary)',
                            borderRadius: '24px',
                            border: '2px dashed var(--border)'
                        }}>
                            <Folder size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                            <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Nenhum arquivo encontrado nesta pasta</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Squoosh-like Upload Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            style={{
                                width: '100%',
                                maxWidth: '900px',
                                background: 'var(--bg-primary)',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                border: '1px solid var(--border)'
                            }}
                        >
                            {/* Modal Header */}
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Otimizar Imagem</h2>
                                <button
                                    onClick={handleCloseModal}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', height: '500px' }}>
                                {/* Preview Area */}
                                <div style={{ background: '#0a0a0a', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <AnimatePresence mode="wait">
                                        {optimizationLoading ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
                                            >
                                                <Loader2 className="animate-spin" size={48} color="var(--accent)" />
                                                <span style={{ color: 'white', fontWeight: '600' }}>Otimizando...</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key={optimizedUrl}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <img
                                                    src={optimizedUrl || previewUrl}
                                                    alt="Preview"
                                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Comparativo Flutuante */}
                                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', gap: '12px' }}>
                                        <div style={{ background: 'rgba(0,0,0,0.6)', padding: '8px 12px', borderRadius: '8px', color: 'white', fontSize: '12px', backdropFilter: 'blur(4px)' }}>
                                            <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>Original</div>
                                            <div style={{ fontWeight: '700' }}>{selectedFile && formatSize(selectedFile.size)}</div>
                                        </div>
                                        <div style={{ background: 'var(--accent)', padding: '8px 12px', borderRadius: '8px', color: 'white', fontSize: '12px' }}>
                                            <div style={{ opacity: 0.8, marginBottom: '2px' }}>Otimizado</div>
                                            <div style={{ fontWeight: '700' }}>{optimizedBlob ? formatSize(optimizedBlob.size) : '---'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Controls Area */}
                                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', borderLeft: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
                                            Qualidade: {Math.round(quality * 100)}%
                                        </label>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="1.0"
                                            step="0.05"
                                            value={quality}
                                            onChange={(e) => setQuality(parseFloat(e.target.value))}
                                            onPointerUp={() => processImage(selectedFile)}
                                            onKeyUp={(e) => e.key === 'Enter' && processImage(selectedFile)}
                                            style={{ width: '100%', accentColor: 'var(--accent)' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
                                            Largura Máxima: {maxWidth}px
                                        </label>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {[1080, 1920, 2560].map(w => (
                                                <button
                                                    key={w}
                                                    onClick={() => { setMaxWidth(w); processImage(selectedFile, quality, w); }}
                                                    style={{
                                                        flex: 1,
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        background: maxWidth === w ? 'var(--accent)' : 'var(--bg-primary)',
                                                        color: maxWidth === w ? 'white' : 'var(--text-primary)',
                                                        border: '1px solid var(--border)',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {w}p
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                        <div
                                            onClick={() => { 
                                                const newVal = !convertToWebP;
                                                setConvertToWebP(newVal);
                                                processImage(selectedFile, quality, maxWidth, newVal);
                                            }}
                                            style={{
                                                width: '48px',
                                                height: '24px',
                                                borderRadius: '12px',
                                                background: convertToWebP ? 'var(--accent)' : 'var(--text-muted)',
                                                position: 'relative',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div style={{
                                                width: '18px',
                                                height: '18px',
                                                background: 'white',
                                                borderRadius: '50%',
                                                position: 'absolute',
                                                top: '3px',
                                                left: convertToWebP ? '27px' : '3px',
                                                transition: 'all 0.2s ease'
                                            }} />
                                        </div>
                                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Converter para WebP</span>
                                    </label>

                                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <button
                                            onClick={handleUpload}
                                            disabled={uploading || optimizationLoading || !optimizedBlob}
                                            className="btn-primary"
                                            style={{
                                                padding: '16px',
                                                borderRadius: '16px',
                                                background: 'var(--accent)',
                                                color: 'white',
                                                fontWeight: '700',
                                                fontSize: '15px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '10px'
                                            }}
                                        >
                                            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                                            Confirmar e Enviar
                                        </button>
                                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
                                            A imagem será enviada para a pasta <b>{currentFolder.name}</b>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
        .admin-container {
          background: var(--bg-primary);
          min-height: 100vh;
          color: var(--text-primary);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .btn-primary:active {
          transform: scale(0.98);
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
};

export default AdminAssets;
