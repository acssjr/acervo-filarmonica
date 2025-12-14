// ===== SEARCH BAR =====
// Barra de busca reutilizável

const SearchBar = ({ value, onChange, placeholder, onClear: _onClear }) => (
  <div style={{ padding: '0 20px', marginBottom: '20px' }}>
    <div className="search-bar" role="search">
      <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        placeholder={placeholder || "Buscar partituras..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder || "Buscar partituras"}
        autoComplete="off"
      />
      {value && (
        <button className="clear-btn" onClick={() => onChange('')} aria-label="Limpar busca">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  </div>
);

export default SearchBar;
