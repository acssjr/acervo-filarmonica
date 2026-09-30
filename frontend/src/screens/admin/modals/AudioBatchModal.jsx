import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileAudio, FolderOpen, Upload, X } from 'lucide-react';
import { API } from '@services/api';
import { AUDIO_ACCEPT, MAX_AUDIO_BYTES, captureAudioDrop, isAudioFile, matchAudioTitle, readAudioDrop } from '@utils/audioBatch';
import './audio-batch.css';

export default function AudioBatchModal({ partituras, onClose, onUpdate }) {
  const [rows, setRows] = useState([]);
  const [reading, setReading] = useState(false);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState({ total: 1, completed: 0 });
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const stopRef = useRef(false);
  const busyRef = useRef(false);
  const dialogRef = useRef(null);
  const filesRef = useRef(null);
  const folderRef = useRef(null);
  const nextId = useRef(0);
  const fileKey = file => `${file.webkitRelativePath || file.batchRelativePath || file.name}:${file.size}:${file.lastModified}`;

  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector('button')?.focus();
    const keydown = event => {
      if (event.key === 'Escape' && !busyRef.current) closeRef.current();
      if (event.key !== 'Tab') return;
      const controls = [...dialogRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled)')].filter(el => el.offsetParent !== null);
      const first = controls[0]; const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', keydown);
    const beforeUnload = event => { if (busyRef.current) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', beforeUnload);
    return () => { stopRef.current = true; document.body.style.overflow = overflow; document.removeEventListener('keydown', keydown); window.removeEventListener('beforeunload', beforeUnload); previous?.focus(); };
  }, []);

  const addFiles = files => {
    const audio = Array.from(files).filter(isAudioFile);
    setRows(previous => {
      const seen = new Set(previous.map(row => fileKey(row.file)));
      const added = [];
      for (const file of audio) {
        const key = fileKey(file);
        if (seen.has(key)) continue;
        seen.add(key);
        added.push({ id: ++nextId.current, file, ...matchAudioTitle(file.name, partituras), replace: false, status: 'pending', error: '', validationError: file.size > MAX_AUDIO_BYTES ? 'Excede 80 MiB' : file.size === 0 ? 'Arquivo vazio' : '' });
      }
      return [...previous, ...added];
    });
    setMessage(audio.length ? `${audio.length} arquivo(s) de áudio lido(s). Duplicatas são ignoradas.` : 'Nenhum áudio compatível encontrado. Use MP3, WAV, M4A, OGG ou WebM de áudio.');
  };

  const drop = async event => {
    event.preventDefault(); event.stopPropagation();
    if (busyRef.current) return;
    const captured = captureAudioDrop(event.dataTransfer);
    busyRef.current = true; setReading(true);
    try { addFiles(await readAudioDrop(captured)); }
    catch { setMessage('Não foi possível ler a pasta. Tente o botão Selecionar pasta.'); }
    finally { busyRef.current = false; setReading(false); }
  };
  const patchRow = (id, patch) => setRows(previous => previous.map(row => row.id === id ? { ...row, ...patch } : row));
  const counts = new Map();
  rows.filter(row => row.selectedId).forEach(row => counts.set(row.selectedId, (counts.get(row.selectedId) || 0) + 1));
  const problem = row => {
    const sheet = partituras.find(item => String(item.id) === row.selectedId);
    if (row.validationError) return row.validationError;
    if (!sheet) return 'Escolha uma partitura para enviar';
    if (counts.get(row.selectedId) > 1) return 'Mais de um arquivo associado à mesma partitura';
    if (sheet.has_audio && !row.replace) return 'Autorize a substituição do áudio atual';
    return '';
  };
  const eligible = rows.filter(row => row.status !== 'success' && !problem(row));
  const send = async () => {
    if (busyRef.current || !eligible.length) return;
    busyRef.current = true; stopRef.current = false; setRunning(true);
    setProgress({ total: eligible.length, completed: 0 });
    let sent = 0; let failures = 0;
    try {
      for (const row of eligible) {
        if (stopRef.current) break;
        patchRow(row.id, { status: 'sending', error: '' });
        try {
          const patch = await API.uploadPartituraAudio(row.selectedId, row.file);
          onUpdate(row.selectedId, patch);
          patchRow(row.id, { status: 'success', error: '' }); sent++;
        } catch (error) { patchRow(row.id, { status: 'failed', error: error.message || 'Falha no envio' }); failures++; }
        setProgress(previous => ({ ...previous, completed: previous.completed + 1 }));
      }
      setMessage(`${sent} áudio(s) enviado(s); ${failures} falha(s).${stopRef.current ? ' Os arquivos restantes não foram enviados.' : ''}`);
    } finally { busyRef.current = false; setRunning(false); }
  };
  const locked = reading || running;
  return createPortal(
    <div data-audio-batch className="audio-batch-overlay" onDragOver={event => { event.preventDefault(); event.stopPropagation(); }} onDrop={drop}>
      <section ref={dialogRef} className="audio-batch-dialog" role="dialog" aria-modal="true" aria-labelledby="audio-batch-title">
        <header><div><span className="audio-batch-eyebrow">ACERVO · ADMINISTRAÇÃO</span><h2 id="audio-batch-title">Áudios em lote</h2><p>Associe os arquivos às partituras pelo título.</p></div><button type="button" onClick={onClose} disabled={locked} aria-label="Fechar upload de áudios"><X size={20} /></button></header>
        <div className="audio-batch-content">
          <div className="audio-batch-drop"><FileAudio size={30} /><strong>Arraste áudios ou uma pasta aqui</strong><span>Inclui subpastas · MP3, WAV, M4A, OGG e WebM · até 80 MiB por arquivo</span><div><button type="button" disabled={locked} onClick={() => filesRef.current.click()}><Upload size={16} /> Selecionar arquivos</button><button type="button" disabled={locked} onClick={() => folderRef.current.click()}><FolderOpen size={16} /> Selecionar pasta</button></div></div>
          <input ref={filesRef} hidden type="file" multiple accept={AUDIO_ACCEPT} onChange={event => { addFiles(event.target.files); event.target.value = ''; }} />
          <input ref={folderRef} hidden type="file" multiple webkitdirectory="" directory="" onChange={event => { addFiles(event.target.files); event.target.value = ''; }} />
          <p className="audio-batch-help">Títulos únicos são associados automaticamente. Revise as sugestões e escolha a partitura nos casos ambíguos. Nenhum arquivo é enviado antes da sua confirmação.</p>
          <p role="status" aria-live="polite">{reading ? 'Lendo arquivos da pasta…' : message}</p>
          {running && <progress aria-label="Progresso do lote" max={progress.total} value={progress.completed} />}
          <div className="audio-batch-rows">{rows.map(row => {
            const sheet = partituras.find(item => String(item.id) === row.selectedId);
            const issue = problem(row);
            return <article key={row.id} className={`audio-batch-row ${row.status}`}>
              <div className="audio-batch-filename"><strong>{row.file.name}</strong><small>{row.file.webkitRelativePath || row.file.batchRelativePath || ''}</small><small>{(row.file.size / 1024 / 1024).toFixed(1)} MiB · {row.reason}</small></div>
              <label>Partitura correspondente<select aria-label={`Partitura para ${row.file.name}`} disabled={locked || row.status === 'success'} value={row.selectedId} onChange={event => patchRow(row.id, { selectedId: event.target.value, replace: false })}><option value="">Selecionar partitura</option>{row.candidates.length > 0 && <optgroup label="Correspondências sugeridas">{row.candidates.map(item => <option key={item.id} value={String(item.id)}>{item.titulo} · {item.compositor || 'Sem compositor'}</option>)}</optgroup>}<optgroup label="Todas as partituras">{partituras.map(item => <option key={item.id} value={String(item.id)}>{item.titulo} · {item.compositor || 'Sem compositor'}</option>)}</optgroup></select></label>
              {sheet?.has_audio && row.status !== 'success' && <label className="audio-batch-replace"><input type="checkbox" checked={row.replace} disabled={locked} onChange={event => patchRow(row.id, { replace: event.target.checked })} /> Substituir áudio atual: {sheet.audio_name || 'áudio anexado'}</label>}
              <div className="audio-batch-row-bottom"><span>{row.status === 'success' ? 'Áudio enviado' : row.status === 'sending' ? 'Enviando…' : row.status === 'failed' ? row.error : issue || 'Pronto para enviar'}</span><button type="button" disabled={locked} aria-label={`Remover ${row.file.name} do lote`} onClick={() => setRows(previous => previous.filter(item => item.id !== row.id))}>Remover do lote</button></div>
            </article>;
          })}</div>
        </div>
        <footer><span>{rows.filter(row => row.status === 'success').length} enviados · {eligible.length} prontos</span>{running ? <button type="button" onClick={() => { stopRef.current = true; setMessage('Parando após o arquivo atual…'); }}>Parar após este arquivo</button> : <button type="button" className="audio-batch-submit" disabled={reading || !eligible.length} onClick={send}>Enviar {eligible.length} áudio(s)</button>}</footer>
      </section>
    </div>, document.body
  );
}
