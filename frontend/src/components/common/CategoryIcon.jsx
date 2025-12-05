// ===== CATEGORY ICON COMPONENT =====
// Renderiza SVG baseado no ID da categoria

const CategoryIcon = ({ categoryId, size = 24, color = '#fff' }) => {
  const categoryMap = {
    'dobrado': (
      // Trompete militar - simbolo do dobrado brasileiro
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h3l2-2h4"/>
        <path d="M12 10v4"/>
        <circle cx="12" cy="12" r="6"/>
        <path d="M18 12h3"/>
        <path d="M6 9v6"/>
      </svg>
    ),
    'marcha': (
      // Tambor com baquetas
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="9" rx="7" ry="3"/>
        <path d="M5 9v7c0 1.7 3.1 3 7 3s7-1.3 7-3V9"/>
        <path d="M5 13c0 1.7 3.1 3 7 3s7-1.3 7-3"/>
        <path d="M3 4l4 5M21 4l-4 5"/>
      </svg>
    ),
    'marcha-funebre': (
      // Vela memorial
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c0 2-2 4-2 6s2 3 2 3 2-1 2-3-2-4-2-6z"/>
        <rect x="10" y="11" width="4" height="10" rx="1"/>
        <path d="M8 21h8"/>
      </svg>
    ),
    'valsa': (
      // Clave de sol elegante
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c2.5 0 4 1.5 4 3.5 0 3-4 4-4 8"/>
        <circle cx="12" cy="17" r="3"/>
        <path d="M12 14v-3"/>
        <path d="M9 17c0 1.7 1.3 3 3 3"/>
      </svg>
    ),
    'fantasia': (
      // Estrela brilhante
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
      </svg>
    ),
    'polaca': (
      // Coroa real (origem polonesa)
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18l2-10 4 4 3-6 3 6 4-4 2 10H3z"/>
        <circle cx="5" cy="6" r="1.5"/>
        <circle cx="12" cy="4" r="1.5"/>
        <circle cx="19" cy="6" r="1.5"/>
        <path d="M3 18h18v2H3z"/>
      </svg>
    ),
    'bolero': (
      // Rosa elegante
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="10" r="4"/>
        <path d="M12 6c-2-2-4-1-4 1s2 3 4 3 4-1 4-3-2-3-4-1"/>
        <path d="M12 14v7"/>
        <path d="M9 18c-1.5 0-2.5.5-2.5 1.5"/>
        <path d="M15 18c1.5 0 2.5.5 2.5 1.5"/>
      </svg>
    ),
    'hino': (
      // Bandeira
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4v17"/>
        <path d="M4 4h12c2 0 3 1 3 2s-1 2-3 2H8c-2 0-3 1-3 2s1 2 3 2h11"/>
        <circle cx="4" cy="4" r="1.5" fill={color}/>
      </svg>
    ),
    'hino-religioso': (
      // Cruz estilizada
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18"/>
        <path d="M7 8h10"/>
        <circle cx="12" cy="8" r="5"/>
      </svg>
    ),
    'arranjo': (
      // Partitura com notas
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M7 8h10M7 12h10M7 16h6"/>
        <circle cx="17" cy="16" r="2" fill={color}/>
      </svg>
    ),
    'preludio': (
      // Clave de sol simplificada
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18c0 1.7 1.3 3 3 3s3-1.3 3-3-1.3-3-3-3"/>
        <path d="M12 15V6c0-2 2-3 3-3"/>
        <path d="M12 10c2-1 3-3 3-5"/>
      </svg>
    )
  };

  // Fallback para nota musical elegante
  const defaultIcon = (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
      <path d="M11 18V6l10-2v12"/>
    </svg>
  );

  return categoryMap[categoryId] || defaultIcon;
};

export default CategoryIcon;
