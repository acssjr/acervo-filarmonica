import { useEffect, useRef, useState } from 'react';
import { API } from '@services/api';

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
};

export default function SheetAudioPlayer({ sheet }) {
  const audioRef = useRef(null);
  const requestVersionRef = useRef(0);
  const disposedRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [full, setFull] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    disposedRef.current = false;
    const audio = audioRef.current;
    return () => {
      disposedRef.current = true;
      requestVersionRef.current += 1;
      audio?.pause();
      if (audio) { audio.removeAttribute('src'); audio.load(); }
    };
  }, []);

  const start = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    const requestVersion = ++requestVersionRef.current;
    setExpanded(true);
    setError('');
    if (sheet.audioMime && audio.canPlayType(sheet.audioMime) === '') {
      setError('Este formato de áudio não é reproduzido neste navegador.');
      return;
    }
    setLoading(true);
    try {
      const { url } = await API.getPartituraAudioAccess(sheet.apiId || sheet.id);
      if (disposedRef.current || requestVersion !== requestVersionRef.current) return;
      audio.src = url;
      audio.preload = 'metadata';
      await audio.play();
    } catch (caught) {
      if (!disposedRef.current && requestVersion === requestVersionRef.current) setError(caught.message || 'Não foi possível carregar o áudio');
    } finally {
      if (!disposedRef.current && requestVersion === requestVersionRef.current) setLoading(false);
    }
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (!audio.src) { start(); return; }
      if (!full && audio.currentTime >= Math.min(30, audio.duration || 30)) audio.currentTime = 0;
      audio.play().catch(() => setError('Não foi possível reproduzir o áudio'));
    } else audio.pause();
  };

  const skip = (seconds) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    const limit = full ? audio.duration : Math.min(30, audio.duration);
    audio.currentTime = Math.max(0, Math.min(limit, audio.currentTime + seconds));
  };

  const chooseFull = () => {
    setFull(true);
    audioRef.current?.play().catch(() => setError('Não foi possível reproduzir o áudio'));
  };

  const onTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    if (!full && audio.currentTime >= 30) audio.pause();
  };

  const limit = full ? duration : Math.min(30, duration || 30);

  return (
    <section aria-label="Áudio oficial da partitura" style={{ borderTop: '1px solid var(--border)', paddingTop: 13, marginBottom: 14 }}>
      <audio ref={audioRef} preload="metadata" onLoadedMetadata={event => setDuration(event.currentTarget.duration)} onTimeUpdate={onTimeUpdate} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => setError('Falha ao carregar o áudio. Tente novamente.')} />
      {!expanded ? (
        <button type="button" onClick={start} style={{ width: '100%', minHeight: 44, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', border: '1.5px solid #d4af37', borderRadius: 10, background: 'rgba(212,175,55,0.12)', color: '#722f37', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          <span aria-hidden="true" style={{ width: 23, height: 23, borderRadius: '50%', display: 'grid', placeItems: 'center', background: '#5c1a1b', color: '#fff', fontSize: 10 }}>▶</span>
          Ouvir partitura
        </button>
      ) : (
        <div style={{ padding: 13, border: '1px solid rgba(212,175,55,0.35)', borderRadius: 12, background: 'rgba(212,175,55,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <strong style={{ color: 'var(--text-primary)', fontSize: 12 }}>Áudio oficial</strong>
            <button type="button" onClick={() => { requestVersionRef.current += 1; audioRef.current?.pause(); setLoading(false); setExpanded(false); }} aria-label="Fechar player" style={{ border: 0, background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>⌃</button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 11, margin: '5px 0 10px' }}>{full ? 'Reprodução completa' : 'Trecho de até 30 segundos'}</p>
          {loading && <p role="status" style={{ fontSize: 12 }}>Carregando áudio...</p>}
          {error && <p role="alert" style={{ fontSize: 12, color: '#b32929' }}>{error} <button type="button" onClick={start}>Tentar novamente</button></p>}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, color: '#5c1a1b' }}>
            <button type="button" onClick={() => skip(-10)} disabled={loading} aria-label="Voltar 10 segundos" style={{ minWidth: 44, minHeight: 44, border: 0, background: 'none', color: 'inherit' }}>↶ 10</button>
            <button type="button" onClick={toggle} disabled={loading || !!error} aria-label={playing ? 'Pausar áudio' : 'Reproduzir áudio'} style={{ width: 44, height: 44, borderRadius: '50%', border: 0, background: '#5c1a1b', color: '#fff', fontSize: 16 }}>{playing ? 'Ⅱ' : '▶'}</button>
            <button type="button" onClick={() => skip(10)} disabled={loading} aria-label="Avançar 10 segundos" style={{ minWidth: 44, minHeight: 44, border: 0, background: 'none', color: 'inherit' }}>10 ↷</button>
          </div>
          <input type="range" min="0" max={limit || 30} step="0.1" value={Math.min(currentTime, limit || 30)} onChange={event => { audioRef.current.currentTime = Number(event.target.value); }} aria-label="Posição do áudio" style={{ width: '100%', accentColor: '#b49438', marginTop: 10 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: 10 }}><span>{formatTime(currentTime)}</span><span>{formatTime(limit)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 9 }}>
            {!full ? <button type="button" onClick={chooseFull} style={{ border: 0, background: 'none', color: '#722f37', textDecoration: 'underline', fontSize: 12, fontWeight: 700, padding: '8px 0' }}>Ouvir completo</button> : <span />}
            <label style={{ color: 'var(--text-muted)', fontSize: 11 }}>Velocidade <select aria-label="Velocidade do áudio" value={rate} onChange={event => { const next = Number(event.target.value); setRate(next); audioRef.current.playbackRate = next; }} style={{ marginLeft: 5, minHeight: 36, borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}><option value="0.75">0,75×</option><option value="1">1×</option><option value="1.25">1,25×</option><option value="1.5">1,5×</option></select></label>
          </div>
        </div>
      )}
    </section>
  );
}
