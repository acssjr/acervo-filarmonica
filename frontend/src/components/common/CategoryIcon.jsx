// ===== CATEGORY ICON COMPONENT =====
// Usa ícones profissionais da biblioteca Lucide React + SVG customizado
// https://lucide.dev/icons

import {
  Drum,           // marcha - caixa clara / percussão
  Cross,          // marcha-funebre - símbolo fúnebre
  UsersRound,     // valsa - casal dançando
  Sparkles,       // fantasia e preludio - magia/fantasia
  Crown,          // polaca - realeza polonesa
  Sun,            // bolero - sol espanhol
  Flag,           // hino - bandeira
  Church,         // hino-religioso e marcha-religiosa - igreja
  SlidersHorizontal, // arranjo - mixer/ajustes
  Music,          // musica-popular e fallback - nota musical
  Landmark        // hino-civico - monumento/civismo
} from 'lucide-react';

// Ícone de Trompete SVG customizado (não existe no Lucide)
const TrumpetIcon = ({ size = 24, color = '#fff', strokeWidth = 1.75 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Campana do trompete */}
    <path d="M2 12c0-2 1-4 3-4h1" />
    <ellipse cx="4" cy="12" rx="2" ry="4" />
    {/* Corpo do trompete */}
    <path d="M6 12h10" />
    <path d="M6 10h10" />
    <path d="M6 14h10" />
    {/* Bocal */}
    <path d="M16 10v4" />
    <path d="M16 12h3" />
    <circle cx="20.5" cy="12" r="1.5" />
    {/* Pistons */}
    <path d="M9 10v-2" />
    <path d="M11 10v-3" />
    <path d="M13 10v-2" />
  </svg>
);

const CategoryIcon = ({ categoryId, size = 24, color = '#fff' }) => {
  const iconProps = {
    size,
    color,
    strokeWidth: 1.75
  };

  const categoryMap = {
    // Dobrado - trompete (ícone customizado)
    'dobrado': <TrumpetIcon size={size} color={color} />,
    'dobrados': <TrumpetIcon size={size} color={color} />,

    // Marchas
    'marcha': <Drum {...iconProps} />,
    'marchas': <Drum {...iconProps} />,
    'marcha-funebre': <Cross {...iconProps} />,
    'marchas-funebres': <Cross {...iconProps} />,
    'marcha-religiosa': <Church {...iconProps} />,
    'marchas-religiosas': <Church {...iconProps} />,

    // Danças
    'valsa': <UsersRound {...iconProps} />,
    'valsas': <UsersRound {...iconProps} />,
    'bolero': <Sun {...iconProps} />,
    'boleros': <Sun {...iconProps} />,
    'polaca': <Crown {...iconProps} />,
    'polacas': <Crown {...iconProps} />,

    // Fantasias e Prelúdios (mesmo ícone)
    'fantasia': <Sparkles {...iconProps} />,
    'fantasias': <Sparkles {...iconProps} />,
    'preludio': <Sparkles {...iconProps} />,
    'preludios': <Sparkles {...iconProps} />,

    // Hinos
    'hino': <Flag {...iconProps} />,
    'hinos': <Flag {...iconProps} />,
    'hino-civico': <Landmark {...iconProps} />,
    'hinos-civicos': <Landmark {...iconProps} />,
    'hino-religioso': <Church {...iconProps} />,
    'hinos-religiosos': <Church {...iconProps} />,

    // Outros
    'arranjo': <SlidersHorizontal {...iconProps} />,
    'arranjos': <SlidersHorizontal {...iconProps} />,
    'popular': <Music {...iconProps} />,
    'musica-popular': <Music {...iconProps} />
  };

  // Fallback é nota musical (não guitarra)
  return categoryMap[categoryId] || <Music {...iconProps} />;
};

export default CategoryIcon;
