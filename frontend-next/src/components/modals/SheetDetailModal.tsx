"use client";

// ===== SHEET DETAIL MODAL =====
// Modal de detalhes da partitura com opcoes de download
// Suporta URL compartilhavel: /acervo/:categoria/:id
// Refatorado: extraido componentes e hook de download

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@contexts/AuthContext";
import { useUI } from "@contexts/UIContext";
import { useData } from "@contexts/DataContext";
import { Icons } from "@constants/icons";
import { API } from "@lib/api";
import CategoryIcon from "@components/common/CategoryIcon";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { useSheetDownload, findParteExata } from "@hooks/useSheetDownload";
import type { Parte } from "@hooks/useSheetDownload";
import { PartePicker, DownloadConfirm, InstrumentSelector } from "./sheet";

const PDFViewerModal = dynamic(() => import("./PDFViewerModal"), {
  ssr: false,
});

const SheetDetailModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const {
    selectedSheet,
    setSelectedSheet,
    showToast,
    addToShareCart,
    removeFromShareCart,
    shareCart,
  } = useUI();
  const { favorites, toggleFavorite, categoriesMap, instrumentNames } =
    useData();

  // Estado local
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [showInstrumentPicker, setShowInstrumentPicker] = useState(false);
  const [partes, setPartes] = useState<Parte[]>([]);
  const [loadingPartes, setLoadingPartes] = useState(false);

  // Hook de download
  const download = useSheetDownload({
    showToast,
    selectedSheet,
    partes,
  });

  // Handler para adicionar parte ao carrinho de compartilhamento
  const handleAddToCart = useCallback(
    (instrument: string) => {
      if (!selectedSheet) return;

      const parte = findParteExata(instrument, partes);
      if (parte) {
        addToShareCart({
          parteId: parte.id,
          parteName: parte.instrumento,
          partituraTitle: selectedSheet.title,
          downloadUrl: "",
        });
        showToast(`${parte.instrumento} adicionado ao carrinho`);
      } else {
        showToast("Parte não encontrada", "error");
      }
    },
    [selectedSheet, partes, addToShareCart, showToast]
  );

  // Travar scroll do body quando modal estiver aberto
  useEffect(() => {
    if (selectedSheet) {
      // Salvar posicao atual do scroll
      const scrollY = window.scrollY;

      // Aplicar classe que trava scroll (definida em base.css com !important)
      document.documentElement.classList.add("modal-open");
      document.body.style.top = `-${scrollY}px`;

      return () => {
        // Restaurar scroll
        document.documentElement.classList.remove("modal-open");
        document.body.style.top = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [selectedSheet]);

  // Buscar partes quando abrir o modal
  useEffect(() => {
    if (!selectedSheet) return;

    let cancelled = false;
    setShowInstrumentPicker(false);
    download.handleCancelDownload();

    const fetchPartes = async () => {
      setLoadingPartes(true);
      try {
        const data = await API.getPartesPartitura(selectedSheet.id);
        if (!cancelled) {
          setPartes(data || []);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("Erro ao buscar partes:", e);
          setPartes([]);
        }
      }
      if (!cancelled) {
        setLoadingPartes(false);
      }
    };

    fetchPartes();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- download e estavel (useSheetDownload)
  }, [selectedSheet]);

  const handleClose = () => {
    setSelectedSheet(null);
    // Se estamos numa URL de partitura, volta para o acervo da categoria
    if (
      pathname.includes("/acervo/") &&
      pathname.split("/").length > 3
    ) {
      const categoria = selectedSheet?.category || "dobrado";
      router.push(`/acervo/${categoria}`);
    }
  };

  // Dados derivados do selectedSheet (so acessados quando existe)
  const category = selectedSheet
    ? categoriesMap.get(selectedSheet.category)
    : null;
  const isFavorite = selectedSheet
    ? favorites.includes(selectedSheet.id)
    : false;
  const userInstrument = user?.instrumento || "Trompete Bb";
  const userInstrumentLower = userInstrument?.toLowerCase() || "";
  const isMaestro =
    userInstrumentLower === "maestro" || userInstrumentLower === "regente";
  const hasGrade = partes.some(
    (p) => p.instrumento?.toLowerCase() === "grade"
  );
  const availableInstruments =
    partes.length > 0
      ? [...new Set(partes.map((p) => p.instrumento))]
      : instrumentNames;

  return (
    <AnimatePresence>
      {selectedSheet && (
        <>
          {/* Overlay */}
          <motion.div
            key="sheet-modal-overlay"
            onClick={handleClose}
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 2000,
            }}
          />

          {/* Modal de Selecao de Partes */}
          <PartePicker
            isOpen={download.showPartePicker}
            partes={download.partesDisponiveis}
            instrumentName={download.confirmInstrument || ""}
            downloading={download.downloading}
            onSelectParte={download.downloadParteDireta}
            onClose={download.closePartePicker}
          />

          {/* Modal de Confirmacao */}
          <DownloadConfirm
            isOpen={
              !!download.confirmInstrument && !download.showPartePicker
            }
            instrumentName={download.confirmInstrument || ""}
            downloading={download.downloading}
            onConfirm={download.handleConfirmDownload}
            onCancel={download.handleCancelDownload}
          />

          {/* Visualizador de PDF embutido */}
          <Suspense
            fallback={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "32px",
                }}
              >
                Carregando visualizador...
              </div>
            }
          >
            <PDFViewerModal
              isOpen={download.pdfViewer.isOpen}
              pdfUrl={download.pdfViewer.url}
              title={`${download.pdfViewer.title} - ${download.pdfViewer.instrument}`}
              onClose={download.closePdfViewer}
              onDownload={() => {
                // Abre em nova aba como fallback
                if (download.pdfViewer.url) {
                  window.open(download.pdfViewer.url, "_blank");
                }
              }}
            />
          </Suspense>

          {/* Modal Principal */}
          <motion.div
            key="sheet-modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-detail-title"
            initial={
              isDesktop
                ? { opacity: 0, scale: 0.95 }
                : { opacity: 1, y: "100%" }
            }
            animate={
              isDesktop
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, y: 0 }
            }
            exit={
              isDesktop
                ? { opacity: 0, scale: 0.95 }
                : { opacity: 1, y: "100%" }
            }
            transition={{
              type: "spring" as const,
              stiffness: 350,
              damping: 30,
            }}
            style={{
              position: "fixed",
              ...(isDesktop
                ? {
                    top: "50%",
                    left: "50%",
                    x: "-50%",
                    y: "-50%",
                    width: "420px",
                    maxWidth: "90vw",
                    borderRadius: "20px",
                  }
                : {
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderRadius: "24px 24px 0 0",
                  }),
              background: "var(--bg-card)",
              zIndex: 2001,
              maxHeight: isDesktop ? "85vh" : "90vh",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Handle - apenas mobile */}
            {!isDesktop && (
              <div
                style={{
                  width: "40px",
                  height: "4px",
                  background: "var(--border)",
                  borderRadius: "2px",
                  margin: "12px auto",
                  flexShrink: 0,
                }}
              />
            )}

            {/* Header com imagem */}
            <div
              style={{
                background:
                  "linear-gradient(145deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)",
                padding: isDesktop ? "20px" : "16px 20px",
                position: "relative",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-20px",
                  right: "-20px",
                  width: "100px",
                  height: "100px",
                  background: "rgba(212, 175, 55, 0.1)",
                  borderRadius: "50%",
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    background:
                      "linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)",
                    border:
                      "1px solid rgba(212, 175, 55, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CategoryIcon
                    categoryId={category?.id || ""}
                    size={26}
                    color="var(--accent)"
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2
                    id="sheet-detail-title"
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "17px",
                      fontWeight: "700",
                      color: "var(--text-primary)",
                      marginBottom: "3px",
                      lineHeight: "1.3",
                    }}
                  >
                    {selectedSheet.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      marginBottom: "6px",
                    }}
                  >
                    {selectedSheet.composer}
                  </p>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 8px",
                      background: "rgba(212, 175, 55, 0.15)",
                      color: "var(--accent)",
                      borderRadius: "6px",
                      fontSize: "10px",
                      fontWeight: "600",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    {category?.name}
                  </span>
                </div>

                <button
                  onClick={handleClose}
                  aria-label="Fechar modal"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "var(--bg-secondary)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    flexShrink: 0,
                  }}
                >
                  <div style={{ width: "16px", height: "16px" }}>
                    <Icons.Close />
                  </div>
                </button>
              </div>
            </div>

            {/* Conteudo scrollavel */}
            <div
              style={{
                padding: isDesktop
                  ? "16px 20px 20px"
                  : "16px 20px 28px",
                overflowY: "auto",
                flex: 1,
              }}
            >
              {/* Info compacta */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    background: "var(--bg-secondary)",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      color: "var(--text-muted)",
                    }}
                  >
                    <Icons.Download />
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    {selectedSheet.downloads || 0}
                  </span>
                </div>
                <div
                  style={{
                    background: "var(--bg-secondary)",
                    padding: "8px 12px",
                    borderRadius: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    {selectedSheet.year}
                  </span>
                </div>
                {selectedSheet.featured && (
                  <div
                    style={{
                      background: "rgba(212, 175, 55, 0.15)",
                      padding: "8px 12px",
                      borderRadius: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--accent)",
                        fontFamily: "Outfit, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="var(--accent)"
                        stroke="none"
                        aria-hidden="true"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      Destaque
                    </span>
                  </div>
                )}
              </div>

              {/* Opcoes de Download */}
              <div style={{ marginBottom: "14px" }}>
                <p
                  style={{
                    fontSize: "10px",
                    color: "var(--text-muted)",
                    marginBottom: "8px",
                    fontFamily: "Outfit, sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontWeight: "600",
                  }}
                >
                  Baixar Partitura
                </p>

                {/* Botao Download - Meu Instrumento ou Grade (Maestro) */}
                {isMaestro && !hasGrade && !loadingPartes ? (
                  /* Botao desabilitado quando nao ha grade */
                  <button
                    data-walkthrough="quick-download"
                    disabled
                    aria-label="Grade não disponível"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      color: "var(--text-muted)",
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      opacity: 0.6,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                        }}
                      >
                        <Icons.Download />
                      </div>
                      <span>Grade nao disponivel</span>
                    </div>
                    <span
                      style={{
                        background: "var(--bg-card)",
                        padding: "3px 8px",
                        borderRadius: "5px",
                        fontSize: "10px",
                        fontWeight: "700",
                      }}
                    >
                      Indisponivel
                    </span>
                  </button>
                ) : (
                  <button
                    data-walkthrough="quick-download"
                    onClick={() =>
                      download.handleSelectInstrument(
                        isMaestro ? "Grade" : userInstrument
                      )
                    }
                    aria-label={
                      isMaestro
                        ? "Baixar grade"
                        : `Baixar partitura para ${userInstrument}`
                    }
                    disabled={loadingPartes}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      background: loadingPartes
                        ? "var(--bg-secondary)"
                        : "linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)",
                      border: "none",
                      color: loadingPartes
                        ? "var(--text-muted)"
                        : "#F4E4BC",
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: loadingPartes ? "wait" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      boxShadow: loadingPartes
                        ? "none"
                        : "0 4px 12px rgba(114, 47, 55, 0.3)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                        }}
                      >
                        <Icons.Download />
                      </div>
                      <span>
                        {loadingPartes
                          ? "Carregando..."
                          : isMaestro
                            ? "Baixar Grade"
                            : "Meu Instrumento"}
                      </span>
                    </div>
                    <span
                      style={{
                        background: "rgba(244, 228, 188, 0.2)",
                        padding: "3px 8px",
                        borderRadius: "5px",
                        fontSize: "10px",
                        fontWeight: "700",
                      }}
                    >
                      {isMaestro ? "Grade" : userInstrument}
                    </span>
                  </button>
                )}

                {/* Seletor de Outros Instrumentos */}
                <div data-walkthrough="instrument-selector">
                  <InstrumentSelector
                    isOpen={showInstrumentPicker}
                    instruments={availableInstruments}
                    userInstrument={userInstrument}
                    isMaestro={isMaestro}
                    downloading={download.downloading}
                    canShare={download.canShareFiles()}
                    shareCart={shareCart
                      .filter(
                        (item) =>
                          item.parteId !== undefined
                      )
                      .map((item) => ({
                        instrument: item.parteName,
                        parteId: item.parteId,
                      }))}
                    onToggle={() =>
                      setShowInstrumentPicker(
                        !showInstrumentPicker
                      )
                    }
                    onSelectInstrument={
                      download.handleSelectParteEspecifica
                    }
                    onPrintInstrument={
                      download.handlePrintInstrument
                    }
                    onViewInstrument={
                      download.handleViewInstrument
                    }
                    onShareInstrument={
                      download.handleShareInstrument
                    }
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={removeFromShareCart}
                  />
                </div>
              </div>

              {/* Botoes Imprimir, Compartilhar e Favoritar */}
              <div
                data-walkthrough="sheet-options"
                style={{ display: "flex", gap: "8px" }}
              >
                <button
                  onClick={() =>
                    download.handlePrintInstrument(
                      isMaestro ? "Grade" : userInstrument
                    )
                  }
                  disabled={
                    download.downloading ||
                    loadingPartes ||
                    (isMaestro && !hasGrade)
                  }
                  aria-label="Imprimir partitura"
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "10px",
                    background:
                      isMaestro && !hasGrade
                        ? "var(--bg-secondary)"
                        : "rgba(52, 152, 219, 0.1)",
                    border:
                      isMaestro && !hasGrade
                        ? "1.5px solid var(--border)"
                        : "1.5px solid rgba(52, 152, 219, 0.3)",
                    color:
                      isMaestro && !hasGrade
                        ? "var(--text-muted)"
                        : "#3498db",
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor:
                      (isMaestro && !hasGrade) ||
                      download.downloading ||
                      loadingPartes
                        ? "not-allowed"
                        : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    opacity:
                      isMaestro && !hasGrade ? 0.5 : 1,
                  }}
                >
                  <div
                    style={{ width: "14px", height: "14px" }}
                  >
                    <Icons.Printer />
                  </div>
                  Imprimir
                </button>

                {/* Botao Compartilhar - apenas se suportado */}
                {download.canShareFiles() && (
                  <button
                    onClick={() =>
                      download.handleShareInstrument(
                        isMaestro ? "Grade" : userInstrument
                      )
                    }
                    disabled={
                      download.downloading ||
                      loadingPartes ||
                      (isMaestro && !hasGrade)
                    }
                    aria-label="Compartilhar partitura"
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      background:
                        isMaestro && !hasGrade
                          ? "var(--bg-secondary)"
                          : "rgba(37, 211, 102, 0.1)",
                      border:
                        isMaestro && !hasGrade
                          ? "1.5px solid var(--border)"
                          : "1.5px solid rgba(37, 211, 102, 0.3)",
                      color:
                        isMaestro && !hasGrade
                          ? "var(--text-muted)"
                          : "#25D366",
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor:
                        (isMaestro && !hasGrade) ||
                        download.downloading ||
                        loadingPartes
                          ? "not-allowed"
                          : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      opacity:
                        isMaestro && !hasGrade ? 0.5 : 1,
                    }}
                  >
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                      }}
                    >
                      <Icons.Share />
                    </div>
                    Enviar
                  </button>
                )}

                <button
                  onClick={() =>
                    toggleFavorite(selectedSheet.id)
                  }
                  aria-pressed={isFavorite}
                  aria-label={
                    isFavorite
                      ? "Remover dos favoritos"
                      : "Adicionar aos favoritos"
                  }
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "10px",
                    background: isFavorite
                      ? "rgba(232,90,79,0.1)"
                      : "transparent",
                    border: isFavorite
                      ? "1.5px solid var(--primary)"
                      : "1.5px solid var(--border)",
                    color: isFavorite
                      ? "var(--primary)"
                      : "var(--text-muted)",
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{ width: "14px", height: "14px" }}
                  >
                    <Icons.Heart filled={isFavorite} />
                  </div>
                  {isFavorite ? "Favorito" : "Favoritar"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SheetDetailModal;
