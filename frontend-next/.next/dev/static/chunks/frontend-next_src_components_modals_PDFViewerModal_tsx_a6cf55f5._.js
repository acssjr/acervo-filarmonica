(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend-next/src/components/modals/PDFViewerModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// ===== PDF VIEWER MODAL =====
// Visualizador de PDF elegante usando react-pdf
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$react$2d$pdf$2f$dist$2f$Document$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Document$3e$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/react-pdf/dist/Document.js [app-client] (ecmascript) <export default as Document>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$react$2d$pdf$2f$dist$2f$Page$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Page$3e$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/react-pdf/dist/Page.js [app-client] (ecmascript) <export default as Page>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$pdfjs$2d$dist$2f$build$2f$pdf$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__pdfjs$3e$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/pdfjs-dist/build/pdf.mjs [app-client] (ecmascript) <export * as pdfjs>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useAnimatedVisibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/hooks/useAnimatedVisibility.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// Configurar worker do PDF.js
__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$pdfjs$2d$dist$2f$build$2f$pdf$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__pdfjs$3e$__["pdfjs"].GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$pdfjs$2d$dist$2f$build$2f$pdf$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__pdfjs$3e$__["pdfjs"].version}/build/pdf.worker.min.mjs`;
const PDFViewerModal = ({ isOpen, onClose, pdfUrl, title = "Visualizador de PDF", onDownload })=>{
    _s();
    const [numPages, setNumPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pageNumber, setPageNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [scale, setScale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1.0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const pdfContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pdfWrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Refs para pinch-to-zoom suave
    const lastTouchDistance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const initialScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(1.0);
    const currentVisualScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(1.0);
    const rafId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Dimensoes da tela para responsividade
    const [screenSize, setScreenSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        width: ("TURBOPACK compile-time truthy", 1) ? window.innerWidth : "TURBOPACK unreachable",
        height: ("TURBOPACK compile-time truthy", 1) ? window.innerHeight : "TURBOPACK unreachable",
        isLandscape: ("TURBOPACK compile-time truthy", 1) ? window.innerWidth > window.innerHeight : "TURBOPACK unreachable"
    });
    // Detectar mudanca de orientacao/tamanho da tela
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PDFViewerModal.useEffect": ()=>{
            const updateScreenSize = {
                "PDFViewerModal.useEffect.updateScreenSize": ()=>{
                    setScreenSize({
                        width: window.innerWidth,
                        height: window.innerHeight,
                        isLandscape: window.innerWidth > window.innerHeight
                    });
                }
            }["PDFViewerModal.useEffect.updateScreenSize"];
            // orientationchange precisa de um delay porque as dimensoes
            // nao estao atualizadas imediatamente apos o evento
            const handleOrientationChange = {
                "PDFViewerModal.useEffect.handleOrientationChange": ()=>{
                    updateScreenSize();
                    setTimeout(updateScreenSize, 100);
                    setTimeout(updateScreenSize, 300);
                }
            }["PDFViewerModal.useEffect.handleOrientationChange"];
            window.addEventListener("resize", updateScreenSize);
            window.addEventListener("orientationchange", handleOrientationChange);
            if (screen.orientation) {
                screen.orientation.addEventListener("change", handleOrientationChange);
            }
            return ({
                "PDFViewerModal.useEffect": ()=>{
                    window.removeEventListener("resize", updateScreenSize);
                    window.removeEventListener("orientationchange", handleOrientationChange);
                    if (screen.orientation) {
                        screen.orientation.removeEventListener("change", handleOrientationChange);
                    }
                }
            })["PDFViewerModal.useEffect"];
        }
    }["PDFViewerModal.useEffect"], []);
    // Calcular largura ideal do PDF baseada na orientacao
    // Em landscape, usa ratio A4 para calcular largura otima
    const getOptimalWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PDFViewerModal.useCallback[getOptimalWidth]": ()=>{
            const padding = 40;
            const availableWidth = screenSize.width - padding;
            const availableHeight = screenSize.height - 120;
            if (screenSize.isLandscape) {
                const widthFromHeight = availableHeight / 1.414;
                return Math.min(widthFromHeight, availableWidth * 0.85);
            }
            return Math.min(availableWidth, 600);
        }
    }["PDFViewerModal.useCallback[getOptimalWidth]"], [
        screenSize
    ]);
    // Zoom maximo depende da orientacao - landscape permite mais zoom
    const maxZoom = screenSize.isLandscape ? 5.0 : 4.0;
    const onDocumentLoadSuccess = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PDFViewerModal.useCallback[onDocumentLoadSuccess]": ({ numPages: pages })=>{
            setNumPages(pages);
            setPageNumber(1);
            setLoading(false);
            setError(null);
        }
    }["PDFViewerModal.useCallback[onDocumentLoadSuccess]"], []);
    const onDocumentLoadError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PDFViewerModal.useCallback[onDocumentLoadError]": (err)=>{
            setLoading(false);
            setError("Erro ao carregar PDF");
            console.error("PDF load error:", err);
        }
    }["PDFViewerModal.useCallback[onDocumentLoadError]"], []);
    const goToPrevPage = ()=>{
        setPageNumber((prev)=>Math.max(prev - 1, 1));
    };
    const goToNextPage = ()=>{
        setPageNumber((prev)=>Math.min(prev + 1, numPages || 1));
    };
    const zoomIn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PDFViewerModal.useCallback[zoomIn]": ()=>{
            setScale({
                "PDFViewerModal.useCallback[zoomIn]": (prev)=>Math.min(prev + 0.25, maxZoom)
            }["PDFViewerModal.useCallback[zoomIn]"]);
        }
    }["PDFViewerModal.useCallback[zoomIn]"], [
        maxZoom
    ]);
    const zoomOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PDFViewerModal.useCallback[zoomOut]": ()=>{
            setScale({
                "PDFViewerModal.useCallback[zoomOut]": (prev)=>Math.max(prev - 0.25, 0.5)
            }["PDFViewerModal.useCallback[zoomOut]"]);
        }
    }["PDFViewerModal.useCallback[zoomOut]"], []);
    const resetZoom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PDFViewerModal.useCallback[resetZoom]": ()=>{
            setScale(1.0);
        }
    }["PDFViewerModal.useCallback[resetZoom]"], []);
    const handleDownload = ()=>{
        if (onDownload) {
            onDownload();
        } else if (pdfUrl) {
            window.open(pdfUrl, "_blank");
        }
    };
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PDFViewerModal.useCallback[handleKeyDown]": (e)=>{
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowLeft") {
                setPageNumber({
                    "PDFViewerModal.useCallback[handleKeyDown]": (prev)=>Math.max(prev - 1, 1)
                }["PDFViewerModal.useCallback[handleKeyDown]"]);
            } else if (e.key === "ArrowRight") {
                setPageNumber({
                    "PDFViewerModal.useCallback[handleKeyDown]": (prev)=>Math.min(prev + 1, numPages || 1)
                }["PDFViewerModal.useCallback[handleKeyDown]"]);
            } else if (e.key === "+" || e.key === "=") {
                setScale({
                    "PDFViewerModal.useCallback[handleKeyDown]": (prev)=>Math.min(prev + 0.25, maxZoom)
                }["PDFViewerModal.useCallback[handleKeyDown]"]);
            } else if (e.key === "-") {
                setScale({
                    "PDFViewerModal.useCallback[handleKeyDown]": (prev)=>Math.max(prev - 0.25, 0.5)
                }["PDFViewerModal.useCallback[handleKeyDown]"]);
            }
        }
    }["PDFViewerModal.useCallback[handleKeyDown]"], [
        numPages,
        onClose,
        maxZoom
    ]);
    // Handler para Ctrl+Scroll fazer zoom no PDF
    const handleWheel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PDFViewerModal.useCallback[handleWheel]": (e)=>{
            if (e.ctrlKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setScale({
                    "PDFViewerModal.useCallback[handleWheel]": (prev)=>Math.min(Math.max(prev + delta, 0.5), maxZoom)
                }["PDFViewerModal.useCallback[handleWheel]"]);
            }
        }
    }["PDFViewerModal.useCallback[handleWheel]"], [
        maxZoom
    ]);
    // Calcula distancia entre dois toques
    const getTouchDistance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PDFViewerModal.useCallback[getTouchDistance]": (touches)=>{
            if (touches.length < 2) return 0;
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }
    }["PDFViewerModal.useCallback[getTouchDistance]"], []);
    // Aplica zoom visual via CSS transform (sem re-render durante o gesto)
    const applyVisualZoom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PDFViewerModal.useCallback[applyVisualZoom]": (visualScale)=>{
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
            rafId.current = requestAnimationFrame({
                "PDFViewerModal.useCallback[applyVisualZoom]": ()=>{
                    if (pdfWrapperRef.current) {
                        const relativeScale = visualScale / scale;
                        pdfWrapperRef.current.style.transform = `scale(${relativeScale})`;
                        pdfWrapperRef.current.style.transformOrigin = "center center";
                    }
                }
            }["PDFViewerModal.useCallback[applyVisualZoom]"]);
        }
    }["PDFViewerModal.useCallback[applyVisualZoom]"], [
        scale
    ]);
    // Pinch-to-zoom suave: inicio do toque
    const handleTouchStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PDFViewerModal.useCallback[handleTouchStart]": (e)=>{
            if (e.touches.length === 2) {
                lastTouchDistance.current = getTouchDistance(e.touches);
                initialScale.current = scale;
                currentVisualScale.current = scale;
            }
        }
    }["PDFViewerModal.useCallback[handleTouchStart]"], [
        scale,
        getTouchDistance
    ]);
    // Pinch-to-zoom suave: movimento (usa CSS transform para feedback visual imediato)
    const handleTouchMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PDFViewerModal.useCallback[handleTouchMove]": (e)=>{
            if (e.touches.length === 2 && lastTouchDistance.current !== null) {
                e.preventDefault();
                const currentDistance = getTouchDistance(e.touches);
                const distanceRatio = currentDistance / lastTouchDistance.current;
                const newVisualScale = Math.min(Math.max(initialScale.current * distanceRatio, 0.5), maxZoom);
                currentVisualScale.current = newVisualScale;
                applyVisualZoom(newVisualScale);
            }
        }
    }["PDFViewerModal.useCallback[handleTouchMove]"], [
        getTouchDistance,
        maxZoom,
        applyVisualZoom
    ]);
    // Pinch-to-zoom suave: fim do toque (aplica o estado final ao React)
    const handleTouchEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PDFViewerModal.useCallback[handleTouchEnd]": ()=>{
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
        }
    }["PDFViewerModal.useCallback[handleTouchEnd]"], [
        scale
    ]);
    // Previne zoom da pagina inteira quando Ctrl+Scroll no modal
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PDFViewerModal.useEffect": ()=>{
            if (!isOpen) return;
            const preventBrowserZoom = {
                "PDFViewerModal.useEffect.preventBrowserZoom": (e)=>{
                    if (e.ctrlKey) {
                        e.preventDefault();
                    }
                }
            }["PDFViewerModal.useEffect.preventBrowserZoom"];
            const container = pdfContainerRef.current;
            if (container) {
                container.addEventListener("wheel", preventBrowserZoom, {
                    passive: false
                });
            }
            return ({
                "PDFViewerModal.useEffect": ()=>{
                    if (container) {
                        container.removeEventListener("wheel", preventBrowserZoom);
                    }
                }
            })["PDFViewerModal.useEffect"];
        }
    }["PDFViewerModal.useEffect"], [
        isOpen
    ]);
    // Cancela requestAnimationFrame pendente ao desmontar ou fechar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PDFViewerModal.useEffect": ()=>{
            return ({
                "PDFViewerModal.useEffect": ()=>{
                    if (rafId.current !== null) {
                        cancelAnimationFrame(rafId.current);
                        rafId.current = null;
                    }
                }
            })["PDFViewerModal.useEffect"];
        }
    }["PDFViewerModal.useEffect"], []);
    // Handler para fechar ao clicar no backdrop (area escura)
    const handleBackdropClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PDFViewerModal.useCallback[handleBackdropClick]": (e)=>{
            if (e.target === e.currentTarget) {
                onClose();
            }
        }
    }["PDFViewerModal.useCallback[handleBackdropClick]"], [
        onClose
    ]);
    const { shouldRender, isExiting } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useAnimatedVisibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(isOpen, 200);
    const modalContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Auto-focus para que keyboard events (Escape, setas, zoom) funcionem imediatamente
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PDFViewerModal.useEffect": ()=>{
            if (shouldRender && !isExiting) {
                modalContainerRef.current?.focus();
            }
        }
    }["PDFViewerModal.useEffect"], [
        shouldRender,
        isExiting
    ]);
    if (!shouldRender) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: modalContainerRef,
        style: {
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            background: "rgba(0, 0, 0, 0.92)",
            outline: "none",
            animation: isExiting ? "fadeOut 0.2s ease forwards" : "fadeIn 0.2s ease"
        },
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: screenSize.isLandscape ? "8px 16px" : "12px 20px",
                    background: "rgba(30, 30, 40, 0.95)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    gap: screenSize.isLandscape ? "12px" : "16px",
                    flexWrap: "wrap",
                    flexShrink: 0
                },
                children: [
                    !screenSize.isLandscape && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            minWidth: 0,
                            flex: "1 1 auto"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "20",
                                height: "20",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "#D4AF37",
                                strokeWidth: "2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                        lineNumber: 363,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                        points: "14 2 14 8 20 8"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                        lineNumber: 364,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                lineNumber: 355,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    color: "#fff",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                },
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                lineNumber: 366,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                        lineNumber: 346,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    background: "rgba(255, 255, 255, 0.08)",
                                    borderRadius: "8px",
                                    padding: "4px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: goToPrevPage,
                                        disabled: pageNumber <= 1,
                                        title: "Página anterior (←)",
                                        style: {
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "6px",
                                            border: "none",
                                            background: pageNumber <= 1 ? "transparent" : "rgba(255, 255, 255, 0.1)",
                                            color: pageNumber <= 1 ? "rgba(255, 255, 255, 0.3)" : "#fff",
                                            cursor: pageNumber <= 1 ? "not-allowed" : "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "all 0.2s"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "16",
                                            height: "16",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                points: "15 18 9 12 15 6"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                                lineNumber: 433,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                            lineNumber: 425,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                        lineNumber: 401,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: "var(--font-sans)",
                                            fontSize: "13px",
                                            color: "#fff",
                                            padding: "0 8px",
                                            minWidth: "80px",
                                            textAlign: "center"
                                        },
                                        children: numPages ? `${pageNumber} / ${numPages}` : "..."
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                        lineNumber: 437,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: goToNextPage,
                                        disabled: pageNumber >= (numPages || 1),
                                        title: "Próxima página (→)",
                                        style: {
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "6px",
                                            border: "none",
                                            background: pageNumber >= (numPages || 1) ? "transparent" : "rgba(255, 255, 255, 0.1)",
                                            color: pageNumber >= (numPages || 1) ? "rgba(255, 255, 255, 0.3)" : "#fff",
                                            cursor: pageNumber >= (numPages || 1) ? "not-allowed" : "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "all 0.2s"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "16",
                                            height: "16",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                points: "9 18 15 12 9 6"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                                lineNumber: 483,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                            lineNumber: 475,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                        lineNumber: 450,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                lineNumber: 391,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: "1px",
                                    height: "24px",
                                    background: "rgba(255, 255, 255, 0.15)"
                                }
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                lineNumber: 489,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    background: "rgba(255, 255, 255, 0.08)",
                                    borderRadius: "8px",
                                    padding: "4px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: zoomOut,
                                        disabled: scale <= 0.5,
                                        title: "Diminuir zoom (-)",
                                        style: {
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "6px",
                                            border: "none",
                                            background: scale <= 0.5 ? "transparent" : "rgba(255, 255, 255, 0.1)",
                                            color: scale <= 0.5 ? "rgba(255, 255, 255, 0.3)" : "#fff",
                                            cursor: scale <= 0.5 ? "not-allowed" : "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "all 0.2s"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "16",
                                            height: "16",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: "11",
                                                    cy: "11",
                                                    r: "8"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                                    lineNumber: 540,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "21",
                                                    y1: "21",
                                                    x2: "16.65",
                                                    y2: "16.65"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                                    lineNumber: 541,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "8",
                                                    y1: "11",
                                                    x2: "14",
                                                    y2: "11"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                                    lineNumber: 542,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                            lineNumber: 532,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                        lineNumber: 508,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: resetZoom,
                                        title: "Resetar zoom",
                                        style: {
                                            padding: "0 8px",
                                            height: "32px",
                                            borderRadius: "6px",
                                            border: "none",
                                            background: "transparent",
                                            color: "#fff",
                                            fontFamily: "var(--font-sans)",
                                            fontSize: "12px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                            minWidth: "50px"
                                        },
                                        children: [
                                            Math.round(scale * 100),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                        lineNumber: 546,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: zoomIn,
                                        disabled: scale >= maxZoom,
                                        title: `Aumentar zoom (+) max ${Math.round(maxZoom * 100)}%`,
                                        style: {
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "6px",
                                            border: "none",
                                            background: scale >= maxZoom ? "transparent" : "rgba(255, 255, 255, 0.1)",
                                            color: scale >= maxZoom ? "rgba(255, 255, 255, 0.3)" : "#fff",
                                            cursor: scale >= maxZoom ? "not-allowed" : "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "all 0.2s"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "16",
                                            height: "16",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: "11",
                                                    cy: "11",
                                                    r: "8"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                                    lineNumber: 598,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "21",
                                                    y1: "21",
                                                    x2: "16.65",
                                                    y2: "16.65"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                                    lineNumber: 599,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "11",
                                                    y1: "8",
                                                    x2: "11",
                                                    y2: "14"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                                    lineNumber: 600,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "8",
                                                    y1: "11",
                                                    x2: "14",
                                                    y2: "11"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                                    lineNumber: 601,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                            lineNumber: 590,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                        lineNumber: 566,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                lineNumber: 498,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                        lineNumber: 383,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleDownload,
                                title: "Abrir em nova aba",
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "8px 14px",
                                    borderRadius: "8px",
                                    border: "none",
                                    background: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
                                    color: "#fff",
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "13px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "14",
                                        height: "14",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                                lineNumber: 644,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                points: "15 3 21 3 21 9"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                                lineNumber: 645,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "10",
                                                y1: "14",
                                                x2: "21",
                                                y2: "3"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                                lineNumber: 646,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                        lineNumber: 636,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Abrir"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                lineNumber: 616,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                title: "Fechar (Esc)",
                                style: {
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
                                    transition: "all 0.2s"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "18",
                                    height: "18",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "18",
                                            y1: "6",
                                            x2: "6",
                                            y2: "18"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                            lineNumber: 677,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "6",
                                            y1: "6",
                                            x2: "18",
                                            y2: "18"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                            lineNumber: 678,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                    lineNumber: 669,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                lineNumber: 652,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                        lineNumber: 608,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                lineNumber: 331,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: pdfContainerRef,
                onClick: handleBackdropClick,
                onWheel: handleWheel,
                onTouchStart: handleTouchStart,
                onTouchMove: handleTouchMove,
                onTouchEnd: handleTouchEnd,
                style: {
                    flex: 1,
                    overflow: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    padding: "20px",
                    background: "rgba(40, 40, 50, 0.5)",
                    cursor: "pointer",
                    touchAction: "manipulation",
                    overscrollBehavior: "contain"
                },
                children: [
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            gap: "16px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "40",
                                height: "40",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "#D4AF37",
                                strokeWidth: "2",
                                style: {
                                    animation: "spin 1s linear infinite"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "12",
                                        cy: "12",
                                        r: "10",
                                        strokeOpacity: "0.25"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                        lineNumber: 725,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M12 2a10 10 0 0 1 10 10",
                                        strokeLinecap: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                        lineNumber: 726,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                lineNumber: 716,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "14px",
                                    color: "rgba(255, 255, 255, 0.6)"
                                },
                                children: "Carregando PDF..."
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                lineNumber: 728,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                        lineNumber: 706,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            gap: "16px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "48",
                                height: "48",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "#e74c3c",
                                strokeWidth: "1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "12",
                                        cy: "12",
                                        r: "10"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                        lineNumber: 759,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "15",
                                        y1: "9",
                                        x2: "9",
                                        y2: "15"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                        lineNumber: 760,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "9",
                                        y1: "9",
                                        x2: "15",
                                        y2: "15"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                        lineNumber: 761,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                lineNumber: 751,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "14px",
                                    color: "#e74c3c"
                                },
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                lineNumber: 763,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                        lineNumber: 741,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: pdfWrapperRef,
                        style: {
                            willChange: "transform",
                            transition: "none"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$react$2d$pdf$2f$dist$2f$Document$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Document$3e$__["Document"], {
                            file: pdfUrl,
                            onLoadSuccess: onDocumentLoadSuccess,
                            onLoadError: onDocumentLoadError,
                            loading: null,
                            error: null,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$react$2d$pdf$2f$dist$2f$Page$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Page$3e$__["Page"], {
                                pageNumber: pageNumber,
                                width: getOptimalWidth(),
                                scale: scale,
                                renderTextLayer: true,
                                renderAnnotationLayer: true,
                                loading: null
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                                lineNumber: 790,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                            lineNumber: 783,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                        lineNumber: 776,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                lineNumber: 685,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
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
      `
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
                lineNumber: 803,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/modals/PDFViewerModal.tsx",
        lineNumber: 313,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(PDFViewerModal, "diXqeKowGwQNBkPIkr9/Gy9pQaM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useAnimatedVisibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = PDFViewerModal;
const __TURBOPACK__default__export__ = PDFViewerModal;
var _c;
__turbopack_context__.k.register(_c, "PDFViewerModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/src/components/modals/PDFViewerModal.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend-next/src/components/modals/PDFViewerModal.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=frontend-next_src_components_modals_PDFViewerModal_tsx_a6cf55f5._.js.map