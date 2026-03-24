// ===== HOME HEADER =====
// Header com saudação contextual + countdown

import { useState, useEffect, useMemo } from 'react';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { getNextRehearsal } from '@utils/rehearsal';
import { useMediaQuery } from '@hooks/useMediaQuery';
import HeaderActions from './HeaderActions';
import LogoBadge from './LogoBadge';

// ── Saudação contextual em duas linhas ────────────────────────────────
const getGreetingParts = (firstName, diasEnsaio, repertorioAtivo) => {
  const now = new Date();
  const h = now.getHours();
  const day = now.getDay(); // 0=Dom … 6=Sab
  const d = now.getDate(); // índice rotativo para sub-mensagens

  // Detecta se hoje é dia de apresentação
  const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const isApresentacaoDay = repertorioAtivo?.data_apresentacao === todayStr;
  const isRehearsalDay = !isApresentacaoDay && diasEnsaio?.dias?.includes(day);

  // Ícone 3D por período
  let icon;
  if (h >= 5 && h < 12) icon = '☀️';
  else if (h >= 12 && h < 18) icon = '🌤️';
  else if (h >= 18 && h < 23) icon = '🌙';
  else icon = '⭐';

  // Linha 1 — prefixo da saudação
  let greetingPrefix;
  if (h >= 5 && h < 12) {
    if (day === 1) greetingPrefix = 'Boa semana,';
    else if (day === 0 || day === 6) greetingPrefix = 'Bom fim de semana,';
    else greetingPrefix = 'Bom dia,';
  } else if (h >= 12 && h < 18) {
    if (day === 5) greetingPrefix = 'Feliz sexta,';
    else greetingPrefix = 'Boa tarde,';
  } else if (h >= 18 && h < 23) {
    greetingPrefix = 'Boa noite,';
  } else {
    greetingPrefix = 'Boa madrugada,';
  }

  // Linha 2 — sub-mensagem contextual
  let line2;
  if (isApresentacaoDay) {
    // Dia de apresentação — mensagens especiais
    const msgs = [
      'Hoje é o grande dia.',
      'Dia de fazer bonito.',
      'Que tal uma última revisada?',
      'É hora de brilhar.',
      'Hoje é o dia.',
    ];
    line2 = msgs[d % msgs.length];
  } else if (isRehearsalDay) {
    const msgs = [
      'Pronto para mais um dia de preparação?',
      'Vai ser um bom ensaio hoje, não vai?',
      'Animado para o ensaio de hoje?',
      'Que bom ter você no ensaio de hoje.',
    ];
    line2 = msgs[d % msgs.length];
  } else if (h >= 5 && h < 12) {
    const msgs = [
      'O que estudaremos hoje?',
      'Que partituras explorar hoje?',
      'Que repertório vamos explorar?',
    ];
    line2 = msgs[d % msgs.length];
  } else if (h >= 12 && h < 18) {
    const msgs = [
      'O que ensaiaremos hoje?',
      'Uma boa tarde para estudar música.',
      'Que partituras vamos ver hoje?',
    ];
    line2 = msgs[d % msgs.length];
  } else {
    const msgs = [
      'Uma boa noite para estudar.',
      'Que tal revisar o repertório?',
    ];
    line2 = msgs[d % msgs.length];
  }

  return { icon, greetingPrefix, line2 };
};

// Calcula a data/hora exata do próximo ensaio para ter segundos precisos
const computeNextRehearsalDate = (dias, hora) => {
  const now = new Date();
  const today = now.getDay();
  let minDaysAhead = 8;

  for (const dia of dias) {
    let daysAhead = (dia - today + 7) % 7;
    if (daysAhead === 0 && now.getHours() >= hora) daysAhead = 7;
    if (daysAhead < minDaysAhead) minDaysAhead = daysAhead;
  }

  const target = new Date(now);
  target.setDate(now.getDate() + minDaysAhead);
  target.setHours(hora, 0, 0, 0);
  return target;
};

const CountdownBlock = ({ value, label, isDark }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 11px' }}>
    <span style={{
      fontSize: '18px', fontWeight: '800', lineHeight: 1,
      color: isDark ? '#D4AF37' : '#8B6914', fontVariantNumeric: 'tabular-nums',
    }}>
      {String(value).padStart(2, '0')}
    </span>
    <span style={{
      fontSize: '7px', fontWeight: '600', letterSpacing: '0.9px',
      color: isDark ? 'rgba(212,175,55,0.55)' : 'rgba(139,105,20,0.7)',
      marginTop: '3px', textTransform: 'uppercase',
    }}>
      {label}
    </span>
  </div>
);

