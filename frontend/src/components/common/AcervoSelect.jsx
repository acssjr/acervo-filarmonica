import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search } from 'lucide-react';
import './acervo-select.css';

const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function AcervoSelect({ id, value, options, onChange, disabled = false, searchable = false, placeholder = 'Selecionar', ariaLabel, className = '' }) {
  const uid = useId();
  const listId = `${uid}-list`;
  const trigger = useRef(null);
  const menu = useRef(null);
  const search = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [placement, setPlacement] = useState(null);
  const selected = options.find(option => String(option.value) === String(value));
  const filtered = useMemo(() => options.filter(option => normalize(option.label).includes(normalize(query))), [options, query]);
  const visible = open && !disabled;
  const positioned = Boolean(placement);
  const close = (focus = false) => { setOpen(false); setQuery(''); if (focus) trigger.current?.focus(); };
  const choose = option => { onChange(String(option.value)); close(true); };

  useLayoutEffect(() => {
    if (!visible) return;
    const position = () => {
      const rect = trigger.current.getBoundingClientRect();
      const below = window.innerHeight - rect.bottom - 12;
      const above = rect.top - 12;
      const up = below < 220 && above > below;
      const width = Math.min(Math.max(rect.width, searchable ? 280 : 160), window.innerWidth - 24);
      setPlacement({ position: 'fixed', width, left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
        top: up ? undefined : rect.bottom + 6, bottom: up ? window.innerHeight - rect.top + 6 : undefined,
        maxHeight: Math.max(80, Math.min(360, up ? above : below)) });
    };
    position();
    window.addEventListener('resize', position);
    const scroll = event => { if (!menu.current?.contains(event.target)) position(); };
    document.addEventListener('scroll', scroll, true);
    return () => { window.removeEventListener('resize', position); document.removeEventListener('scroll', scroll, true); };
  }, [visible, searchable]);

  useEffect(() => {
    if (!visible) return;
    search.current?.focus();
    const outside = event => { if (!event.target.closest?.('[data-overlay-scrollbar]') && !trigger.current?.contains(event.target) && !menu.current?.contains(event.target)) close(); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [visible, positioned]);

  useEffect(() => {
    if (visible) menu.current?.querySelector('[data-active="true"]')?.scrollIntoView?.({ block: 'nearest' });
  }, [active, visible, positioned]);

  const keys = event => {
    if (event.key === 'Escape' && visible) { event.preventDefault(); event.stopPropagation(); close(true); }
    else if (event.key === 'Tab') close();
    else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault(); event.stopPropagation();
      if (!visible) { setQuery(''); setActive(Math.max(0, options.findIndex(option => String(option.value) === String(value)))); setOpen(true); }
      else setActive(previous => event.key === 'Home' ? 0 : event.key === 'End' ? filtered.length - 1 : Math.max(0, Math.min(filtered.length - 1, previous + (event.key === 'ArrowDown' ? 1 : -1))));
    } else if (visible && (event.key === 'Enter' || (!searchable && event.key === ' '))) {
      event.preventDefault(); event.stopPropagation(); if (filtered[active]) choose(filtered[active]);
    }
  };
  const host = trigger.current?.closest('[role="dialog"]') || document.body;
  return <div className={`acervo-select ${className}`}>
    <button ref={trigger} id={id} type="button" className="acervo-select-trigger" role="combobox" aria-label={ariaLabel} aria-expanded={visible} aria-haspopup="listbox" aria-controls={visible ? listId : undefined} aria-activedescendant={visible && !searchable && filtered[active] ? `${listId}-${active}` : undefined} disabled={disabled} onKeyDown={keys} onClick={event => { event.stopPropagation(); if (visible) close(); else { setQuery(''); setActive(Math.max(0, options.findIndex(option => String(option.value) === String(value)))); setOpen(true); } }}>
      <span className={!selected || !String(selected.value) ? 'acervo-select-placeholder' : ''}>{selected?.label || placeholder}</span><ChevronDown size={16} aria-hidden="true" />
    </button>
    {visible && placement && createPortal(<div ref={menu} className="acervo-select-menu" style={placement} onClick={event => event.stopPropagation()} onKeyDown={keys}>
      {searchable && <div className="acervo-select-search"><Search size={16} aria-hidden="true" /><input ref={search} type="search" aria-label={`Buscar em ${ariaLabel || placeholder}`} placeholder="Buscar por nome…" value={query} aria-controls={listId} aria-activedescendant={filtered[active] ? `${listId}-${active}` : undefined} onChange={event => { setQuery(event.target.value); setActive(0); }} /></div>}
      <div className="acervo-select-options" id={listId} role="listbox" aria-label={ariaLabel || placeholder}>
        {filtered.map((option, index) => <div key={String(option.value)}>
          {option.group && option.group !== filtered[index - 1]?.group && <p className="acervo-select-group">{option.group}</p>}
          <div id={`${listId}-${index}`} role="option" aria-selected={String(option.value) === String(value)} data-active={index === active} className="acervo-select-option" onPointerMove={() => setActive(index)} onMouseDown={event => event.preventDefault()} onClick={() => choose(option)}><span>{option.label}</span>{String(option.value) === String(value) && <Check size={16} aria-hidden="true" />}</div>
        </div>)}
        {!filtered.length && <p className="acervo-select-empty" role="status">Nenhum resultado encontrado</p>}
      </div>
    </div>, host)}
  </div>;
}
