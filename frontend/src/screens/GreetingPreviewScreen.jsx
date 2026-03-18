// ===== GREETING PREVIEW — apenas para visualização interna =====

import { useUI } from '@contexts/UIContext';

const FIRST_NAME = 'Antonio';

const icons = {
  manha: '☀️',
  tarde: '🌤️',
  noite: '🌙',
  madrugada: '⭐',
};

const scenarios = [
  // ── Dias de ensaio ──────────────────────────────────────
  { label: 'Ensaio · Manhã',      icon: icons.manha,    prefix: 'Bom dia,',        sub: 'Pronto para mais um dia de preparação?' },
  { label: 'Ensaio · Tarde',      icon: icons.tarde,    prefix: 'Boa tarde,',       sub: 'Vai ser um bom ensaio hoje, não vai?' },
  { label: 'Ensaio · Tarde 2',    icon: icons.tarde,    prefix: 'Boa tarde,',       sub: 'Animado para o ensaio de hoje?' },
  { label: 'Ensaio · Tarde 3',    icon: icons.tarde,    prefix: 'Boa tarde,',       sub: 'Que bom ter você no ensaio de hoje.' },
  // ── Manhã (sem ensaio) ──────────────────────────────────
  { label: 'Manhã · Seg',         icon: icons.manha,    prefix: 'Boa semana,',      sub: 'O que estudaremos hoje?' },
  { label: 'Manhã · Fim de sem.', icon: icons.manha,    prefix: 'Bom fim de semana,', sub: 'Que partituras explorar hoje?' },
  { label: 'Manhã · Normal 1',    icon: icons.manha,    prefix: 'Bom dia,',         sub: 'O que estudaremos hoje?' },
  { label: 'Manhã · Normal 2',    icon: icons.manha,    prefix: 'Bom dia,',         sub: 'Pronto pra mais um dia de música?' },
  { label: 'Manhã · Normal 3',    icon: icons.manha,    prefix: 'Bom dia,',         sub: 'Que partituras explorar hoje?' },
  // ── Tarde (sem ensaio) ──────────────────────────────────
  { label: 'Tarde · Sexta',       icon: icons.tarde,    prefix: 'Feliz sexta,',     sub: 'Que repertório vamos explorar?' },
  { label: 'Tarde · Normal 1',    icon: icons.tarde,    prefix: 'Boa tarde,',       sub: 'O que ensaiaremos hoje?' },
  { label: 'Tarde · Normal 2',    icon: icons.tarde,    prefix: 'Boa tarde,',       sub: 'Uma boa tarde para estudar música.' },
  { label: 'Tarde · Normal 3',    icon: icons.tarde,    prefix: 'Boa tarde,',       sub: 'Que partituras vamos ver hoje?' },
  // ── Noite ───────────────────────────────────────────────
  { label: 'Noite 1',             icon: icons.noite,    prefix: 'Boa noite,',       sub: 'Uma boa noite para estudar.' },
  { label: 'Noite 2',             icon: icons.noite,    prefix: 'Boa noite,',       sub: 'Que tal revisar o repertório?' },
  // ── Madrugada ───────────────────────────────────────────
  { label: 'Madrugada',           icon: icons.madrugada, prefix: 'Boa madrugada,', sub: 'Uma boa noite para estudar.' },
];

const GreetingCard = ({ scenario, isDark }) => (
  <div style={{
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
    borderRadius: '14px',
    padding: '16px 18px',
  }}>
    <p style={{
      fontSize: '10px', fontWeight: '600', letterSpacing: '1px',
      textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
      marginBottom: '10px',
    }}>
      {scenario.label}
    </p>

    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <div>
        <h2 style={{
          fontSize: '22px', fontWeight: '800', letterSpacing: '-0.4px',
          color: isDark ? '#FFFFFF' : '#1a1a1a',
          margin: '0 0 4px', lineHeight: 1.2,
        }}>
          {scenario.prefix}{' '}
          <span className="liquid-metal-name">{FIRST_NAME}.</span>
        </h2>
        <p style={{
          fontSize: '14px', fontWeight: '400',
          color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(26,26,26,0.48)',
          margin: 0, lineHeight: 1.4,
        }}>
          {scenario.sub}
        </p>
      </div>
      <span style={{
        fontSize: '44px', lineHeight: 1, flexShrink: 0,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
        userSelect: 'none',
      }}>
        {scenario.icon}
      </span>
    </div>
  </div>
);

const GreetingPreviewScreen = () => {
  const { theme } = useUI();
  const isDark = theme === 'dark';

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#0f0f0f' : '#f5f5f5',
      padding: '32px 20px',
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <p style={{
          fontSize: '10px', fontWeight: '700', letterSpacing: '2px',
          textTransform: 'uppercase', color: '#D4AF37', marginBottom: '6px',
        }}>
          Preview interno
        </p>
        <h1 style={{
          fontSize: '22px', fontWeight: '800',
          color: isDark ? '#fff' : '#1a1a1a',
          marginBottom: '28px',
        }}>
          Todas as saudações
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {scenarios.map((s, i) => (
            <GreetingCard key={i} scenario={s} isDark={isDark} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GreetingPreviewScreen;