const BlockDivider = ({ isDark }) => (
  <div style={{
    width: '1px', alignSelf: 'stretch',
    background: isDark ? 'rgba(212,175,55,0.2)' : 'rgba(139,105,20,0.25)',
    margin: '5px 0'
  }} />
);

// Pill liquid glass — contador de ensaio
const pillStyle = (isDark) => ({
  display: 'inline-flex', alignItems: 'center',
  borderRadius: '14px',
  background: isDark
    ? 'linear-gradient(135deg, rgba(212,175,55,0.13) 0%, rgba(212,175,55,0.06) 100%)'
    : 'linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.08) 100%)',
  border: `1px solid ${isDark ? 'rgba(212,175,55,0.25)' : 'rgba(139,105,20,0.35)'}`,
  backdropFilter: 'blur(16px) saturate(180%)',
  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
  boxShadow: isDark
    ? '0 4px 16px rgba(212,175,55,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
    : '0 4px 16px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
  overflow: 'hidden',
});

// Retorna {date, isApresentacao} com o próximo evento relevante
const getNextEvent = (diasEnsaio, repertorioAtivo) => {
  const hora = typeof diasEnsaio.hora === 'number' ? diasEnsaio.hora : parseInt(diasEnsaio.hora, 10);
  const now = new Date();

  // Verifica se há apresentação futura no repertório ativo
  if (repertorioAtivo?.data_apresentacao) {
    const [y, m, d] = repertorioAtivo.data_apresentacao.split('-').map(Number);
    const apresentacaoDate = new Date(y, m - 1, d, hora, 0, 0, 0);
    if (apresentacaoDate > now) {
      return { date: apresentacaoDate, isApresentacao: true, nome: repertorioAtivo.nome };
    }
  }

  // Fallback: próximo ensaio regular
  return { date: computeNextRehearsalDate(diasEnsaio.dias, hora), isApresentacao: false };
};

