// ===== PROFILE SCREEN =====
// Redesign moderno com stats de presença, badges de conquista e configurações

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAuth } from '@contexts/AuthContext';
import { useUI } from '@contexts/UIContext';
import { useNotifications } from '@contexts/NotificationContext';
import { Icons } from '@constants/icons';
import { Storage } from '@services/storage';
import { API } from '@services/api';
import ChangePinModal from '@components/modals/ChangePinModal';
import { AboutModal, PROFILE_CHANGELOG, PROFILE_LEGACY_VERSIONS, PROFILE_ABOUT_CONFIG } from '@components/modals/AboutModal';

gsap.registerPlugin(useGSAP);

// ── Helpers ────────────────────────────────────────────────────────────────

// ── Sub-componentes ────────────────────────────────────────────────────────

const StatCard = ({ value, label, accent, animate, suffix = '' }) => {
  const numRef = useRef(null);

  useGSAP(() => {
    if (animate == null || numRef.current == null) return;
    const proxy = { val: 0 };
    gsap.to(proxy, {
      val: animate,
      duration: 1.2,
      ease: 'power2.out',
      snap: { val: 1 },
      onUpdate: () => {
        if (numRef.current) numRef.current.textContent = proxy.val + suffix;
      },
    });
  }, {
    scope: numRef,
    dependencies: [animate, suffix],
    revertOnUpdate: true
  });

  return (
    <div style={{
      flex: 1,
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '14px 8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
    }}>
      <span ref={numRef} style={{
        fontSize: '22px',
        fontWeight: '800',
        color: accent ? 'var(--accent)' : 'var(--text-primary)',
        lineHeight: 1,
      }}>{animate != null ? `0${suffix}` : value}</span>
      <span style={{
        fontSize: '10px',
        fontWeight: '600',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        textAlign: 'center',
      }}>{label}</span>
    </div>
  );
};

const BADGE_THEMES = {
  primeiro_acorde: { gradient: 'linear-gradient(145deg, #1A3A20 0%, #0C1E10 100%)', glow: 'rgba(60,200,100,0.18)' },
  em_chama:        { gradient: 'linear-gradient(145deg, #6B2A10 0%, #381208 100%)', glow: 'rgba(220,100,40,0.22)' },
  assiduo:         { gradient: 'linear-gradient(145deg, #5A4010 0%, #2E2008 100%)', glow: 'rgba(212,175,55,0.22)' },
  mes_perfeito:    { gradient: 'linear-gradient(145deg, #3A3A10 0%, #1E1E08 100%)', glow: 'rgba(240,220,40,0.22)' },
  dedicado:        { gradient: 'linear-gradient(145deg, #4A1040 0%, #250820 100%)', glow: 'rgba(180,80,200,0.18)' },
  maratonista:     { gradient: 'linear-gradient(145deg, #1A4830 0%, #0C2818 100%)', glow: 'rgba(40,200,120,0.18)' },
  leal:            { gradient: 'linear-gradient(145deg, #1A2A60 0%, #0C1430 100%)', glow: 'rgba(80,130,220,0.18)' },
  fundador_digital:{ gradient: 'linear-gradient(145deg, #2A1A50 0%, #150A28 100%)', glow: 'rgba(160,80,255,0.20)' },
};
const DEFAULT_BADGE_THEME = { gradient: 'linear-gradient(145deg, #2A2A3A 0%, #151520 100%)', glow: 'rgba(255,255,255,0.08)' };

// Como desbloquear cada conquista (exibido no modal quando não conquistada)
const _UNLOCK_HINTS = {
  primeiro_acorde: 'Compareça ao seu primeiro ensaio da filarmônica.',
  em_chama:        'Mantenha uma sequência de 5 ensaios consecutivos sem faltar.',
  assiduo:         'Alcance 90% ou mais de presença em pelo menos 5 ensaios registrados.',
  mes_perfeito:    'Não falte a nenhum ensaio em um mês com pelo menos 3 ensaios.',
  dedicado:        'Frequente 50 ensaios ao longo de sua trajetória na filarmônica.',
  maratonista:     'Frequente 100 ensaios ao longo de sua trajetória na filarmônica.',
  leal:            'Permaneça ativo no Acervo Digital por 6 meses ou mais.',
  fundador_digital:'Esta conquista era exclusiva para os primeiros membros do app.',
};

