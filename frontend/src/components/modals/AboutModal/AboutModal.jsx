// ===== ABOUT MODAL =====
// Modal "Sobre" reutilizavel para ProfileScreen e AdminConfig

import PropTypes from 'prop-types';
import useAnimatedVisibility from '@hooks/useAnimatedVisibility';

const AboutModal = ({
  isOpen,
  onClose,
  subtitle,
  maxWidth = 420,
  infoCards = [],
  changelog = [],
  legacyVersions = null,
  footerText
}) => {
  const { shouldRender, isExiting } = useAnimatedVisibility(isOpen, 200);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        padding: '20px',
        animation: isExiting
          ? 'modalBackdropOut 0.2s ease forwards'
          : 'modalBackdropIn 0.2s ease'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-primary)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: `${maxWidth}px`,
          maxHeight: '85vh',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: isExiting
            ? 'modalScaleOut 0.2s ease forwards'
            : 'modalScaleIn 0.25s ease'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '24px 24px 0', textAlign: 'center', flexShrink: 0 }}>
          {/* Logo */}
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '18px',
            background: 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            padding: '10px'
          }}>
            <img
              src="/assets/images/ui/brasao-256x256.png"
              alt="Brasao"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          <h3 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '18px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '2px'
          }}>Acervo Digital</h3>

          <p style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '13px',
            color: 'var(--text-muted)',
            marginBottom: '16px'
          }}>{subtitle}</p>

          {/* Info cards */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            textAlign: 'left'
          }}>
            {infoCards.map((card, index) => (
              <div key={index}>
                <p style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  marginBottom: '2px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>{card.label}</p>
                <p style={{
                  fontSize: '13px',
                  fontWeight: card.isHighlighted ? '600' : '500',
                  color: card.isHighlighted ? 'var(--primary)' : 'var(--text-primary)'
                }}>{card.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Changelog scrollavel */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 24px',
          WebkitOverflowScrolling: 'touch'
        }}>
          <p style={{
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '12px'
          }}>Histórico de Atualizações</p>

          {changelog.map((version, vIndex) => (
            <div key={vIndex} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{
                  background: version.isCurrent ? 'var(--primary)' : 'var(--bg-card)',
                  color: version.isCurrent ? '#fff' : 'var(--text-primary)',
                  fontSize: '11px',
                  fontWeight: version.isCurrent ? '700' : '600',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: version.isCurrent ? 'none' : '1px solid var(--border)'
                }}>{version.version}</span>
                {version.isCurrent && (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Atual</span>
                )}
              </div>
              <ul style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                paddingLeft: '16px',
                margin: 0
              }}>
                {version.items.map((item, iIndex) => (
                  <li key={iIndex} style={{ marginBottom: iIndex < version.items.length - 1 ? '4px' : 0 }}>
                    {item.bold && <strong>{item.bold}</strong>} {item.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Versoes antigas colapsadas */}
          {legacyVersions && Object.keys(legacyVersions).length > 0 && (
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '8px'
            }}>
              <p style={{
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>Versões anteriores</p>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {Object.entries(legacyVersions).map(([ver, desc], index) => (
                  <span key={ver}>
                    {index > 0 && ' • '}
                    <strong>{ver}</strong> {desc}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px 24px', flexShrink: 0 }}>
          <p style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginBottom: '12px'
          }}>{footerText}</p>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--primary)',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

AboutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  subtitle: PropTypes.string.isRequired,
  maxWidth: PropTypes.number,
  infoCards: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    isHighlighted: PropTypes.bool
  })),
  changelog: PropTypes.arrayOf(PropTypes.shape({
    version: PropTypes.string.isRequired,
    isCurrent: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape({
      bold: PropTypes.string,
      text: PropTypes.string.isRequired
    })).isRequired
  })),
  legacyVersions: PropTypes.object,
  footerText: PropTypes.string.isRequired
};

export default AboutModal;
