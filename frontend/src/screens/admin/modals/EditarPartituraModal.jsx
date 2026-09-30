import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LoaderCircle, X } from 'lucide-react';
import AcervoSelect from '@components/common/AcervoSelect';
import CategoryIcon from '@components/common/CategoryIcon';
import AdminPartituraMedia from '../components/AdminPartituraMedia';
import './editar-partitura.css';

export default function EditarPartituraModal({ partitura, form, setForm, categorias, saving, onSave, onClose, onMediaUpdate, showToast }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  const [mediaBusy, setMediaBusy] = useState(false);
  const busy = saving || mediaBusy;
  closeRef.current = busy ? () => {} : onClose;

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector('input')?.focus();

    const onKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key !== 'Tab') return;
      const controls = [...dialogRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href]')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  const change = event => setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));

  return createPortal(
    <div className="partitura-editor-backdrop" onClick={event => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <section ref={dialogRef} className="partitura-editor" role="dialog" aria-modal="true" aria-labelledby="partitura-editor-title" aria-busy={busy}>
        <header className="partitura-editor-header">
          <span className="partitura-editor-icon"><CategoryIcon categoryId={form.categoria_id} size={22} color="currentColor" /></span>
          <div className="partitura-editor-heading">
            <h2 id="partitura-editor-title">Editar partitura</h2>
            <p title={partitura.titulo}>{partitura.titulo}</p>
          </div>
          <button type="button" className="partitura-editor-close" aria-label="Fechar edição" onClick={onClose} disabled={busy}><X size={20} /></button>
        </header>

        <form className="partitura-editor-form" noValidate onSubmit={event => { event.preventDefault(); if (!busy && form.titulo.trim()) onSave(); }}>
          <div className="partitura-editor-body">
            <section className="partitura-editor-details" aria-labelledby="partitura-editor-details-title">
              <h3 id="partitura-editor-details-title">Dados da partitura</h3>
              <div className="partitura-editor-fields">
                <div className="partitura-editor-field partitura-editor-field-wide">
                  <label htmlFor="edit-partitura-titulo">Título</label>
                  <input id="edit-partitura-titulo" name="titulo" value={form.titulo} onChange={change} placeholder="Nome da partitura" disabled={saving} required />
                </div>
                <div className="partitura-editor-field">
                  <label htmlFor="edit-partitura-compositor">Compositor</label>
                  <input id="edit-partitura-compositor" name="compositor" value={form.compositor} onChange={change} placeholder="Nome do compositor" disabled={saving} />
                </div>
                <div className="partitura-editor-field">
                  <label htmlFor="edit-partitura-arranjador">Arranjador <span>opcional</span></label>
                  <input id="edit-partitura-arranjador" name="arranjador" value={form.arranjador} onChange={change} placeholder="Nome do arranjador" disabled={saving} />
                </div>
                <div className="partitura-editor-field partitura-editor-field-wide">
                  <label htmlFor="edit-partitura-categoria">Categoria</label>
                  <AcervoSelect id="edit-partitura-categoria" ariaLabel="Categoria" value={form.categoria_id} onChange={categoria_id => setForm(previous => ({ ...previous, categoria_id }))} disabled={saving} searchable options={[{ value: '', label: 'Sem categoria' }, ...categorias.map(category => ({ value: category.id, label: category.nome }))]} />
                </div>
              </div>
            </section>
            <AdminPartituraMedia partitura={partitura} onUpdate={onMediaUpdate} showToast={showToast} onBusyChange={setMediaBusy} disabled={saving} />
          </div>
          <footer className="partitura-editor-footer">
            <button type="button" className="partitura-editor-cancel" onClick={onClose} disabled={busy}>Cancelar</button>
            <button type="submit" className="partitura-editor-save" disabled={busy || !form.titulo.trim()}>
              {saving && <LoaderCircle size={17} className="partitura-editor-spinner" />}
              {saving ? 'Salvando…' : 'Salvar alterações'}
            </button>
          </footer>
        </form>
      </section>
    </div>, document.body
  );
}
