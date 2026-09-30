import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, LoaderCircle, Pause, Play, RotateCcw, RotateCw } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { API } from '@services/api';
import './SheetAudioPlayer.css';

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
};

export default function SheetAudioPlayer({ sheet, summary }) {
  const controlsId = useId();
  const reducedMotion = useReducedMotion();
  const audioRef = useRef(null);
  const requestVersionRef = useRef(0);
  const disposedRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [full, setFull] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(1);
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');

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
    setStarted(true);
    setExpanded(true);
    setError('');
    setHint('');
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
      setLoading(false);
      try {
        await audio.play();
      } catch (playError) {
        if (disposedRef.current || requestVersion !== requestVersionRef.current) return;
        if (playError?.name === 'NotAllowedError') setHint('Toque em reproduzir para iniciar o áudio.');
        else setError('Não foi possível reproduzir o áudio');
      }
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
      setHint('');
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
    if (loading || !audioRef.current?.getAttribute('src')) return;
    setFull(true);
    setHint('');
    audioRef.current?.play().catch(() => setError('Não foi possível reproduzir o áudio'));
  };

  const onTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    if (!full && audio.currentTime >= 30) audio.pause();
  };

  const limit = full ? duration : Math.min(30, duration || 30);

  const playButton = (compact = false) => (
    <button type="button" className={`sheet-audio-play${compact ? ' sheet-audio-play-compact' : ''}`} onClick={toggle} disabled={loading || !!error} aria-label={playing ? 'Pausar áudio' : 'Reproduzir áudio'}>
      {loading ? <LoaderCircle size={22} className="sheet-audio-spinner" /> : playing ? <Pause size={24} fill="currentColor" strokeWidth={1.5} /> : <Play size={24} fill="currentColor" strokeWidth={1.5} />}
    </button>
  );

  return (
    <section aria-label="Áudio da partitura" className="sheet-audio">
      <audio ref={audioRef} preload="metadata" onLoadedMetadata={event => setDuration(event.currentTarget.duration)} onTimeUpdate={onTimeUpdate} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => setError('Falha ao carregar o áudio. Tente novamente.')} />
      {!started ? (
        <div className="sheet-audio-summary">
          {summary}
        <button type="button" onClick={start} className="sheet-audio-start" aria-label="Ouvir partitura">
          <span className="sheet-audio-start-icon"><Play size={17} fill="currentColor" /></span>
          <span>Áudio da música</span>
        </button>
        </div>
      ) : (
        <div className={`sheet-audio-panel${expanded ? '' : ' sheet-audio-panel-compact'}`}>
          <div className="sheet-audio-header">
            {summary}
            <div className="sheet-audio-title">
              <div><strong>Áudio da música</strong><p>{loading ? 'Carregando áudio…' : expanded ? (full ? 'Reprodução completa' : 'Trecho de até 30 segundos') : `${playing ? 'Tocando' : 'Pausado'} · ${formatTime(currentTime)}`}</p></div>
            </div>
            {!expanded && playButton(true)}
            <button type="button" className="sheet-audio-disclosure" onClick={() => setExpanded(previous => !previous)} aria-label={expanded ? 'Recolher player' : 'Expandir player'} aria-expanded={expanded} aria-controls={controlsId}>
              <ChevronDown size={20} />
            </button>
          </div>
          {hint && <p role="status" className="sheet-audio-message">{hint}</p>}
          {error && <p role="alert" className="sheet-audio-error">{error} <button type="button" onClick={start}>Tentar novamente</button></p>}
          <motion.div
            className="sheet-audio-expansion"
            id={controlsId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden={!expanded}
            inert={!expanded ? '' : undefined}
          >
            <div className="sheet-audio-details">
              <div className="sheet-audio-controls">
                <button type="button" className="sheet-audio-skip" onClick={() => skip(-10)} disabled={loading || !!error} aria-label="Voltar 10 segundos"><RotateCcw size={29} strokeWidth={1.7} /><span aria-hidden="true">10</span></button>
                {playButton()}
                <button type="button" className="sheet-audio-skip" onClick={() => skip(10)} disabled={loading || !!error} aria-label="Avançar 10 segundos"><RotateCw size={29} strokeWidth={1.7} /><span aria-hidden="true">10</span></button>
              </div>
              <input className="sheet-audio-progress" type="range" min="0" max={limit || 30} step="0.1" value={Math.min(currentTime, limit || 30)} disabled={loading || !!error} onChange={event => { audioRef.current.currentTime = Number(event.target.value); setCurrentTime(Number(event.target.value)); }} aria-label="Posição do áudio" style={{ '--audio-progress': `${Math.min(100, (currentTime / (limit || 30)) * 100)}%` }} />
              <div className="sheet-audio-times"><span>{formatTime(currentTime)}</span><span>{formatTime(limit)}</span></div>
              <div className="sheet-audio-footer">
                {!full ? <button type="button" className="sheet-audio-full" onClick={chooseFull} disabled={loading || !!error}>Ouvir completo</button> : <span className="sheet-audio-full-label">Áudio completo</span>}
                <label className="sheet-audio-rate">Velocidade <select aria-label="Velocidade do áudio" value={rate} onChange={event => { const next = Number(event.target.value); setRate(next); audioRef.current.playbackRate = next; }}><option value="0.75">0,75×</option><option value="1">1×</option><option value="1.25">1,25×</option><option value="1.5">1,5×</option></select></label>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
