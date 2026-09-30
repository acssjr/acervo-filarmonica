import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import './acervo-datepicker.css';

const isoDate = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const display = value => value ? value.split('-').reverse().join('/') : '';
const parse = text => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!match) return null;
  const [, day, month, year] = match.map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
};
export default function AcervoDatePicker({ value, onChange, ariaLabel = 'Data', style }) {
  const [text, setText] = useState(display(value));
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => value ? new Date(`${value}T12:00:00`) : new Date());
  const [position, setPosition] = useState({});
  const wrapper = useRef(null); const panel = useRef(null); const button = useRef(null);
  const uid = useId();
  useEffect(() => setText(display(value)), [value]);
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = wrapper.current.getBoundingClientRect(); const width = Math.min(336, window.innerWidth - 24);
      const up = window.innerHeight - rect.bottom < 360 && rect.top > window.innerHeight - rect.bottom;
      setPosition({ width, left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)), top: up ? undefined : rect.bottom + 6, bottom: up ? window.innerHeight - rect.top + 6 : undefined, maxHeight: Math.max(120, (up ? rect.top : window.innerHeight - rect.bottom) - 18) });
    };
    place();
    const outside = event => { if (!event.target.closest?.('[data-overlay-scrollbar]') && !wrapper.current.contains(event.target) && !panel.current?.contains(event.target)) setOpen(false); };
    const scroll = event => { if (!panel.current?.contains(event.target)) place(); };
    document.addEventListener('pointerdown', outside); document.addEventListener('scroll', scroll, true); window.addEventListener('resize', place);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('scroll', scroll, true); window.removeEventListener('resize', place); };
  }, [open]);
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7;
  const choose = date => { onChange(isoDate(date)); setText(display(isoDate(date))); setOpen(false); button.current.focus(); };
  const keys = event => { if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); setOpen(false); button.current.focus(); } };
  return <div className="acervo-date" ref={wrapper} onKeyDown={keys}>
    <input type="text" inputMode="numeric" aria-label={ariaLabel} placeholder="dd/mm/aaaa" value={text} style={style} aria-invalid={Boolean(text && !parse(text))} onBlur={() => { if (text && !parse(text)) setText(display(value)); }} onChange={event => {
      const raw = event.target.value;
      const formatted = /^(?:\d{1,8}|\d{2}\/\d{3,6})$/.test(raw) ? raw.replace(/\//g, '').replace(/^(\d{2})(\d)/, '$1/$2').replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2') : raw;
      setText(formatted); const date = parse(formatted); if (date) onChange(isoDate(date)); else if (!formatted) onChange('');
    }} />
    <button ref={button} type="button" className="acervo-date-toggle" aria-label={`Escolher ${ariaLabel.toLowerCase()}`} aria-expanded={open} aria-controls={open ? uid : undefined} onClick={event => { event.stopPropagation(); if (!open) setMonth(value ? new Date(`${value}T12:00:00`) : new Date()); setOpen(!open); }}><CalendarDays size={17} /></button>
    {open && createPortal(<div ref={panel} id={uid} className="acervo-date-calendar" style={position} onKeyDown={keys} onClick={event => event.stopPropagation()}>
      <header><button type="button" aria-label="Mês anterior" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={17} /></button><strong aria-live="polite">{first.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</strong><button type="button" aria-label="Próximo mês" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={17} /></button></header>
      <div className="acervo-date-grid">{['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => <span className="acervo-date-weekday" key={day}>{day}</span>)}{Array.from({ length: offset }, (_, index) => <span key={`blank-${index}`} />)}{Array.from({ length: count }, (_, index) => {
        const date = new Date(month.getFullYear(), month.getMonth(), index + 1);
        return <button key={index} type="button" aria-label={date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })} aria-pressed={isoDate(date) === value} onClick={() => choose(date)}>{index + 1}</button>;
      })}</div><footer><button type="button" onClick={() => choose(new Date())}>Hoje</button><button type="button" onClick={() => { onChange(''); setText(''); setOpen(false); button.current.focus(); }}>Limpar</button></footer>
    </div>, wrapper.current?.closest('[role="dialog"]') || document.body)}
  </div>;
}
