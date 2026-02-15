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
"[project]/frontend-next/src/components/common/IconButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
const IconButton = ({ icon: Icon, onClick, primary, style, ariaLabel })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: "btn-hover",
        "aria-label": ariaLabel,
        style: {
            width: "44px",
            height: "44px",
            borderRadius: "var(--radius-sm)",
            background: primary ? "var(--primary)" : "var(--bg-card)",
            border: primary ? "none" : "1px solid var(--border)",
            color: primary ? "#fff" : "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            ...style
        },
        onClick: onClick,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: "20px",
                height: "20px"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {}, void 0, false, {
                fileName: "[project]/frontend-next/src/components/common/IconButton.tsx",
                lineNumber: 27,
                columnNumber: 52
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/IconButton.tsx",
            lineNumber: 27,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/frontend-next/src/components/common/IconButton.tsx",
        lineNumber: 15,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c = IconButton;
const __TURBOPACK__default__export__ = IconButton;
var _c;
__turbopack_context__.k.register(_c, "IconButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/src/components/music/CategoryCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/UIContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$CategoryIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/CategoryIcon.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const CategoryCard = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(({ category, count, onClick, index = 0 })=>{
    _s();
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUI"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        className: "card-hover",
        initial: {
            opacity: 0,
            y: 12
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            delay: index * 0.05,
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
        style: {
            background: theme === 'dark' ? 'rgba(58, 58, 74, 0.5)' : 'rgba(244, 228, 188, 0.15)',
            borderRadius: 'var(--radius)',
            padding: '14px',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '12px',
            border: '1px solid rgba(212, 175, 55, 0.15)'
        },
        onClick: onClick,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$CategoryIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    categoryId: category.id,
                    size: 20,
                    color: "#D4AF37"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/components/music/CategoryCard.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/music/CategoryCard.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    minWidth: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        style: {
                            fontFamily: "Outfit, sans-serif",
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '1px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        },
                        children: category.name
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/music/CategoryCard.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '12px',
                            color: 'var(--text-muted)'
                        },
                        children: [
                            count,
                            " partitura",
                            count !== 1 ? 's' : ''
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/src/components/music/CategoryCard.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/music/CategoryCard.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/music/CategoryCard.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "jyM3Q7Sm6m0H5sMpPbAZypuYttg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUI"]
    ];
})), "jyM3Q7Sm6m0H5sMpPbAZypuYttg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUI"]
    ];
});
_c1 = CategoryCard;
CategoryCard.displayName = "CategoryCard";
const __TURBOPACK__default__export__ = CategoryCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "CategoryCard$memo");
__turbopack_context__.k.register(_c1, "CategoryCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/src/components/music/FileCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/UIContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/icons.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$CategoryIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/CategoryIcon.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const FileCard = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(({ sheet, category, isFavorite, onToggleFavorite, index = 0 })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { setSelectedSheet } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUI"])();
    const handleCardClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FileCard.useCallback[handleCardClick]": ()=>{
            setSelectedSheet(sheet);
            router.push(`/acervo/${sheet.category}/${sheet.id}`);
        }
    }["FileCard.useCallback[handleCardClick]"], [
        sheet,
        setSelectedSheet,
        router
    ]);
    const handleDownloadClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FileCard.useCallback[handleDownloadClick]": (e)=>{
            e.stopPropagation();
            setSelectedSheet(sheet);
            router.push(`/acervo/${sheet.category}/${sheet.id}`);
        }
    }["FileCard.useCallback[handleDownloadClick]"], [
        sheet,
        setSelectedSheet,
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        "data-walkthrough": "sheet-card",
        className: "file-card",
        initial: {
            opacity: 0,
            y: 8
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            delay: index * 0.03,
            duration: 0.25,
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
        onClick: handleCardClick,
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '14px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            border: '1px solid var(--border)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$CategoryIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    categoryId: category?.id ?? "",
                    size: 24,
                    color: "#D4AF37"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/components/music/FileCard.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/music/FileCard.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    minWidth: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        style: {
                            fontSize: '15px',
                            fontWeight: '600',
                            marginBottom: '3px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: 'var(--text-primary)'
                        },
                        children: sheet.title
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/music/FileCard.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: '13px',
                            color: 'var(--text-muted)'
                        },
                        children: sheet.composer
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/music/FileCard.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/music/FileCard.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                "data-walkthrough": "favorite-btn",
                "aria-label": isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos',
                title: isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos',
                style: {
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: isFavorite ? 'rgba(232, 90, 79, 0.1)' : 'transparent',
                    color: isFavorite ? 'var(--primary)' : 'var(--text-muted)'
                },
                onClick: (e)=>{
                    e.stopPropagation();
                    onToggleFavorite?.();
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: '16px',
                        height: '16px'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Heart, {
                        filled: isFavorite
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/music/FileCard.tsx",
                        lineNumber: 60,
                        columnNumber: 56
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/components/music/FileCard.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/music/FileCard.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                "aria-label": `Baixar partitura ${sheet.title}`,
                title: "Baixar partitura",
                style: {
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: 'transparent',
                    color: 'var(--primary)'
                },
                onClick: handleDownloadClick,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: '18px',
                        height: '18px'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Download, {}, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/music/FileCard.tsx",
                        lineNumber: 69,
                        columnNumber: 56
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/components/music/FileCard.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/music/FileCard.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/music/FileCard.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "bb1H3VwKwEcOoBL/Xif4LrFVRGE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUI"]
    ];
}), (prevProps, nextProps)=>{
    return prevProps.sheet.id === nextProps.sheet.id && prevProps.isFavorite === nextProps.isFavorite && prevProps.category?.id === nextProps.category?.id && prevProps.index === nextProps.index;
}), "bb1H3VwKwEcOoBL/Xif4LrFVRGE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUI"]
    ];
});
_c1 = FileCard;
FileCard.displayName = "FileCard";
const __TURBOPACK__default__export__ = FileCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "FileCard$memo");
__turbopack_context__.k.register(_c1, "FileCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/app/(auth)/acervo/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AcervoPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/DataContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/icons.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/IconButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/EmptyState.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$music$2f$CategoryCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/music/CategoryCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$music$2f$FileCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/music/FileCard.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
function AcervoPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { sheets, categories, categoriesMap, selectedCategory, setSelectedCategory, selectedComposer, setSelectedComposer, favorites, toggleFavorite } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useData"])();
    const filteredSheets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AcervoPage.useMemo[filteredSheets]": ()=>{
            let result = sheets;
            if (selectedCategory) {
                result = result.filter({
                    "AcervoPage.useMemo[filteredSheets]": (s)=>s.category === selectedCategory
                }["AcervoPage.useMemo[filteredSheets]"]);
            }
            if (selectedComposer) {
                result = result.filter({
                    "AcervoPage.useMemo[filteredSheets]": (s)=>s.composer === selectedComposer
                }["AcervoPage.useMemo[filteredSheets]"]);
            }
            return result;
        }
    }["AcervoPage.useMemo[filteredSheets]"], [
        sheets,
        selectedCategory,
        selectedComposer
    ]);
    const currentCategory = categoriesMap.get(selectedCategory ?? "");
    const categoryCounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AcervoPage.useMemo[categoryCounts]": ()=>{
            const counts = new Map();
            for (const sheet of sheets){
                const catId = sheet.category;
                counts.set(catId, (counts.get(catId) || 0) + 1);
            }
            return counts;
        }
    }["AcervoPage.useMemo[categoryCounts]"], [
        sheets
    ]);
    const getCategoryCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AcervoPage.useCallback[getCategoryCount]": (categoryId)=>categoryCounts.get(categoryId) || 0
    }["AcervoPage.useCallback[getCategoryCount]"], [
        categoryCounts
    ]);
    const handleBack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AcervoPage.useCallback[handleBack]": ()=>{
            if (selectedComposer) {
                setSelectedComposer(null);
                router.push("/compositores");
            } else if (selectedCategory) {
                setSelectedCategory(null);
                router.push("/generos");
            }
        }
    }["AcervoPage.useCallback[handleBack]"], [
        selectedComposer,
        selectedCategory,
        setSelectedComposer,
        setSelectedCategory,
        router
    ]);
    const handleCategoryClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AcervoPage.useCallback[handleCategoryClick]": (catId)=>{
            setSelectedCategory(catId);
            setSelectedComposer(null);
            router.push(`/acervo/${catId}`);
        }
    }["AcervoPage.useCallback[handleCategoryClick]"], [
        setSelectedCategory,
        setSelectedComposer,
        router
    ]);
    const getTitle = ()=>{
        if (selectedComposer) return selectedComposer;
        if (currentCategory) return currentCategory.name;
        return "Acervo";
    };
    const getSubtitle = ()=>{
        if (selectedComposer || selectedCategory) return `${filteredSheets.length} partituras`;
        return "Todas as categorias";
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: getTitle(),
                subtitle: getSubtitle(),
                showBack: !!(selectedCategory || selectedComposer),
                onBack: handleBack,
                actions: user?.is_admin ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Plus,
                    primary: true,
                    onClick: ()=>router.push("/admin/partituras")
                }, void 0, false, {
                    fileName: "[project]/frontend-next/app/(auth)/acervo/page.tsx",
                    lineNumber: 96,
                    columnNumber: 13
                }, void 0) : undefined
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/acervo/page.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            !selectedCategory && !selectedComposer ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "0 20px"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: "12px",
                        width: "100%"
                    },
                    children: categories.map((cat, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$music$2f$CategoryCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            category: cat,
                            count: getCategoryCount(cat.id),
                            index: i,
                            onClick: ()=>handleCategoryClick(cat.id)
                        }, cat.id, false, {
                            fileName: "[project]/frontend-next/app/(auth)/acervo/page.tsx",
                            lineNumber: 116,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/frontend-next/app/(auth)/acervo/page.tsx",
                    lineNumber: 107,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/acervo/page.tsx",
                lineNumber: 106,
                columnNumber: 9
            }, this) : filteredSheets.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                icon: (props)=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Folder(props ?? {}),
                title: "Nenhuma partitura encontrada"
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/acervo/page.tsx",
                lineNumber: 127,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "0 20px",
                    contentVisibility: "auto",
                    containIntrinsicSize: "0 2000px"
                },
                children: filteredSheets.map((sheet)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$music$2f$FileCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sheet: sheet,
                        category: currentCategory,
                        isFavorite: favorites.includes(sheet.id),
                        onToggleFavorite: ()=>toggleFavorite(sheet.id)
                    }, sheet.id, false, {
                        fileName: "[project]/frontend-next/app/(auth)/acervo/page.tsx",
                        lineNumber: 137,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/acervo/page.tsx",
                lineNumber: 129,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/app/(auth)/acervo/page.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
_s(AcervoPage, "obDu5M2epe+kjOOrsRRI2PSGa8Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useData"]
    ];
});
_c = AcervoPage;
var _c;
__turbopack_context__.k.register(_c, "AcervoPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend-next_a8229ea3._.js.map