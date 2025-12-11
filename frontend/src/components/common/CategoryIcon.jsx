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
  Landmark,       // hino-civico - monumento/civismo
  Music2          // dobrado - notas musicais duplas
} from 'lucide-react';

const CategoryIcon = ({ categoryId, size = 24, color = '#fff' }) => {
  const iconProps = {
    size,
    color,
    strokeWidth: 1.75
  };

  const categoryMap = {
    // Dobrado - notas musicais duplas (representa o ritmo binário)
    'dobrado': <Music2 {...iconProps} />,
    'dobrados': <Music2 {...iconProps} />,

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
