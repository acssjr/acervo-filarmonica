// ===== LOGIN BACKGROUND COMPONENT =====
// Background decorativo com imagem e overlay do login

const LoginBackground = () => {
  return (
    <>
      {/* Background com imagem e overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `
          linear-gradient(135deg, rgba(61, 21, 24, 0.92) 0%, rgba(92, 26, 27, 0.88) 50%, rgba(61, 21, 24, 0.92) 100%),
          url('/assets/images/banda/foto-banda-sao-goncalo.webp')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.9)',
        zIndex: -2
      }} />

      {/* Padrao decorativo sutil */}
      <div style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        pointerEvents: 'none',
        zIndex: -1
      }} />
    </>
  );
};

export default LoginBackground;
