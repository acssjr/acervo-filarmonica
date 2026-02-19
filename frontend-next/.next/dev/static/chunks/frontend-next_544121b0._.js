(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend-next/src/components/common/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/icons.tsx [app-client] (ecmascript)");
"use client";
;
;
const Header = ({ title, subtitle, showBack, onBack, actions })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        style: {
            padding: "16px 20px",
            paddingTop: "max(env(safe-area-inset-top), 16px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                },
                children: [
                    showBack && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn-hover",
                        onClick: onBack,
                        style: {
                            width: "40px",
                            height: "40px",
                            borderRadius: "var(--radius-sm)",
                            background: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            color: "var(--text-primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: "20px",
                                height: "20px"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Back, {}, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/common/Header.tsx",
                                lineNumber: 34,
                                columnNumber: 58
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/frontend-next/src/components/common/Header.tsx",
                            lineNumber: 34,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/common/Header.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                style: {
                                    fontFamily: "Outfit, sans-serif",
                                    fontWeight: 700,
                                    letterSpacing: "-0.5px",
                                    color: "var(--text-primary)",
                                    fontSize: subtitle ? "28px" : "26px"
                                },
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/common/Header.tsx",
                                lineNumber: 38,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: "14px",
                                    color: "var(--text-muted)",
                                    marginTop: "2px"
                                },
                                children: subtitle
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/common/Header.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/src/components/common/Header.tsx",
                        lineNumber: 37,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/common/Header.tsx",
                lineNumber: 22,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: "10px"
                },
                children: actions
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/common/Header.tsx",
                lineNumber: 54,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/common/Header.tsx",
        lineNumber: 15,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c = Header;
const __TURBOPACK__default__export__ = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/app/(auth)/repertorio/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RepertorioPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/UIContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/DataContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/lib/storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/icons.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/EmptyState.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
// Hook to detect desktop via useSyncExternalStore (SSR-safe, no setState in effect)
function subscribeToResize(callback) {
    window.addEventListener("resize", callback);
    return ()=>window.removeEventListener("resize", callback);
}
function getIsDesktop() {
    return window.innerWidth >= 1024;
}
function getIsDesktopServer() {
    return false;
}
function useIsDesktop() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribeToResize, getIsDesktop, getIsDesktopServer);
}
_s(useIsDesktop, "FpwL93IKMLJZuQQXefVtWynbBPQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
// ============ SKELETON LOADING ============
const RepertorioSkeleton = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "20px 20px 0"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: "160px",
                            height: "24px",
                            background: "linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-card) 50%, var(--bg-secondary) 75%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.5s infinite",
                            borderRadius: "6px",
                            marginBottom: "8px"
                        }
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                        lineNumber: 67,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: "100px",
                            height: "16px",
                            background: "linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-card) 50%, var(--bg-secondary) 75%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.5s infinite",
                            borderRadius: "4px"
                        }
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                        lineNumber: 76,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                lineNumber: 66,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "16px",
                    display: "flex",
                    justifyContent: "center"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: "140px",
                        height: "44px",
                        background: "linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-card) 50%, var(--bg-secondary) 75%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.5s infinite",
                        borderRadius: "12px"
                    }
                }, void 0, false, {
                    fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                    lineNumber: 88,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                lineNumber: 87,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "0 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                },
                children: [
                    1,
                    2,
                    3,
                    4,
                    5
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px 16px",
                            background: "var(--bg-secondary)",
                            borderRadius: "12px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
                                    backgroundSize: "200% 100%",
                                    animation: "shimmer 1.5s infinite",
                                    animationDelay: `${i * 0.1}s`,
                                    flexShrink: 0
                                }
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: "80%",
                                            height: "14px",
                                            background: "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
                                            backgroundSize: "200% 100%",
                                            animation: "shimmer 1.5s infinite",
                                            animationDelay: `${i * 0.1}s`,
                                            borderRadius: "4px",
                                            marginBottom: "6px"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 125,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: "50%",
                                            height: "12px",
                                            background: "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
                                            backgroundSize: "200% 100%",
                                            animation: "shimmer 1.5s infinite",
                                            animationDelay: `${i * 0.1}s`,
                                            borderRadius: "4px"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 135,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                lineNumber: 124,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "8px",
                                    background: "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
                                    backgroundSize: "200% 100%",
                                    animation: "shimmer 1.5s infinite",
                                    animationDelay: `${i * 0.1}s`
                                }
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, i, true, {
                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                lineNumber: 99,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
        lineNumber: 64,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c = RepertorioSkeleton;
// ============ MODAL DE DOWNLOAD ============
const DownloadModal = ({ isOpen, onClose, sheets, instruments, userInstrument, downloading, onDownload })=>{
    _s1();
    const [selectedInstrument, setSelectedInstrument] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedIds, setSelectedIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "DownloadModal.useState": ()=>new Set(sheets.map({
                "DownloadModal.useState": (s)=>s.id
            }["DownloadModal.useState"]))
    }["DownloadModal.useState"]);
    const [showInstrumentPicker, setShowInstrumentPicker] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isDesktop = useIsDesktop();
    const toggleSelection = (id)=>{
        setSelectedIds((prev)=>{
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };
    const selectAll = ()=>setSelectedIds(new Set(sheets.map((s)=>s.id)));
    const deselectAll = ()=>setSelectedIds(new Set());
    const allSelected = selectedIds.size === sheets.length;
    const handleDownload = (formato)=>{
        onDownload(formato, selectedInstrument, Array.from(selectedIds));
    };
    const handleSelectInstrument = (inst)=>{
        setSelectedInstrument(inst);
        setShowInstrumentPicker(false);
    };
    if (!isOpen) return null;
    // Filtrar instrumentos (sem Grade para download em lote)
    const filteredInstruments = instruments.filter((i)=>i.toLowerCase() !== "grade");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: onClose,
                style: {
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(4px)",
                    zIndex: 2000
                }
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                lineNumber: 206,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "fixed",
                    ...isDesktop ? {
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "400px",
                        maxWidth: "90vw",
                        borderRadius: "20px",
                        maxHeight: "70vh"
                    } : {
                        bottom: 0,
                        left: 0,
                        right: 0,
                        borderRadius: "24px 24px 0 0",
                        maxHeight: "80vh"
                    },
                    background: "var(--bg-card)",
                    zIndex: 2001,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    boxShadow: isDesktop ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "0 -10px 40px rgba(0,0,0,0.3)"
                },
                children: [
                    !isDesktop && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: "40px",
                            height: "4px",
                            background: "var(--border)",
                            borderRadius: "2px",
                            margin: "12px auto 8px",
                            flexShrink: 0
                        }
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                        lineNumber: 244,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: isDesktop ? "20px 20px 16px" : "0 20px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    margin: 0,
                                    fontSize: "17px",
                                    fontWeight: "700",
                                    fontFamily: "Outfit, sans-serif",
                                    color: "var(--text-primary)"
                                },
                                children: "Baixar Partituras"
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                lineNumber: 261,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                "aria-label": "Fechar",
                                style: {
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    background: "var(--bg-secondary)",
                                    border: "none",
                                    color: "var(--text-muted)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: "16px",
                                        height: "16px"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Close, {}, void 0, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 286,
                                        columnNumber: 60
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                    lineNumber: 286,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                lineNumber: 270,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                        lineNumber: 255,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: "0 20px 20px",
                            overflowY: "auto",
                            flex: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: "10px",
                                    color: "var(--text-muted)",
                                    marginBottom: "8px",
                                    fontFamily: "Outfit, sans-serif",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    fontWeight: "600"
                                },
                                children: "Instrumento"
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                lineNumber: 297,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            !showInstrumentPicker && !selectedInstrument && userInstrument && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleSelectInstrument(userInstrument),
                                        style: {
                                            width: "100%",
                                            padding: "12px 14px",
                                            borderRadius: "10px",
                                            background: "linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)",
                                            border: "none",
                                            color: "#F4E4BC",
                                            fontFamily: "Outfit, sans-serif",
                                            fontSize: "13px",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginBottom: "8px",
                                            boxShadow: "0 4px 12px rgba(114, 47, 55, 0.3)"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: "16px",
                                                            height: "16px"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Download, {}, void 0, false, {
                                                            fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                            lineNumber: 332,
                                                            columnNumber: 66
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                        lineNumber: 332,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Meu Instrumento"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                        lineNumber: 333,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 331,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    background: "rgba(244, 228, 188, 0.2)",
                                                    padding: "3px 8px",
                                                    borderRadius: "5px",
                                                    fontSize: "10px",
                                                    fontWeight: "700"
                                                },
                                                children: userInstrument
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 335,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 311,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowInstrumentPicker(true),
                                        style: {
                                            width: "100%",
                                            padding: "12px 14px",
                                            borderRadius: "10px",
                                            background: "var(--bg-secondary)",
                                            border: "1px solid var(--border)",
                                            color: "var(--text-primary)",
                                            fontFamily: "Outfit, sans-serif",
                                            fontSize: "13px",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginBottom: "14px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: "16px",
                                                            height: "16px"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Music, {}, void 0, false, {
                                                            fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                            lineNumber: 365,
                                                            columnNumber: 66
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                        lineNumber: 365,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Outro Instrumento"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                        lineNumber: 366,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 364,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: "16px",
                                                    height: "16px"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].ChevronDown, {}, void 0, false, {
                                                    fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                    lineNumber: 368,
                                                    columnNumber: 64
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 368,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 345,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true),
                            !showInstrumentPicker && selectedInstrument && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowInstrumentPicker(true),
                                style: {
                                    width: "100%",
                                    padding: "12px 14px",
                                    borderRadius: "10px",
                                    background: "linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)",
                                    border: "none",
                                    color: "#F4E4BC",
                                    fontFamily: "Outfit, sans-serif",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "14px",
                                    boxShadow: "0 4px 12px rgba(114, 47, 55, 0.3)"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: "16px",
                                                    height: "16px"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Music, {}, void 0, false, {
                                                    fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                    lineNumber: 396,
                                                    columnNumber: 64
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 396,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: selectedInstrument
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 397,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 395,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            background: "rgba(244, 228, 188, 0.2)",
                                            padding: "3px 8px",
                                            borderRadius: "5px",
                                            fontSize: "10px",
                                            fontWeight: "700"
                                        },
                                        children: selectedInstrument === userInstrument ? "MEU" : "ALTERAR"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 399,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                lineNumber: 375,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            showInstrumentPicker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "var(--bg-secondary)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "10px",
                                            maxHeight: "180px",
                                            overflowY: "auto",
                                            marginBottom: "8px"
                                        },
                                        children: filteredInstruments.map((inst, idx)=>{
                                            const isUserInst = inst === userInstrument;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleSelectInstrument(inst),
                                                style: {
                                                    width: "100%",
                                                    padding: "10px 14px",
                                                    background: "transparent",
                                                    border: "none",
                                                    borderBottom: idx < filteredInstruments.length - 1 ? "1px solid var(--border)" : "none",
                                                    color: isUserInst ? "var(--accent)" : "var(--text-primary)",
                                                    fontFamily: "Outfit, sans-serif",
                                                    fontSize: "13px",
                                                    fontWeight: isUserInst ? "600" : "500",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    textAlign: "left"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: inst
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                        lineNumber: 445,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    isUserInst && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: "9px",
                                                            background: "rgba(212,175,55,0.2)",
                                                            color: "var(--accent)",
                                                            padding: "2px 6px",
                                                            borderRadius: "4px",
                                                            fontWeight: "700"
                                                        },
                                                        children: "MEU"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                        lineNumber: 447,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, inst, true, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 425,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0));
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 414,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowInstrumentPicker(false),
                                        style: {
                                            width: "100%",
                                            padding: "10px",
                                            borderRadius: "8px",
                                            background: "transparent",
                                            border: "1px solid var(--border)",
                                            color: "var(--text-muted)",
                                            fontFamily: "Outfit, sans-serif",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            marginBottom: "14px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "6px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: "14px",
                                                    height: "14px",
                                                    transform: "rotate(90deg)"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].ChevronDown, {}, void 0, false, {
                                                    fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                    lineNumber: 483,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 482,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Voltar"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 462,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true),
                            !showInstrumentPicker && !selectedInstrument && !userInstrument && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "var(--bg-secondary)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "10px",
                                    maxHeight: "180px",
                                    overflowY: "auto",
                                    marginBottom: "14px"
                                },
                                children: filteredInstruments.map((inst, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleSelectInstrument(inst),
                                        style: {
                                            width: "100%",
                                            padding: "10px 14px",
                                            background: "transparent",
                                            border: "none",
                                            borderBottom: idx < filteredInstruments.length - 1 ? "1px solid var(--border)" : "none",
                                            color: "var(--text-primary)",
                                            fontFamily: "Outfit, sans-serif",
                                            fontSize: "13px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                            textAlign: "left"
                                        },
                                        children: inst
                                    }, inst, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 501,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                lineNumber: 492,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            selectedInstrument && !showInstrumentPicker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginBottom: "8px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: "10px",
                                                    color: "var(--text-muted)",
                                                    margin: 0,
                                                    fontFamily: "Outfit, sans-serif",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.5px",
                                                    fontWeight: "600"
                                                },
                                                children: [
                                                    "Partituras (",
                                                    selectedIds.size,
                                                    "/",
                                                    sheets.length,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 533,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: allSelected ? deselectAll : selectAll,
                                                style: {
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                    background: "transparent",
                                                    border: "none",
                                                    color: "var(--accent)",
                                                    fontSize: "11px",
                                                    fontWeight: "600",
                                                    cursor: "pointer",
                                                    fontFamily: "Outfit, sans-serif"
                                                },
                                                children: allSelected ? "Desmarcar" : "Todas"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 542,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 527,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "var(--bg-secondary)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "10px",
                                            maxHeight: "150px",
                                            overflowY: "auto",
                                            marginBottom: "16px"
                                        },
                                        children: sheets.map((sheet, idx)=>{
                                            const isSelected = selectedIds.has(sheet.id);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>toggleSelection(sheet.id),
                                                style: {
                                                    width: "100%",
                                                    padding: "10px 14px",
                                                    background: "transparent",
                                                    border: "none",
                                                    borderBottom: idx < sheets.length - 1 ? "1px solid var(--border)" : "none",
                                                    color: "var(--text-primary)",
                                                    fontFamily: "Outfit, sans-serif",
                                                    fontSize: "13px",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    textAlign: "left"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: "18px",
                                                            height: "18px",
                                                            borderRadius: "4px",
                                                            border: `2px solid ${isSelected ? "#D4AF37" : "rgba(255,255,255,0.3)"}`,
                                                            background: isSelected ? "#D4AF37" : "transparent",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            flexShrink: 0
                                                        },
                                                        children: isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                width: "10px",
                                                                height: "10px",
                                                                color: "#fff"
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Check, {}, void 0, false, {
                                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                                lineNumber: 604,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                            lineNumber: 603,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                        lineNumber: 591,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            flex: 1,
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            fontWeight: "500"
                                                        },
                                                        children: [
                                                            idx + 1,
                                                            ". ",
                                                            sheet.title
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                        lineNumber: 608,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, sheet.id, true, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 571,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0));
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 560,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            gap: "8px",
                                            flexWrap: "wrap"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleDownload("pdf"),
                                                disabled: selectedIds.size === 0 || downloading,
                                                style: {
                                                    flex: "1 1 45%",
                                                    padding: "12px",
                                                    borderRadius: "10px",
                                                    background: selectedIds.size > 0 ? "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)" : "var(--bg-secondary)",
                                                    color: selectedIds.size > 0 ? "#fff" : "var(--text-muted)",
                                                    border: "none",
                                                    fontSize: "13px",
                                                    fontWeight: "700",
                                                    cursor: selectedIds.size > 0 ? "pointer" : "not-allowed",
                                                    fontFamily: "Outfit, sans-serif",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "6px",
                                                    boxShadow: selectedIds.size > 0 ? "0 4px 12px rgba(212, 175, 55, 0.3)" : "none"
                                                },
                                                children: [
                                                    downloading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: "16px",
                                                            height: "16px",
                                                            border: "2px solid rgba(255,255,255,0.3)",
                                                            borderTopColor: "#fff",
                                                            borderRadius: "50%",
                                                            animation: "spin 1s linear infinite"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                        lineNumber: 646,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: "16px",
                                                            height: "16px"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].File, {}, void 0, false, {
                                                            fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                            lineNumber: 655,
                                                            columnNumber: 68
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                        lineNumber: 655,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    "PDF"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 624,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleDownload("zip"),
                                                disabled: selectedIds.size === 0 || downloading,
                                                style: {
                                                    flex: "1 1 45%",
                                                    padding: "12px",
                                                    borderRadius: "10px",
                                                    background: selectedIds.size > 0 ? "#9b59b6" : "var(--bg-secondary)",
                                                    color: selectedIds.size > 0 ? "#fff" : "var(--text-muted)",
                                                    border: "none",
                                                    fontSize: "13px",
                                                    fontWeight: "700",
                                                    cursor: selectedIds.size > 0 ? "pointer" : "not-allowed",
                                                    fontFamily: "Outfit, sans-serif",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "6px",
                                                    boxShadow: selectedIds.size > 0 ? "0 4px 12px rgba(155, 89, 182, 0.3)" : "none"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: "16px",
                                                            height: "16px"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Archive, {}, void 0, false, {
                                                            fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                            lineNumber: 681,
                                                            columnNumber: 66
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                        lineNumber: 681,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    "ZIP"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 660,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleDownload("print"),
                                                disabled: selectedIds.size === 0 || downloading,
                                                style: {
                                                    flex: "1 1 100%",
                                                    padding: "12px",
                                                    borderRadius: "10px",
                                                    background: selectedIds.size > 0 ? "#3498db" : "var(--bg-secondary)",
                                                    color: selectedIds.size > 0 ? "#fff" : "var(--text-muted)",
                                                    border: "none",
                                                    fontSize: "13px",
                                                    fontWeight: "700",
                                                    cursor: selectedIds.size > 0 ? "pointer" : "not-allowed",
                                                    fontFamily: "Outfit, sans-serif",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "6px",
                                                    boxShadow: selectedIds.size > 0 ? "0 4px 12px rgba(52, 152, 219, 0.3)" : "none"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: "16px",
                                                            height: "16px"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Printer, {}, void 0, false, {
                                                            fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                            lineNumber: 706,
                                                            columnNumber: 66
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                        lineNumber: 706,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    "Imprimir Tudo"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 685,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 623,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                        lineNumber: 291,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                lineNumber: 218,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                lineNumber: 715,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s1(DownloadModal, "+qEEj/2YsELjKOBk2vLJ3ZdxWcc=", false, function() {
    return [
        useIsDesktop
    ];
});
_c1 = DownloadModal;
function RepertorioPage() {
    _s2();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { showToast, setSelectedSheet } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUI"])();
    const { favorites, toggleFavorite, categoriesMap } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useData"])();
    const [repertorio, setRepertorio] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [repertorioInstrumentos, setRepertorioInstrumentos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [downloading, setDownloading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showDownloadModal, setShowDownloadModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Carregar repertorio ativo (instrumentos sao prefetched em background)
    const loadRepertorio = async ()=>{
        setLoading(true);
        try {
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].getRepertorioAtivo();
            setRepertorio(data);
            setLoading(false);
            // Prefetch instrumentos em background (non-blocking)
            if (data?.id) {
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].getRepertorioInstrumentos(data.id).then((instrumentos)=>setRepertorioInstrumentos(instrumentos)).catch((err)=>console.error("Prefetch instrumentos falhou:", err));
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erro ao carregar repertório";
            console.error("Erro ao carregar repertorio:", err);
            showToast(message, "error");
            setLoading(false);
        }
    };
    // Recarregar instrumentos quando o modal abre (para refletir mudancas feitas no admin)
    const reloadInstrumentos = async ()=>{
        if (repertorio?.id) {
            try {
                const instrumentos = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].getRepertorioInstrumentos(repertorio.id);
                setRepertorioInstrumentos(instrumentos);
            } catch (err) {
                console.error("Erro ao recarregar instrumentos:", err);
            }
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RepertorioPage.useEffect": ()=>{
            loadRepertorio();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["RepertorioPage.useEffect"], []);
    // Recarrega instrumentos sempre que o modal abre
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RepertorioPage.useEffect": ()=>{
            if (showDownloadModal) {
                reloadInstrumentos();
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["RepertorioPage.useEffect"], [
        showDownloadModal
    ]);
    // Handler de download
    const handleDownload = async (formato, instrumento, partituraIds)=>{
        if (!repertorio || !instrumento) return;
        setDownloading(true);
        const isPrint = formato === "print";
        try {
            const url = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].getRepertorioDownloadUrl(repertorio.id, instrumento, isPrint ? "pdf" : formato, partituraIds);
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("authToken", "")}`
                }
            });
            if (!response.ok) {
                const error = await response.json().catch(()=>({}));
                throw new Error(error.error || "Erro no download");
            }
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            if (isPrint) {
                // Abrir em nova janela para impressao
                const printWindow = window.open(blobUrl, "_blank");
                if (printWindow) {
                    printWindow.onload = ()=>{
                        printWindow.print();
                        URL.revokeObjectURL(blobUrl);
                    };
                } else {
                    URL.revokeObjectURL(blobUrl);
                }
                showToast("Abrindo impressão...");
            } else {
                // Download normal
                const contentDisposition = response.headers.get("Content-Disposition");
                const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || `Repertorio_${repertorio.nome}.${formato === "zip" ? "zip" : "pdf"}`;
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
                showToast("Download iniciado!");
            }
            setShowDownloadModal(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erro no download";
            console.error("Erro no download:", err);
            showToast(message, "error");
        }
        setDownloading(false);
    };
    // Handler para remover do repertorio (admin)
    const handleRemoveFromRepertorio = async (partituraId)=>{
        if (!user?.is_admin || !repertorio) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].removePartituraFromRepertorio(repertorio.id, partituraId);
            showToast("Partitura removida do repertório");
            loadRepertorio();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erro ao remover";
            showToast(message, "error");
        }
    };
    // Converter partituras para formato simplificado
    const sheets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "RepertorioPage.useMemo[sheets]": ()=>{
            if (!repertorio?.partituras) return [];
            return repertorio.partituras.map({
                "RepertorioPage.useMemo[sheets]": (p)=>({
                        id: p.id,
                        title: p.titulo,
                        composer: p.compositor,
                        category: p.categoria_id
                    })
            }["RepertorioPage.useMemo[sheets]"]);
        }
    }["RepertorioPage.useMemo[sheets]"], [
        repertorio
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RepertorioSkeleton, {}, void 0, false, {
            fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
            lineNumber: 874,
            columnNumber: 12
        }, this);
    }
    if (!repertorio) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    title: "Repertório",
                    subtitle: "Próxima apresentação"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                    lineNumber: 880,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].ListMusic,
                    title: "Nenhum repertório definido",
                    subtitle: "O regente ainda não definiu o repertório da próxima apresentação"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                    lineNumber: 881,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
            lineNumber: 879,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: repertorio.nome,
                subtitle: `${repertorio.partituras?.length || 0} música${(repertorio.partituras?.length || 0) !== 1 ? "s" : ""}`
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                lineNumber: 892,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "0 16px",
                    marginBottom: "16px"
                },
                children: [
                    repertorio.data_apresentacao && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            fontSize: "14px",
                            color: "var(--text-muted)",
                            margin: "0 0 12px 0"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    width: "16px",
                                    height: "16px"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Calendar, {}, void 0, false, {
                                    fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                    lineNumber: 910,
                                    columnNumber: 61
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                lineNumber: 910,
                                columnNumber: 13
                            }, this),
                            new Date(repertorio.data_apresentacao).toLocaleDateString("pt-BR")
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                        lineNumber: 901,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "center"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowDownloadModal(true),
                            disabled: !repertorio.partituras?.length,
                            style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "12px 24px",
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
                                color: "#fff",
                                border: "none",
                                fontSize: "14px",
                                fontWeight: "700",
                                cursor: "pointer",
                                opacity: repertorio.partituras?.length ? 1 : 0.5,
                                boxShadow: "0 4px 12px rgba(212, 175, 55, 0.3)"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: "18px",
                                        height: "18px"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Archive, {}, void 0, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 936,
                                        columnNumber: 60
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                    lineNumber: 936,
                                    columnNumber: 13
                                }, this),
                                "Baixar Tudo"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                            lineNumber: 917,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                        lineNumber: 916,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                lineNumber: 898,
                columnNumber: 7
            }, this),
            sheets.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Music,
                title: "Repertório vazio",
                subtitle: "Nenhuma partitura adicionada ainda"
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                lineNumber: 944,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "0 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                },
                children: sheets.map((sheet, index)=>{
                    const category = categoriesMap.get(sheet.category);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 12
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            delay: index * 0.04,
                            duration: 0.3,
                            ease: [
                                0.25,
                                0.1,
                                0.25,
                                1
                            ]
                        },
                        whileTap: {
                            scale: 0.98
                        },
                        onClick: ()=>setSelectedSheet(sheet),
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px 16px",
                            background: "var(--bg-secondary)",
                            borderRadius: "12px",
                            cursor: "pointer",
                            border: "1px solid transparent"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
                                    color: "#fff",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0
                                },
                                children: index + 1
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                lineNumber: 977,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    minWidth: 0
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            marginBottom: "2px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: "14px",
                                                    fontWeight: "600",
                                                    color: "var(--text-primary)",
                                                    margin: 0,
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis"
                                                },
                                                children: sheet.title
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 996,
                                                columnNumber: 21
                                            }, this),
                                            category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "10px",
                                                    fontWeight: "600",
                                                    padding: "2px 6px",
                                                    borderRadius: "4px",
                                                    background: "rgba(212, 175, 55, 0.15)",
                                                    color: "var(--accent)",
                                                    whiteSpace: "nowrap",
                                                    flexShrink: 0
                                                },
                                                children: category.name
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 1008,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 995,
                                        columnNumber: 19
                                    }, this),
                                    sheet.composer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: "12px",
                                            color: "var(--text-muted)",
                                            margin: 0,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        },
                                        children: sheet.composer
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 1023,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                lineNumber: 994,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            toggleFavorite(String(sheet.id));
                                        },
                                        style: {
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "8px",
                                            background: "transparent",
                                            border: "none",
                                            color: favorites.includes(String(sheet.id)) ? "#e74c3c" : "var(--text-muted)",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: "18px",
                                                height: "18px"
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Heart, {
                                                filled: favorites.includes(String(sheet.id))
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 1054,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                            lineNumber: 1053,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 1038,
                                        columnNumber: 19
                                    }, this),
                                    user?.is_admin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            handleRemoveFromRepertorio(sheet.id);
                                        },
                                        title: "Remover do repertório",
                                        style: {
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "8px",
                                            background: "rgba(231, 76, 60, 0.1)",
                                            border: "none",
                                            color: "#e74c3c",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: "16px",
                                                height: "16px"
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Close, {}, void 0, false, {
                                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                                lineNumber: 1076,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                            lineNumber: 1075,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                        lineNumber: 1059,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                                lineNumber: 1037,
                                columnNumber: 17
                            }, this)
                        ]
                    }, sheet.id, true, {
                        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                        lineNumber: 954,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                lineNumber: 950,
                columnNumber: 9
            }, this),
            showDownloadModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DownloadModal, {
                isOpen: showDownloadModal,
                onClose: ()=>setShowDownloadModal(false),
                sheets: sheets,
                instruments: repertorioInstrumentos,
                userInstrument: user?.instrumento,
                downloading: downloading,
                onDownload: handleDownload
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
                lineNumber: 1089,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/app/(auth)/repertorio/page.tsx",
        lineNumber: 891,
        columnNumber: 5
    }, this);
}
_s2(RepertorioPage, "FdGIfZY34voQZ6q1ZDDOxlLEYzQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUI"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useData"]
    ];
});
_c2 = RepertorioPage;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "RepertorioSkeleton");
__turbopack_context__.k.register(_c1, "DownloadModal");
__turbopack_context__.k.register(_c2, "RepertorioPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend-next_544121b0._.js.map