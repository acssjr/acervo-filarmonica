// ===== DATE TIME PICKER =====
// Seletor de data/hora premium — sempre em modo claro, brandline vinho/dourado

import { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

// ── Helpers ──────────────────────────────────────────────────────────
const parseValue = (val) => {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

const toISOLocal = (year, month, day, hour, minute) => {
  const y = year;
  const mo = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  const h = String(hour).padStart(2, '0');
  const mi = String(minute).padStart(2, '0');
  return `${y}-${mo}-${d}T${h}:${mi}`;
};

const formatDisplay = (val) => {
  const d = parseValue(val);
  if (!d) return null;
  const day = d.getDate();
  const month = MONTHS[d.getMonth()].slice(0, 3).toLowerCase();
  const year = d.getFullYear();
  const h = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month}. ${year} · ${h}:${mi}`;
};

const getCalendarDays = (year, month) => {
  const firstDow = new Date(year, month, 1).getDay(); // 0=Dom
  const total = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDow; i++) days.push(null);
  for (let i = 1; i <= total; i++) days.push(i);
  return days;
};

// ── Shared style atoms ────────────────────────────────────────────────
const navBtn = {
  width: '32px', height: '32px', borderRadius: '10px',
  background: '#f1f5f9', border: '1px solid #e2e8f0',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 0, flexShrink: 0,
};

const stepBtn = {
  width: '28px', height: '28px', borderRadius: '8px',
  background: '#f1f5f9', border: 'none',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '16px', fontWeight: '700', color: '#64748b', padding: 0,
};

// ── Component ─────────────────────────────────────────────────────────
const DateTimePicker = ({
  value = '',
  onChange,
  placeholder = 'Selecione data e hora',
  label,
  hint,
}) => {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Derive initial state from value prop
  const parsed = parseValue(value);
  const [viewYear, setViewYear] = useState(parsed ? parsed.getFullYear() : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.getMonth() : new Date().getMonth());
  const [selDay, setSelDay] = useState(parsed ? parsed.getDate() : null);
  const [selMonth, setSelMonth] = useState(parsed ? parsed.getMonth() : null);
  const [selYear, setSelYear] = useState(parsed ? parsed.getFullYear() : null);
  const [hour, setHour] = useState(parsed ? parsed.getHours() : 8);
  const [minute, setMinute] = useState(parsed ? parsed.getMinutes() : 0);

  // Sync internal state when value changes externally
  useEffect(() => {
    const p = parseValue(value);
    if (p) {
      setViewYear(p.getFullYear());
      setViewMonth(p.getMonth());
      setSelDay(p.getDate());
      setSelMonth(p.getMonth());
      setSelYear(p.getFullYear());
      setHour(p.getHours());
      setMinute(p.getMinutes());
    } else {
      setSelDay(null); setSelMonth(null); setSelYear(null);
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const calDays = getCalendarDays(viewYear, viewMonth);
  const todayRef = new Date();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleDayClick = (day) => {
    setSelDay(day); setSelMonth(viewMonth); setSelYear(viewYear);
  };

  const handleConfirm = () => {
    if (selDay === null) return;
    onChange(toISOLocal(selYear, selMonth, selDay, hour, minute));
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSelDay(null); setSelMonth(null); setSelYear(null);
  };

  const isToday = (day) =>
    day === todayRef.getDate() &&
    viewMonth === todayRef.getMonth() &&
    viewYear === todayRef.getFullYear();

  const isSelected = (day) =>
    day === selDay && viewMonth === selMonth && viewYear === selYear;

  const displayText = formatDisplay(value);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Label */}
      {label && (
        <label style={{
          display: 'block', fontSize: '11px', fontWeight: '900',
          color: 'var(--text-muted)', marginBottom: '8px',
          textTransform: 'uppercase', letterSpacing: '1.5px',
        }}>
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(o => !o)}
        style={{
          width: '100%', padding: '13px 16px', borderRadius: '14px',
          background: '#ffffff',
          border: `1.5px solid ${isOpen ? '#D4AF37' : '#e2e8f0'}`,
          boxShadow: isOpen
            ? '0 0 0 3px rgba(212,175,55,0.10), 0 4px 16px rgba(0,0,0,0.06)'
            : '0 1px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
          textAlign: 'left', transition: 'all 0.2s ease',
        }}
      >
        <Calendar size={15} color={displayText ? '#D4AF37' : '#b0b8c4'} style={{ flexShrink: 0 }} />
        <span style={{
          flex: 1, fontSize: '14px',
          fontWeight: displayText ? '600' : '400',
          color: displayText ? '#1a1a2e' : '#a0aec0',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {displayText || placeholder}
        </span>
        {displayText ? (
          <div
            onClick={handleClear}
            style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: '#f1f5f9', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <X size={11} color="#94a3b8" />
          </div>
        ) : (
          <Clock size={13} color="#c8d0da" style={{ flexShrink: 0 }} />
        )}
      </button>

      {/* Hint */}
      {hint && (
        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '6px 0 0' }}>{hint}</p>
      )}

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0,
              zIndex: 2000, minWidth: '300px', width: '100%',
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e8edf3',
              boxShadow: '0 24px 64px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06)',
              overflow: 'hidden',
            }}
          >
            {/* ── Month nav ── */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px 14px',
              borderBottom: '1px solid #f0f4f8',
            }}>
              <button onClick={prevMonth} style={navBtn}>
                <ChevronLeft size={15} color="#64748b" />
              </button>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#1a1a2e', letterSpacing: '-0.2px' }}>
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button onClick={nextMonth} style={navBtn}>
                <ChevronRight size={15} color="#64748b" />
              </button>
            </div>

            {/* ── Calendar grid ── */}
            <div style={{ padding: '14px 16px 10px' }}>
              {/* Weekday headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '6px' }}>
                {WEEKDAYS.map((d, i) => (
                  <div key={i} style={{ textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#94a3b8', padding: '3px 0' }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                {calDays.map((day, i) => {
                  if (!day) return <div key={i} />;
                  const sel = isSelected(day);
                  const tod = isToday(day);
                  return (
                    <button
                      key={i}
                      onClick={() => handleDayClick(day)}
                      style={{
                        width: '100%', aspectRatio: '1', borderRadius: '50%',
                        border: tod && !sel ? '1.5px solid #722F37' : 'none',
                        background: sel
                          ? 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)'
                          : 'transparent',
                        color: sel ? '#1A0507' : tod ? '#722F37' : '#374151',
                        fontSize: '13px',
                        fontWeight: sel || tod ? '800' : '500',
                        cursor: 'pointer', padding: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.14s ease',
                        boxShadow: sel ? '0 3px 10px rgba(212,175,55,0.4)' : 'none',
                      }}
                      onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = '#f8fafc'; }}
                      onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Time selector ── */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 20px 14px',
              borderTop: '1px solid #f0f4f8',
              borderBottom: '1px solid #f0f4f8',
              background: '#fafbfc',
            }}>
              <Clock size={14} color="#D4AF37" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', flexShrink: 0 }}>
                Horário
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                {/* Hour */}
                <button onClick={() => setHour(h => (h - 1 + 24) % 24)} style={stepBtn}>−</button>
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e', minWidth: '32px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
                  {String(hour).padStart(2, '0')}
                </span>
                <button onClick={() => setHour(h => (h + 1) % 24)} style={stepBtn}>+</button>

                <span style={{ fontSize: '20px', fontWeight: '300', color: '#c0cad4', margin: '0 2px' }}>:</span>

                {/* Minute */}
                <button onClick={() => setMinute(m => (m - 5 + 60) % 60)} style={stepBtn}>−</button>
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e', minWidth: '32px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
                  {String(minute).padStart(2, '0')}
                </span>
                <button onClick={() => setMinute(m => (m + 5) % 60)} style={stepBtn}>+</button>
              </div>
            </div>

            {/* ── Confirm / Cancel ── */}
            <div style={{ padding: '12px 16px 16px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  flex: 1, padding: '11px', borderRadius: '12px',
                  background: '#f8fafc', border: '1px solid #e2e8f0',
                  color: '#64748b', fontSize: '13px', fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={selDay === null}
                style={{
                  flex: 2, padding: '11px', borderRadius: '12px',
                  background: selDay === null
                    ? '#f0f4f8'
                    : 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                  border: 'none',
                  color: selDay === null ? '#94a3b8' : '#1A0507',
                  fontSize: '13px', fontWeight: '800',
                  cursor: selDay === null ? 'default' : 'pointer',
                  boxShadow: selDay !== null ? '0 4px 14px rgba(212,175,55,0.35)' : 'none',
                  letterSpacing: '0.3px',
                }}
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateTimePicker;