// Catálogo completo de conquistas possíveis (independente do que o usuário ganhou)
const BADGE_CATALOG = [
  { id: 'primeiro_acorde', emoji: '🎵', label: 'Primeiro Acorde',   descricao: 'Participou do primeiro ensaio' },
  { id: 'em_chama',        emoji: '🔥', label: 'Em Chama',          descricao: 'Sequência de 5+ ensaios' },
  { id: 'assiduo',         emoji: '🎖️', label: 'Assíduo',           descricao: '90%+ de presença nos ensaios' },
  { id: 'mes_perfeito',    emoji: '⭐', label: 'Mês Perfeito',      descricao: '100% de presença no mês' },
  { id: 'dedicado',        emoji: '🎼', label: 'Dedicado',          descricao: '50+ ensaios frequentados' },
  { id: 'maratonista',     emoji: '🏆', label: 'Maratonista',       descricao: '100+ ensaios frequentados' },
  { id: 'leal',            emoji: '💛', label: 'Leal',              descricao: '6+ meses no Acervo Digital' },
  { id: 'fundador_digital',emoji: '🌟', label: 'Fundador Digital',  descricao: 'Membro da primeira geração' },
];

const BadgeCard = ({ id, emoji, label, descricao, earned }) => {
  const { gradient, glow } = BADGE_THEMES[id] || DEFAULT_BADGE_THEME;
  return (
    <div
      data-testid={`badge-card-${id}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: gradient,
        borderRadius: '20px',
        padding: '14px',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0,0,0,0.32)',
        border: '1px solid rgba(255,255,255,0.07)',
        opacity: earned ? 1 : 0.38,
      }}
    >
      {/* Specular highlight */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      {/* Text */}
      <div style={{ paddingRight: '44px', flex: 1 }}>
        <p style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.2, marginBottom: '3px' }}>
          {label}
        </p>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', fontWeight: '500', lineHeight: 1.3 }}>
          {descricao}
        </p>
      </div>
      {/* Radial glow behind emoji */}
      <div style={{
        position: 'absolute', right: '-16px', bottom: '-16px',
        width: '110px', height: '110px', borderRadius: '50%',
        background: `radial-gradient(circle, ${glow} 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />
      {/* Big emoji */}
      <div style={{
        position: 'absolute', right: '10px', bottom: '8px',
        fontSize: '44px', lineHeight: 1, opacity: 0.45,
        transform: 'rotate(-8deg)', pointerEvents: 'none',
        userSelect: 'none',
      }}>{emoji}</div>
      {/* Earned dot */}
      {earned && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          width: '8px', height: '8px', borderRadius: '50%',
          background: '#D4AF37', boxShadow: '0 0 6px rgba(212,175,55,0.8)',
        }} />
      )}
    </div>
  );
};


