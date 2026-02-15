"use client";

import {
  Drum,
  Cross,
  UsersRound,
  Sparkles,
  Crown,
  Sun,
  Flag,
  Church,
  SlidersHorizontal,
  Music,
  Landmark,
  Music2
} from 'lucide-react';

interface CategoryIconProps {
  categoryId: string;
  size?: number;
  color?: string;
}

const CategoryIcon = ({ categoryId, size = 24, color = '#fff' }: CategoryIconProps) => {
  const iconProps = {
    size,
    color,
    strokeWidth: 1.75
  };

  const categoryMap: Record<string, React.ReactNode> = {
    'dobrado': <Music2 {...iconProps} />,
    'dobrados': <Music2 {...iconProps} />,
    'marcha': <Drum {...iconProps} />,
    'marchas': <Drum {...iconProps} />,
    'marcha-funebre': <Cross {...iconProps} />,
    'marchas-funebres': <Cross {...iconProps} />,
    'marcha-religiosa': <Church {...iconProps} />,
    'marchas-religiosas': <Church {...iconProps} />,
    'valsa': <UsersRound {...iconProps} />,
    'valsas': <UsersRound {...iconProps} />,
    'bolero': <Sun {...iconProps} />,
    'boleros': <Sun {...iconProps} />,
    'polaca': <Crown {...iconProps} />,
    'polacas': <Crown {...iconProps} />,
    'fantasia': <Sparkles {...iconProps} />,
    'fantasias': <Sparkles {...iconProps} />,
    'preludio': <Sparkles {...iconProps} />,
    'preludios': <Sparkles {...iconProps} />,
    'hino': <Flag {...iconProps} />,
    'hinos': <Flag {...iconProps} />,
    'hino-civico': <Landmark {...iconProps} />,
    'hinos-civicos': <Landmark {...iconProps} />,
    'hino-religioso': <Church {...iconProps} />,
    'hinos-religiosos': <Church {...iconProps} />,
    'arranjo': <SlidersHorizontal {...iconProps} />,
    'arranjos': <SlidersHorizontal {...iconProps} />,
    'popular': <Music {...iconProps} />,
    'musica-popular': <Music {...iconProps} />
  };

  return categoryMap[categoryId] || <Music {...iconProps} />;
};

export default CategoryIcon;
