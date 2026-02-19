(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend-next/app/(auth)/compositores/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// ===== COMPOSERS SCREEN =====
// Tela de compositores com fotos e glassmorphism
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/DataContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// Compositores prioritarios (ordem de importancia para a banda) - definido fora do componente para estabilidade
const PRIORITY_ORDER = [
    "Estevam Moura",
    "Tertuliano Santos",
    "Amando Nobre",
    "Heraclio Guerreiro"
];
// Fotos dos compositores (caminhos locais - WebP otimizado)
const COMPOSER_PHOTOS = {
    "Estevam Moura": "/assets/images/compositores/estevam-moura.webp",
    "Tertuliano Santos": "/assets/images/compositores/tertuliano-santos.webp",
    "Amando Nobre": "/assets/images/compositores/amando-nobre.webp",
    "Heraclio Guerreiro": "/assets/images/compositores/heraclio-guerreiro.webp"
};
// Normaliza texto para busca (estilo YouTube)
const normalizeText = (str)=>{
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[ºª°]/g, "") // Remove indicadores ordinais
    .replace(/\./g, " ") // Pontos viram espacos
    .replace(/\s+/g, " ") // Colapsa espacos
    .trim();
};
// Componente de Card do Compositor com Glassmorphism (extraido para evitar recriacao)
const ComposerCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function ComposerCard({ composer, featured = false, onSelect }) {
    const hasPhoto = COMPOSER_PHOTOS[composer.name];
    const photoUrl = hasPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(composer.name)}&size=400&background=2a2a38&color=D4AF37&bold=true&font-size=0.4`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: ()=>onSelect(composer.name),
        style: {
            position: "relative",
            width: "100%",
            height: featured ? "160px" : "120px",
            borderRadius: "12px",
            overflow: "hidden",
            border: "none",
            cursor: "pointer",
            background: "var(--bg-card)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease"
        },
        onMouseEnter: (e)=>{
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
        },
        onMouseLeave: (e)=>{
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    inset: "-15%",
                    backgroundImage: `url(${photoUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center 25%",
                    filter: "brightness(0.9)"
                }
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                lineNumber: 92,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, transparent 70%)"
                }
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                lineNumber: 104,
                columnNumber: 9
            }, this),
            featured && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    padding: "3px 8px",
                    background: "rgba(212, 175, 55, 0.9)",
                    borderRadius: "20px",
                    fontSize: "9px",
                    fontWeight: "600",
                    color: "#1a1a1a",
                    fontFamily: "var(--font-sans)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                },
                children: "Destaque"
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                lineNumber: 115,
                columnNumber: 11
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    right: "0",
                    padding: "8px 10px",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderTop: "1px solid rgba(255, 255, 255, 0.15)",
                    textAlign: "left"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        style: {
                            fontFamily: "var(--font-sans)",
                            fontSize: featured ? "13px" : "12px",
                            fontWeight: "600",
                            color: "#fff",
                            marginBottom: "1px",
                            textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            lineHeight: "1.3"
                        },
                        children: composer.name
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                        lineNumber: 150,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontFamily: "var(--font-sans)",
                            fontSize: "10px",
                            color: "rgba(255, 255, 255, 0.75)",
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                            lineHeight: "1.2"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "10",
                                height: "10",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M9 18V5l12-2v13"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                        lineNumber: 187,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "6",
                                        cy: "18",
                                        r: "3"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                        lineNumber: 188,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "18",
                                        cy: "16",
                                        r: "3"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                lineNumber: 177,
                                columnNumber: 13
                            }, this),
                            composer.count,
                            " ",
                            composer.count === 1 ? "partitura" : "partituras"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                        lineNumber: 166,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                lineNumber: 136,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
        lineNumber: 69,
        columnNumber: 7
    }, this);
}, (prevProps, nextProps)=>{
    // Comparacao customizada para evitar re-renders desnecessarios
    return prevProps.composer.name === nextProps.composer.name && prevProps.composer.count === nextProps.composer.count && prevProps.featured === nextProps.featured;
});
_c = ComposerCard;
const ComposersPage = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { sheets, setSelectedComposer, setSelectedCategory } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useData"])();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("count");
    // Calcular compositores com contagem
    const composersWithCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ComposersPage.useMemo[composersWithCount]": ()=>{
            const composerMap = {};
            sheets.forEach({
                "ComposersPage.useMemo[composersWithCount]": (s)=>{
                    if (s.composer && s.composer.trim()) {
                        if (!composerMap[s.composer]) {
                            composerMap[s.composer] = 0;
                        }
                        composerMap[s.composer]++;
                    }
                }
            }["ComposersPage.useMemo[composersWithCount]"]);
            return Object.entries(composerMap).map({
                "ComposersPage.useMemo[composersWithCount]": ([name, count])=>({
                        name,
                        count
                    })
            }["ComposersPage.useMemo[composersWithCount]"]).sort({
                "ComposersPage.useMemo[composersWithCount]": (a, b)=>{
                    const aIndex = PRIORITY_ORDER.indexOf(a.name);
                    const bIndex = PRIORITY_ORDER.indexOf(b.name);
                    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                    if (aIndex !== -1) return -1;
                    if (bIndex !== -1) return 1;
                    return b.count - a.count;
                }
            }["ComposersPage.useMemo[composersWithCount]"]);
        }
    }["ComposersPage.useMemo[composersWithCount]"], [
        sheets
    ]);
    // Scroll to top quando a tela abrir
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ComposersPage.useEffect": ()=>{
            window.scrollTo(0, 0);
        }
    }["ComposersPage.useEffect"], []);
    // Filtrar por busca
    const filteredComposers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ComposersPage.useMemo[filteredComposers]": ()=>{
            if (!searchQuery.trim()) return composersWithCount;
            const query = normalizeText(searchQuery);
            const queryTerms = query.split(" ").filter({
                "ComposersPage.useMemo[filteredComposers].queryTerms": (t)=>t.length > 0
            }["ComposersPage.useMemo[filteredComposers].queryTerms"]);
            return composersWithCount.filter({
                "ComposersPage.useMemo[filteredComposers]": (c)=>{
                    const nameNorm = normalizeText(c.name);
                    return queryTerms.every({
                        "ComposersPage.useMemo[filteredComposers]": (term)=>nameNorm.includes(term)
                    }["ComposersPage.useMemo[filteredComposers]"]);
                }
            }["ComposersPage.useMemo[filteredComposers]"]);
        }
    }["ComposersPage.useMemo[filteredComposers]"], [
        composersWithCount,
        searchQuery
    ]);
    // Separar destaque dos demais
    const featuredComposers = filteredComposers.filter((c)=>PRIORITY_ORDER.includes(c.name));
    const otherComposers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ComposersPage.useMemo[otherComposers]": ()=>{
            const others = filteredComposers.filter({
                "ComposersPage.useMemo[otherComposers].others": (c)=>!PRIORITY_ORDER.includes(c.name)
            }["ComposersPage.useMemo[otherComposers].others"]);
            if (sortBy === "alpha") {
                return [
                    ...others
                ].sort({
                    "ComposersPage.useMemo[otherComposers]": (a, b)=>a.name.localeCompare(b.name, "pt-BR")
                }["ComposersPage.useMemo[otherComposers]"]);
            }
            return [
                ...others
            ].sort({
                "ComposersPage.useMemo[otherComposers]": (a, b)=>b.count - a.count
            }["ComposersPage.useMemo[otherComposers]"]);
        }
    }["ComposersPage.useMemo[otherComposers]"], [
        filteredComposers,
        sortBy
    ]);
    const handleSelectComposer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ComposersPage.useCallback[handleSelectComposer]": (composerName)=>{
            setSelectedComposer(composerName);
            setSelectedCategory(null);
            router.push("/acervo");
        }
    }["ComposersPage.useCallback[handleSelectComposer]"], [
        setSelectedComposer,
        setSelectedCategory,
        router
    ]);
    // Lista de compositores exibida na secao "Outros"
    // otherComposers ja filtra de filteredComposers e aplica sorting
    const displayedOthers = otherComposers;
    const sortButtonStyle = (active)=>({
            padding: "5px 10px",
            fontSize: "12px",
            fontFamily: "var(--font-sans)",
            fontWeight: "500",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            background: active ? "var(--primary)" : "transparent",
            color: active ? "#fff" : "var(--text-muted)",
            transition: "all 0.2s ease"
        });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "screen-container",
        style: {
            padding: "24px",
            maxWidth: "1400px",
            margin: "0 auto"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: "32px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push("/"),
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "transparent",
                            border: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            fontFamily: "var(--font-sans)",
                            fontSize: "14px",
                            marginBottom: "16px",
                            padding: "0"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "20",
                                height: "20",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M19 12H5M12 19l-7-7 7-7"
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                    lineNumber: 330,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                lineNumber: 320,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            "Voltar"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                        lineNumber: 304,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        style: {
                            fontFamily: "var(--font-sans)",
                            fontSize: "28px",
                            fontWeight: "700",
                            color: "var(--text-primary)",
                            marginBottom: "8px"
                        },
                        children: "Compositores"
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                        lineNumber: 334,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontFamily: "var(--font-sans)",
                            fontSize: "15px",
                            color: "var(--text-muted)"
                        },
                        children: "Mestres da musica que moldaram o repertorio da filarmonica"
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                        lineNumber: 345,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                lineNumber: 303,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: "32px",
                    maxWidth: "400px"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "search-bar",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "search-icon",
                            width: "20",
                            height: "20",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: "11",
                                    cy: "11",
                                    r: "8"
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                    lineNumber: 370,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "m21 21-4.35-4.35"
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                    lineNumber: 371,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                            lineNumber: 359,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            placeholder: "Buscar compositor...",
                            value: searchQuery,
                            onChange: (e)=>setSearchQuery(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                            lineNumber: 373,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "clear-btn",
                            onClick: ()=>setSearchQuery(""),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "12",
                                height: "12",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2.5",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "18",
                                        y1: "6",
                                        x2: "6",
                                        y2: "18"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                        lineNumber: 394,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "6",
                                        y1: "6",
                                        x2: "18",
                                        y2: "18"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                        lineNumber: 395,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                lineNumber: 384,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                            lineNumber: 380,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                    lineNumber: 358,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                lineNumber: 357,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            filteredComposers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "var(--text-muted)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Nenhum compositor encontrado"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                    lineNumber: 410,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                lineNumber: 403,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    featuredComposers.length > 0 && !searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: "40px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#D4AF37",
                                    marginBottom: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "18",
                                        height: "18",
                                        viewBox: "0 0 24 24",
                                        fill: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                            lineNumber: 435,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                        lineNumber: 429,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Destaques"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                lineNumber: 417,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                                    gap: "12px"
                                },
                                children: featuredComposers.map((comp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ComposerCard, {
                                        composer: comp,
                                        featured: true,
                                        onSelect: handleSelectComposer
                                    }, comp.name, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                        lineNumber: 448,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                lineNumber: 439,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                        lineNumber: 416,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    displayedOthers.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "12px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        style: {
                                            fontFamily: "var(--font-sans)",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            color: "var(--text-secondary)"
                                        },
                                        children: [
                                            searchQuery ? "Resultados" : "Todos os Compositores",
                                            " (",
                                            displayedOthers.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                        lineNumber: 471,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            gap: "4px",
                                            background: "var(--bg-card)",
                                            borderRadius: "8px",
                                            padding: "3px",
                                            border: "1px solid var(--border)"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSortBy("count"),
                                                style: sortButtonStyle(sortBy === "count"),
                                                children: "Partituras"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                                lineNumber: 494,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSortBy("alpha"),
                                                style: sortButtonStyle(sortBy === "alpha"),
                                                children: "A-Z"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                                lineNumber: 500,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                        lineNumber: 484,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                lineNumber: 463,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "var(--bg-card)",
                                    borderRadius: "12px",
                                    border: "1px solid var(--border)",
                                    overflow: "hidden",
                                    contentVisibility: "auto",
                                    containIntrinsicSize: "0 1500px"
                                },
                                children: displayedOthers.map((comp, index, arr)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleSelectComposer(comp.name),
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "100%",
                                            padding: "12px 16px",
                                            background: "transparent",
                                            border: "none",
                                            borderBottom: index < arr.length - 1 ? "1px solid var(--border)" : "none",
                                            cursor: "pointer",
                                            textAlign: "left",
                                            transition: "background 0.2s ease"
                                        },
                                        onMouseEnter: (e)=>e.currentTarget.style.background = "var(--bg-hover)",
                                        onMouseLeave: (e)=>e.currentTarget.style.background = "transparent",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: "var(--font-sans)",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "var(--text-primary)"
                                                },
                                                children: comp.name
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                                lineNumber: 547,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: "var(--font-sans)",
                                                    fontSize: "12px",
                                                    color: "var(--text-muted)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "12",
                                                        height: "12",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        strokeWidth: "2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M9 18V5l12-2v13"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                                                lineNumber: 575,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                cx: "6",
                                                                cy: "18",
                                                                r: "3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                                                lineNumber: 576,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                cx: "18",
                                                                cy: "16",
                                                                r: "3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                                                lineNumber: 577,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                                        lineNumber: 567,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    comp.count
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                                lineNumber: 557,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, comp.name, true, {
                                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                        lineNumber: 521,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                                lineNumber: 510,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
                        lineNumber: 461,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/app/(auth)/compositores/page.tsx",
        lineNumber: 298,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ComposersPage, "YoGpQbrRw28nYcGZPz2N1MXJJ8w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useData"]
    ];
});
_c1 = ComposersPage;
const __TURBOPACK__default__export__ = ComposersPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "ComposerCard");
__turbopack_context__.k.register(_c1, "ComposersPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend-next_app_%28auth%29_compositores_page_tsx_3f5d1174._.js.map