export const SITE_ORIGIN = 'https://acervo.filarmonica25demarco.com';
export const API_ORIGIN = 'https://acervo-filarmonica-api.acssjr.workers.dev';
export const SOCIAL_IMAGE_NAME = 'social-image.png';

const trimText = (value, fallback = '') => typeof value === 'string' && value.trim()
  ? value.trim()
  : fallback;

export const parseSheetRoute = (pathname) => {
  let segments;
  try {
    segments = pathname.split('/').filter(Boolean).map(segment => decodeURIComponent(segment));
  } catch {
    return null;
  }
  if (segments[0] !== 'acervo' || segments.length < 3 || segments.length > 4) return null;
  if (!/^\d+$/.test(segments[2])) return null;
  const isImage = segments.length === 4 && segments[3] === SOCIAL_IMAGE_NAME;
  if (segments.length === 4 && !isImage) return null;

  return {
    category: segments[1],
    sheetId: segments[2],
    isImage
  };
};

export const normalizeSheetMetadata = (data) => {
  if (!data?.id || !trimText(data.titulo) || !trimText(data.categoria_id)) return null;
  return {
    id: String(data.id),
    title: trimText(data.titulo),
    composer: trimText(data.compositor, 'Compositor não informado'),
    categoryId: trimText(data.categoria_id),
    categoryName: trimText(data.categoria_nome, trimText(data.categoria_id)),
    updatedAt: trimText(data.atualizado_em)
  };
};

const versionFromDate = (value) => {
  const timestamp = value ? Date.parse(value) : Number.NaN;
  return Number.isNaN(timestamp) ? null : timestamp.toString(36);
};

export const buildSocialMetadata = (sheet, siteOrigin = SITE_ORIGIN) => {
  const canonicalUrl = `${siteOrigin}/acervo/${encodeURIComponent(sheet.categoryId)}/${encodeURIComponent(sheet.id)}`;
  const imageUrl = new URL(`${canonicalUrl}/${SOCIAL_IMAGE_NAME}`);
  const version = versionFromDate(sheet.updatedAt);
  if (version) imageUrl.searchParams.set('v', version);

  return {
    pageTitle: `${sheet.title} | Acervo Digital`,
    description: `${sheet.categoryName} de ${sheet.composer}. Entre no Acervo Digital para visualizar e baixar sua parte.`,
    canonicalUrl,
    imageUrl: imageUrl.toString(),
    imageAlt: `Cartão da partitura ${sheet.title}, gênero ${sheet.categoryName}`
  };
};

export const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export const buildSocialTags = (metadata) => {
  const title = escapeHtml(metadata.pageTitle);
  const description = escapeHtml(metadata.description);
  const canonicalUrl = escapeHtml(metadata.canonicalUrl);
  const imageUrl = escapeHtml(metadata.imageUrl);
  const imageAlt = escapeHtml(metadata.imageAlt);

  return [
    `<link rel="canonical" href="${canonicalUrl}">`,
    `<meta name="description" content="${description}">`,
    '<meta property="og:type" content="website">',
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${canonicalUrl}">`,
    `<meta property="og:image" content="${imageUrl}">`,
    '<meta property="og:image:type" content="image/png">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${imageAlt}">`,
    '<meta property="og:site_name" content="Acervo Digital — S.F. 25 de Março">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${imageUrl}">`,
    `<meta name="twitter:image:alt" content="${imageAlt}">`
  ].join('\n  ');
};

export const injectSocialMetadata = (html, metadata) => {
  const title = `<title>${escapeHtml(metadata.pageTitle)}</title>`;
  const withTitle = /<title>[\s\S]*?<\/title>/i.test(html)
    ? html.replace(/<title>[\s\S]*?<\/title>/i, title)
    : html.replace(/<\/head>/i, `  ${title}\n</head>`);
  const socialBlock = `<!-- social-meta:start -->\n  ${buildSocialTags(metadata)}\n  <!-- social-meta:end -->`;
  const existingBlock = /<!-- social-meta:start -->[\s\S]*?<!-- social-meta:end -->/i;
  return existingBlock.test(withTitle)
    ? withTitle.replace(existingBlock, socialBlock)
    : withTitle.replace(/<\/head>/i, `  ${socialBlock}\n</head>`);
};

export const getTitleFontSize = (title) => {
  if (title.length > 58) return 44;
  if (title.length > 38) return 52;
  return 62;
};

export const buildSocialCardContent = (sheet) => ({
  title: sheet.title,
  categoryName: sheet.categoryName,
  composer: sheet.composer,
  titleFontSize: getTitleFontSize(sheet.title)
});
