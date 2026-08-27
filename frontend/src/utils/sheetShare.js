import {
  getSingularCategoryName,
  SHARE_PRESENTATION_VERSION
} from '../../shared/categoryDisplay.js';

const APP_NAME = 'Acervo Digital';

const resolveOrigin = (origin) => {
  const value = origin || globalThis.window?.location?.origin;
  if (!value) throw new Error('Origem da aplicação indisponível');
  return value.replace(/\/$/, '');
};
const versionFromDate = (value) => {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : timestamp.toString(36);
};

export const buildSheetShareUrl = (sheet, { origin } = {}) => {
  if (!sheet?.id || !sheet?.category) {
    throw new Error('Partitura sem identificador ou categoria');
  }

  const url = new URL(
    `/acervo/${encodeURIComponent(String(sheet.category))}/${encodeURIComponent(String(sheet.id))}`,
    resolveOrigin(origin)
  );
  const contentVersion = versionFromDate(sheet.updatedAt || sheet.atualizado_em);
  url.searchParams.set(
    'v',
    contentVersion ? `${contentVersion}-${SHARE_PRESENTATION_VERSION}` : SHARE_PRESENTATION_VERSION
  );
  return url.toString();
};

export const buildSheetShareText = (sheet, categoryName) => {
  const title = sheet?.title?.trim() || 'Partitura';
  const composer = sheet?.composer?.trim();
  const genre = getSingularCategoryName(categoryName || sheet?.category);
  const attribution = composer ? `“${title}”, de ${composer}` : `“${title}”`;
  const genreLine = genre ? `\nGênero: ${genre}` : '';

  return `🎺 Partitura disponível no ${APP_NAME}!\n\n${attribution}${genreLine}\n\nAcesse e encontre a sua parte:`;
};

const copyText = async (text, clipboard = globalThis.navigator?.clipboard) => {
  if (!clipboard?.writeText) return false;
  try {
    await clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const shareSheetLink = async ({
  sheet,
  categoryName,
  origin,
  navigatorObject = globalThis.navigator
}) => {
  const url = buildSheetShareUrl(sheet, { origin });
  const text = buildSheetShareText(sheet, categoryName);
  const shareMessage = `${text}\n${url}`;
  const copyPromise = copyText(
    typeof navigatorObject?.share === 'function' ? url : shareMessage,
    navigatorObject?.clipboard
  );

  if (typeof navigatorObject?.share !== 'function') {
    const copied = await copyPromise;
    if (!copied) throw new Error('Não foi possível copiar o link');
    return { status: 'copied', copied, url };
  }

  try {
    await navigatorObject.share({
      title: `${sheet.title} | ${APP_NAME}`,
      text,
      url
    });
    return { status: 'shared', copied: await copyPromise, url };
  } catch (error) {
    const copied = await copyPromise;
    if (error?.name === 'AbortError') {
      return { status: 'cancelled', copied, url };
    }
    if (copied) return { status: 'copied', copied, url };
    throw error;
  }
};
