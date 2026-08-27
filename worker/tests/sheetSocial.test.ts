import { describe, expect, test } from 'vitest';
import {
  buildSocialCardContent,
  buildSocialMetadata,
  buildSocialTags,
  getTitleFontSize,
  injectSocialMetadata,
  normalizeSheetMetadata,
  parseSheetRoute
} from '../../frontend/functions/_shared/sheetSocial.js';

const sheet = normalizeSheetMetadata({
  id: 96,
  titulo: "Senhora Sant'Anna",
  compositor: 'Tertuliano Santos',
  categoria_id: 'marchas',
  categoria_nome: 'Marchas',
  atualizado_em: '2026-08-27T12:00:00.000Z'
});

describe('preview social de partitura', () => {
  test('reconhece página e imagem somente para IDs numéricos', () => {
    expect(parseSheetRoute('/acervo/marchas/96')).toEqual({ category: 'marchas', sheetId: '96', isImage: false });
    expect(parseSheetRoute('/acervo/marchas/96/social-image.png')).toEqual({ category: 'marchas', sheetId: '96', isImage: true });
    expect(parseSheetRoute('/acervo/marchas/invalido')).toBeNull();
    expect(parseSheetRoute('/acervo/%E0%A4%A/96')).toBeNull();
  });

  test('gera metadados canônicos e imagem versionada', () => {
    const metadata = buildSocialMetadata(sheet, 'https://acervo.exemplo.com');

    expect(metadata.canonicalUrl).toBe('https://acervo.exemplo.com/acervo/marchas/96');
    expect(metadata.imageUrl).toBe('https://acervo.exemplo.com/acervo/marchas/96/social-image.png?v=mtbh0g00');
    expect(metadata.description).toContain('Tertuliano Santos');
  });

  test('usa o domínio oficial como origem padrão', () => {
    const metadata = buildSocialMetadata(sheet);

    expect(metadata.canonicalUrl).toBe('https://acervo.filarmonica25demarco.com/acervo/marchas/96');
    expect(metadata.imageUrl).toMatch(/^https:\/\/acervo\.filarmonica25demarco\.com\//);
  });

  test('injeta todas as tags sociais e escapa dados do banco', () => {
    const metadata = buildSocialMetadata({ ...sheet, title: '<script>alert("x")</script>' });
    const html = injectSocialMetadata(
      '<html><head><title>Genérico</title><!-- social-meta:start --><meta property="og:title" content="Genérico"><!-- social-meta:end --></head><body></body></html>',
      metadata
    );

    expect(html).not.toContain('<script>alert');
    expect(html).not.toContain('content="Genérico"');
    expect(html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
    expect(html).toContain('property="og:image"');
    expect(html).toContain('property="og:image:width" content="1200"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(buildSocialTags(metadata)).toContain('rel="canonical"');
  });

  test('conteúdo visual não recebe o compositor', () => {
    expect(buildSocialCardContent(sheet)).toEqual({
      title: "Senhora Sant'Anna",
      categoryName: 'Marchas',
      titleFontSize: 62
    });
    expect(buildSocialCardContent(sheet)).not.toHaveProperty('composer');
  });

  test('reduz títulos longos para caber no cartão', () => {
    expect(getTitleFontSize('A'.repeat(39))).toBe(52);
    expect(getTitleFontSize('A'.repeat(59))).toBe(44);
  });

  test('rejeita dados incompletos em vez de inventar uma peça', () => {
    expect(normalizeSheetMetadata({ id: 96, titulo: '', categoria_id: 'marchas' })).toBeNull();
  });
});
