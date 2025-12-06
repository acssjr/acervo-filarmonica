// ===== SIDEBAR LOGO =====
// Logo da sidebar com estados colapsado/expandido

const SidebarLogo = ({ collapsed }) => {
  if (collapsed) {
    return (
      <div style={{
        textAlign: 'center',
        width: '40px',
        height: '40px',
        margin: '0 auto',
        background: 'rgba(244, 228, 188, 0.15)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid rgba(244, 228, 188, 0.3)',
        overflow: 'hidden',
        padding: '4px'
      }}>
        <img
          src="/assets/images/ui/brasao-256x256.png"
          alt="Brasao"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'rgba(244, 228, 188, 0.15)',
        border: '2px solid rgba(244, 228, 188, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
        padding: '5px'
      }}>
        <img
          src="/assets/images/ui/brasao-256x256.png"
          alt="Brasao"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
      <div>
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '15px',
          fontWeight: '700',
          color: '#F4E4BC',
          marginBottom: '1px',
          lineHeight: '1.2'
        }}>
          S.F. 25 de Marco
        </h1>
        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
          Feira de Santana - BA
        </p>
        <p style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '9px',
          fontWeight: '600',
          color: '#D4AF37',
          letterSpacing: '1.5px',
          textTransform: 'uppercase'
        }}>
          Acervo Digital
        </p>
      </div>
    </div>
  );
};

export default SidebarLogo;
