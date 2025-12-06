// ===== EMPTY STATE =====
// Componente reutilizavel para estados vazios

import PropTypes from 'prop-types';

const SIZES = {
  small: { icon: 48, title: 14, subtitle: 12, padding: '30px 20px', iconOpacity: 0.4 },
  default: { icon: 64, title: 15, subtitle: 13, padding: '60px 40px', iconOpacity: 0.3 },
  large: { icon: 80, title: 16, subtitle: 14, padding: '80px 40px', iconOpacity: 0.2 }
};

const EmptyState = ({ icon: Icon, title, subtitle, size = 'default' }) => {
  const s = SIZES[size] || SIZES.default;

  return (
    <div style={{
      textAlign: 'center',
      padding: s.padding,
      color: 'var(--text-muted)',
      animation: 'fadeIn 0.3s ease'
    }}>
      {Icon && (
        <div style={{
          width: `${s.icon}px`,
          height: `${s.icon}px`,
          margin: '0 auto 16px',
          opacity: s.iconOpacity,
          color: 'var(--primary)'
        }}>
          <Icon />
        </div>
      )}
      {title && (
        <p style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: `${s.title}px`,
          marginBottom: subtitle ? '8px' : 0
        }}>
          {title}
        </p>
      )}
      {subtitle && (
        <p style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: `${s.subtitle}px`,
          opacity: 0.7
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  size: PropTypes.oneOf(['small', 'default', 'large'])
};

export default EmptyState;
