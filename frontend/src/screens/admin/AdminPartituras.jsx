// ===== ADMIN PARTITURAS =====
// Gerenciamento de partituras

import { useState, useEffect, useMemo } from 'react';
import { useUI } from '@contexts/UIContext';
import { API } from '@services/api';
import CategoryIcon from '@components/common/CategoryIcon';
import UploadPastaModal from './components/UploadPastaModal';
import PartesDrawer from './components/PartesDrawer';

const AdminPartituras = () => {
  const { showToast } = useUI();
  const [partituras, setPartituras] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPartitura, setSelectedPartitura] = useState(null);
  const [showPartesDrawer, setShowPartesDrawer] = useState(false);

  // Normaliza texto removendo acentos
  const normalizeText = (text) => {
    if (!text) return '';
    return text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [parts, cats] = await Promise.all([
        API.getPartituras(),
        API.getCategorias()
      ]);
      setPartituras(parts || []);
      setCategorias(cats || []);
    } catch (e) {
      showToast('Erro ao carregar dados', 'error');
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail === 'novo') {
        showToast('Funcao de criar partitura em desenvolvimento');
      }
      if (e.detail === 'pasta') {
        setShowUploadModal(true);
      }
    };
    window.addEventListener('admin-partituras-action', handler);
    return () => window.removeEventListener('admin-partituras-action', handler);
  }, [showToast]);

  // Filtragem
  const filtered = useMemo(() => {
    const query = normalizeText(search);

    let results = partituras;

    if (filterCategoria) {
      results = results.filter(p => p.categoria_id === filterCategoria);
    }

    if (query) {
      results = results.filter(p => {
        const tituloNorm = normalizeText(p.titulo);
        const compositorNorm = normalizeText(p.compositor);
        return tituloNorm.includes(query) || compositorNorm.includes(query);
      });
    }

    return results.sort((a, b) => a.titulo?.localeCompare(b.titulo, 'pt-BR'));
  }, [partituras, search, filterCategoria]);

  // Agrupar por letra inicial
  const groupedByLetter = filtered.reduce((acc, p) => {
    const letter = p.titulo?.charAt(0)?.toUpperCase() || '#';
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(p);
    return acc;
  }, {});

  const sortedLetters = Object.keys(groupedByLetter).sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const handleDelete = async (id) => {
    if (!confirm('Remover esta partitura?')) return;
    try {
      await API.deletePartitura(id);
      showToast('Partitura removida!');
      loadData();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const toggleDestaque = async (partitura) => {
    const novoDestaque = partitura.destaque === 1 ? 0 : 1;

    setPartituras(prev => prev.map(p =>
      p.id === partitura.id ? { ...p, destaque: novoDestaque } : p
    ));

    try {
      await API.updatePartitura(partitura.id, { ...partitura, destaque: novoDestaque });
      showToast(novoDestaque ? 'Adicionado aos destaques!' : 'Removido dos destaques');
    } catch (e) {
      setPartituras(prev => prev.map(p =>
        p.id === partitura.id ? { ...p, destaque: partitura.destaque } : p
      ));
      showToast(e.message, 'error');
    }
  };

  const getCategoriaInfo = (id) => categorias.find(c => c.id === id) || {};
  const selectedCategoria = categorias.find(c => c.id === filterCategoria);

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          fontFamily: 'Outfit, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
          Partituras
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => window.adminNav?.('partituras', 'pasta')} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
            color: '#fff',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload de Pasta
          </button>
          <button onClick={() => window.adminNav?.('partituras', 'novo')} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #2C3E50 0%, #1a252f 100%)',
            color: '#fff',
            border: '2px solid #34495e',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nova Partitura
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {/* Barra de busca */}
        <div style={{ flex: 1, minWidth: '250px' }}>
          <div className="search-bar">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar por titulo ou compositor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="clear-btn" onClick={() => setSearch('')}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Dropdown de categoria */}
        <div style={{ position: 'relative', minWidth: '200px' }}>
          <button
            type="button"
            onClick={() => setShowCatDropdown(!showCatDropdown)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1.5px solid var(--border)',
              background: 'var(--bg-card)',
              color: selectedCategoria ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '14px',
              fontFamily: 'Outfit, sans-serif',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {selectedCategoria && (
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(212, 175, 55, 0.2)'
                }}>
                  <CategoryIcon categoryId={selectedCategoria.id} size={14} color="#D4AF37" />
                </span>
              )}
              {selectedCategoria ? selectedCategoria.nome : 'Todas categorias'}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{
              transform: showCatDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
              flexShrink: 0
            }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {showCatDropdown && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              background: 'var(--bg-secondary)',
              border: '1.5px solid var(--border)',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              zIndex: 100,
              maxHeight: '280px',
              overflowY: 'auto'
            }}>
              <button
                onClick={() => { setFilterCategoria(''); setShowCatDropdown(false); }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: !filterCategoria ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                  color: !filterCategoria ? '#D4AF37' : 'var(--text-primary)',
                  fontSize: '14px',
                  fontFamily: 'Outfit, sans-serif',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                Todas categorias
              </button>
              {categorias.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setFilterCategoria(cat.id); setShowCatDropdown(false); }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: filterCategoria === cat.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                    color: filterCategoria === cat.id ? '#D4AF37' : 'var(--text-primary)',
                    fontSize: '14px',
                    fontFamily: 'Outfit, sans-serif',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(212, 175, 55, 0.2)'
                  }}>
                    <CategoryIcon categoryId={cat.id} size={14} color="#D4AF37" />
                  </span>
                  {cat.nome}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px', color: 'var(--text-secondary)', fontSize: '14px', fontFamily: 'Outfit, sans-serif' }}>
        {filtered.length} partitura(s) {search && `para "${search}"`}
      </div>

      {/* Lista agrupada por letra */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)', fontFamily: 'Outfit, sans-serif' }}>
          Carregando...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-secondary)',
          fontFamily: 'Outfit, sans-serif'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.5, marginBottom: '16px' }}>
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <p style={{ margin: 0 }}>Nenhuma partitura encontrada</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {sortedLetters.map((letter) => (
            <div key={letter}>
              {/* Header da letra */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '2px solid var(--border)'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#fff',
                  fontFamily: 'Outfit, sans-serif',
                  boxShadow: '0 2px 6px rgba(212, 175, 55, 0.3)'
                }}>
                  {letter}
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif' }}>
                  {groupedByLetter[letter].length} {groupedByLetter[letter].length === 1 ? 'partitura' : 'partituras'}
                </span>
              </div>

              {/* Lista de partituras desta letra */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {groupedByLetter[letter].map((p) => {
                  const cat = getCategoriaInfo(p.categoria_id);
                  return (
                    <div key={p.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      transition: 'all 0.2s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.2s',
                          border: '1px solid rgba(212, 175, 55, 0.2)'
                        }}>
                          <CategoryIcon categoryId={cat.id || p.categoria_id} size={22} color="#D4AF37" />
                        </div>
                        <div>
                          <div style={{
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '15px'
                          }}>
                            {p.titulo}
                            {p.destaque === 1 && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="#D4AF37" stroke="#D4AF37" strokeWidth="1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                              </svg>
                            )}
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            {p.compositor} • {cat.nome || p.categoria_id} {p.ano && `• ${p.ano}`}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            {p.downloads || 0} downloads
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {/* Botao Gerenciar Partes */}
                        <button
                          onClick={() => {
                            setSelectedPartitura(p);
                            setShowPartesDrawer(true);
                          }}
                          title="Gerenciar partes"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(52, 152, 219, 0.1)',
                            border: '1px solid rgba(52, 152, 219, 0.3)',
                            color: '#3498db',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                          </svg>
                        </button>
                        {/* Botao Destaque */}
                        <button onClick={() => toggleDestaque(p)} title={p.destaque === 1 ? 'Remover destaque' : 'Destacar'} style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-sm)',
                          background: p.destaque === 1 ? 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' : 'var(--bg-primary)',
                          border: p.destaque === 1 ? 'none' : '1px solid var(--border)',
                          color: p.destaque === 1 ? '#fff' : 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill={p.destaque === 1 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        </button>
                        {/* Botao Excluir */}
                        <button onClick={() => handleDelete(p.id)} title="Excluir" style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(231, 76, 60, 0.1)',
                          border: '1px solid rgba(231, 76, 60, 0.3)',
                          color: '#e74c3c',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Upload de Pasta */}
      <UploadPastaModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={() => {
          loadData();
          setShowUploadModal(false);
        }}
        categorias={categorias}
      />

      {/* Drawer de Gerenciamento de Partes */}
      <PartesDrawer
        isOpen={showPartesDrawer}
        onClose={() => {
          setShowPartesDrawer(false);
          setSelectedPartitura(null);
        }}
        partitura={selectedPartitura}
        categorias={categorias}
        onUpdate={loadData}
      />
    </div>
  );
};

export default AdminPartituras;
