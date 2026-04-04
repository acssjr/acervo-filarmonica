import { useMemo } from 'react';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { useMediaQuery } from '@hooks/useMediaQuery';
import HeaderActions from './HeaderActions';
import LogoBadge from './LogoBadge';
import MusicianCountdown from './MusicianCountdown';

const getGreetingParts = (diasEnsaio, repertorioAtivo) => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  const dayIndex = now.getDate();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const isPresentationDay = repertorioAtivo?.data_apresentacao === today;
  const isRehearsalDay = !isPresentationDay && diasEnsaio?.dias?.includes(day);

  let icon;
  if (hour >= 5 && hour < 12) icon = '☀️';
  else if (hour >= 12 && hour < 18) icon = '🌤️';
  else if (hour >= 18 && hour < 23) icon = '🌙';
  else icon = '⭐';

  let greetingPrefix;
  if (hour >= 5 && hour < 12) {
    if (day === 1) greetingPrefix = 'Boa semana,';
    else if (day === 0 || day === 6) greetingPrefix = 'Bom fim de semana,';
    else greetingPrefix = 'Bom dia,';
  } else if (hour >= 12 && hour < 18) {
    greetingPrefix = day === 5 ? 'Feliz sexta,' : 'Boa tarde,';
  } else if (hour >= 18 && hour < 23) {
    greetingPrefix = 'Boa noite,';
  } else {
    greetingPrefix = 'Boa madrugada,';
  }

  let line2;
  if (isPresentationDay) {
    const messages = [
      'Hoje é o grande dia.',
      'Dia de fazer bonito.',
      'Que tal uma última revisada?',
      'É hora de brilhar.',
      'Hoje é o dia.'
    ];
    line2 = messages[dayIndex % messages.length];
  } else if (isRehearsalDay) {
    const messages = [
      'Pronto para mais um dia de preparação?',
      'Vai ser um bom ensaio hoje, não vai?',
      'Animado para o ensaio de hoje?',
      'Que bom ter você no ensaio de hoje.'
    ];
    line2 = messages[dayIndex % messages.length];
  } else if (hour >= 5 && hour < 12) {
    const messages = [
      'O que estudaremos hoje?',
      'Que partituras explorar hoje?',
      'Que repertório vamos explorar?'
    ];
    line2 = messages[dayIndex % messages.length];
  } else if (hour >= 12 && hour < 18) {
    const messages = [
      'O que ensaiaremos hoje?',
      'Uma boa tarde para estudar música.',
      'Que partituras vamos ver hoje?'
    ];
    line2 = messages[dayIndex % messages.length];
  } else {
    const messages = [
      'Uma boa noite para estudar.',
      'Que tal revisar o repertório?'
    ];
    line2 = messages[dayIndex % messages.length];
  }

  return { icon, greetingPrefix, line2 };
};

const HomeHeader = ({ userName, actions }) => {
  const { theme } = useUI();
  const isDark = theme === 'dark';
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { diasEnsaio, modoRecesso, repertorioAtivo } = useData();

  const firstName = useMemo(() => (userName || '').split(' ')[0], [userName]);
  const { icon, greetingPrefix, line2 } = useMemo(
    () => getGreetingParts(diasEnsaio, repertorioAtivo),
    [diasEnsaio, repertorioAtivo]
  );

  return (
    <>
      {!isDesktop && (
        <div
          style={{
            background: 'linear-gradient(135deg, #722F37 0%, #5C1A1B 100%)',
            padding: '14px 20px 18px',
            paddingTop: 'max(env(safe-area-inset-top), 14px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LogoBadge size={38} variant="dark" />
            <div>
              <h2
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#F4E4BC',
                  marginBottom: '1px',
                  lineHeight: '1.2'
                }}
              >
                S.F. 25 de Março
              </h2>
              <p
                style={{
                  fontSize: '9px',
                  fontWeight: '600',
                  color: '#D4AF37',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
              >
                Acervo Digital
              </p>
            </div>
          </div>
          <HeaderActions inDarkHeader />
        </div>
      )}

      <header
        style={{
          padding: isDesktop ? '0 0 16px' : '16px 20px 12px',
          paddingTop: isDesktop ? '0' : '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <div>
              <h1
                style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  letterSpacing: '-0.4px',
                  color: isDark ? '#FFFFFF' : '#1a1a1a',
                  margin: '0 0 4px',
                  lineHeight: 1.2
                }}
              >
                {greetingPrefix}{' '}
                <span className="liquid-metal-name">{firstName}.</span>
              </h1>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '400',
                  color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(26,26,26,0.48)',
                  margin: 0,
                  lineHeight: 1.4
                }}
              >
                {line2}
              </p>
            </div>
            <span
              style={{
                fontSize: '48px',
                lineHeight: 1,
                flexShrink: 0,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.18))',
                userSelect: 'none'
              }}
            >
              {icon}
            </span>
          </div>

          {!isDesktop && (
            <MusicianCountdown
              diasEnsaio={diasEnsaio}
              repertorioAtivo={repertorioAtivo}
              modoRecesso={modoRecesso}
              isDark={isDark}
              variant="mobile"
            />
          )}
        </div>

        {isDesktop && actions && <div style={{ display: 'flex', gap: '10px' }}>{actions}</div>}
      </header>
    </>
  );
};

export default HomeHeader;
