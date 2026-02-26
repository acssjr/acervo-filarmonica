// ===== ADMIN AVISOS =====
// Gerenciamento de avisos com preview fiel ao modal (Design Limpo)

import { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Trash2,
    Edit3,
    Eye,
    CheckCircle2,
    AlertCircle,
    History,
    Megaphone,
    Power,
    Sparkles
} from 'lucide-react';
import { API } from '@services/api';
import { useUI } from '@contexts/UIContext';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { formatTimeAgo } from '@utils/formatters';

// Componente para renderizar a mensagem formatada
const FormattedMessage = ({ text, isPreview = false }) => {
    if (!text) return '';

    const parts = text.split(/!!(.*?)!!/g).map((part, i) =>
        i % 2 === 1 ? (
            <span key={`h-${i}`} style={{ color: isPreview ? '#D4AF37' : 'var(--accent)', fontWeight: '800' }}>
                {part}
            </span>
        ) : part
    );

    return parts.map((part, i) => {
        if (typeof part !== 'string') return part;
        return part.split(/\*\*(.*?)\*\*/g).map((subPart, j) =>
            j % 2 === 1 ? <strong key={`b-${i}-${j}`} style={{ fontWeight: '800' }}>{subPart}</strong> : subPart
        );
    });
};

FormattedMessage.propTypes = {
    text: PropTypes.string,
    isPreview: PropTypes.bool
};

