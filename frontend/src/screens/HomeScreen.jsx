// ===== HOME SCREEN =====
// Tela inicial com destaques, categorias e atividade recente

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useData } from '@contexts/DataContext';
import { API } from '@services/api';
import { CATEGORIES } from '@constants/categories';
import { formatTimeAgo, getAtividadeInfo } from '@utils/formatters';
import HomeHeader from '@components/common/HomeHeader';
import HeaderActions from '@components/common/HeaderActions';
import FeaturedSheets from '@components/music/FeaturedSheets';
import CategoryCard from '@components/music/CategoryCard';
import FileCard from '@components/music/FileCard';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sheets, favorites, toggleFavorite } = useData();
  const [atividades, setAtividades] = useState([]);
  const getCategoryCount = (catId) => sheets.filter(s => s.category === catId).length;
  const recentSheets = useMemo(() => [...sheets].sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 6), [sheets]);

  // Pega o primeiro nome do usuário
  const firstName = user?.name?.split(' ')[0] || 'Músico';

  // Carrega atividades da API somente se usuario estiver autenticado
  useEffect(() => {
    if (!user) return;

    const loadAtividades = async () => {
      try {
        const data = await API.getMinhasAtividades();
        setAtividades(data || []);
      } catch (e) {
        // Silencioso - atividades nao sao criticas
      }
    };
    loadAtividades();
  }, [user]);

  return (
    <div style={{ width: '100%', overflow: 'visible' }}>
      <HomeHeader
        userName={user?.name || 'Visitante'}
        instrument={user?.instrument || 'Músico'}
        actions={<HeaderActions />}
      />

      <div style={{ paddingTop: '8px', overflow: 'visible' }}>
        <FeaturedSheets sheets={sheets} favorites={favorites} onToggleFavorite={toggleFavorite} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '16px' }}>
        <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: '18px', fontWeight: '700' }}>Gêneros Musicais</h2>
        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
          onClick={() => navigate('/generos')}>Ver Todos</button>
      </div>

      <div style={{ padding: '0 20px', marginBottom: '24px' }}>
        <div className="categories-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '12px',
          width: '100%'
        }}>
          {CATEGORIES.slice(0, 4).map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} count={getCategoryCount(cat.id)} index={i}
              onClick={() => navigate(`/acervo/${cat.id}`)} />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '12px' }}>
        <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: '18px', fontWeight: '700' }}>Partituras Populares</h2>
        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
          onClick={() => navigate('/acervo')}>Ver Todas</button>
      </div>

      <div className="sheets-grid" style={{ padding: '0 20px' }}>
        {recentSheets.map(sheet => (
          <FileCard
            key={sheet.id}
            sheet={sheet}
            category={CATEGORIES.find(c => c.id === sheet.category)}
            isFavorite={favorites.includes(sheet.id)}
            onToggleFavorite={() => toggleFavorite(sheet.id)}
          />
        ))}
      </div>

      {/* Seção de Estatísticas */}
      <div style={{ padding: '32px 20px' }}>
        <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
          Estatísticas do Acervo
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)', fontFamily: 'Outfit, sans-serif' }}>
              {sheets.length}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif' }}>
              Partituras
            </p>
          </div>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '32px', fontWeight: '800', color: '#D4AF37', fontFamily: 'Outfit, sans-serif' }}>
              {favorites.length}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif' }}>
              Favoritos
            </p>
          </div>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '32px', fontWeight: '800', color: '#43B97F', fontFamily: 'Outfit, sans-serif' }}>
              {CATEGORIES.length}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif' }}>
              Gêneros
            </p>
          </div>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '32px', fontWeight: '800', color: '#5B8DEF', fontFamily: 'Outfit, sans-serif' }}>
              {sheets.reduce((acc, s) => acc + (s.downloads || 0), 0)}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif' }}>
              Downloads
            </p>
          </div>
        </div>
      </div>

      {/* Seção de Atividade Recente */}
      <div style={{ padding: '0 20px 32px' }}>
        <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
          Atividade Recente
        </h2>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          {atividades.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              Nenhuma atividade recente
            </div>
          ) : (
            atividades.slice(0, 5).map((atividade, index, arr) => {
              const info = getAtividadeInfo(atividade.tipo);
              return (
                <div key={atividade.id || index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 16px',
                  borderBottom: index < arr.length - 1 ? '1px solid var(--border)' : 'none'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: info.color,
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {info.action}
                    </p>
                    <p style={{ fontSize: '12px', fontFamily: 'Outfit, sans-serif', color: 'var(--text-muted)' }}>
                      {atividade.titulo} {atividade.detalhes && `• ${atividade.detalhes}`} • {formatTimeAgo(atividade.criado_em)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer informativo */}
      <div style={{
        padding: '24px 20px 120px',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        margin: '0 20px'
      }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif', marginBottom: '8px' }}>
          Filarmônica 25 de Março
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif', opacity: 0.7 }}>
          Acervo Digital de Partituras • Versão 2.0
        </p>
      </div>
    </div>
  );
};

export default HomeScreen;
