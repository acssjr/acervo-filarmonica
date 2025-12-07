// ===== PDF VIEWER MODAL =====
// Visualizador de PDF elegante usando react-pdf

import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configurar worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewerModal = ({
  isOpen,
  onClose,
  pdfUrl,
  title = 'Visualizador de PDF',
  onDownload
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((err) => {
    setLoading(false);
    setError('Erro ao carregar PDF');
    console.error('PDF load error:', err);
  }, []);

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      setPageNumber(prev => Math.max(prev - 1, 1));
    } else if (e.key === 'ArrowRight') {
      setPageNumber(prev => Math.min(prev + 1, numPages || 1));
    } else if (e.key === '+' || e.key === '=') {
      setScale(prev => Math.min(prev + 0.25, 3.0));
    } else if (e.key === '-') {
      setScale(prev => Math.max(prev - 0.25, 0.5));
    }
  }, [numPages, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(0, 0, 0, 0.92)'
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header / Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'rgba(30, 30, 40, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        {/* Titulo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minWidth: 0,
          flex: '1 1 auto'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '15px',
            fontWeight: '600',
            color: '#fff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {title}
          </span>
        </div>

        {/* Controles centrais */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {/* Navegacao de paginas */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '4px'
          }}>
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              title="Pagina anterior (←)"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: 'none',
                background: pageNumber <= 1 ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
                color: pageNumber <= 1 ? 'rgba(255, 255, 255, 0.3)' : '#fff',
                cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>

            <span style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '13px',
              color: '#fff',
              padding: '0 8px',
              minWidth: '80px',
              textAlign: 'center'
            }}>
              {numPages ? `${pageNumber} / ${numPages}` : '...'}
            </span>

            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              title="Proxima pagina (→)"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: 'none',
                background: pageNumber >= numPages ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
                color: pageNumber >= numPages ? 'rgba(255, 255, 255, 0.3)' : '#fff',
                cursor: pageNumber >= numPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>

          {/* Separador */}
          <div style={{
            width: '1px',
            height: '24px',
            background: 'rgba(255, 255, 255, 0.15)'
          }} />

          {/* Controles de zoom */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '4px'
          }}>
            <button
              onClick={zoomOut}
              disabled={scale <= 0.5}
              title="Diminuir zoom (-)"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: 'none',
                background: scale <= 0.5 ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
                color: scale <= 0.5 ? 'rgba(255, 255, 255, 0.3)' : '#fff',
                cursor: scale <= 0.5 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </button>

            <button
              onClick={resetZoom}
              title="Resetar zoom"
              style={{
                padding: '0 8px',
                height: '32px',
                borderRadius: '6px',
                border: 'none',
                background: 'transparent',
                color: '#fff',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                minWidth: '50px'
              }}
            >
              {Math.round(scale * 100)}%
            </button>

            <button
              onClick={zoomIn}
              disabled={scale >= 3.0}
              title="Aumentar zoom (+)"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: 'none',
                background: scale >= 3.0 ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
                color: scale >= 3.0 ? 'rgba(255, 255, 255, 0.3)' : '#fff',
                cursor: scale >= 3.0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="14"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Acoes */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {/* Download */}
          <button
            onClick={handleDownload}
            title="Abrir em nova aba"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
              color: '#fff',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Abrir
          </button>

          {/* Fechar */}
          <button
            onClick={onClose}
            title="Fechar (Esc)"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(231, 76, 60, 0.15)',
              color: '#e74c3c',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Area do PDF */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '20px',
        background: 'rgba(40, 40, 50, 0.5)'
      }}>
        {loading && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '16px'
          }}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2"
              style={{ animation: 'spin 1s linear infinite' }}
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
            </svg>
            <span style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              Carregando PDF...
            </span>
          </div>
        )}

        {error && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '16px'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14px',
              color: '#e74c3c'
            }}>
              {error}
            </span>
          </div>
        )}

        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          error={null}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            loading={null}
          />
        </Document>
      </div>

      {/* Estilos */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Estilo para o canvas do PDF */
        .react-pdf__Document {
          display: flex;
          justify-content: center;
        }

        .react-pdf__Page {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          border-radius: 4px;
          overflow: hidden;
        }

        .react-pdf__Page__canvas {
          display: block;
        }

        /* Estilo para selecao de texto */
        .react-pdf__Page__textContent {
          color: transparent;
        }

        .react-pdf__Page__textContent span::selection {
          background: rgba(212, 175, 55, 0.4);
        }
      `}</style>
    </div>
  );
};

export default PDFViewerModal;
