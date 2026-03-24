// ===== STAT CARD =====
// Card de estatística estilo premium — gradiente rico + contador GSAP animado

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const THEMES = {
  users: {
    gradient: 'linear-gradient(145deg, #3C2800 0%, #1E1200 100%)',
    accentColor: '#D4AF37',
    iconColor: '#F0D070',
    glow: 'rgba(212,175,55,0.18)',
  },
  music: {
    gradient: 'linear-gradient(145deg, #0A2238 0%, #050F1A 100%)',
    accentColor: '#3498db',
    iconColor: '#72B8E0',
    glow: 'rgba(52,152,219,0.18)',
  },
  download: {
    gradient: 'linear-gradient(145deg, #0A2A18 0%, #051008 100%)',
    accentColor: '#27ae60',
    iconColor: '#72D898',
    glow: 'rgba(39,174,96,0.18)',
  },
  folder: {
    gradient: 'linear-gradient(145deg, #220E38 0%, #100618 100%)',
    accentColor: '#9b59b6',
    iconColor: '#C08AE8',
    glow: 'rgba(155,89,182,0.18)',
  },
};

const Icon = ({ type, color, size }) => {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (type === 'users') return (
    <svg {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
  if (type === 'music') return (
    <svg {...props}>
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
  );
  if (type === 'download') return (
    <svg {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
  // folder
  return (
    <svg {...props}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  );
};

const StatCard = ({ icon, label, value, loading, index = 0, onClick }) => {
  const theme = THEMES[icon] || THEMES.music;
  const cardRef = useRef(null);
  const numRef = useRef(null);
  const counter = useRef({ val: 0 });

  // Entrance: staggered fade-up — usa fromTo explícito + desabilita CSS transition durante animação
  useGSAP(() => {
    const el = cardRef.current;
    el.style.transition = 'none';
    gsap.fromTo(el,
      { opacity: 0, y: 24, scale: 0.94 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.55, ease: 'expo.out',
        delay: index * 0.09,
        onComplete: () => {
          gsap.set(el, { clearProps: 'transform,opacity' });
          el.style.transition = 'transform 0.18s ease, box-shadow 0.18s ease';
        },
      }
    );
  }, { scope: cardRef });

  // Animated counter when value arrives
  useGSAP(() => {
    if (loading || !value) return;
    counter.current.val = 0;
    gsap.to(counter.current, {
      val: value,
      duration: 1.5,
      ease: 'power3.out',
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = Math.round(counter.current.val).toLocaleString('pt-BR');
        }
      },
    });
  }, { scope: cardRef, dependencies: [loading, value] });

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      style={{
        background: theme.gradient,
        borderRadius: '20px',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '140px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 6px 28px rgba(0,0,0,0.38)',
        border: '1px solid rgba(255,255,255,0.07)',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseEnter={onClick ? (e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 12px 36px rgba(0,0,0,0.48), 0 0 0 1px ${theme.accentColor}30`;
      } : undefined}
      onMouseLeave={onClick ? (e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,0,0,0.38)';
      } : undefined}
    >
      {/* Specular top highlight */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.06) 55%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Small icon badge */}
      <div style={{
        width: '38px', height: '38px', borderRadius: '11px',
        background: `${theme.accentColor}22`,
        border: `1px solid ${theme.accentColor}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '14px', flexShrink: 0,
      }}>
        <Icon type={icon} color={theme.iconColor} size={18} />
      </div>

      {/* Animated number */}
      <div style={{
        fontSize: '38px', fontWeight: '800', color: '#FFFFFF',
        lineHeight: 1, letterSpacing: '-1.5px', marginBottom: '5px',
      }}>
        {loading ? (
          <div style={{
            width: '64px', height: '38px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.1)',
            animation: 'shimmer 1.6s ease-in-out infinite',
          }} />
        ) : (
          <span ref={numRef}>0</span>
        )}
      </div>

      {/* Label */}
      <div style={{
        fontSize: '12px', fontWeight: '600',
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase', letterSpacing: '0.6px',
        marginTop: 'auto',
      }}>
        {label}
      </div>

      {/* Radial glow behind decorative icon */}
      <div style={{
        position: 'absolute', right: '-24px', bottom: '-24px',
        width: '150px', height: '150px', borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.glow} 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      {/* Large decorative icon */}
      <div style={{
        position: 'absolute', right: '10px', bottom: '8px',
        opacity: 0.15, transform: 'rotate(-8deg)', pointerEvents: 'none',
      }}>
        <Icon type={icon} color={theme.iconColor} size={72} />
      </div>
    </div>
  );
};

export default StatCard;
