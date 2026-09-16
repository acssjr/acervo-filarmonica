const icons = {
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></>,
  music: <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
  folder: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>,
};

const StatCard = ({ icon, label, value, loading, onClick }) => {
  const content = <>
    <span className={`admin-stat-icon is-${icon}`} aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icons[icon] || icons.music}</svg>
    </span>
    <span className="admin-stat-copy">
      <strong>{loading ? <span className="admin-stat-skeleton" aria-label={`Carregando ${label}`} /> : Number(value || 0).toLocaleString('pt-BR')}</strong>
      <span>{label}</span>
    </span>
  </>;

  return onClick ? <button type="button" className="admin-stat" onClick={onClick} aria-label={`Abrir ${label}`}>{content}</button> : <div className="admin-stat">{content}</div>;
};

export default StatCard;
