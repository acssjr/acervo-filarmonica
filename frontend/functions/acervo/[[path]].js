import React from 'react';
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import plusJakartaBold from '../assets/plus-jakarta-sans-700.bin';
import crestPng from '../assets/brasao-256x256.png.bin';
import {
  API_ORIGIN,
  SITE_ORIGIN,
  buildSocialCardContent,
  buildSocialMetadata,
  injectSocialMetadata,
  normalizeSheetMetadata,
  parseSheetRoute
} from '../_shared/sheetSocial.js';

const CACHE_CONTROL = 'public, max-age=300, stale-while-revalidate=86400';
const FALLBACK_IMAGE_PATH = '/assets/images/ui/social-share-fallback.png';

const arrayBufferToDataUrl = (buffer, mimeType) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return `data:${mimeType};base64,${btoa(binary)}`;
};

const crestDataUrl = arrayBufferToDataUrl(crestPng, 'image/png');

const fetchSheet = async (sheetId, apiOrigin) => {
  const response = await fetch(`${apiOrigin}/api/partituras/${encodeURIComponent(sheetId)}`, {
    headers: { Accept: 'application/json' },
    cf: { cacheTtl: 300, cacheEverything: true }
  });
  if (!response.ok) return null;
  return normalizeSheetMetadata(await response.json());
};

const cardElement = (sheet) => {
  const content = buildSocialCardContent(sheet);
  return React.createElement('div', {
    style: {
      width: '1200px',
      height: '630px',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
      padding: '72px 82px',
      background: 'linear-gradient(135deg, #702d36 0%, #4b141b 54%, #26090d 100%)',
      color: '#f4e4bc',
      fontFamily: 'Plus Jakarta Sans'
    }
  }, [
    React.createElement('div', {
      key: 'gold-orbit',
      style: {
        position: 'absolute',
        width: '520px',
        height: '520px',
        right: '-145px',
        top: '-220px',
        borderRadius: '999px',
        background: 'rgba(212, 175, 55, 0.14)',
        border: '2px solid rgba(212, 175, 55, 0.18)'
      }
    }),
    React.createElement('div', {
      key: 'wine-orbit',
      style: {
        position: 'absolute',
        width: '420px',
        height: '420px',
        left: '-190px',
        bottom: '-260px',
        borderRadius: '999px',
        background: 'rgba(212, 175, 55, 0.09)'
      }
    }),
    React.createElement('div', {
      key: 'content',
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        position: 'relative'
      }
    }, [
      React.createElement('div', {
        key: 'brand',
        style: { display: 'flex', alignItems: 'center', gap: '22px' }
      }, [
        React.createElement('div', {
          key: 'crest-wrap',
          style: {
            width: '112px',
            height: '112px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '56px',
            background: 'rgba(20, 5, 8, 0.38)',
            border: '3px solid #d4af37'
          }
        }, React.createElement('img', { src: crestDataUrl, width: 94, height: 94 })),
        React.createElement('div', {
          key: 'brand-copy',
          style: { display: 'flex', flexDirection: 'column' }
        }, [
          React.createElement('div', { key: 'name', style: { fontSize: '31px', fontWeight: 700 } }, 'Acervo Digital'),
          React.createElement('div', { key: 'org', style: { fontSize: '19px', color: 'rgba(244, 228, 188, 0.72)', marginTop: '5px' } }, 'Sociedade Filarmônica 25 de Março')
        ])
      ]),
      React.createElement('div', {
        key: 'main',
        style: { display: 'flex', flexDirection: 'column', marginTop: '70px', maxWidth: '920px' }
      }, [
        React.createElement('div', {
          key: 'genre',
          style: {
            alignSelf: 'flex-start',
            display: 'flex',
            padding: '11px 20px',
            borderRadius: '999px',
            background: 'rgba(212, 175, 55, 0.16)',
            border: '1px solid rgba(212, 175, 55, 0.42)',
            color: '#e4c45c',
            fontSize: '21px',
            fontWeight: 700,
            letterSpacing: '1.8px',
            textTransform: 'uppercase'
          }
        }, content.categoryName),
        React.createElement('div', {
          key: 'title',
          style: {
            display: 'flex',
            marginTop: '24px',
            fontSize: `${content.titleFontSize}px`,
            lineHeight: 1.08,
            fontWeight: 700,
            letterSpacing: '-1.5px',
            color: '#fff6df'
          }
        }, content.title)
      ]),
      React.createElement('div', {
        key: 'footer',
        style: {
          display: 'flex',
          position: 'absolute',
          left: 0,
          bottom: 0,
          fontSize: '18px',
          color: 'rgba(244, 228, 188, 0.65)'
        }
      }, 'acervo.filarmonica25demarco.com')
    ])
  ]);
};

const renderImage = (sheet) => new ImageResponse(cardElement(sheet), {
  width: 1200,
  height: 630,
  fonts: [{
    name: 'Plus Jakarta Sans',
    data: plusJakartaBold,
    weight: 700,
    style: 'normal'
  }],
  headers: {
    'Cache-Control': CACHE_CONTROL
  }
});

const renderPage = async (context, sheet) => {
  const assetUrl = new URL('/index.html', context.request.url);
  const assetResponse = await context.env.ASSETS.fetch(assetUrl);
  if (!assetResponse.ok) return context.next();

  const metadata = buildSocialMetadata(sheet, context.env.SITE_ORIGIN || SITE_ORIGIN);
  const html = injectSocialMetadata(await assetResponse.text(), metadata);
  const headers = new Headers(assetResponse.headers);
  headers.delete('Content-Length');
  headers.delete('Content-Encoding');
  headers.delete('ETag');
  headers.set('Content-Type', 'text/html; charset=UTF-8');
  headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  return new Response(html, { status: 200, headers });
};

const renderGenericPage = async (context) => {
  const response = await context.env.ASSETS.fetch(new URL('/index.html', context.request.url));
  return response.ok ? response : context.next();
};

const fallbackImage = (requestUrl) => Response.redirect(new URL(FALLBACK_IMAGE_PATH, requestUrl), 302);

export async function onRequestGet(context) {
  const route = parseSheetRoute(new URL(context.request.url).pathname);
  if (!route) return renderGenericPage(context);

  try {
    const sheet = await fetchSheet(route.sheetId, context.env.API_ORIGIN || API_ORIGIN);
    if (!sheet) return route.isImage ? fallbackImage(context.request.url) : renderGenericPage(context);
    return route.isImage ? renderImage(sheet) : renderPage(context, sheet);
  } catch (error) {
    console.error('Falha ao gerar preview social:', error);
    if (route.isImage) {
      return fallbackImage(context.request.url);
    }
    return renderGenericPage(context);
  }
}
