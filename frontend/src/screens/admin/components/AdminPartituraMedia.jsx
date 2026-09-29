import { useState } from 'react';
import { API } from '@services/api';

const accepted = '.mp3,.wav,.m4a,.ogg,.webm,audio/mpeg,audio/wav,audio/mp4,audio/ogg,audio/webm';
const maxBytes = 80 * 1024 * 1024;

export default function AdminPartituraMedia({ partitura, onUpdate, showToast }) {
  const [youtubeUrl, setYoutubeUrl] = useState(partitura.youtube_url || '');
  const [busy, setBusy] = useState(false);

  const run = async (action, success) => {
    setBusy(true);
    try {
      const patch = await action();
      onUpdate(patch);
      showToast(success);
    } catch (error) {
      showToast(error.message || 'Não foi possível salvar a mídia', 'error');
    } finally {
      setBusy(false);
    }
  };

  const onFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > maxBytes) {
      showToast('O áudio deve ter no máximo 80 MiB', 'error');
      return;
    }
    run(() => API.uploadPartituraAudio(partitura.id, file), 'Áudio oficial salvo');
  };

  return (
    <section style={{ borderTop: '1px solid var(--border)', paddingTop: 18, marginBottom: 22 }} aria-label="Mídia da partitura">
      <h3 style={{ margin: '0 0 8px', color: 'var(--text-primary)', fontSize: 15 }}>Áudio oficial</h3>
      <p style={{ margin: '0 0 10px', color: 'var(--text-muted)', fontSize: 12 }}>
        {partitura.has_audio ? `Arquivo atual: ${partitura.audio_name || 'Áudio anexado'}` : 'Nenhum áudio anexado'}
      </p>
      <p style={{ margin: '0 0 10px', color: 'var(--text-muted)', fontSize: 12 }}>MP3, WAV, M4A, OGG ou WebM de áudio · até 80 MiB. Prefira MP3 para carregar mais rápido.</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <label style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', padding: '10px 12px', borderRadius: 10, background: '#5c1a1b', color: '#f4e4bc', cursor: busy ? 'wait' : 'pointer', fontSize: 12, fontWeight: 700 }}>
          {busy ? 'Salvando...' : partitura.has_audio ? 'Substituir áudio' : 'Anexar áudio'}
          <input type="file" accept={accepted} onChange={onFileChange} disabled={busy} aria-label={partitura.has_audio ? 'Substituir áudio oficial' : 'Anexar áudio oficial'} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
        </label>
        {partitura.has_audio && <button type="button" disabled={busy} onClick={() => run(() => API.removePartituraAudio(partitura.id), 'Áudio removido')} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 12 }}>Remover áudio</button>}
      </div>
      <label htmlFor="partitura-youtube" style={{ display: 'block', marginTop: 18, marginBottom: 7, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>Link do YouTube (opcional)</label>
      <input id="partitura-youtube" type="url" value={youtubeUrl} onChange={event => setYoutubeUrl(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." disabled={busy} style={{ width: '100%', padding: '11px 12px', boxSizing: 'border-box', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
      <button type="button" disabled={busy || youtubeUrl.trim() === (partitura.youtube_url || '')} onClick={() => run(() => API.updatePartituraYoutube(partitura.id, youtubeUrl.trim()), 'Link do YouTube salvo')} style={{ marginTop: 8, padding: '9px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 700 }}>Salvar link</button>
    </section>
  );
}