const HomeHeader = ({ userName, actions }) => {
  const { theme } = useUI();
  const isDark = theme === 'dark';
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { diasEnsaio, modoRecesso, repertorioAtivo } = useData();

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const nextEvent = useMemo(
    () => getNextEvent(diasEnsaio, repertorioAtivo),
    [diasEnsaio, repertorioAtivo]
  );

  const countdown = useMemo(() => {
    const diff = Math.max(0, nextEvent.date - Date.now());
    const totalSec = Math.floor(diff / 1000);
    return {
      days: Math.floor(totalSec / 86400),
      hours: Math.floor((totalSec % 86400) / 3600),
      minutes: Math.floor((totalSec % 3600) / 60),
      seconds: totalSec % 60,
    };
  }, [nextEvent.date, tick]); // eslint-disable-line react-hooks/exhaustive-deps

  const rehearsalInfo = useMemo(
    () => getNextRehearsal(diasEnsaio.dias, diasEnsaio.hora),
    [diasEnsaio]
  );

  const firstName = useMemo(() => (userName || '').split(' ')[0], [userName]);
  const { icon, greetingPrefix, line2 } = useMemo(() => getGreetingParts(firstName, diasEnsaio, repertorioAtivo), [firstName, diasEnsaio, repertorioAtivo]);

  const mutedColor = isDark ? 'var(--text-muted)' : 'rgba(0,0,0,0.45)';
  const goldLabel = isDark ? '#D4AF37' : '#8B6914';

  return (
    <>
      {/* Header institucional — apenas mobile */}
      {!isDesktop && (
        <div style={{
          background: 'linear-gradient(135deg, #722F37 0%, #5C1A1B 100%)',
          padding: '14px 20px 18px',
          paddingTop: 'max(env(safe-area-inset-top), 14px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LogoBadge size={38} variant="dark" />
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#F4E4BC', marginBottom: '1px', lineHeight: '1.2' }}>
                S.F. 25 de Março
              </h2>
              <p style={{ fontSize: '9px', fontWeight: '600', color: '#D4AF37', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Acervo Digital
              </p>
            </div>
          </div>
          <HeaderActions inDarkHeader={true} />
        </div>
      )}

      {/* Header de saudação */}
      <header style={{
        padding: isDesktop ? '0 0 16px' : '16px 20px 12px',
        paddingTop: isDesktop ? '0' : '16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div style={{ flex: 1 }}>

          {/* Saudação — texto + ícone 3D colado à direita */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <div>
              <h1 style={{
                fontSize: '22px', fontWeight: '800', letterSpacing: '-0.4px',
                color: isDark ? '#FFFFFF' : '#1a1a1a',
                margin: '0 0 4px', lineHeight: 1.2,
              }}>
                {greetingPrefix}{' '}
                <span className="liquid-metal-name">{firstName}.</span>
              </h1>
              <p style={{
                fontSize: '14px', fontWeight: '400',
                color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(26,26,26,0.48)',
                margin: 0, lineHeight: 1.4,
              }}>
                {line2}
              </p>
            </div>
            <span style={{
              fontSize: '48px', lineHeight: 1, flexShrink: 0,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.18))',
              userSelect: 'none',
            }}>
              {icon}
            </span>
          </div>

          {/* Countdown / status — apenas mobile */}
          {!isDesktop && (modoRecesso ? (
            <div style={{ marginTop: '8px' }}>
              <div style={{
                display: 'inline-block', background: '#D4AF37', color: '#3D1518',
                fontSize: '10px', fontWeight: '700', padding: '5px 10px',
                borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>
                EM RECESSO
              </div>
            </div>
          ) : rehearsalInfo.isNow ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22C55E', animation: 'pulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#22C55E' }}>
                Ensaio acontecendo agora!
              </span>
            </div>
          ) : (
            /* Countdown — alinhado à esquerda */
            <div style={{ marginTop: '10px' }}>

              {/* Dia do evento (days===0) */}
              {countdown.days === 0 ? (
                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                  {nextEvent.isApresentacao && (
                    <p style={{
                      fontSize: '14px', fontWeight: '800', letterSpacing: '0.3px',
                      textTransform: 'uppercase', color: goldLabel,
                      margin: '0 0 8px', lineHeight: 1.3,
                    }}>
                      {nextEvent.nome}
                    </p>
                  )}
                  {!nextEvent.isApresentacao && (
                    <p style={{
                      fontSize: '9px', fontWeight: '700', letterSpacing: '1.4px',
                      textTransform: 'uppercase', color: mutedColor,
                      margin: '0 0 8px', lineHeight: 1.4,
                    }}>
                      Ensaio iniciando em
                    </p>
                  )}
                  <div style={pillStyle(isDark)}>
                    <CountdownBlock value={countdown.hours} label="Horas" isDark={isDark} />
                    <BlockDivider isDark={isDark} />
                    <CountdownBlock value={countdown.minutes} label="Min" isDark={isDark} />
                    <BlockDivider isDark={isDark} />
                    <CountdownBlock value={countdown.seconds} label="Seg" isDark={isDark} />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                  {!nextEvent.isApresentacao && (
                    <p style={{
                      fontSize: '9px', fontWeight: '700', letterSpacing: '1.2px',
                      textTransform: 'uppercase', color: mutedColor,
                      margin: 0, lineHeight: 1.4,
                    }}>
                      Próximo ensaio
                    </p>
                  )}
                  <p style={{
                    fontSize: nextEvent.isApresentacao ? '14px' : '12px', fontWeight: '800',
                    letterSpacing: nextEvent.isApresentacao ? '0.3px' : '0.3px',
                    textTransform: 'uppercase', color: goldLabel,
                    margin: nextEvent.isApresentacao ? '0 0 6px' : '1px 0', lineHeight: 1.3,
                  }}>
                    {nextEvent.isApresentacao ? nextEvent.nome : rehearsalInfo.dayName}
                  </p>
                  <p style={{
                    fontSize: '9px', fontWeight: '700', letterSpacing: '1.2px',
                    textTransform: 'uppercase', color: mutedColor,
                    margin: '0 0 8px', lineHeight: 1.4,
                  }}>
                    Iniciando em
                  </p>
                  <div style={pillStyle(isDark)}>
                    {countdown.days > 0 ? (
                      <>
                        <CountdownBlock value={countdown.days} label="Dias" isDark={isDark} />
                        <BlockDivider isDark={isDark} />
                        <CountdownBlock value={countdown.hours} label="Horas" isDark={isDark} />
                        <BlockDivider isDark={isDark} />
                        <CountdownBlock value={countdown.minutes} label="Min" isDark={isDark} />
                      </>
                    ) : (
                      <>
                        <CountdownBlock value={countdown.hours} label="Horas" isDark={isDark} />
                        <BlockDivider isDark={isDark} />
                        <CountdownBlock value={countdown.minutes} label="Min" isDark={isDark} />
                        <BlockDivider isDark={isDark} />
                        <CountdownBlock value={countdown.seconds} label="Seg" isDark={isDark} />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {isDesktop && actions && <div style={{ display: 'flex', gap: '10px' }}>{actions}</div>}
      </header>
    </>
  );
};

export default HomeHeader;
