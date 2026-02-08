"use client";

// ===== PDF VIEWER MODAL =====
// Visualizador de PDF elegante usando react-pdf

import { useState, useCallback, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import useAnimatedVisibility from "@hooks/useAnimatedVisibility";

// Configurar worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  title?: string;
  onDownload?: () => void;
}

interface ScreenSize {
  width: number;
  height: number;
  isLandscape: boolean;
}

const PDFViewerModal = ({
  isOpen,
  onClose,
  pdfUrl,
  title = "Visualizador de PDF",
  onDownload,
}: PDFViewerModalProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const pdfWrapperRef = useRef<HTMLDivElement>(null);

  // Refs para pinch-to-zoom suave
  const lastTouchDistance = useRef<number | null>(null);
  const initialScale = useRef(1.0);
  const currentVisualScale = useRef(1.0);
  const rafId = useRef<number | null>(null);

  // Dimensoes da tela para responsividade
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    isLandscape:
      typeof window !== "undefined"
        ? window.innerWidth > window.innerHeight
        : false,
  });

  // Detectar mudanca de orientacao/tamanho da tela
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isLandscape: window.innerWidth > window.innerHeight,
      });
    };

    // orientationchange precisa de um delay porque as dimensoes
    // nao estao atualizadas imediatamente apos o evento
    const handleOrientationChange = () => {
      updateScreenSize();
      setTimeout(updateScreenSize, 100);
      setTimeout(updateScreenSize, 300);
    };

    window.addEventListener("resize", updateScreenSize);
    window.addEventListener("orientationchange", handleOrientationChange);

    if (screen.orientation) {
      screen.orientation.addEventListener("change", handleOrientationChange);
    }

    return () => {
      window.removeEventListener("resize", updateScreenSize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      if (screen.orientation) {
        screen.orientation.removeEventListener(
          "change",
          handleOrientationChange
        );
      }
    };
  }, []);

  // Calcular largura ideal do PDF baseada na orientacao
  // Em landscape, usa ratio A4 para calcular largura otima
  const getOptimalWidth = useCallback(() => {
    const padding = 40;
    const availableWidth = screenSize.width - padding;
    const availableHeight = screenSize.height - 120;

    if (screenSize.isLandscape) {
      const widthFromHeight = availableHeight / 1.414;
      return Math.min(widthFromHeight, availableWidth * 0.85);
    }
    return Math.min(availableWidth, 600);
  }, [screenSize]);

  // Zoom maximo depende da orientacao - landscape permite mais zoom
  const maxZoom = screenSize.isLandscape ? 5.0 : 4.0;

  const onDocumentLoadSuccess = useCallback(
    ({ numPages: pages }: { numPages: number }) => {
      setNumPages(pages);
      setPageNumber(1);
      setLoading(false);
      setError(null);
    },
    []
  );

  const onDocumentLoadError = useCallback((err: Error) => {
    setLoading(false);
    setError("Erro ao carregar PDF");
    console.error("PDF load error:", err);
  }, []);

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
  };

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.25, maxZoom));
  }, [maxZoom]);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1.0);
  }, []);

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        setPageNumber((prev) => Math.max(prev - 1, 1));
      } else if (e.key === "ArrowRight") {
        setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
      } else if (e.key === "+" || e.key === "=") {
        setScale((prev) => Math.min(prev + 0.25, maxZoom));
      } else if (e.key === "-") {
        setScale((prev) => Math.max(prev - 0.25, 0.5));
      }
    },
    [numPages, onClose, maxZoom]
  );

  // Handler para Ctrl+Scroll fazer zoom no PDF
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setScale((prev) => Math.min(Math.max(prev + delta, 0.5), maxZoom));
      }
    },
    [maxZoom]
  );

  // Calcula distancia entre dois toques
  const getTouchDistance = useCallback((touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Aplica zoom visual via CSS transform (sem re-render durante o gesto)
  const applyVisualZoom = useCallback(
    (visualScale: number) => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(() => {
        if (pdfWrapperRef.current) {
          const relativeScale = visualScale / scale;
          pdfWrapperRef.current.style.transform = `scale(${relativeScale})`;
          pdfWrapperRef.current.style.transformOrigin = "center center";
        }
      });
    },
    [scale]
  );

  // Pinch-to-zoom suave: inicio do toque
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        lastTouchDistance.current = getTouchDistance(e.touches);
        initialScale.current = scale;
        currentVisualScale.current = scale;
      }
    },
    [scale, getTouchDistance]
  );

  // Pinch-to-zoom suave: movimento (usa CSS transform para feedback visual imediato)
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && lastTouchDistance.current !== null) {
        e.preventDefault();
        const currentDistance = getTouchDistance(e.touches);
        const distanceRatio = currentDistance / lastTouchDistance.current;
        const newVisualScale = Math.min(
          Math.max(initialScale.current * distanceRatio, 0.5),
          maxZoom
        );
        currentVisualScale.current = newVisualScale;
        applyVisualZoom(newVisualScale);
      }
    },
    [getTouchDistance, maxZoom, applyVisualZoom]
  );

  // Pinch-to-zoom suave: fim do toque (aplica o estado final ao React)
  const handleTouchEnd = useCallback(() => {
    if (lastTouchDistance.current !== null) {
      if (pdfWrapperRef.current) {
        pdfWrapperRef.current.style.transform = "scale(1)";
      }
      const finalScale = currentVisualScale.current;
      if (Math.abs(finalScale - scale) > 0.01) {
        setScale(finalScale);
      }
    }
    lastTouchDistance.current = null;
  }, [scale]);

  // Previne zoom da pagina inteira quando Ctrl+Scroll no modal
  useEffect(() => {
    if (!isOpen) return;

    const preventBrowserZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    const container = pdfContainerRef.current;
    if (container) {
      container.addEventListener("wheel", preventBrowserZoom, {
        passive: false,
      });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", preventBrowserZoom);
      }
    };
  }, [isOpen]);

  // Handler para fechar ao clicar no backdrop (area escura)
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const { shouldRender, isExiting } = useAnimatedVisibility(isOpen, 200);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        background: "rgba(0, 0, 0, 0.92)",
        animation: isExiting
          ? "fadeOut 0.2s ease forwards"
          : "fadeIn 0.2s ease",
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header / Toolbar - compacto em landscape */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: screenSize.isLandscape ? "8px 16px" : "12px 20px",
          background: "rgba(30, 30, 40, 0.95)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          gap: screenSize.isLandscape ? "12px" : "16px",
          flexWrap: "wrap",
          flexShrink: 0,
        }}
      >
        {/* Titulo - oculto em landscape mobile para economizar espaco */}
        {!screenSize.isLandscape && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              minWidth: 0,
              flex: "1 1 auto",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "15px",
                fontWeight: "600",
                color: "#fff",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </span>
          </div>
        )}

        {/* Controles centrais */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Navegacao de paginas */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "4px",
            }}
          >
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              title="Pagina anterior (←)"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                border: "none",
                background:
                  pageNumber <= 1
                    ? "transparent"
                    : "rgba(255, 255, 255, 0.1)",
                color:
                  pageNumber <= 1
                    ? "rgba(255, 255, 255, 0.3)"
                    : "#fff",
                cursor: pageNumber <= 1 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <span
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "13px",
                color: "#fff",
                padding: "0 8px",
                minWidth: "80px",
                textAlign: "center",
              }}
            >
              {numPages ? `${pageNumber} / ${numPages}` : "..."}
            </span>

            <button
              onClick={goToNextPage}
              disabled={pageNumber >= (numPages || 1)}
              title="Proxima pagina (→)"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                border: "none",
                background:
                  pageNumber >= (numPages || 1)
                    ? "transparent"
                    : "rgba(255, 255, 255, 0.1)",
                color:
                  pageNumber >= (numPages || 1)
                    ? "rgba(255, 255, 255, 0.3)"
                    : "#fff",
                cursor:
                  pageNumber >= (numPages || 1) ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Separador */}
          <div
            style={{
              width: "1px",
              height: "24px",
              background: "rgba(255, 255, 255, 0.15)",
            }}
          />

          {/* Controles de zoom */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "4px",
            }}
          >
            <button
              onClick={zoomOut}
              disabled={scale <= 0.5}
              title="Diminuir zoom (-)"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                border: "none",
                background:
                  scale <= 0.5
                    ? "transparent"
                    : "rgba(255, 255, 255, 0.1)",
                color:
                  scale <= 0.5
                    ? "rgba(255, 255, 255, 0.3)"
                    : "#fff",
                cursor: scale <= 0.5 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>

            <button
              onClick={resetZoom}
              title="Resetar zoom"
              style={{
                padding: "0 8px",
                height: "32px",
                borderRadius: "6px",
                border: "none",
                background: "transparent",
                color: "#fff",
                fontFamily: "Outfit, sans-serif",
                fontSize: "12px",
                fontWeight: "500",
                cursor: "pointer",
                minWidth: "50px",
              }}
            >
              {Math.round(scale * 100)}%
            </button>

            <button
              onClick={zoomIn}
              disabled={scale >= maxZoom}
              title={`Aumentar zoom (+) max ${Math.round(maxZoom * 100)}%`}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                border: "none",
                background:
                  scale >= maxZoom
                    ? "transparent"
                    : "rgba(255, 255, 255, 0.1)",
                color:
                  scale >= maxZoom
                    ? "rgba(255, 255, 255, 0.3)"
                    : "#fff",
                cursor: scale >= maxZoom ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
          </div>
        </div>

        {/* Acoes */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Download */}
          <button
            onClick={handleDownload}
            title="Abrir em nova aba"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              background:
                "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
              color: "#fff",
              fontFamily: "Outfit, sans-serif",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Abrir
          </button>

          {/* Fechar */}
          <button
            onClick={onClose}
            title="Fechar (Esc)"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              border: "none",
              background: "rgba(231, 76, 60, 0.15)",
              color: "#e74c3c",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Area do PDF - clicavel para fechar, suporta pinch-to-zoom */}
      <div
        ref={pdfContainerRef}
        onClick={handleBackdropClick}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "20px",
          background: "rgba(40, 40, 50, 0.5)",
          cursor: "pointer",
          touchAction: "manipulation",
          overscrollBehavior: "contain",
        }}
      >
        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: "16px",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2"
              style={{ animation: "spin 1s linear infinite" }}
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
            </svg>
            <span
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              Carregando PDF...
            </span>
          </div>
        )}

        {error && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: "16px",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e74c3c"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "14px",
                color: "#e74c3c",
              }}
            >
              {error}
            </span>
          </div>
        )}

        {/* Wrapper para aplicar CSS transform durante pinch-to-zoom */}
        <div
          ref={pdfWrapperRef}
          style={{
            willChange: "transform",
            transition: "none",
          }}
        >
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            error={null}
          >
            <Page
              pageNumber={pageNumber}
              width={getOptimalWidth()}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={null}
            />
          </Document>
        </div>
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
          cursor: default;
        }

        .react-pdf__Page {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          border-radius: 4px;
          overflow: hidden;
          cursor: default;
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
