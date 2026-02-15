module.exports = [
"[project]/frontend-next/src/hooks/useResponsive.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useIsDesktop",
    ()=>useIsDesktop,
    "useIsMobile",
    ()=>useIsMobile,
    "useResponsive",
    ()=>useResponsive
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/hooks/useMediaQuery.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/config.ts [app-ssr] (ecmascript)");
"use client";
;
;
const useResponsive = ()=>{
    const isMobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMediaQuery"])(`(max-width: ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BREAKPOINTS"].mobile - 1}px)`);
    const isTablet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMediaQuery"])(`(min-width: ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BREAKPOINTS"].mobile}px) and (max-width: ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BREAKPOINTS"].desktop - 1}px)`);
    const isDesktop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMediaQuery"])(`(min-width: ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BREAKPOINTS"].desktop}px)`);
    return {
        isMobile,
        isTablet,
        isDesktop
    };
};
const useIsMobile = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMediaQuery"])(`(max-width: ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BREAKPOINTS"].mobile - 1}px)`);
};
const useIsDesktop = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMediaQuery"])(`(min-width: ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BREAKPOINTS"].desktop}px)`);
};
const __TURBOPACK__default__export__ = useResponsive;
}),
"[project]/frontend-next/src/components/common/HeaderActions.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/UIContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$NotificationContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/NotificationContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/icons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/hooks/useMediaQuery.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$ThemeSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/ThemeSelector.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$AdminToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/AdminToggle.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
const HeaderActions = ({ inDarkHeader = false })=>{
    const { setShowNotifications } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUI"])();
    const { unreadCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$NotificationContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useNotifications"])();
    const isDesktop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMediaQuery"])("(min-width: 1024px)");
    if (isDesktop) return null;
    const darkHeaderStyles = {
        background: "rgba(255,255,255,0.15)",
        border: "1px solid rgba(255,255,255,0.2)",
        color: "#F4E4BC"
    };
    const normalStyles = {
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)"
    };
    const buttonStyles = inDarkHeader ? darkHeaderStyles : normalStyles;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "flex",
            gap: "8px",
            alignItems: "center"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$ThemeSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                inDarkHeader: inDarkHeader,
                compact: true
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/common/HeaderActions.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "btn-hover",
                onClick: ()=>setShowNotifications(true),
                "aria-label": unreadCount > 0 ? `Notificações (${unreadCount} não lidas)` : "Notificações",
                style: {
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    ...buttonStyles,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    position: "relative"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: "18px",
                            height: "18px"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Bell, {}, void 0, false, {
                            fileName: "[project]/frontend-next/src/components/common/HeaderActions.tsx",
                            lineNumber: 49,
                            columnNumber: 56
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/common/HeaderActions.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "absolute",
                            top: "-4px",
                            right: "-4px",
                            minWidth: "16px",
                            height: "16px",
                            padding: "0 4px",
                            borderRadius: "8px",
                            background: "#E74C3C",
                            color: "#fff",
                            fontSize: "10px",
                            fontWeight: "700",
                            fontFamily: "Outfit, sans-serif",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                        },
                        children: unreadCount > 99 ? "99+" : unreadCount
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/common/HeaderActions.tsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/common/HeaderActions.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$AdminToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/frontend-next/src/components/common/HeaderActions.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/common/HeaderActions.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = HeaderActions;
}),
"[project]/frontend-next/src/components/common/LogoBadge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
const VARIANTS = {
    dark: {
        background: "rgba(244, 228, 188, 0.15)",
        border: "2px solid rgba(244, 228, 188, 0.3)"
    },
    light: {
        background: "var(--bg-card)",
        border: "1px solid var(--border)"
    }
};
const LogoBadge = ({ size = 38, variant = "dark", style = {} })=>{
    const v = VARIANTS[variant] || VARIANTS.dark;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            background: v.background,
            border: v.border,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
            padding: `${Math.round(size * 0.1)}px`,
            ...style
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            src: "/assets/images/ui/brasao-256x256.png",
            alt: "Brasão Filarmônica 25 de Março",
            style: {
                width: "100%",
                height: "100%",
                objectFit: "contain"
            }
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/LogoBadge.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/frontend-next/src/components/common/LogoBadge.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = LogoBadge;
}),
"[project]/frontend-next/src/components/common/HomeHeader.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/UIContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useNextRehearsal$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/hooks/useNextRehearsal.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/hooks/useMediaQuery.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$HeaderActions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/HeaderActions.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$LogoBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/LogoBadge.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const HomeHeader = ({ userName, instrument, actions })=>{
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUI"])();
    const isDark = theme === "dark";
    const isDesktop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMediaQuery"])("(min-width: 1024px)");
    const [modoRecesso, setModoRecesso] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API"].getModoRecesso().then((res)=>setModoRecesso(res.ativo));
    }, []);
    const renderRehearsalInfo = ()=>{
        if (modoRecesso) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "12px"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: "#D4AF37",
                        color: "#3D1518",
                        fontSize: "10px",
                        fontFamily: "Outfit, sans-serif",
                        fontWeight: "700",
                        padding: "5px 10px",
                        borderRadius: "8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        whiteSpace: "nowrap"
                    },
                    children: "EM RECESSO"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                    lineNumber: 31,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                lineNumber: 30,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        }
        const rehearsalInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useNextRehearsal$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNextRehearsal"])();
        if (rehearsalInfo.isNow) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "12px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "#22C55E",
                            animation: "pulse 2s ease-in-out infinite"
                        }
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                        lineNumber: 47,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontFamily: "Outfit, sans-serif",
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "#22C55E"
                        },
                        children: "Ensaio acontecendo agora!"
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "12px"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontFamily: "Outfit, sans-serif",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "var(--text-muted)"
                    },
                    children: "Proximo ensaio:"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "rgba(212, 175, 55, 0.15)",
                        padding: "4px 10px",
                        borderRadius: "8px"
                    },
                    children: [
                        rehearsalInfo.days !== undefined && rehearsalInfo.days > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontFamily: "Outfit, sans-serif",
                                fontSize: "14px",
                                fontWeight: "800",
                                color: "#D4AF37"
                            },
                            children: [
                                rehearsalInfo.days,
                                "d"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                            lineNumber: 72,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontFamily: "Outfit, sans-serif",
                                fontSize: "14px",
                                fontWeight: "800",
                                color: "#D4AF37"
                            },
                            children: [
                                rehearsalInfo.hours,
                                "h",
                                rehearsalInfo.minutes !== undefined && rehearsalInfo.minutes > 0 ? ` ${rehearsalInfo.minutes}m` : ""
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontFamily: "Outfit, sans-serif",
                                fontSize: "12px",
                                color: "var(--text-muted)",
                                fontWeight: "500"
                            },
                            children: [
                                "(",
                                rehearsalInfo.dayName,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            !isDesktop && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: "linear-gradient(135deg, #722F37 0%, #5C1A1B 100%)",
                    padding: "14px 20px 18px",
                    paddingTop: "max(env(safe-area-inset-top), 14px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$LogoBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                size: 38,
                                variant: "dark"
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                                lineNumber: 98,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        style: {
                                            fontFamily: "Outfit, sans-serif",
                                            fontSize: "14px",
                                            fontWeight: "700",
                                            color: "#F4E4BC",
                                            marginBottom: "1px",
                                            lineHeight: "1.2"
                                        },
                                        children: "S.F. 25 de Março"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                                        lineNumber: 100,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontFamily: "Outfit, sans-serif",
                                            fontSize: "9px",
                                            fontWeight: "600",
                                            color: "#D4AF37",
                                            letterSpacing: "1px",
                                            textTransform: "uppercase"
                                        },
                                        children: "Acervo Digital"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                                        lineNumber: 106,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                        lineNumber: 97,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$HeaderActions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        inDarkHeader: true
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                lineNumber: 91,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                style: {
                    padding: isDesktop ? "20px 0 24px" : "16px 20px 20px",
                    paddingTop: isDesktop ? "max(env(safe-area-inset-top), 20px)" : "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontFamily: "Outfit, sans-serif",
                                    fontSize: "14px",
                                    color: isDark ? "rgba(255,255,255,0.7)" : "rgba(26,26,26,0.6)",
                                    marginBottom: "2px"
                                },
                                children: "Ola,"
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    flexWrap: "wrap"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        style: {
                                            fontFamily: "Outfit, sans-serif",
                                            fontSize: "28px",
                                            fontWeight: "800",
                                            letterSpacing: "-0.5px",
                                            position: "relative",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            color: isDark ? "#FFFFFF" : "#1a1a1a",
                                            margin: 0
                                        },
                                        children: [
                                            userName,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    marginLeft: "4px",
                                                    fontSize: "16px"
                                                },
                                                children: "✨"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                                                lineNumber: 138,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                                        lineNumber: 132,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "#D4AF37",
                                            color: "#3D1518",
                                            fontSize: "10px",
                                            fontFamily: "Outfit, sans-serif",
                                            fontWeight: "700",
                                            padding: "5px 10px",
                                            borderRadius: "8px",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.5px",
                                            whiteSpace: "nowrap"
                                        },
                                        children: instrument
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                                        lineNumber: 140,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            !isDesktop && renderRehearsalInfo()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    isDesktop && actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: "10px"
                        },
                        children: actions
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                        lineNumber: 151,
                        columnNumber: 34
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/common/HomeHeader.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
const __TURBOPACK__default__export__ = HomeHeader;
}),
"[project]/frontend-next/src/components/music/FeaturedCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/UIContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/icons.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const FeaturedCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(({ sheet, category, bgImage, isFav, onToggleFavorite, isDesktop, stopAnimation })=>{
    const { setSelectedSheet } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUI"])();
    const cardMouseStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0
    });
    const handleMouseDown = (e)=>{
        if (isDesktop) {
            cardMouseStart.current = {
                x: e.clientX,
                y: e.clientY
            };
        }
        stopAnimation();
    };
    const handleClick = (e)=>{
        if (!isDesktop) {
            setSelectedSheet(sheet);
            return;
        }
        const dx = Math.abs(e.clientX - cardMouseStart.current.x);
        const dy = Math.abs(e.clientY - cardMouseStart.current.y);
        if (dx < 5 && dy < 5) {
            setSelectedSheet(sheet);
        }
    };
    const cardWidth = isDesktop ? '280px' : '200px';
    const cardMinHeight = isDesktop ? '200px' : '180px';
    const cardPadding = isDesktop ? '24px' : '20px';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "featured-card",
        onMouseDown: handleMouseDown,
        onTouchStart: stopAnimation,
        onClick: handleClick,
        style: {
            height: 'auto',
            flexShrink: 0,
            alignSelf: 'flex-start',
            background: 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)',
            borderRadius: '20px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            boxSizing: 'border-box',
            width: cardWidth,
            minWidth: cardWidth,
            maxWidth: cardWidth,
            minHeight: cardMinHeight,
            padding: cardPadding
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '20px',
                    padding: '2px',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BC 25%, #D4AF37 50%, #AA8C2C 75%, #D4AF37 100%)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                    animation: 'borderGlow 2s ease-in-out infinite',
                    willChange: 'opacity'
                }
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/music/FeaturedCard.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            bgImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '120px',
                    height: '120px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${bgImage})`,
                    opacity: 0.15,
                    pointerEvents: 'none',
                    maskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)'
                }
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/music/FeaturedCard.tsx",
                lineNumber: 57,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#D4AF37',
                    color: '#3D1518',
                    fontSize: '9px',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: '700',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    zIndex: 2
                },
                children: "Em estudo"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/music/FeaturedCard.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'relative',
                    zIndex: 1
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '14px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: '24px',
                                height: '24px',
                                color: '#F4E4BC'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Music, {}, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/music/FeaturedCard.tsx",
                                lineNumber: 66,
                                columnNumber: 76
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/frontend-next/src/components/music/FeaturedCard.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/music/FeaturedCard.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        style: {
                            fontSize: '16px',
                            fontWeight: '700',
                            marginBottom: '4px',
                            color: '#FFFFFF',
                            fontFamily: "'Outfit', sans-serif",
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        },
                        children: sheet.title
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/music/FeaturedCard.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: '13px',
                            fontFamily: "'Outfit', sans-serif",
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: '14px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        },
                        children: sheet.composer
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/music/FeaturedCard.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '5px 10px',
                                    background: 'rgba(212, 175, 55, 0.2)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(212, 175, 55, 0.3)',
                                    flexShrink: 1,
                                    minWidth: 0,
                                    maxWidth: '70%',
                                    overflow: 'hidden'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '11px',
                                        fontFamily: "'Outfit', sans-serif",
                                        color: '#D4AF37',
                                        fontWeight: '600',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: 'block'
                                    },
                                    children: category?.name
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/src/components/music/FeaturedCard.tsx",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/music/FeaturedCard.tsx",
                                lineNumber: 73,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onToggleFavorite(sheet.id);
                                },
                                style: {
                                    cursor: 'pointer',
                                    padding: '6px',
                                    borderRadius: '8px',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: isFav ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.15)',
                                    border: isFav ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                                    color: isFav ? '#D4AF37' : 'rgba(255, 255, 255, 0.7)'
                                },
                                "aria-label": isFav ? `Remover ${sheet.title} dos favoritos` : `Adicionar ${sheet.title} aos favoritos`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: '16px',
                                        height: '16px'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Heart, {
                                        filled: isFav
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/music/FeaturedCard.tsx",
                                        lineNumber: 82,
                                        columnNumber: 60
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/src/components/music/FeaturedCard.tsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/music/FeaturedCard.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/src/components/music/FeaturedCard.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/music/FeaturedCard.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/music/FeaturedCard.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
FeaturedCard.displayName = "FeaturedCard";
const __TURBOPACK__default__export__ = FeaturedCard;
}),
"[project]/frontend-next/src/components/music/FeaturedSheets.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/UIContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/DataContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/hooks/useMediaQuery.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$music$2f$FeaturedCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/music/FeaturedCard.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const CATEGORY_IMAGES = {
    dobrado: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
    marcha: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&q=80',
    valsa: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80',
    fantasia: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&q=80',
    polaca: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&q=80',
    bolero: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80',
    popular: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    hinos: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&q=80'
};
const FeaturedSheets = ({ sheets, onToggleFavorite, favorites })=>{
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUI"])();
    const { categoriesMap } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useData"])();
    const isDesktop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMediaQuery"])('(min-width: 1024px)');
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const innerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [hasInteracted, setHasInteracted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const inactivityTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const featuredSheets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const featured = sheets.filter((s)=>s.featured);
        return featured.slice(0, 8);
    }, [
        sheets
    ]);
    const stopAnimation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (innerRef.current && scrollRef.current) {
            const computedStyle = window.getComputedStyle(innerRef.current);
            const transform = computedStyle.transform;
            if (transform && transform !== 'none') {
                const matrix = new DOMMatrix(transform);
                const currentX = matrix.m41;
                innerRef.current.style.animation = 'none';
                innerRef.current.style.transform = 'none';
                scrollRef.current.scrollLeft = Math.abs(currentX);
            }
        }
        setHasInteracted(true);
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }
        inactivityTimerRef.current = setTimeout(()=>{
            setHasInteracted(false);
        }, 5000);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
        };
    }, []);
    const handleMouseDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (isDesktop && scrollRef.current) {
            scrollRef.current.dataset.startX = String(e.pageX);
            scrollRef.current.dataset.scrollLeft = String(scrollRef.current.scrollLeft);
            scrollRef.current.dataset.isDragging = 'true';
        }
    }, [
        isDesktop
    ]);
    const handleMouseMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!isDesktop || !scrollRef.current || scrollRef.current.dataset.isDragging !== 'true') return;
        const startX = parseFloat(scrollRef.current.dataset.startX || '0');
        const scrollLeft = parseFloat(scrollRef.current.dataset.scrollLeft || '0');
        const diff = e.pageX - startX;
        scrollRef.current.scrollLeft = scrollLeft - diff;
    }, [
        isDesktop
    ]);
    const handleMouseUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (scrollRef.current) scrollRef.current.dataset.isDragging = 'false';
    }, []);
    if (featuredSheets.length === 0) return null;
    const duplicatedSheets = featuredSheets.length > 2 ? [
        ...featuredSheets,
        ...featuredSheets
    ] : featuredSheets;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-walkthrough": "featured",
        style: {
            marginBottom: '32px',
            width: '100%',
            overflow: 'visible'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: isDesktop ? '0' : '0 20px',
                    marginBottom: '16px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: '18px',
                                fontWeight: '700',
                                marginBottom: '2px'
                            },
                            children: "Em Destaque"
                        }, void 0, false, {
                            fileName: "[project]/frontend-next/src/components/music/FeaturedSheets.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: '13px',
                                color: 'var(--text-muted)'
                            },
                            children: "Partituras em estudo"
                        }, void 0, false, {
                            fileName: "[project]/frontend-next/src/components/music/FeaturedSheets.tsx",
                            lineNumber: 109,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend-next/src/components/music/FeaturedSheets.tsx",
                    lineNumber: 107,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/music/FeaturedSheets.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: scrollRef,
                onMouseDown: handleMouseDown,
                onMouseMove: handleMouseMove,
                onMouseUp: handleMouseUp,
                onMouseLeave: handleMouseUp,
                style: {
                    overflowX: hasInteracted ? 'auto' : 'hidden',
                    overflowY: 'visible',
                    paddingTop: '8px',
                    paddingBottom: '16px',
                    paddingLeft: isDesktop ? '0' : '20px',
                    paddingRight: isDesktop ? '0' : '20px',
                    marginBottom: '-8px',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    cursor: isDesktop ? 'grab' : 'default',
                    overscrollBehaviorX: 'contain',
                    maskImage: !hasInteracted && theme === 'dark' ? 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' : 'none',
                    WebkitMaskImage: !hasInteracted && theme === 'dark' ? 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' : 'none'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: innerRef,
                    style: {
                        display: 'inline-flex',
                        alignItems: 'flex-start',
                        gap: isDesktop ? '20px' : '14px',
                        animation: !hasInteracted && featuredSheets.length > 2 ? `marqueeScroll ${isDesktop ? '80s' : '60s'} linear infinite` : 'none'
                    },
                    children: (featuredSheets.length > 2 ? duplicatedSheets : featuredSheets).map((sheet, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$music$2f$FeaturedCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            sheet: sheet,
                            category: categoriesMap.get(sheet.category),
                            bgImage: CATEGORY_IMAGES[sheet.category],
                            isFav: favorites.includes(sheet.id),
                            onToggleFavorite: onToggleFavorite,
                            isDesktop: isDesktop,
                            stopAnimation: stopAnimation
                        }, `${sheet.id}-${index}`, false, {
                            fileName: "[project]/frontend-next/src/components/music/FeaturedSheets.tsx",
                            lineNumber: 148,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/components/music/FeaturedSheets.tsx",
                    lineNumber: 136,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/music/FeaturedSheets.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/music/FeaturedSheets.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = FeaturedSheets;
}),
"[project]/frontend-next/src/components/music/CategoryCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/UIContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$CategoryIcon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/CategoryIcon.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const CategoryCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(({ category, count, onClick, index = 0 })=>{
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUI"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$CategoryIcon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    minWidth: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
});
CategoryCard.displayName = "CategoryCard";
const __TURBOPACK__default__export__ = CategoryCard;
}),
"[project]/frontend-next/src/components/music/FileCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/UIContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/icons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$CategoryIcon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/CategoryIcon.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
const FileCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(({ sheet, category, isFavorite, onToggleFavorite, index = 0 })=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { setSelectedSheet } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUI"])();
    const handleCardClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setSelectedSheet(sheet);
        router.push(`/acervo/${sheet.category}/${sheet.id}`);
    }, [
        sheet,
        setSelectedSheet,
        router
    ]);
    const handleDownloadClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.stopPropagation();
        setSelectedSheet(sheet);
        router.push(`/acervo/${sheet.category}/${sheet.id}`);
    }, [
        sheet,
        setSelectedSheet,
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$CategoryIcon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    minWidth: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: '16px',
                        height: '16px'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Heart, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: '18px',
                        height: '18px'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Download, {}, void 0, false, {
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
}, (prevProps, nextProps)=>{
    return prevProps.sheet.id === nextProps.sheet.id && prevProps.isFavorite === nextProps.isFavorite && prevProps.category?.id === nextProps.category?.id && prevProps.index === nextProps.index;
});
FileCard.displayName = "FileCard";
const __TURBOPACK__default__export__ = FileCard;
}),
"[project]/frontend-next/src/components/music/ComposerCarousel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const composerPhotos = {
    'Estevam Moura': '/assets/images/compositores/estevam-moura.webp',
    'Tertuliano Santos': '/assets/images/compositores/tertuliano-santos.webp',
    'Amando Nobre': '/assets/images/compositores/amando-nobre.webp',
    'Heráclio Guerreiro': '/assets/images/compositores/heraclio-guerreiro.webp'
};
const priorityOrder = [
    'Estevam Moura',
    'Tertuliano Santos',
    'Amando Nobre',
    'Heráclio Guerreiro'
];
const ComposerCarousel = ({ composers = [] })=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const innerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [hasInteracted, setHasInteracted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const inactivityTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const topComposers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return [
            ...composers
        ].sort((a, b)=>{
            const aIndex = priorityOrder.indexOf(a.name);
            const bIndex = priorityOrder.indexOf(b.name);
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            return b.count - a.count;
        }).slice(0, 3);
    }, [
        composers
    ]);
    const duplicatedComposers = topComposers.length > 1 ? [
        ...topComposers,
        ...topComposers
    ] : topComposers;
    const stopAnimation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (innerRef.current && scrollRef.current) {
            const computedStyle = window.getComputedStyle(innerRef.current);
            const transform = computedStyle.transform;
            if (transform && transform !== 'none') {
                const matrix = new DOMMatrix(transform);
                const currentX = matrix.m41;
                scrollRef.current.scrollLeft = Math.abs(currentX);
            }
        }
        setHasInteracted(true);
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }
        inactivityTimerRef.current = setTimeout(()=>{
            setHasInteracted(false);
        }, 5000);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
        };
    }, []);
    if (topComposers.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '24px 0 0'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 20px',
                    marginBottom: '16px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: {
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: '18px',
                            fontWeight: '700'
                        },
                        children: "Compositores"
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/music/ComposerCarousel.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        style: {
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary)',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            fontFamily: "'Outfit', sans-serif"
                        },
                        onClick: ()=>router.push('/compositores'),
                        children: "Ver Todos"
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/music/ComposerCarousel.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/music/ComposerCarousel.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: scrollRef,
                onTouchStart: stopAnimation,
                onMouseDown: stopAnimation,
                style: {
                    overflowX: hasInteracted ? 'auto' : 'hidden',
                    overflowY: 'visible',
                    paddingTop: '8px',
                    paddingBottom: '16px',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    overscrollBehaviorX: 'contain'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: innerRef,
                    style: {
                        display: 'inline-flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        animation: !hasInteracted && topComposers.length > 1 ? 'marqueeScroll 25s linear infinite' : 'none'
                    },
                    children: (hasInteracted || topComposers.length <= 1 ? topComposers : duplicatedComposers).map((composer, index)=>{
                        const hasPhoto = composerPhotos[composer.name];
                        const isFirst = index === 0 || index === topComposers.length;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push('/compositores'),
                            style: {
                                flex: '0 0 220px',
                                width: '220px',
                                height: '140px',
                                borderRadius: '14px',
                                border: 'none',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                                background: hasPhoto ? 'var(--bg-card)' : 'linear-gradient(145deg, #722F37 0%, #5C1A1B 50%, #3D1011 100%)'
                            },
                            children: [
                                hasPhoto && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'absolute',
                                        inset: '-10%',
                                        backgroundImage: `url(${hasPhoto})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center 30%',
                                        filter: 'brightness(0.85)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/src/components/music/ComposerCarousel.tsx",
                                    lineNumber: 134,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, transparent 80%)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/src/components/music/ComposerCarousel.tsx",
                                    lineNumber: 137,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'absolute',
                                        bottom: '10px',
                                        left: '10px',
                                        right: '10px',
                                        padding: '10px 12px',
                                        borderRadius: '10px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(12px)',
                                        WebkitBackdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                        textAlign: 'left'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontFamily: "'Outfit', sans-serif",
                                                fontSize: '14px',
                                                fontWeight: '700',
                                                color: '#FFFFFF',
                                                marginBottom: '2px',
                                                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                            },
                                            children: composer.name
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/src/components/music/ComposerCarousel.tsx",
                                            lineNumber: 140,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontFamily: "'Outfit', sans-serif",
                                                fontSize: '11px',
                                                color: 'rgba(255, 255, 255, 0.8)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "11",
                                                    height: "11",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    strokeWidth: "2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M9 18V5l12-2v13"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend-next/src/components/music/ComposerCarousel.tsx",
                                                            lineNumber: 145,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                            cx: "6",
                                                            cy: "18",
                                                            r: "3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend-next/src/components/music/ComposerCarousel.tsx",
                                                            lineNumber: 146,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                            cx: "18",
                                                            cy: "16",
                                                            r: "3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend-next/src/components/music/ComposerCarousel.tsx",
                                                            lineNumber: 147,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend-next/src/components/music/ComposerCarousel.tsx",
                                                    lineNumber: 144,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                composer.count,
                                                " partitura",
                                                composer.count !== 1 ? 's' : ''
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend-next/src/components/music/ComposerCarousel.tsx",
                                            lineNumber: 143,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend-next/src/components/music/ComposerCarousel.tsx",
                                    lineNumber: 139,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                isFirst && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        padding: '3px 8px',
                                        borderRadius: '20px',
                                        background: 'linear-gradient(145deg, #D4AF37 0%, #B8860B 100%)',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        color: '#1A1A1A',
                                        fontFamily: "'Outfit', sans-serif",
                                        boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
                                    },
                                    children: "Destaque"
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/src/components/music/ComposerCarousel.tsx",
                                    lineNumber: 154,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, `${composer.name}-${index}`, true, {
                            fileName: "[project]/frontend-next/src/components/music/ComposerCarousel.tsx",
                            lineNumber: 122,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0));
                    })
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/components/music/ComposerCarousel.tsx",
                    lineNumber: 106,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/music/ComposerCarousel.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/music/ComposerCarousel.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = ComposerCarousel;
}),
"[project]/frontend-next/src/components/stats/StreakBar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
const StreakBar = ({ streak = 0, percentual = 0 })=>{
    const [count, setCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const prevStreakRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(streak);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        prevStreakRef.current = streak;
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (streak === 0) return;
        const duration = 1000;
        const steps = 30;
        const increment = streak / steps;
        const interval = duration / steps;
        let current = 0;
        const timer = setInterval(()=>{
            current += increment;
            if (current >= streak) {
                setCount(streak);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, interval);
        return ()=>clearInterval(timer);
    }, [
        streak
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            scale: 0.95
        },
        animate: {
            opacity: 1,
            scale: 1
        },
        transition: {
            duration: 0.5
        },
        style: {
            position: "relative",
            width: "80px",
            background: "linear-gradient(145deg, #722F37 0%, #5C1A1B 50%, #3D1011 100%)",
            borderRadius: "16px",
            padding: "20px 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            overflow: "hidden",
            border: "2px solid transparent",
            backgroundClip: "padding-box"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    inset: "-2px",
                    borderRadius: "16px",
                    padding: "2px",
                    background: "linear-gradient(145deg, #D4AF37, #F4E4BC, #D4AF37)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    animation: "borderGlow 2s ease-in-out infinite",
                    pointerEvents: "none"
                }
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/stats/StreakBar.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "48px",
                    fontWeight: "800",
                    background: "linear-gradient(145deg, #D4AF37 0%, #F4E4BC 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1,
                    filter: "drop-shadow(0 2px 8px rgba(212, 175, 55, 0.3))"
                },
                children: count
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/stats/StreakBar.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.7)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: "center"
                },
                children: "Sequ\\u00eancia"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/stats/StreakBar.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    width: "6px",
                    borderRadius: "3px",
                    background: "rgba(255, 255, 255, 0.1)",
                    position: "relative",
                    overflow: "hidden",
                    minHeight: "60px"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        height: 0
                    },
                    animate: {
                        height: `${Math.min(percentual, 100)}%`
                    },
                    transition: {
                        duration: 1.2,
                        ease: "easeOut"
                    },
                    style: {
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        borderRadius: "3px",
                        background: "linear-gradient(to top, #D4AF37, #F4E4BC)"
                    }
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/components/stats/StreakBar.tsx",
                    lineNumber: 120,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/stats/StreakBar.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                style: {
                    flexShrink: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M12 2C10 6 9 9 9 12C9 15.31 11.69 18 15 18C15.34 18 15.67 17.97 16 17.92C15.38 19.73 13.82 21 12 21C9.24 21 7 18.76 7 16C7 13 8 10 12 2Z",
                        fill: "url(#fireGradient)"
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/stats/StreakBar.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                            id: "fireGradient",
                            x1: "7",
                            y1: "2",
                            x2: "16",
                            y2: "21",
                            gradientUnits: "userSpaceOnUse",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "0%",
                                    stopColor: "#D4AF37"
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/src/components/stats/StreakBar.tsx",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "100%",
                                    stopColor: "#F4E4BC"
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/src/components/stats/StreakBar.tsx",
                                    lineNumber: 156,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend-next/src/components/stats/StreakBar.tsx",
                            lineNumber: 147,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/stats/StreakBar.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/stats/StreakBar.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/stats/StreakBar.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = StreakBar;
}),
"[project]/frontend-next/src/components/stats/AttendanceCalendar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
"use client";
;
;
const AttendanceCalendar = ({ ensaios = [], onEnsaioClick })=>{
    if (!ensaios || ensaios.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                flex: 1,
                background: "var(--bg-card)",
                borderRadius: "12px",
                padding: "16px",
                border: "1px solid var(--border)"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: "center",
                    padding: "32px 16px",
                    color: "var(--text-muted)",
                    fontSize: "14px",
                    fontFamily: "'Outfit', sans-serif"
                },
                children: "Nenhum ensaio registrado ainda"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/stats/AttendanceCalendar.tsx",
                lineNumber: 32,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/stats/AttendanceCalendar.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    const containerVariants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };
    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 10
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3
            }
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            flex: 1,
            background: "var(--bg-card)",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid var(--border)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                    marginBottom: "16px"
                },
                children: "\\u00DAltimos ensaios"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/stats/AttendanceCalendar.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                variants: containerVariants,
                initial: "hidden",
                animate: "visible",
                style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(55px, 1fr))",
                    gap: "10px"
                },
                children: ensaios.map((ensaio)=>{
                    const data = new Date(ensaio.data_ensaio + "T00:00:00Z");
                    const dia = data.getDate();
                    const diaSemana = ensaio.dia_semana || data.toLocaleDateString("pt-BR", {
                        weekday: "short"
                    });
                    const presente = ensaio.usuario_presente === 1;
                    const totalPartituras = ensaio.total_partituras || 0;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                        variants: itemVariants,
                        onClick: ()=>onEnsaioClick?.(ensaio),
                        whileHover: {
                            scale: 1.05
                        },
                        whileTap: {
                            scale: 0.95
                        },
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "6px",
                            padding: "12px 8px",
                            borderRadius: "12px",
                            cursor: "pointer",
                            position: "relative",
                            minHeight: "70px",
                            border: "none",
                            background: presente ? "rgba(67, 185, 127, 0.1)" : "rgba(150, 150, 150, 0.08)",
                            borderBottom: presente ? "2px solid #43B97F" : "2px solid transparent"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: presente ? "#43B97F" : "var(--text-muted)"
                                },
                                children: presente ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "20",
                                    height: "20",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "3",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                        points: "20 6 9 17 4 12"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/stats/AttendanceCalendar.tsx",
                                        lineNumber: 141,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/src/components/stats/AttendanceCalendar.tsx",
                                    lineNumber: 133,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "20",
                                    height: "20",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "18",
                                            y1: "6",
                                            x2: "6",
                                            y2: "18"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/src/components/stats/AttendanceCalendar.tsx",
                                            lineNumber: 152,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "6",
                                            y1: "6",
                                            x2: "18",
                                            y2: "18"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/src/components/stats/AttendanceCalendar.tsx",
                                            lineNumber: 153,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend-next/src/components/stats/AttendanceCalendar.tsx",
                                    lineNumber: 144,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/stats/AttendanceCalendar.tsx",
                                lineNumber: 124,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontFamily: "'Outfit', sans-serif",
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    color: "var(--text-primary)",
                                    lineHeight: 1
                                },
                                children: dia
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/stats/AttendanceCalendar.tsx",
                                lineNumber: 158,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontFamily: "'Outfit', sans-serif",
                                    fontSize: "10px",
                                    fontWeight: "500",
                                    color: "var(--text-muted)",
                                    textTransform: "capitalize"
                                },
                                children: diaSemana.slice(0, 3)
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/stats/AttendanceCalendar.tsx",
                                lineNumber: 169,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            totalPartituras > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: "absolute",
                                    top: "4px",
                                    right: "4px",
                                    background: "rgba(212, 175, 55, 0.2)",
                                    color: "#D4AF37",
                                    width: "18px",
                                    height: "18px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: "'Outfit', sans-serif",
                                    fontSize: "9px",
                                    fontWeight: "700"
                                },
                                children: totalPartituras
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/stats/AttendanceCalendar.tsx",
                                lineNumber: 182,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, ensaio.data_ensaio, true, {
                        fileName: "[project]/frontend-next/src/components/stats/AttendanceCalendar.tsx",
                        lineNumber: 99,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/stats/AttendanceCalendar.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/stats/AttendanceCalendar.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = AttendanceCalendar;
}),
"[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/lib/api.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const EnsaioDetailModal = ({ ensaio, isOpen, onClose })=>{
    const [partituras, setPartituras] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen || !ensaio) return;
        const loadPartituras = async ()=>{
            setLoading(true);
            try {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API"].getPartiturasEnsaio(ensaio.data_ensaio);
                setPartituras(result.partituras || []);
            } catch (error) {
                console.error("Erro ao carregar partituras do ensaio:", error);
                setPartituras([]);
            } finally{
                setLoading(false);
            }
        };
        loadPartituras();
    }, [
        isOpen,
        ensaio
    ]);
    if (!ensaio) return null;
    const data = new Date(ensaio.data_ensaio + "T00:00:00Z");
    const dataFormatada = data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        weekday: "long"
    });
    const presente = ensaio.usuario_presente === 1;
    const backdropVariants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1
        }
    };
    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.9,
            y: 20
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: 20,
            transition: {
                duration: 0.2
            }
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    variants: backdropVariants,
                    initial: "hidden",
                    animate: "visible",
                    exit: "hidden",
                    onClick: onClose,
                    style: {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(4px)",
                        zIndex: 9998
                    }
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                    lineNumber: 88,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    variants: modalVariants,
                    initial: "hidden",
                    animate: "visible",
                    exit: "exit",
                    style: {
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "16px",
                        width: "90%",
                        maxWidth: "500px",
                        maxHeight: "80vh",
                        overflow: "hidden",
                        zIndex: 9999,
                        display: "flex",
                        flexDirection: "column"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                padding: "24px",
                                borderBottom: "1px solid var(--border)"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            style: {
                                                fontFamily: "'Outfit', sans-serif",
                                                fontSize: "20px",
                                                fontWeight: "700",
                                                color: "var(--text-primary)",
                                                margin: 0
                                            },
                                            children: "Ensaio"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                            lineNumber: 139,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontFamily: "'Outfit', sans-serif",
                                                fontSize: "13px",
                                                color: "var(--text-muted)",
                                                margin: "4px 0 0 0",
                                                textTransform: "capitalize"
                                            },
                                            children: dataFormatada
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                            lineNumber: 150,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                    lineNumber: 138,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    "aria-label": "Fechar",
                                    style: {
                                        background: "none",
                                        border: "none",
                                        color: "var(--text-muted)",
                                        cursor: "pointer",
                                        padding: "4px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "24",
                                        height: "24",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "18",
                                                y1: "6",
                                                x2: "6",
                                                y2: "18"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                                lineNumber: 184,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "6",
                                                y1: "6",
                                                x2: "18",
                                                y2: "18"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                                lineNumber: 185,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                        lineNumber: 176,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                    lineNumber: 162,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                            lineNumber: 129,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                margin: "0 24px",
                                marginTop: "16px",
                                padding: "10px 16px",
                                borderRadius: "8px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: "13px",
                                fontWeight: "600",
                                background: presente ? "rgba(67, 185, 127, 0.15)" : "rgba(150, 150, 150, 0.15)",
                                color: presente ? "#43B97F" : "var(--text-muted)",
                                alignSelf: "flex-start"
                            },
                            children: presente ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "16",
                                        height: "16",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                            points: "20 6 9 17 4 12"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                            lineNumber: 220,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                        lineNumber: 212,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Presente"
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "16",
                                        height: "16",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "18",
                                                y1: "6",
                                                x2: "6",
                                                y2: "18"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                                lineNumber: 234,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "6",
                                                y1: "6",
                                                x2: "18",
                                                y2: "18"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                                lineNumber: 235,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                        lineNumber: 226,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Ausente"
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                            lineNumber: 191,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flex: 1,
                                overflowY: "auto",
                                padding: "24px"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    style: {
                                        fontFamily: "'Outfit', sans-serif",
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        color: "var(--text-primary)",
                                        margin: "0 0 16px 0"
                                    },
                                    children: [
                                        "Partituras tocadas (",
                                        partituras.length,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                    lineNumber: 244,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        textAlign: "center",
                                        padding: "32px 16px",
                                        color: "var(--text-muted)",
                                        fontSize: "14px",
                                        fontFamily: "'Outfit', sans-serif"
                                    },
                                    children: "Carregando..."
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                    lineNumber: 257,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)) : partituras.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        textAlign: "center",
                                        padding: "32px 16px",
                                        color: "var(--text-muted)",
                                        fontSize: "14px",
                                        fontFamily: "'Outfit', sans-serif"
                                    },
                                    children: "Nenhuma partitura registrada para este ensaio"
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                    lineNumber: 269,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "12px"
                                    },
                                    children: partituras.map((partitura, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                                padding: "14px",
                                                background: "var(--bg)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "10px"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        width: "28px",
                                                        height: "28px",
                                                        borderRadius: "50%",
                                                        background: "linear-gradient(145deg, #D4AF37 0%, #F4E4BC 100%)",
                                                        color: "#3D1011",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontFamily: "'Outfit', sans-serif",
                                                        fontSize: "12px",
                                                        fontWeight: "700",
                                                        flexShrink: 0
                                                    },
                                                    children: index + 1
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                                    lineNumber: 301,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        flex: 1,
                                                        minWidth: 0
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontFamily: "'Outfit', sans-serif",
                                                                fontSize: "14px",
                                                                fontWeight: "600",
                                                                color: "var(--text-primary)",
                                                                marginBottom: "2px",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap"
                                                            },
                                                            children: partitura.titulo
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                                            lineNumber: 321,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontFamily: "'Outfit', sans-serif",
                                                                fontSize: "12px",
                                                                color: "var(--text-muted)",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap"
                                                            },
                                                            children: partitura.compositor
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                                            lineNumber: 335,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                                    lineNumber: 320,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                partitura.categoria_nome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        padding: "4px 10px",
                                                        borderRadius: "6px",
                                                        fontFamily: "'Outfit', sans-serif",
                                                        fontSize: "10px",
                                                        fontWeight: "600",
                                                        color: "#FFFFFF",
                                                        flexShrink: 0,
                                                        backgroundColor: partitura.categoria_cor || "var(--text-muted)"
                                                    },
                                                    children: partitura.categoria_nome
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                                    lineNumber: 349,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, partitura.id, true, {
                                            fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                            lineNumber: 289,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                                    lineNumber: 281,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                            lineNumber: 243,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
                    lineNumber: 106,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true)
    }, void 0, false, {
        fileName: "[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = EnsaioDetailModal;
}),
"[project]/frontend-next/src/components/stats/PresenceStats.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$stats$2f$StreakBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/stats/StreakBar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$stats$2f$AttendanceCalendar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/stats/AttendanceCalendar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$stats$2f$EnsaioDetailModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/stats/EnsaioDetailModal.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const SkeletonLoader = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "flex",
            gap: "20px"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: "80px",
                    height: "300px",
                    background: "linear-gradient(90deg, var(--bg-card) 0%, rgba(255,255,255,0.05) 50%, var(--bg-card) 100%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s infinite",
                    borderRadius: "16px"
                }
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/stats/PresenceStats.tsx",
                lineNumber: 26,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    height: "300px",
                    background: "linear-gradient(90deg, var(--bg-card) 0%, rgba(255,255,255,0.05) 50%, var(--bg-card) 100%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s infinite",
                    borderRadius: "12px"
                }
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/stats/PresenceStats.tsx",
                lineNumber: 37,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/stats/PresenceStats.tsx",
        lineNumber: 25,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const PresenceStats = ()=>{
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [presencaData, setPresencaData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedEnsaio, setSelectedEnsaio] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!user) {
            setLoading(false);
            return;
        }
        const fetchPresenca = async ()=>{
            try {
                setLoading(true);
                setError(null);
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API"].getMinhaPresenca();
                setPresencaData(data);
            } catch (err) {
                console.error("Erro ao buscar presen\u00e7a:", err);
                setError(err instanceof Error ? err.message : "Erro desconhecido");
            } finally{
                setLoading(false);
            }
        };
        fetchPresenca();
    }, [
        user
    ]);
    const handleEnsaioClick = (ensaio)=>{
        setSelectedEnsaio(ensaio);
        setModalOpen(true);
    };
    const handleCloseModal = ()=>{
        setModalOpen(false);
        setTimeout(()=>setSelectedEnsaio(null), 300);
    };
    if (!user) return null;
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonLoader, {}, void 0, false, {
        fileName: "[project]/frontend-next/src/components/stats/PresenceStats.tsx",
        lineNumber: 91,
        columnNumber: 23
    }, ("TURBOPACK compile-time value", void 0));
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                textAlign: "center",
                padding: "32px 16px",
                color: "var(--text-muted)",
                fontSize: "14px",
                fontFamily: "'Outfit', sans-serif",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "12px"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    margin: 0
                },
                children: "Erro ao carregar dados de presen\\u00e7a"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/stats/PresenceStats.tsx",
                lineNumber: 106,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/stats/PresenceStats.tsx",
            lineNumber: 94,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (!presencaData) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                transition: {
                    duration: 0.4
                },
                style: {
                    display: "flex",
                    gap: "20px",
                    alignItems: "stretch"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$stats$2f$StreakBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        streak: presencaData.streak || 0,
                        percentual: presencaData.percentual_frequencia || 0
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/stats/PresenceStats.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$stats$2f$AttendanceCalendar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        ensaios: presencaData.ultimos_ensaios || [],
                        onEnsaioClick: handleEnsaioClick
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/stats/PresenceStats.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/stats/PresenceStats.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$stats$2f$EnsaioDetailModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                ensaio: selectedEnsaio,
                isOpen: modalOpen,
                onClose: handleCloseModal
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/stats/PresenceStats.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
const __TURBOPACK__default__export__ = PresenceStats;
}),
"[project]/frontend-next/src/constants/version.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APP_VERSION",
    ()=>APP_VERSION
]);
const APP_VERSION = "3.0.0";
}),
"[project]/frontend-next/app/(auth)/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/DataContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useResponsive$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/hooks/useResponsive.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$HomeHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/HomeHeader.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$HeaderActions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/HeaderActions.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$music$2f$FeaturedSheets$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/music/FeaturedSheets.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$music$2f$CategoryCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/music/CategoryCard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$music$2f$FileCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/music/FileCard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$music$2f$ComposerCarousel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/music/ComposerCarousel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$stats$2f$PresenceStats$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/stats/PresenceStats.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$version$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/version.ts [app-ssr] (ecmascript)");
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
;
;
;
;
function HomePage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const { sheets, favorites, toggleFavorite, categories, categoriesMap } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useData"])();
    const isMobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useResponsive$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useIsMobile"])();
    const categoryCounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const counts = {};
        sheets.forEach((s)=>{
            counts[s.category] = (counts[s.category] || 0) + 1;
        });
        return counts;
    }, [
        sheets
    ]);
    const getCategoryCount = (catId)=>categoryCounts[catId] || 0;
    const mainGenres = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const desiredIds = [
            "dobrados",
            "marchas",
            "arranjos",
            "fantasias"
        ];
        const filtered = desiredIds.map((id)=>categories.find((cat)=>cat.id === id)).filter((cat)=>cat != null);
        if (filtered.length === 0 && categories.length > 0) {
            return categories.slice(0, 4);
        }
        return filtered;
    }, [
        categories
    ]);
    const recentSheets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            ...sheets
        ].sort((a, b)=>(b.downloads || 0) - (a.downloads || 0)).slice(0, 6), [
        sheets
    ]);
    const topComposers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const composerCounts = {};
        sheets.forEach((s)=>{
            if (s.composer && s.composer.trim()) {
                composerCounts[s.composer] = (composerCounts[s.composer] || 0) + 1;
            }
        });
        return Object.entries(composerCounts).map(([name, count])=>({
                name,
                count
            })).sort((a, b)=>b.count - a.count).slice(0, 6);
    }, [
        sheets
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: "100%",
            overflow: "visible"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$HomeHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                userName: user?.nome || "Visitante",
                instrument: user?.instrumento || "Músico",
                actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$HeaderActions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                    lineNumber: 73,
                    columnNumber: 18
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    paddingTop: "8px",
                    overflow: "visible"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$music$2f$FeaturedSheets$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    sheets: sheets,
                    favorites: favorites,
                    onToggleFavorite: toggleFavorite
                }, void 0, false, {
                    fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 20px",
                    marginBottom: "16px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: {
                            fontFamily: "Outfit, sans-serif",
                            fontSize: "18px",
                            fontWeight: "700"
                        },
                        children: "Gêneros Musicais"
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        style: {
                            background: "none",
                            border: "none",
                            color: "var(--primary)",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            fontFamily: "Outfit, sans-serif"
                        },
                        onClick: ()=>router.push("/generos"),
                        children: "Ver Todos"
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-walkthrough": "categories",
                style: {
                    padding: "0 20px",
                    marginBottom: "24px"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "categories-grid",
                    style: {
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: "12px",
                        width: "100%"
                    },
                    children: mainGenres.map((cat, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$music$2f$CategoryCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            category: cat,
                            count: getCategoryCount(cat.id),
                            index: i,
                            onClick: ()=>router.push(`/acervo/${cat.id}`)
                        }, cat.id, false, {
                            fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                            lineNumber: 119,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                    lineNumber: 109,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, this),
            isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$music$2f$ComposerCarousel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                composers: topComposers
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                lineNumber: 130,
                columnNumber: 20
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 20px",
                    marginBottom: "12px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: {
                            fontFamily: "Outfit, sans-serif",
                            fontSize: "18px",
                            fontWeight: "700"
                        },
                        children: "Partituras Populares"
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        style: {
                            background: "none",
                            border: "none",
                            color: "var(--primary)",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            fontFamily: "Outfit, sans-serif"
                        },
                        onClick: ()=>router.push("/acervo"),
                        children: "Ver Todas"
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sheets-grid",
                style: {
                    padding: "0 20px"
                },
                children: recentSheets.map((sheet, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$music$2f$FileCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        sheet: sheet,
                        category: categoriesMap.get(sheet.category),
                        isFavorite: favorites.includes(sheet.id),
                        onToggleFavorite: ()=>toggleFavorite(sheet.id),
                        index: index
                    }, sheet.id, false, {
                        fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                        lineNumber: 173,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "32px 20px"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$stats$2f$PresenceStats$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                    lineNumber: 186,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                lineNumber: 185,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "24px 20px 120px",
                    textAlign: "center",
                    borderTop: "1px solid var(--border)",
                    margin: "0 20px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: "13px",
                            color: "var(--text-muted)",
                            fontFamily: "Outfit, sans-serif",
                            marginBottom: "8px"
                        },
                        children: "Filarmônica 25 de Março"
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: "12px",
                            color: "var(--text-muted)",
                            fontFamily: "Outfit, sans-serif",
                            opacity: 0.7
                        },
                        children: [
                            "Acervo Digital de Partituras • Versão ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$version$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["APP_VERSION"]
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                        lineNumber: 207,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/app/(auth)/page.tsx",
                lineNumber: 189,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/app/(auth)/page.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=frontend-next_e47f66fe._.js.map