import {
  getSingularCategoryName,
  titleStartsWithCategory
} from '../../shared/categoryDisplay.js';

const APP_NAME = 'Acervo Digital';

const resolveOrigin = (origin) => {
  const value = origin || globalThis.window?.location?.origin;
  if (!value) throw new Error('Origem da aplicação indisponível');
  return value.replace(/\/$/, '');
};
export const buildSheetShareUrl = (sheet, { origin } = {}) => {
  if (!sheet?.id || !sheet?.category) {
    throw new Error('Partitura sem identificador ou categoria');
  }

  return new URL(
    `/acervo/${encodeURIComponent(String(sheet.category))}/${encodeURIComponent(String(sheet.id))}`,
    resolveOrigin(origin)
  ).toString();
};

export const buildSheetShareText = (sheet, categoryName) => {
  const title = sheet?.title?.trim() || 'Partitura';
  const composer = sheet?.composer?.trim();
  const genre = getSingularCategoryName(categoryName || sheet?.category);
  const attribution = composer ? `“${title}”, de ${composer}` : `“${title}”`;
  const genreLine = genre && !titleStartsWithCategory(title, genre) ? `\nGênero: ${genre}` : '';

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
