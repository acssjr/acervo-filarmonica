// ===== LOGIN HEADER COMPONENT =====
// Cabeçalho do login com logo, título e badge de status

const LoginHeader = () => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
      {/* Logo — sem círculo, direto com sombra suave */}
      <div style={{
        width: '72px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 14px',
        filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5)) drop-shadow(0 0 12px rgba(212,175,55,0.25))'
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

      {/* Título principal */}
      <h1 style={{
        fontSize: '30px',
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: '14px',
        letterSpacing: '-0.5px',
        lineHeight: 1.1,
        textShadow: '0 2px 12px rgba(0,0,0,0.4)'
      }}>
        Acervo Digital
      </h1>

      {/* Status badge — liquid glass inspirado no bottom nav */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 14px',
        background: 'linear-gradient(135deg, rgba(34,197,94,0.18) 0%, rgba(20,120,56,0.12) 100%)',
        backdropFilter: 'blur(16px) saturate(160%)',
        WebkitBackdropFilter: 'blur(16px) saturate(160%)',
        borderRadius: '20px',
        borderTop: '1px solid rgba(34,197,94,0.35)',
        borderLeft: '1px solid rgba(34,197,94,0.2)',
        borderRight: '1px solid rgba(0,0,0,0.25)',
        borderBottom: '1px solid rgba(0,0,0,0.3)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(34,197,94,0.25), inset 0 -1px 1px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: '#22C55E',
          boxShadow: '0 0 6px rgba(34,197,94,0.7)',
          animation: 'pulse 2s ease-in-out infinite'
        }} />
        <span style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#4ADE80',
          textTransform: 'uppercase',
          letterSpacing: '0.6px'
        }}>Sistema Online</span>
      </div>
    </div>
  );
};

export default LoginHeader;
