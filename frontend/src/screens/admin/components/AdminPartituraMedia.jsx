import { useState } from 'react';
import { Check, FileAudio, Link, LoaderCircle, RefreshCw, Trash2, Upload } from 'lucide-react';
import { API } from '@services/api';

const accepted = '.mp3,.wav,.m4a,.ogg,.webm,audio/mpeg,audio/wav,audio/mp4,audio/ogg,audio/webm';
const maxBytes = 80 * 1024 * 1024;

export default function AdminPartituraMedia({ partitura, onUpdate, showToast, onBusyChange, disabled = false }) {
  const [youtubeUrl, setYoutubeUrl] = useState(partitura.youtube_url || '');
  const [busy, setBusy] = useState(false);

  const run = async (action, success) => {
    if (busy || disabled) return;
    setBusy(true);
    onBusyChange?.(true);
    try {
      const patch = await action();
      onUpdate(patch);
      showToast(success);
    } catch (error) {
      showToast(error.message || 'Não foi possível salvar a mídia', 'error');
    } finally {
      setBusy(false);
      onBusyChange?.(false);
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

  const locked = busy || disabled;
  const format = partitura.audio_name?.split('.').pop()?.toUpperCase();
  const size = partitura.audio_size ? `${(partitura.audio_size / (1024 * 1024)).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB` : null;
  const uploadControl = (
    <label className={`partitura-media-upload ${partitura.has_audio ? 'partitura-media-action' : 'partitura-media-empty'}`}>
      {busy ? <LoaderCircle size={18} className="partitura-editor-spinner" /> : partitura.has_audio ? <RefreshCw size={14} /> : <Upload size={22} />}
      <span>{busy ? 'Salvando…' : partitura.has_audio ? 'Trocar arquivo' : 'Adicionar áudio'}</span>
      <input type="file" accept={accepted} onChange={onFileChange} disabled={locked} aria-label={partitura.has_audio ? 'Substituir áudio oficial' : 'Anexar áudio oficial'} />
    </label>
  );

  return (
    <section className="partitura-editor-media" aria-label="Mídia da partitura">
      <div className="partitura-media-heading">
        <h3>Áudio oficial</h3>
        {partitura.has_audio && <span className="partitura-media-status"><Check size={13} /> Anexado</span>}
      </div>
      {partitura.has_audio ? (
        <>
          <div className="partitura-media-file">
            <span className="partitura-media-file-icon"><FileAudio size={27} strokeWidth={1.5} /></span>
            <div className="partitura-media-file-details">
              <span className="partitura-media-file-name">{partitura.audio_name || 'Áudio anexado'}</span>
              <span className="partitura-media-file-meta">{[format && format.length < 6 ? format : 'Áudio', size].filter(Boolean).join(' · ')}</span>
            </div>
          </div>
          <div className="partitura-media-actions">
            {uploadControl}
            <button type="button" className="partitura-media-action partitura-media-remove" disabled={locked} onClick={() => run(() => API.removePartituraAudio(partitura.id), 'Áudio removido')}><Trash2 size={14} /> Remover áudio</button>
          </div>
        </>
      ) : uploadControl}
      <p className="partitura-media-help">MP3, WAV, M4A, OGG ou WebM. Até 80 MB.</p>
      <div className="partitura-media-youtube">
        <label htmlFor="partitura-youtube">Link do YouTube <span>opcional</span></label>
        <div className="partitura-media-link-row">
          <div className="partitura-media-link-input">
            <Link size={16} aria-hidden="true" />
            <input id="partitura-youtube" type="url" value={youtubeUrl} onChange={event => setYoutubeUrl(event.target.value)} placeholder="Cole o link do vídeo" disabled={locked} />
          </div>
          <button type="button" className="partitura-media-link-save" disabled={locked || youtubeUrl.trim() === (partitura.youtube_url || '')} onClick={() => run(() => API.updatePartituraYoutube(partitura.id, youtubeUrl.trim()), 'Link do YouTube salvo')}>Salvar link</button>
        </div>
      </div>
      <p className="partitura-media-note">Áudio e link são salvos separadamente dos dados acima.</p>
    </section>
  );
}
