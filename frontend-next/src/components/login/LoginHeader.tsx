"use client";

// ===== LOGIN HEADER COMPONENT =====
// Cabecalho do login com logo, titulo e badge de status

const LoginHeader = () => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
      {/* Logo */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
        border: '2px solid rgba(212, 175, 55, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
        boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)',
        overflow: 'hidden',
        padding: '8px'
      }}>
        <img
          src="/assets/images/ui/brasao-256x256.png"
          alt="Brasão Filarmônica 25 de Março"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      <h1 style={{
        fontFamily: 'Outfit, sans-serif',
        fontSize: '24px',
        fontWeight: '700',
        color: '#F4E4BC',
        marginBottom: '4px'
      }}>
        Acervo Digital
      </h1>

      <p style={{
        fontFamily: 'Outfit, sans-serif',
        fontSize: '14px',
        color: 'rgba(244, 228, 188, 0.6)'
      }}>
        S.F. 25 de Março - Feira de Santana
      </p>

      {/* Status badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        marginTop: '12px',
        padding: '6px 12px',
        background: 'rgba(34, 197, 94, 0.15)',
        borderRadius: '20px',
        border: '1px solid rgba(34, 197, 94, 0.3)'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#22C55E',
          animation: 'pulse 2s ease-in-out infinite'
        }} />
        <span style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '11px',
          fontWeight: '600',
          color: '#22C55E',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>Sistema Online</span>
      </div>
    </div>
  );
};

export default LoginHeader;