const AdminAvisos = () => {
    const [avisos, setAvisos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [saving, setSaving] = useState(false);
    const { showToast } = useUI();
    const isMobile = useMediaQuery('(max-width: 767px)');

    const isFestive = useMemo(() => {
        const search = (titulo + mensagem).toLowerCase();
        return search.includes('carnaval') || search.includes('folia');
    }, [titulo, mensagem]);

    const loadAvisos = useCallback(async () => {
        try {
            const data = await API.getAvisos();
            setAvisos(data || []);
        } catch (e) {
            showToast('Erro ao carregar avisos', 'error');
        }
        setLoading(false);
    }, [showToast]);

    useEffect(() => { loadAvisos(); }, [loadAvisos]);

    const handleSubmit = async () => {
        if (!titulo.trim() || !mensagem.trim()) {
            showToast('Preencha título e mensagem', 'error');
            return;
        }
        setSaving(true);
        try {
            if (editingId) {
                await API.atualizarAviso(editingId, { titulo, mensagem });
                showToast('Aviso atualizado!', 'success');
            } else {
                await API.criarAviso({ titulo, mensagem });
                showToast('Aviso publicado!', 'success');
            }
            setTitulo('');
            setMensagem('');
            setEditingId(null);
            loadAvisos();
        } catch (e) {
            showToast('Erro ao salvar aviso', 'error');
        }
        setSaving(false);
    };

    const handleEdit = (aviso) => {
        setEditingId(aviso.id);
        setTitulo(aviso.titulo);
        setMensagem(aviso.mensagem);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggle = async (aviso) => {
        try {
            await API.atualizarAviso(aviso.id, { ativo: !aviso.ativo });
            showToast(aviso.ativo ? 'Aviso desativado' : 'Aviso reativado');
            loadAvisos();
        } catch (e) {
            showToast('Erro ao atualizar aviso', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Excluir este aviso permanentemente?')) return;
        try {
            await API.excluirAviso(id);
            showToast('Aviso excluído');
            loadAvisos();
        } catch (e) {
            showToast('Erro ao excluir', 'error');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="admin-container"
            style={{
                padding: isMobile ? '16px' : '32px',
                maxWidth: '1200px',
                margin: '0 auto',
                fontFamily: 'Outfit, sans-serif'
            }}
        >
            {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                        padding: '12px', borderRadius: '16px', color: '#1A0507',
                        boxShadow: '0 8px 16px rgba(184, 134, 11, 0.2)'
                    }}>
                        <Megaphone size={28} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>Comunicações Oficiais</h1>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, fontWeight: '500' }}>Gerencie avisos e comunicados para toda a banda de música</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '32px', marginBottom: '60px' }}>

                {/* Editor */}
                <motion.div
                    layout
                    style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '24px',
                        padding: '32px',
                        border: '1px solid var(--border)',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                        height: 'fit-content'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                        <div style={{ background: 'rgba(212,175,55,0.1)', padding: '8px', borderRadius: '10px' }}>
                            <Edit3 size={18} color="#D4AF37" />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                            {editingId ? 'Editar Comunicado' : 'Escrever Novo Comunicado'}
                        </h3>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Título do Aviso</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Ex: Recesso de Carnaval"
                            style={{
                                width: '100%', padding: '18px', borderRadius: '16px',
                                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                                color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
                                fontFamily: 'Outfit, sans-serif', fontSize: '16px',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Corpo da Mensagem</label>
                        <textarea
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            placeholder="Dica: use **negrito** e !!dourado!! para formatar."
                            rows={10}
                            style={{
                                width: '100%', padding: '18px', borderRadius: '16px',
                                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                                color: 'var(--text-primary)', outline: 'none', resize: 'vertical',
                                boxSizing: 'border-box', lineHeight: '1.7',
                                fontFamily: 'Outfit, sans-serif', fontSize: '16px',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end' }}>
                        {(editingId || (titulo || mensagem)) && (
                            <button
                                onClick={() => { setEditingId(null); setTitulo(''); setMensagem(''); }}
                                style={{
                                    padding: '14px 28px', borderRadius: '14px', background: 'transparent',
                                    border: '1px solid var(--border)', color: 'var(--text-secondary)',
                                    cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: '700'
                                }}
                            >Descartar</button>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={saving || !titulo.trim() || !mensagem.trim()}
                            style={{
                                padding: '16px 40px', borderRadius: '14px',
                                background: (saving || !titulo.trim() || !mensagem.trim()) ? 'var(--border)' : 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                border: 'none',
                                color: (saving || !titulo.trim() || !mensagem.trim()) ? 'var(--text-muted)' : '#1A0507',
                                fontWeight: '900',
                                cursor: (saving || !titulo.trim() || !mensagem.trim()) ? 'default' : 'pointer',
                                fontFamily: 'Outfit, sans-serif',
                                fontSize: '15px',
                                boxShadow: '0 8px 25px rgba(184, 134, 11, 0.4)',
                                opacity: (saving || !titulo.trim() || !mensagem.trim()) ? 0.6 : 1,
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}
                        >
                            {saving ? 'Publicando...' : (editingId ? 'Salvar Alterações' : 'Publicar Agora')}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Preview de Modal Real */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px',
                        display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                        <Eye size={16} color="#D4AF37" /> Preview Real (Modal)
                    </div>

                    {/* Container Simulando o Backdrop da página */}
                    <div style={{
                        background: 'url(https://images.unsplash.com/photo-1514525253440-b393452e2347?q=80&w=1000&auto=format&fit=crop) center/cover', // Imagem de fundo genérica para simular o app
                        borderRadius: '24px',
                        padding: '40px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        minHeight: '500px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Overlay de Blur igual ao Modal Real */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(8px)',
                        }} />

                        {/* O Modal Component em Si */}
                        <motion.div
                            layout
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{
                                background: 'linear-gradient(145deg, #2D0A0E 0%, #1A0507 100%)',
                                borderRadius: '24px',
                                width: '100%',
                                maxWidth: '400px', // Tamanho contido, não tela cheia
                                padding: '0',
                                overflow: 'hidden',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                position: 'relative',
                                zIndex: 10,
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            {/* Flux Border Animation Sutil */}
                            <motion.div
                                style={{
                                    position: 'absolute', inset: 0, padding: '1px', borderRadius: '24px',
                                    background: 'linear-gradient(90deg, #B8860B, #D4AF37, #F4E4BC, #D4AF37, #B8860B)',
                                    backgroundSize: '200% 100%',
                                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                    maskComposite: 'exclude',
                                    WebkitMaskComposite: 'xor',
                                    pointerEvents: 'none',
                                    zIndex: 15
                                }}
                                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Conteúdo Interno do Modal */}
                            <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '20px',
                                    background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '20px', boxShadow: '0 8px 20px rgba(184, 134, 11, 0.3)'
                                }}>
                                    {isFestive ? <Sparkles size={28} color="#1A0507" /> : <Bell size={28} color="#1A0507" />}
                                </div>

                                <span style={{
                                    fontSize: '10px', fontWeight: '900', color: '#D4AF37',
                                    textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '12px'
                                }}>Comunicado Oficial</span>

                                <h2 style={{
                                    fontSize: '22px', fontWeight: '800', color: '#fff',
                                    marginBottom: '20px', lineHeight: '1.3',
                                    fontFamily: 'Outfit, sans-serif'
                                }}>{titulo || 'Título do Aviso'}</h2>

                                <div style={{
                                    background: 'rgba(255,255,255,0.05)', borderRadius: '16px',
                                    padding: '20px', width: '100%', boxSizing: 'border-box',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    marginBottom: '24px'
                                }}>
                                    <p style={{
                                        fontSize: '15px', color: 'rgba(255,255,255,0.9)',
                                        lineHeight: '1.6', whiteSpace: 'pre-wrap', margin: 0,
                                        fontFamily: 'Outfit, sans-serif'
                                    }}>
                                        <FormattedMessage text={mensagem || 'A mensagem formatada aparecerá aqui...'} isPreview={true} />
                                    </p>
                                </div>

                                <button style={{
                                    width: '100%', padding: '16px', borderRadius: '14px',
                                    background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                    border: 'none', color: '#1A0507', fontWeight: '800', fontSize: '14px',
                                    textTransform: 'uppercase', letterSpacing: '1px',
                                    cursor: 'default'
                                }}>Confirmar Leitura</button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Histórico Limpo */}
            <h4 style={{
                fontSize: '15px', fontWeight: '900', color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px',
                display: 'flex', alignItems: 'center', gap: '12px'
            }}>
                <div style={{ background: 'var(--border)', padding: '6px', borderRadius: '8px' }}>
                    <History size={18} />
                </div>
                Histórico de Comunicados
            </h4>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: '#D4AF37', borderRadius: '50%' }}
                    />
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <AnimatePresence mode="popLayout">
                        {avisos.map((aviso, idx) => (
                            <motion.div
                                key={aviso.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.04 }}
                                style={{
                                    background: 'var(--bg-secondary)', borderRadius: '20px', padding: '24px',
                                    border: `1px solid ${aviso.ativo ? 'var(--border)' : 'rgba(231,76,60,0.1)'}`,
                                    opacity: aviso.ativo ? 1 : 0.7,
                                    display: 'flex', flexDirection: isMobile ? 'column' : 'row',
                                    justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
                                    gap: '24px'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '24px', fontSize: '11px', fontWeight: '800',
                                            background: aviso.ativo ? 'rgba(39, 174, 96, 0.12)' : 'rgba(231, 76, 60, 0.12)',
                                            color: aviso.ativo ? '#27ae60' : '#e74c3c',
                                            display: 'flex', alignItems: 'center', gap: '6px'
                                        }}>
                                            {aviso.ativo ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                            {aviso.ativo ? 'ATIVO' : 'ARQUIVADO'}
                                        </span>
                                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                            {formatTimeAgo(aviso.criado_em, true)}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>{aviso.titulo}</h3>
                                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                                        <FormattedMessage text={aviso.mensagem.substring(0, 150) + (aviso.mensagem.length > 150 ? '...' : '')} />
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                        onClick={() => handleToggle(aviso)}
                                        style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '10px', cursor: 'pointer', color: aviso.ativo ? '#f39c12' : '#27ae60' }}
                                    >
                                        <Power size={20} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                        onClick={() => handleEdit(aviso)}
                                        style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '10px', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                    >
                                        <Edit3 size={20} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDelete(aviso.id)}
                                        style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '10px', cursor: 'pointer', color: '#e74c3c' }}
                                    >
                                        <Trash2 size={20} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

export default AdminAvisos;
