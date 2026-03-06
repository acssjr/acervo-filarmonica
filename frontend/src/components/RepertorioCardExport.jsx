import React from 'react';

const CATEGORY_SINGULAR = {
  'Dobrados': 'Dobrado',
  'Marchas': 'Marcha',
  'Fantasias': 'Fantasia',
  'Boleros': 'Bolero',
  'Valsas': 'Valsa',
  'Hinos': 'Hino',
  'Marchas Religiosas': 'Marcha Religiosa',
  'Serenatas': 'Serenata',
  'Polcas': 'Polca',
  'Schottisches': 'Schottisch',
};

function formatSongTitle(partitura) {
  const { titulo, categoria_nome } = partitura;
  if (categoria_nome === 'Arranjos') return titulo;
  const singular = CATEGORY_SINGULAR[categoria_nome];
  if (!singular) return titulo;
  if (titulo.startsWith(singular)) return titulo;
  return `${singular} ${titulo}`;
}

function formatComposer(partitura) {
  const { compositor, arranjador } = partitura;
  if (arranjador) return `${compositor} (Arr. ${arranjador})`;
  return compositor || '';
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString + 'T12:00:00');
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function parseEventName(nome) {
  if (!nome) return { before: '', sep: '', after: '' };
  const idx = nome.indexOf(' — ');
  if (idx === -1) return { before: nome, sep: '', after: '' };
  return {
    before: nome.slice(0, idx),
    sep: ' — ',
    after: nome.slice(idx + 3),
  };
}

const RepertorioCardExport = React.forwardRef(function RepertorioCardExport({ repertorio }, ref) {
  const partituras = repertorio?.partituras || [];
  const { before, sep, after } = parseEventName(repertorio?.nome);
  const dateStr = formatDate(repertorio?.data_apresentacao);

  const W = 1080;
  const H = 1350;
  const PX = 72; // horizontal padding
  const PT = 60; // top padding
  const PB = 52; // bottom padding

  return (
    <div
      ref={ref}
      style={{
        width: W,
        height: H,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: 'linear-gradient(158deg, #8B3A44 0%, #5C1A1B 45%, #3D1518 100%)',
      }}
    >
      {/* Brasão watermark */}
      <img
        src="/assets/images/ui/brasao-transparente.webp"
        alt=""
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          objectFit: 'contain',
          opacity: 0.09,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: `${PT}px ${PX}px ${PB}px`,
        }}
      >
        {/* Meta row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'rgba(212,175,55,0.55)', letterSpacing: 2, textTransform: 'uppercase' }}>
            Sociedade Filarmônica 25 de Março
          </span>
          <span style={{ fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.2)', letterSpacing: 1.5 }}>
            {new Date().getFullYear()}
          </span>
        </div>

        {/* Header glass panel */}
        <div
          style={{
            background: 'rgba(0,0,0,0.28)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24,
            padding: '32px 40px',
            marginBottom: 28,
          }}
        >
          <div style={{ fontSize: 52, fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: -1, marginBottom: 16 }}>
            {before}
            {sep && <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300, margin: '0 8px' }}>—</span>}
            {after && <span style={{ color: '#D4AF37' }}>{after}</span>}
          </div>
          {dateStr && (
            <div style={{ fontSize: 24, fontWeight: 500, color: 'rgba(255,255,255,0.75)', letterSpacing: 0.3 }}>
              {dateStr}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }} />
          <div style={{ width: 8, height: 8, background: '#D4AF37', transform: 'rotate(45deg)', opacity: 0.65, flexShrink: 0 }} />
          <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5))' }} />
        </div>

        {/* Songs glass panel */}
        <div
          style={{
            flex: 1,
            background: 'rgba(0,0,0,0.16)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {partituras.map((p, i) => (
            <div
              key={p.id || i}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                padding: '0 40px',
                borderBottom: i < partituras.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 700, color: '#D4AF37', opacity: 0.7, minWidth: 54, letterSpacing: 0.3 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 27, fontWeight: 700, color: '#fff', lineHeight: 1.25 }}>
                  {formatSongTitle(p)}
                </div>
                <div style={{ fontSize: 23, fontWeight: 400, color: 'rgba(212,175,55,0.55)', marginTop: 4 }}>
                  {formatComposer(p)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(212,175,55,0.12)' }} />
          <div style={{ width: 6, height: 6, background: 'rgba(212,175,55,0.25)', transform: 'rotate(45deg)', flexShrink: 0 }} />
          <div style={{ flex: 1, height: 1, background: 'rgba(212,175,55,0.12)' }} />
        </div>
      </div>
    </div>
  );
});

export default RepertorioCardExport;