const SettingItem = ({ icon, label, value, onClick, rightElement, danger, iconBg }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '15px 16px',
      background: 'var(--bg-card)',
      border: 'none',
      borderBottom: '1px solid var(--border)',
      cursor: onClick ? 'pointer' : 'default',
      textAlign: 'left',
    }}
  >
    <div style={{
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      background: danger
        ? 'rgba(214, 69, 69, 0.12)'
        : (iconBg || 'var(--icon-accent-bg)'),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <div style={{ width: '18px', height: '18px', color: danger ? '#D64545' : 'var(--icon-accent-fg)' }}>
        {icon}
      </div>
    </div>
    <div style={{ flex: 1 }}>
      <p style={{
        fontSize: '14px',
        fontWeight: '500',
        color: danger ? '#D64545' : 'var(--text-primary)',
        marginBottom: value ? '1px' : 0,
      }}>{label}</p>
      {value && (
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{value}</p>
      )}
    </div>
    {rightElement}
    {onClick && !rightElement && (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="var(--text-muted)" strokeWidth="2.5">
        <path d="M9 18l6-6-6-6" />
      </svg>
    )}
  </button>
);

const SectionLabel = ({ children }) => (
  <p style={{
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    padding: '20px 20px 8px',
  }}>{children}</p>
);

const SectionGroup = ({ children }) => (
  <div style={{
    marginInline: '16px',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid var(--border)',
  }}>
    {children}
  </div>
);

// ── Tela principal ─────────────────────────────────────────────────────────

const ProfileScreen = () => {
  const { user, setUser } = useAuth();
  const { showToast } = useUI();
  const { clearNotifications } = useNotifications();

  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showAllBadges, setShowAllBadges] = useState(false);

  // Foto de perfil — URL do servidor (principal) ou base64 local (cache offline)
  const [profilePhoto, setProfilePhoto] = useState(
    () => user?.foto_url || Storage.get(`profilePhoto_${user?.id}`, null)
  );
  const fileInputRef = useRef(null);
  const firstBadgesRef = useRef(null);

  // Stats de presença — carrega do cache local imediatamente, revalida em background
  const statsCache = Storage.get(`presencaStats_${user?.id}`, null);
  const [stats, setStats] = useState(statsCache);
  const [loadingStats, setLoadingStats] = useState(!statsCache);

  // Nome de exibição
  const [isEditingNome, setIsEditingNome] = useState(false);
  const [editedNome, setEditedNome] = useState(user?.nome_exibicao || '');
  const [isSavingNome, setIsSavingNome] = useState(false);
  const isSavingNomeRef = useRef(false);
  const nomeInputRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      setProfilePhoto(user.foto_url || Storage.get(`profilePhoto_${user.id}`, null));
    }
  }, [user?.id, user?.foto_url]);

  useEffect(() => {
    // Revalida em background — se tiver cache, não mostra loading
    API.getPresencaStats().then(data => {
      if (data) {
        setStats(data);
        Storage.set(`presencaStats_${user?.id}`, data);
      }
    }).catch(() => {}).finally(() => setLoadingStats(false));
  }, [user?.id]);

  useEffect(() => {
    if (isEditingNome) nomeInputRef.current?.focus();
  }, [isEditingNome]);

  useGSAP(() => {
    if (!stats || !firstBadgesRef.current) return;

    const cards = Array.from(firstBadgesRef.current.children);
    if (cards.length === 0) return;

    gsap.from(cards, {
      opacity: 0,
      scale: 0.88,
      y: 16,
      duration: 0.4,
      ease: 'back.out(1.5)',
      stagger: { each: 0.08, from: 'start' }
    });
  }, {
    scope: firstBadgesRef,
    dependencies: [stats],
    revertOnUpdate: true
  });

  // ── Handlers ──────────────────────────────────────────────────────────

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Imagem muito grande (max 2MB)', 'error');
      return;
    }

    const previousPhoto = profilePhoto;

    // Preview instantâneo via base64 (não espera o upload)
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setProfilePhoto(base64);
      Storage.set(`profilePhoto_${user.id}`, base64);
    };
    reader.readAsDataURL(file);

    // Upload real para o servidor
    API.uploadFotoPerfil(file).then(({ foto_url }) => {
      setUser({ ...user, foto_url });
      setProfilePhoto(foto_url);
      showToast('Foto atualizada!');
    }).catch((err) => {
      // Reverte para foto anterior em caso de falha
      setProfilePhoto(previousPhoto);
      if (previousPhoto) {
        Storage.set(`profilePhoto_${user.id}`, previousPhoto);
      } else {
        Storage.remove(`profilePhoto_${user.id}`);
      }
      showToast(err.message || 'Erro ao salvar foto', 'error');
    });
  };

  const handleSaveNome = async () => {
    if (isSavingNomeRef.current) return;
    const valor = editedNome.trim();
    setIsEditingNome(false);

    // Sem mudança
    if (valor === (user.nome_exibicao || '')) return;

    isSavingNomeRef.current = true;
    setIsSavingNome(true);
    try {
      await API.updatePerfil({ nome_exibicao: valor || null });
      setUser({ ...user, nome_exibicao: valor || null });
      showToast(valor ? `Agora você é "${valor}"!` : 'Nome de exibição removido');
    } catch {
      showToast('Erro ao salvar nome', 'error');
      setEditedNome(user.nome_exibicao || '');
    } finally {
      isSavingNomeRef.current = false;
      setIsSavingNome(false);
    }
  };

  const handleLogout = () => {
    Storage.remove('authToken');
    Storage.remove('savedUsername');
    Storage.remove('rememberMe');
    clearNotifications();
    setUser(null);
    showToast('Você saiu da conta');
  };

  if (!user) return null;

  // Nome que a plataforma chama a pessoa
  const displayName = user.nome_exibicao || user.name || user.nome || '';
  const nomeOficial = user.name || user.nome || '';
  const instrumento = user.instrument || user.instrumento_nome || '';

  // Stats formatados
  const taxa = stats ? `${Math.round(stats.percentual_frequencia)}%` : '—';
  const streak = stats ? `${stats.streak}` : '—';
  const mes = stats ? `${stats.ensaios_mes}/${stats.total_ensaios_mes}` : '—';

  const earnedIds = new Set((stats?.badges || []).map(b => b.id));
  const earnedDescMap = Object.fromEntries((stats?.badges || []).map(b => [b.id, b.descricao]));
  const getBadgeDescricao = (b) => earnedIds.has(b.id) ? (earnedDescMap[b.id] || b.descricao) : b.descricao;

  // Ordena: ganhas primeiro, depois não ganhas
  const badgesSorted = [
    ...BADGE_CATALOG.filter(b => earnedIds.has(b.id)),
    ...BADGE_CATALOG.filter(b => !earnedIds.has(b.id)),
  ];
  return (
    <div style={{ paddingBottom: '100px' }}>

      {/* ── Hero header (sempre escuro, branding) ─────────────────────── */}
      <div style={{
        background: 'linear-gradient(160deg, #3D0D10 0%, #5C1A1B 60%, #722F37 100%)',
        padding: '52px 24px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}>
        {/* Avatar */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              background: profilePhoto
                ? `url(${profilePhoto}) center/cover`
                : 'linear-gradient(145deg, #722F37 0%, #3D0D10 100%)',
              border: '3px solid #D4AF37',
              boxShadow: '0 0 0 3px rgba(212,175,55,0.2), 0 8px 24px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              fontWeight: '800',
              color: '#F4E4BC',
              cursor: 'pointer',
            }}
          >
            {!profilePhoto && displayName.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: 'absolute',
              bottom: 0, right: 0,
              width: '28px', height: '28px',
              borderRadius: '50%',
              background: '#D4AF37',
              border: '2px solid #3D0D10',
              color: '#3D0D10',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*"
            onChange={handlePhotoUpload} style={{ display: 'none' }} />
        </div>

        {/* Nome de exibição */}
        {isEditingNome ? (
          <input
            ref={nomeInputRef}
            value={editedNome}
            onChange={e => setEditedNome(e.target.value)}
            onBlur={handleSaveNome}
            onKeyDown={e => e.key === 'Enter' && handleSaveNome()}
            disabled={isSavingNome}
            placeholder={nomeOficial}
            style={{
              fontSize: '22px',
              fontWeight: '800',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(212,175,55,0.6)',
              borderRadius: '10px',
              padding: '4px 14px',
              color: '#fff',
              outline: 'none',
              marginBottom: '4px',
              width: '220px',
            }}
          />
        ) : (
          <button
            onClick={() => { setEditedNome(user.nome_exibicao || ''); setIsEditingNome(true); }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '4px',
              padding: 0,
            }}
          >
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff' }}>
              {displayName}
            </h2>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.5)" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}

        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', marginBottom: '10px' }}>
          {instrumento || 'Músico'}
        </p>

        {user.isAdmin && (
          <span style={{
            background: 'rgba(212,175,55,0.2)',
            color: '#D4AF37',
            fontSize: '10px',
            fontWeight: '700',
            padding: '3px 10px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            border: '1px solid rgba(212,175,55,0.3)',
          }}>Administrador</span>
        )}
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div style={{ padding: '16px 16px 0', display: 'flex', gap: '10px' }}>
        <StatCard value={loadingStats ? '…' : taxa} label="Assiduidade" accent animate={stats ? Math.round(stats.percentual_frequencia) : null} suffix="%" />
        <StatCard value={loadingStats ? '…' : streak} label="Sequência" animate={stats ? stats.streak : null} suffix="" />
        <StatCard value={loadingStats ? '…' : mes} label="Este mês" animate={stats ? stats.ensaios_mes : null} suffix={stats ? `/${stats.total_ensaios_mes}` : ''} />
      </div>

      {/* ── Badges ────────────────────────────────────────────────────── */}
      <SectionLabel>Conquistas</SectionLabel>

      {/* Primeiros 4 — sempre visíveis */}
      <div ref={firstBadgesRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '0 16px 0' }}>
        {badgesSorted.slice(0, 4).map(b => (
          <BadgeCard
            key={b.id}
            id={b.id}
            emoji={b.emoji}
            label={b.label}
            descricao={getBadgeDescricao(b)}
            earned={earnedIds.has(b.id)}
          />
        ))}
      </div>

      {/* Extras — container anima height 0↔auto, controlando entrada e saída */}
      <AnimatePresence initial={false}>
        {showAllBadges && (
          <motion.div
            key="extra-badges"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: {
              height: { type: 'spring', stiffness: 280, damping: 28 },
              opacity: { duration: 0.2 },
            }}}
            exit={{ height: 0, opacity: 0, transition: {
              height: { type: 'spring', stiffness: 280, damping: 28 },
              opacity: { duration: 0.15 },
            }}}
            style={{ overflow: 'hidden', padding: '0 16px' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '10px' }}>
              {badgesSorted.slice(4).map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, scale: 0.88, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22, delay: i * 0.07 }}
                >
                  <BadgeCard
                    id={b.id}
                    emoji={b.emoji}
                    label={b.label}
                    descricao={getBadgeDescricao(b)}
                    earned={earnedIds.has(b.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão expandir */}
      <motion.button
        onClick={() => setShowAllBadges(v => !v)}
        whileTap={{ scale: 0.97 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          margin: '10px 16px 0',
          padding: '10px 14px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          cursor: 'pointer',
          width: 'calc(100% - 32px)',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent)' }}>
          {showAllBadges
            ? 'Ver menos'
            : `Ver todas as ${BADGE_CATALOG.length} conquistas`}
        </span>
        <motion.svg
          width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="var(--accent)" strokeWidth="2.5"
          animate={{ rotate: showAllBadges ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </motion.button>

      {/* ── Conta ─────────────────────────────────────────────────────── */}
      <SectionLabel>Conta</SectionLabel>
      <SectionGroup>
        <SettingItem
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>}
          label="Alterar PIN"
          onClick={() => setShowChangePinModal(true)}
        />
      </SectionGroup>

      {/* ── Suporte ───────────────────────────────────────────────────── */}
      <SectionLabel>Suporte</SectionLabel>
      <SectionGroup>
        <SettingItem
          icon={<svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>}
          label="Falar com o desenvolvedor"
          value="Dúvidas e problemas técnicos"
          onClick={() => window.open('https://wa.me/5575981234176', '_blank')}
          iconBg="rgba(37,211,102,0.12)"
        />
      </SectionGroup>

      {/* ── Sobre ─────────────────────────────────────────────────────── */}
      <SectionLabel>Sobre</SectionLabel>
      <SectionGroup>
        <SettingItem
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>}
          label="Acervo Digital"
          value={`Versão ${PROFILE_ABOUT_CONFIG.infoCards[0].value} · Filarmônica 25 de Março`}
          onClick={() => setShowAboutModal(true)}
        />
      </SectionGroup>

      {/* ── Sair ──────────────────────────────────────────────────────── */}
      <div style={{ padding: '20px 16px 0' }}>
        <SectionGroup>
          <SettingItem
            icon={<Icons.Logout />}
            label="Sair da conta"
            onClick={handleLogout}
            danger
          />
        </SectionGroup>
      </div>

      {/* Modais */}
      {showChangePinModal && (
        <ChangePinModal onClose={() => setShowChangePinModal(false)} />
      )}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        subtitle={PROFILE_ABOUT_CONFIG.subtitle}
        maxWidth={PROFILE_ABOUT_CONFIG.maxWidth}
        infoCards={PROFILE_ABOUT_CONFIG.infoCards}
        changelog={PROFILE_CHANGELOG}
        legacyVersions={PROFILE_LEGACY_VERSIONS}
        footerText={PROFILE_ABOUT_CONFIG.footerText}
      />
    </div>
  );
};

export default ProfileScreen;
