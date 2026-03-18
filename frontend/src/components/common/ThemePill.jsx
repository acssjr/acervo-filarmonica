// ===== THEME PILL =====
// Toggle 3-segmentos: Claro / Sistema / Escuro
// Indicador deslizante com spring animation — dark premium glass sem azul

import { useUI } from '@contexts/UIContext';
import { Icons } from '@constants/icons';

const MODES = ['light', 'system', 'dark'];
const LABELS = ['Claro', 'Sistema', 'Escuro'];
const THEME_ICONS = [
  () => <Icons.Sun />,
  () => <Icons.Monitor />,
  () => <Icons.Moon />,
];

const ThemePill = () => {
  const { themeMode, setThemeMode, theme } = useUI();
  const isDarkResolved = theme === 'dark';
  const activeIndex = Math.max(0, MODES.indexOf(themeMode));

  // ── Dark: vidro escuro premium, tinte vinho — contraste contra fundo escuro ──
  const pillStyleDark = {
    background: 'linear-gradient(145deg, rgba(55,18,22,0.72) 0%, rgba(22,6,8,0.88) 100%)',
    boxShadow: [
      'inset 0 1.5px 0 rgba(255,255,255,0.1)',
      'inset 0 -1px 0 rgba(0,0,0,0.5)',
      '0 6px 20px rgba(0,0,0,0.55)',
      '0 1px 4px rgba(0,0,0,0.4)',
    ].join(', '),
    border: '1px solid rgba(255,255,255,0.13)',
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
  };

  const activeBubbleDark = {
    background: 'linear-gradient(145deg, rgba(120,40,48,0.75) 0%, rgba(70,18,22,0.9) 100%)',
    boxShadow: [
      'inset 0 1px 0 rgba(255,255,255,0.14)',
      'inset 0 -1px 0 rgba(0,0,0,0.4)',
      '0 3px 10px rgba(0,0,0,0.5)',
    ].join(', '),
    border: '1px solid rgba(212,175,55,0.2)',
  };

  // ── Light: neumórfico clássico ──
  const pillStyleLight = {
    background: 'linear-gradient(145deg, #d4d8de 0%, #edf0f5 100%)',
    boxShadow: [
      '5px 5px 12px rgba(0,0,0,0.14)',
      '-4px -4px 10px rgba(255,255,255,0.95)',
      'inset 0 1px 0 rgba(255,255,255,0.5)',
    ].join(', '),
    border: '1px solid rgba(0,0,0,0.05)',
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',
  };

  const activeBubbleLight = {
    background: 'linear-gradient(145deg, #ffffff 0%, #f2f4f8 100%)',
    boxShadow: [
      '2px 2px 6px rgba(0,0,0,0.12)',
      '-1px -1px 4px rgba(255,255,255,0.95)',
      'inset 0 1px 0 rgba(255,255,255,0.8)',
    ].join(', '),
    border: '0.5px solid rgba(0,0,0,0.06)',
  };

  const containerStyle = isDarkResolved ? pillStyleDark : pillStyleLight;
  const bubbleStyle = isDarkResolved ? activeBubbleDark : activeBubbleLight;

  return (
    <div
      role="group"
      aria-label={`Tema: ${LABELS[activeIndex]}`}
      title={`Tema: ${LABELS[activeIndex]}`}
      style={{
        width: '96px',
        height: '36px',
        borderRadius: '999px',
        position: 'relative',
        display: 'flex',
        padding: '4px',
        flexShrink: 0,
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
        ...containerStyle,
      }}
    >
      {/* Indicador deslizante */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '4px',
          left: '4px',
          width: 'calc((100% - 8px) / 3)',
          height: 'calc(100% - 8px)',
          borderRadius: '999px',
          transform: `translateX(calc(${activeIndex} * 100%))`,
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.3s ease',
          zIndex: 0,
          pointerEvents: 'none',
          ...bubbleStyle,
        }}
      />

      {/* Segmentos */}
      {MODES.map((mode, i) => {
        const Icon = THEME_ICONS[i];
        const isActive = activeIndex === i;
        return (
          <button
            key={mode}
            onClick={() => setThemeMode(mode)}
            aria-label={`Tema ${LABELS[i]}`}
            aria-pressed={isActive}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              borderRadius: '999px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 1,
              transition: 'opacity 0.2s ease, color 0.2s ease',
              color: isActive
                ? (isDarkResolved ? 'rgba(255,255,255,0.92)' : 'rgba(114,47,55,0.9)')
                : (isDarkResolved ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.28)'),
            }}
          >
            <div style={{ width: '14px', height: '14px' }}><Icon /></div>
          </button>
        );
      })}
    </div>
  );
};

export default ThemePill;
