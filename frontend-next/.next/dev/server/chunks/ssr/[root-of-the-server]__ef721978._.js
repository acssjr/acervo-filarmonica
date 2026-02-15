module.exports = [
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/frontend-next/src/hooks/useMediaQuery.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useMediaQuery",
    ()=>useMediaQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
const useMediaQuery = (query)=>{
    const getMatches = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return false;
    };
    const [matches, setMatches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(getMatches);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = (event)=>setMatches(event.matches);
        media.addEventListener("change", listener);
        return ()=>media.removeEventListener("change", listener);
    }, [
        query,
        matches
    ]);
    return matches;
};
const __TURBOPACK__default__export__ = useMediaQuery;
}),
"[project]/frontend-next/src/constants/config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BREAKPOINTS",
    ()=>BREAKPOINTS,
    "GAP",
    ()=>GAP,
    "LIMITS",
    ()=>LIMITS,
    "SIDEBAR",
    ()=>SIDEBAR,
    "SIZES",
    ()=>SIZES,
    "SPACING",
    ()=>SPACING,
    "TIMING",
    ()=>TIMING,
    "Z_INDEX",
    ()=>Z_INDEX
]);
const BREAKPOINTS = {
    mobile: 768,
    tablet: 1024,
    desktop: 1024
};
const Z_INDEX = {
    bottomNav: 100,
    header: 200,
    sidebar: 300,
    modal: 2000,
    toast: 3000,
    dropdown: 4000,
    tooltip: 5000,
    overlay: 9000,
    max: 9999
};
const TIMING = {
    toastDefault: 3000,
    toastDownload: 4000,
    toastError: 5000,
    debounceSearch: 300,
    debounceInput: 150,
    transitionFast: 150,
    transitionNormal: 300,
    transitionSlow: 500,
    focusDelay: 100,
    marqueeDesktop: 80,
    marqueeMobile: 60
};
const SIDEBAR = {
    expanded: 260,
    collapsed: 72
};
const LIMITS = {
    maxImageSize: 2 * 1024 * 1024,
    maxPdfSize: 50 * 1024 * 1024,
    searchMinLength: 2,
    pinLength: 4,
    featuredMax: 8
};
const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40
};
const SIZES = {
    buttonSm: 32,
    buttonMd: 40,
    buttonLg: 48,
    featuredCardWidth: 200,
    featuredCardWidthDesktop: 280,
    featuredCardHeight: 120,
    avatarSm: 32,
    avatarMd: 40,
    avatarLg: 48,
    iconSm: 16,
    iconMd: 20,
    iconLg: 24,
    logoBadge: 38
};
const GAP = {
    cards: 14,
    cardsDesktop: 20,
    items: 8,
    sections: 24
};
}),
"[project]/frontend-next/src/constants/icons.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Icons",
    ()=>Icons
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const Icons = {
    Home: ({ filled })=>filled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12.71 2.29a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42A1 1 0 0 0 3 13h1v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7h1a1 1 0 0 0 .71-1.71zM12 17a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/constants/icons.tsx",
                lineNumber: 7,
                columnNumber: 50
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 7,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 9,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                    points: "9,22 9,12 15,12 15,22"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 9,
                    columnNumber: 183
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 9,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Folder: ({ filled })=>filled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/constants/icons.tsx",
                lineNumber: 12,
                columnNumber: 50
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 12,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/constants/icons.tsx",
                lineNumber: 14,
                columnNumber: 125
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 14,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Search: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "11",
                    cy: "11",
                    r: "8"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 17,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "m21 21-4.35-4.35"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 17,
                    columnNumber: 156
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 17,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    User: ({ filled })=>filled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/constants/icons.tsx",
                lineNumber: 20,
                columnNumber: 50
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 20,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 22,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "12",
                    cy: "7",
                    r: "4"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 22,
                    columnNumber: 178
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 22,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Download: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 25,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                    points: "7,10 12,15 17,10"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 25,
                    columnNumber: 178
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "12",
                    y1: "15",
                    x2: "12",
                    y2: "3"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 25,
                    columnNumber: 215
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 25,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Upload: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 28,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                    points: "17,8 12,3 7,8"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 28,
                    columnNumber: 178
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "12",
                    y1: "3",
                    x2: "12",
                    y2: "15"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 28,
                    columnNumber: 212
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 28,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Plus: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "12",
                    y1: "5",
                    x2: "12",
                    y2: "19"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 31,
                    columnNumber: 127
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "5",
                    y1: "12",
                    x2: "19",
                    y2: "12"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 31,
                    columnNumber: 165
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 31,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Back: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "15,18 9,12 15,6"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/constants/icons.tsx",
                lineNumber: 34,
                columnNumber: 125
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 34,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Close: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "18",
                    y1: "6",
                    x2: "6",
                    y2: "18"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 37,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "6",
                    y1: "6",
                    x2: "18",
                    y2: "18"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 37,
                    columnNumber: 162
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 37,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Check: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "20,6 9,17 4,12"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/constants/icons.tsx",
                lineNumber: 40,
                columnNumber: 127
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 40,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Bell: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 43,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M13.73 21a2 2 0 0 1-3.46 0"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 43,
                    columnNumber: 180
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 43,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Menu: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "12",
                    cy: "12",
                    r: "1"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 46,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "19",
                    cy: "12",
                    r: "1"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 46,
                    columnNumber: 156
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "5",
                    cy: "12",
                    r: "1"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 46,
                    columnNumber: 187
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 46,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Moon: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/constants/icons.tsx",
                lineNumber: 49,
                columnNumber: 125
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 49,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Sun: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "12",
                    cy: "12",
                    r: "5"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 52,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "12",
                    y1: "1",
                    x2: "12",
                    y2: "3"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 52,
                    columnNumber: 156
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "12",
                    y1: "21",
                    x2: "12",
                    y2: "23"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 52,
                    columnNumber: 193
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "4.22",
                    y1: "4.22",
                    x2: "5.64",
                    y2: "5.64"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 52,
                    columnNumber: 232
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "18.36",
                    y1: "18.36",
                    x2: "19.78",
                    y2: "19.78"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 52,
                    columnNumber: 279
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "1",
                    y1: "12",
                    x2: "3",
                    y2: "12"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 52,
                    columnNumber: 330
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "21",
                    y1: "12",
                    x2: "23",
                    y2: "12"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 52,
                    columnNumber: 367
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "4.22",
                    y1: "19.78",
                    x2: "5.64",
                    y2: "18.36"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 52,
                    columnNumber: 406
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "18.36",
                    y1: "5.64",
                    x2: "19.78",
                    y2: "4.22"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 52,
                    columnNumber: 455
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 52,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Settings: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "12",
                    cy: "12",
                    r: "3"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 55,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 55,
                    columnNumber: 156
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 55,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Monitor: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "2",
                    y: "3",
                    width: "20",
                    height: "14",
                    rx: "2",
                    ry: "2"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 58,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "8",
                    y1: "21",
                    x2: "16",
                    y2: "21"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 58,
                    columnNumber: 181
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "12",
                    y1: "17",
                    x2: "12",
                    y2: "21"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 58,
                    columnNumber: 219
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 58,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Logout: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 61,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                    points: "16,17 21,12 16,7"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 61,
                    columnNumber: 176
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "21",
                    y1: "12",
                    x2: "9",
                    y2: "12"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 61,
                    columnNumber: 213
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 61,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    File: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 64,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                    points: "14,2 14,8 20,8"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 64,
                    columnNumber: 195
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 64,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Music: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M9 18V5l12-2v13"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 67,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "6",
                    cy: "18",
                    r: "3"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 67,
                    columnNumber: 152
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "18",
                    cy: "16",
                    r: "3"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 67,
                    columnNumber: 182
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 67,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Heart: ({ filled })=>filled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "currentColor",
            stroke: "none",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/constants/icons.tsx",
                lineNumber: 70,
                columnNumber: 64
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 70,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/constants/icons.tsx",
                lineNumber: 72,
                columnNumber: 127
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 72,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    HeartFilled: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/constants/icons.tsx",
                lineNumber: 75,
                columnNumber: 50
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 75,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Coreto: ({ filled })=>filled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "currentColor",
            stroke: "currentColor",
            strokeWidth: "0.5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 2L3 7v2h18V7L12 2z"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 78,
                    columnNumber: 90
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M5 10v8h2v-8H5zM11 10v8h2v-8h-2zM17 10v8h2v-8h-2z"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 78,
                    columnNumber: 124
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M3 19v2h18v-2H3z"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 78,
                    columnNumber: 185
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "12",
                    cy: "5.5",
                    r: "1"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 78,
                    columnNumber: 213
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 78,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 2L3 7v2h18V7L12 2z"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 80,
                    columnNumber: 127
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M5 10v8M12 10v8M19 10v8"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 80,
                    columnNumber: 161
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M3 19h18v2H3z"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 80,
                    columnNumber: 196
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "12",
                    cy: "5.5",
                    r: "1",
                    fill: "currentColor"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 80,
                    columnNumber: 221
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 80,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    ChevronLeft: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "15,18 9,12 15,6"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/constants/icons.tsx",
                lineNumber: 83,
                columnNumber: 125
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 83,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    ChevronRight: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "9,6 15,12 9,18"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/constants/icons.tsx",
                lineNumber: 86,
                columnNumber: 125
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 86,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    ChevronDown: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "6,9 12,15 18,9"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/constants/icons.tsx",
                lineNumber: 89,
                columnNumber: 125
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 89,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    ChevronUp: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "18,15 12,9 6,15"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/constants/icons.tsx",
                lineNumber: 92,
                columnNumber: 125
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 92,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Trumpet: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M3 12h4l2-3h6l2 3h4"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 95,
                    columnNumber: 127
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "19",
                    cy: "12",
                    r: "2"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 95,
                    columnNumber: 158
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M7 9v6"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 95,
                    columnNumber: 189
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M9 10v4"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 95,
                    columnNumber: 207
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M11 9v6"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 95,
                    columnNumber: 226
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 95,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Drum: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                    cx: "12",
                    cy: "10",
                    rx: "8",
                    ry: "4"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 98,
                    columnNumber: 127
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M4 10v6c0 2.2 3.6 4 8 4s8-1.8 8-4v-6"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 98,
                    columnNumber: 167
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M4 14c0 2.2 3.6 4 8 4s8-1.8 8-4"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 98,
                    columnNumber: 215
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 98,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Dancers: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "8",
                    cy: "5",
                    r: "2"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 101,
                    columnNumber: 127
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M8 7v4l-3 5"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 101,
                    columnNumber: 156
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M8 11l3 5"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 101,
                    columnNumber: 179
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M5 9l6 0"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 101,
                    columnNumber: 200
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "17",
                    cy: "6",
                    r: "2"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 101,
                    columnNumber: 220
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M17 8v3l2 4"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 101,
                    columnNumber: 250
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M17 11l-2 4"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 101,
                    columnNumber: 273
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 101,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Sparkles: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 104,
                    columnNumber: 127
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M5 18l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 104,
                    columnNumber: 199
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M19 14l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5z"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 104,
                    columnNumber: 249
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 104,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Crown: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M2 17l3-8 4 4 3-6 3 6 4-4 3 8H2z"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 107,
                    columnNumber: 127
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M2 17h20v2H2z"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 107,
                    columnNumber: 171
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 107,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Rose: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 5c-1.5-1.5-4-2-5.5-.5S5.5 9 7 10.5c1.5 1.5 4 2 5 0 1 2 3.5.5 5-1s1-4-.5-5.5S13.5 3.5 12 5z"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 110,
                    columnNumber: 127
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 10v10"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 110,
                    columnNumber: 233
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M9 14c-2 0-3 1-3 3"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 110,
                    columnNumber: 254
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M15 14c2 0 3 1 3 3"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 110,
                    columnNumber: 284
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 110,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    MicrophoneStage: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "12",
                    cy: "6",
                    r: "4"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 113,
                    columnNumber: 127
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 10v4"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 113,
                    columnNumber: 157
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M8 18h8"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 113,
                    columnNumber: 177
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M10 18v3"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 113,
                    columnNumber: 196
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M14 18v3"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 113,
                    columnNumber: 216
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M8 21h8"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 113,
                    columnNumber: 236
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 113,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    MusicNotes: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M9 18V5l12-2v13"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 116,
                    columnNumber: 127
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "6",
                    cy: "18",
                    r: "3"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 116,
                    columnNumber: 154
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "18",
                    cy: "16",
                    r: "3"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 116,
                    columnNumber: 184
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 116,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Church: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 3v4"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 119,
                    columnNumber: 127
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M10 5h4"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 119,
                    columnNumber: 146
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 7l6 5v9H6v-9l6-5z"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 119,
                    columnNumber: 165
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M10 21v-4h4v4"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 119,
                    columnNumber: 198
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 119,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Key: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/constants/icons.tsx",
                lineNumber: 122,
                columnNumber: 125
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 122,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    ListMusic: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M9 18V5l12-2v13"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 125,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "6",
                    cy: "18",
                    r: "3"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 125,
                    columnNumber: 152
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "18",
                    cy: "16",
                    r: "3"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 125,
                    columnNumber: 182
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 125,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Archive: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                    points: "21 8 21 21 3 21 3 8"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 128,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "1",
                    y: "3",
                    width: "22",
                    height: "5"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 128,
                    columnNumber: 165
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "10",
                    y1: "12",
                    x2: "14",
                    y2: "12"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 128,
                    columnNumber: 206
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 128,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Printer: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                    points: "6 9 6 2 18 2 18 9"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 131,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 131,
                    columnNumber: 163
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "6",
                    y: "14",
                    width: "12",
                    height: "8"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 131,
                    columnNumber: 249
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 131,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Calendar: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "3",
                    y: "4",
                    width: "18",
                    height: "18",
                    rx: "2",
                    ry: "2"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 134,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "16",
                    y1: "2",
                    x2: "16",
                    y2: "6"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 134,
                    columnNumber: 181
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "8",
                    y1: "2",
                    x2: "8",
                    y2: "6"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 134,
                    columnNumber: 218
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "3",
                    y1: "10",
                    x2: "21",
                    y2: "10"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 134,
                    columnNumber: 253
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 134,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Share: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "18",
                    cy: "5",
                    r: "3"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 137,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "6",
                    cy: "12",
                    r: "3"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 137,
                    columnNumber: 155
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "18",
                    cy: "19",
                    r: "3"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 137,
                    columnNumber: 185
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "8.59",
                    y1: "13.51",
                    x2: "15.42",
                    y2: "17.49"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 137,
                    columnNumber: 216
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "15.41",
                    y1: "6.51",
                    x2: "8.59",
                    y2: "10.49"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 137,
                    columnNumber: 266
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 137,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Eye: (_props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 140,
                    columnNumber: 125
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "12",
                    cy: "12",
                    r: "3"
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/constants/icons.tsx",
                    lineNumber: 140,
                    columnNumber: 181
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-next/src/constants/icons.tsx",
            lineNumber: 140,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
};
}),
"[project]/frontend-next/src/components/layout/sidebar/SidebarLogo.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
const SidebarLogo = ({ collapsed })=>{
    if (collapsed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                textAlign: 'center',
                width: '40px',
                height: '40px',
                margin: '0 auto',
                background: 'rgba(244, 228, 188, 0.15)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(244, 228, 188, 0.3)',
                overflow: 'hidden',
                padding: '4px'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: "/assets/images/ui/brasao-256x256.png",
                alt: "Brasão",
                style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                }
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarLogo.tsx",
                lineNumber: 11,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarLogo.tsx",
            lineNumber: 10,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(244, 228, 188, 0.15)',
                    border: '2px solid rgba(244, 228, 188, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                    padding: '5px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: "/assets/images/ui/brasao-256x256.png",
                    alt: "Brasão",
                    style: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                    }
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarLogo.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarLogo.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        style: {
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: '15px',
                            fontWeight: '700',
                            color: '#F4E4BC',
                            marginBottom: '1px',
                            lineHeight: '1.2'
                        },
                        children: "S.F. 25 de Março"
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarLogo.tsx",
                        lineNumber: 21,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: '10px',
                            color: 'rgba(255,255,255,0.5)',
                            marginBottom: '4px'
                        },
                        children: "Feira de Santana - BA"
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarLogo.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: '9px',
                            fontWeight: '600',
                            color: '#D4AF37',
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase'
                        },
                        children: "Acervo Digital"
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarLogo.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarLogo.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarLogo.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = SidebarLogo;
}),
"[project]/frontend-next/src/components/layout/sidebar/SidebarNavItem.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
const SidebarNavItem = ({ icon: Icon, label, isActive, collapsed, onClick, danger = false, "data-sidebar": dataSidebar })=>{
    const dangerColor = 'rgba(239, 68, 68, 0.8)';
    const dangerHoverColor = 'rgba(239, 68, 68, 1)';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        title: collapsed ? label : '',
        "aria-label": label,
        "aria-current": isActive ? 'page' : undefined,
        "data-sidebar": dataSidebar,
        style: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '12px',
            padding: collapsed ? '11px' : '11px 12px',
            background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
            border: 'none',
            borderRadius: '10px',
            color: danger ? dangerColor : isActive ? '#fff' : 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '14px',
            fontWeight: isActive ? '600' : '500',
            transition: 'all 0.2s ease',
            marginBottom: '2px'
        },
        onMouseEnter: (e)=>{
            if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            if (danger) e.currentTarget.style.color = dangerHoverColor;
            else if (!isActive) e.currentTarget.style.color = '#fff';
        },
        onMouseLeave: (e)=>{
            if (!isActive) e.currentTarget.style.background = 'transparent';
            if (danger) e.currentTarget.style.color = dangerColor;
            else if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: '18px',
                    height: '18px',
                    flexShrink: 0
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    filled: isActive
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarNavItem.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarNavItem.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            !collapsed && label
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarNavItem.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = SidebarNavItem;
}),
"[project]/frontend-next/src/components/layout/sidebar/SidebarListItem.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
const SidebarListItem = ({ label, count, isActive, onClick })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        "aria-label": label,
        "aria-current": isActive ? 'page' : undefined,
        style: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            paddingLeft: '14px',
            background: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: isActive ? '#D4AF37' : 'rgba(244, 228, 188, 0.85)',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
            fontSize: count !== undefined ? '14px' : '13px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            marginBottom: '2px',
            position: 'relative',
            textAlign: 'left'
        },
        onMouseEnter: (e)=>{
            if (!isActive) {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                e.currentTarget.style.color = '#F4E4BC';
            }
            const bar = e.currentTarget.querySelector('.sidebar-bar');
            if (bar) bar.style.height = isActive ? '24px' : '16px';
        },
        onMouseLeave: (e)=>{
            if (!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(244, 228, 188, 0.85)';
            }
            const bar = e.currentTarget.querySelector('.sidebar-bar');
            if (bar) bar.style.height = isActive ? '24px' : '0px';
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sidebar-bar",
                style: {
                    position: 'absolute',
                    left: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: isActive ? '24px' : '0px',
                    background: '#D4AF37',
                    borderRadius: '2px',
                    transition: 'height 0.2s ease'
                }
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarListItem.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarListItem.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            count !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: '11px',
                    opacity: 0.5
                },
                children: count
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarListItem.tsx",
                lineNumber: 22,
                columnNumber: 31
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarListItem.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = SidebarListItem;
}),
"[project]/frontend-next/src/components/layout/sidebar/SidebarSection.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarListItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/layout/sidebar/SidebarListItem.tsx [app-ssr] (ecmascript)");
"use client";
;
;
const SidebarSection = ({ title, items, selectedId, onItemClick, onHeaderClick, onViewAllClick, showCount = false })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            marginBottom: '12px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '12px',
            padding: '12px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onHeaderClick,
                "aria-label": `Ver todos os ${title.toLowerCase()}`,
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '4px 4px 8px 4px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: '10px',
                            fontWeight: '600',
                            color: 'rgba(244, 228, 188, 0.6)',
                            textTransform: 'uppercase',
                            letterSpacing: '1.5px',
                            transition: 'color 0.2s'
                        },
                        onMouseEnter: (e)=>e.target.style.color = '#D4AF37',
                        onMouseLeave: (e)=>e.target.style.color = 'rgba(244, 228, 188, 0.6)',
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarSection.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "12",
                        height: "12",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "rgba(244, 228, 188, 0.4)",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        "aria-hidden": "true",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                            points: "9 18 15 12 9 6"
                        }, void 0, false, {
                            fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarSection.tsx",
                            lineNumber: 26,
                            columnNumber: 183
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarSection.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarSection.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarListItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            label: item.name,
                            count: showCount ? item.count : undefined,
                            isActive: selectedId === (item.id || item.name),
                            onClick: ()=>onItemClick(item)
                        }, item.id || item.name, false, {
                            fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarSection.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onViewAllClick,
                        "aria-label": `Ver todos os ${title.toLowerCase()}`,
                        style: {
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 12px',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#D4AF37',
                            cursor: 'pointer',
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: '13px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease',
                            marginTop: '4px'
                        },
                        onMouseEnter: (e)=>e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)',
                        onMouseLeave: (e)=>e.currentTarget.style.background = 'transparent',
                        children: [
                            "Ver todos",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "14",
                                height: "14",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                "aria-hidden": "true",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                    points: "9 18 15 12 9 6"
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarSection.tsx",
                                    lineNumber: 34,
                                    columnNumber: 173
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarSection.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarSection.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarSection.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/layout/sidebar/SidebarSection.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = SidebarSection;
}),
"[project]/frontend-next/src/components/layout/sidebar/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/layout/sidebar/SidebarLogo.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarNavItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/layout/sidebar/SidebarNavItem.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarListItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/layout/sidebar/SidebarListItem.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/layout/sidebar/SidebarSection.tsx [app-ssr] (ecmascript)");
;
;
;
;
}),
"[project]/frontend-next/src/components/layout/sidebar/SidebarLogo.tsx [app-ssr] (ecmascript) <export default as SidebarLogo>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SidebarLogo",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/layout/sidebar/SidebarLogo.tsx [app-ssr] (ecmascript)");
}),
"[project]/frontend-next/src/components/layout/sidebar/SidebarNavItem.tsx [app-ssr] (ecmascript) <export default as SidebarNavItem>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SidebarNavItem",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarNavItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarNavItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/layout/sidebar/SidebarNavItem.tsx [app-ssr] (ecmascript)");
}),
"[project]/frontend-next/src/components/layout/sidebar/SidebarSection.tsx [app-ssr] (ecmascript) <export default as SidebarSection>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SidebarSection",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/layout/sidebar/SidebarSection.tsx [app-ssr] (ecmascript)");
}),
"[project]/frontend-next/src/components/layout/DesktopSidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/UIContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/DataContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/icons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend-next/src/components/layout/sidebar/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SidebarLogo$3e$__ = __turbopack_context__.i("[project]/frontend-next/src/components/layout/sidebar/SidebarLogo.tsx [app-ssr] (ecmascript) <export default as SidebarLogo>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarNavItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SidebarNavItem$3e$__ = __turbopack_context__.i("[project]/frontend-next/src/components/layout/sidebar/SidebarNavItem.tsx [app-ssr] (ecmascript) <export default as SidebarNavItem>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SidebarSection$3e$__ = __turbopack_context__.i("[project]/frontend-next/src/components/layout/sidebar/SidebarSection.tsx [app-ssr] (ecmascript) <export default as SidebarSection>");
"use client";
;
;
;
;
;
;
;
;
const DesktopSidebar = ({ activeTab })=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const { sidebarCollapsed, setSidebarCollapsed } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUI"])();
    const { selectedCategory, setSelectedCategory, selectedComposer, setSelectedComposer, sheets, categories } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useData"])();
    const sidebarContentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const composers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const composerSet = new Set(sheets.map((s)=>s.composer).filter((c)=>c && c.trim()));
        return Array.from(composerSet).sort();
    }, [
        sheets
    ]);
    const categoriesWithCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return categories.map((cat)=>({
                ...cat,
                count: sheets.filter((s)=>s.category === cat.id).length
            })).sort((a, b)=>b.count - a.count).slice(0, 4);
    }, [
        sheets,
        categories
    ]);
    const displayComposers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const priorityComposers = [
            'Estevam Moura',
            'Tertuliano Santos',
            'Amando Nobre',
            'Heraclio Guerreiro'
        ];
        const topComposers = priorityComposers.filter((name)=>composers.includes(name)).slice(0, 3);
        if (topComposers.length > 0) return topComposers.map((name)=>({
                name,
                id: name
            }));
        return composers.map((comp)=>({
                name: comp,
                id: comp,
                count: sheets.filter((s)=>s.composer === comp).length
            })).sort((a, b)=>(b.count || 0) - (a.count || 0)).slice(0, 3);
    }, [
        composers,
        sheets
    ]);
    const navItems = [
        {
            id: 'home',
            path: '/',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Home,
            label: 'Inicio'
        },
        {
            id: 'repertorio',
            path: '/repertorio',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].ListMusic,
            label: 'Repertório'
        },
        {
            id: 'favorites',
            path: '/favoritos',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Heart,
            label: 'Favoritos'
        }
    ];
    const handleWheel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        const content = sidebarContentRef.current;
        if (!content) return;
        const { scrollTop, scrollHeight, clientHeight } = content;
        const hasScroll = scrollHeight > clientHeight;
        const atTop = scrollTop === 0;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
        if (!hasScroll || e.deltaY < 0 && atTop || e.deltaY > 0 && atBottom) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const sidebar = document.querySelector('.desktop-sidebar');
        if (sidebar) {
            sidebar.addEventListener('wheel', handleWheel, {
                passive: false
            });
            return ()=>sidebar.removeEventListener('wheel', handleWheel);
        }
    }, [
        handleWheel
    ]);
    const handleNavigation = (path)=>router.push(path);
    const handleCategoryClick = (cat)=>{
        setSelectedCategory(null);
        setSelectedComposer(null);
        handleNavigation(`/acervo/${cat.id}`);
    };
    const handleComposerClick = (comp)=>{
        setSelectedComposer(comp.name);
        setSelectedCategory(null);
        handleNavigation('/acervo');
    };
    const handleViewAllGenres = ()=>{
        setSelectedCategory(null);
        setSelectedComposer(null);
        handleNavigation('/generos');
    };
    const handleViewAllComposers = ()=>{
        setSelectedCategory(null);
        setSelectedComposer(null);
        handleNavigation('/compositores');
    };
    const handleLogout = ()=>{
        logout();
        router.replace('/login');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "desktop-sidebar",
        style: {
            width: sidebarCollapsed ? '72px' : '260px',
            minWidth: sidebarCollapsed ? '72px' : '260px',
            transition: 'all 0.3s ease',
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            background: 'linear-gradient(180deg, #722F37 0%, #5C1A1B 50%, #3D1518 100%)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 300,
            overflow: 'hidden'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setSidebarCollapsed(!sidebarCollapsed),
                "aria-label": sidebarCollapsed ? 'Expandir sidebar' : 'Recolher sidebar',
                style: {
                    position: 'absolute',
                    top: '24px',
                    right: '-14px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)',
                    border: '2px solid #D4AF37',
                    color: '#F4E4BC',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    zIndex: 110,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                },
                onMouseEnter: (e)=>e.currentTarget.style.transform = 'scale(1.1)',
                onMouseLeave: (e)=>e.currentTarget.style.transform = 'scale(1)',
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: '14px',
                        height: '14px'
                    },
                    children: sidebarCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].ChevronRight, {}, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/DesktopSidebar.tsx",
                        lineNumber: 72,
                        columnNumber: 76
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].ChevronLeft, {}, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/DesktopSidebar.tsx",
                        lineNumber: 72,
                        columnNumber: 101
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/components/layout/DesktopSidebar.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/layout/DesktopSidebar.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: sidebarContentRef,
                className: "desktop-sidebar-content",
                style: {
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    padding: '20px 0'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: sidebarCollapsed ? '0 12px' : '0 20px',
                            marginBottom: '32px',
                            marginTop: '8px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SidebarLogo$3e$__["SidebarLogo"], {
                            collapsed: sidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/frontend-next/src/components/layout/DesktopSidebar.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/DesktopSidebar.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        style: {
                            padding: '0 12px',
                            marginBottom: '20px'
                        },
                        children: [
                            !sidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontFamily: 'Outfit, sans-serif',
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    color: 'rgba(255,255,255,0.4)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    padding: '0 12px',
                                    marginBottom: '8px'
                                },
                                children: "Menu"
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/layout/DesktopSidebar.tsx",
                                lineNumber: 79,
                                columnNumber: 33
                            }, ("TURBOPACK compile-time value", void 0)),
                            navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarNavItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SidebarNavItem$3e$__["SidebarNavItem"], {
                                    "data-sidebar": item.id,
                                    icon: item.icon,
                                    label: item.label,
                                    isActive: activeTab === item.id,
                                    collapsed: sidebarCollapsed,
                                    onClick: ()=>handleNavigation(item.path)
                                }, item.id, false, {
                                    fileName: "[project]/frontend-next/src/components/layout/DesktopSidebar.tsx",
                                    lineNumber: 81,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/src/components/layout/DesktopSidebar.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    !sidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '0 12px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SidebarSection$3e$__["SidebarSection"], {
                                title: "Gêneros",
                                items: categoriesWithCount,
                                selectedId: selectedCategory,
                                showCount: true,
                                onItemClick: handleCategoryClick,
                                onHeaderClick: handleViewAllGenres,
                                onViewAllClick: handleViewAllGenres
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/layout/DesktopSidebar.tsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SidebarSection$3e$__["SidebarSection"], {
                                title: "Compositores",
                                items: displayComposers,
                                selectedId: selectedComposer,
                                onItemClick: handleComposerClick,
                                onHeaderClick: handleViewAllComposers,
                                onViewAllClick: handleViewAllComposers
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/layout/DesktopSidebar.tsx",
                                lineNumber: 87,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/src/components/layout/DesktopSidebar.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/layout/DesktopSidebar.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '12px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    marginTop: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarNavItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SidebarNavItem$3e$__["SidebarNavItem"], {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].User,
                        label: "Perfil",
                        isActive: activeTab === 'profile',
                        collapsed: sidebarCollapsed,
                        onClick: ()=>handleNavigation('/perfil')
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/DesktopSidebar.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$sidebar$2f$SidebarNavItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SidebarNavItem$3e$__["SidebarNavItem"], {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Logout,
                        label: "Sair",
                        isActive: false,
                        collapsed: sidebarCollapsed,
                        onClick: handleLogout,
                        danger: true
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/DesktopSidebar.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/layout/DesktopSidebar.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/layout/DesktopSidebar.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = DesktopSidebar;
}),
"[project]/frontend-next/src/components/common/CategoryIcon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$drum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Drum$3e$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/lucide-react/dist/esm/icons/drum.js [app-ssr] (ecmascript) <export default as Drum>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cross$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cross$3e$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/lucide-react/dist/esm/icons/cross.js [app-ssr] (ecmascript) <export default as Cross>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/lucide-react/dist/esm/icons/users-round.js [app-ssr] (ecmascript) <export default as UsersRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/lucide-react/dist/esm/icons/crown.js [app-ssr] (ecmascript) <export default as Crown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/lucide-react/dist/esm/icons/sun.js [app-ssr] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Flag$3e$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/lucide-react/dist/esm/icons/flag.js [app-ssr] (ecmascript) <export default as Flag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$church$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Church$3e$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/lucide-react/dist/esm/icons/church.js [app-ssr] (ecmascript) <export default as Church>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-ssr] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/lucide-react/dist/esm/icons/music.js [app-ssr] (ecmascript) <export default as Music>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$landmark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Landmark$3e$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/lucide-react/dist/esm/icons/landmark.js [app-ssr] (ecmascript) <export default as Landmark>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/lucide-react/dist/esm/icons/music-2.js [app-ssr] (ecmascript) <export default as Music2>");
"use client";
;
;
const CategoryIcon = ({ categoryId, size = 24, color = '#fff' })=>{
    const iconProps = {
        size,
        color,
        strokeWidth: 1.75
    };
    const categoryMap = {
        'dobrado': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__["Music2"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 32,
            columnNumber: 16
        }, ("TURBOPACK compile-time value", void 0)),
        'dobrados': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__["Music2"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 33,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
        'marcha': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$drum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Drum$3e$__["Drum"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 34,
            columnNumber: 15
        }, ("TURBOPACK compile-time value", void 0)),
        'marchas': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$drum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Drum$3e$__["Drum"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 35,
            columnNumber: 16
        }, ("TURBOPACK compile-time value", void 0)),
        'marcha-funebre': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cross$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cross$3e$__["Cross"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 36,
            columnNumber: 23
        }, ("TURBOPACK compile-time value", void 0)),
        'marchas-funebres': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cross$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cross$3e$__["Cross"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 37,
            columnNumber: 25
        }, ("TURBOPACK compile-time value", void 0)),
        'marcha-religiosa': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$church$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Church$3e$__["Church"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 38,
            columnNumber: 25
        }, ("TURBOPACK compile-time value", void 0)),
        'marchas-religiosas': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$church$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Church$3e$__["Church"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 39,
            columnNumber: 27
        }, ("TURBOPACK compile-time value", void 0)),
        'valsa': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__["UsersRound"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 40,
            columnNumber: 14
        }, ("TURBOPACK compile-time value", void 0)),
        'valsas': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__["UsersRound"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 41,
            columnNumber: 15
        }, ("TURBOPACK compile-time value", void 0)),
        'bolero': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 42,
            columnNumber: 15
        }, ("TURBOPACK compile-time value", void 0)),
        'boleros': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 43,
            columnNumber: 16
        }, ("TURBOPACK compile-time value", void 0)),
        'polaca': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__["Crown"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 44,
            columnNumber: 15
        }, ("TURBOPACK compile-time value", void 0)),
        'polacas': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__["Crown"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 45,
            columnNumber: 16
        }, ("TURBOPACK compile-time value", void 0)),
        'fantasia': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 46,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
        'fantasias': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 47,
            columnNumber: 18
        }, ("TURBOPACK compile-time value", void 0)),
        'preludio': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 48,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
        'preludios': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 49,
            columnNumber: 18
        }, ("TURBOPACK compile-time value", void 0)),
        'hino': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Flag$3e$__["Flag"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 50,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0)),
        'hinos': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Flag$3e$__["Flag"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 51,
            columnNumber: 14
        }, ("TURBOPACK compile-time value", void 0)),
        'hino-civico': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$landmark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Landmark$3e$__["Landmark"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 52,
            columnNumber: 20
        }, ("TURBOPACK compile-time value", void 0)),
        'hinos-civicos': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$landmark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Landmark$3e$__["Landmark"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 53,
            columnNumber: 22
        }, ("TURBOPACK compile-time value", void 0)),
        'hino-religioso': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$church$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Church$3e$__["Church"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 54,
            columnNumber: 23
        }, ("TURBOPACK compile-time value", void 0)),
        'hinos-religiosos': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$church$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Church$3e$__["Church"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 55,
            columnNumber: 25
        }, ("TURBOPACK compile-time value", void 0)),
        'arranjo': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 56,
            columnNumber: 16
        }, ("TURBOPACK compile-time value", void 0)),
        'arranjos': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 57,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
        'popular': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__["Music"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 58,
            columnNumber: 16
        }, ("TURBOPACK compile-time value", void 0)),
        'musica-popular': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__["Music"], {
            ...iconProps
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
            lineNumber: 59,
            columnNumber: 23
        }, ("TURBOPACK compile-time value", void 0))
    };
    return categoryMap[categoryId] || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__["Music"], {
        ...iconProps
    }, void 0, false, {
        fileName: "[project]/frontend-next/src/components/common/CategoryIcon.tsx",
        lineNumber: 62,
        columnNumber: 37
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = CategoryIcon;
}),
"[project]/frontend-next/src/components/common/ThemeSelector.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/UIContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/icons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/hooks/useMediaQuery.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const ThemeSelector = ({ inDarkHeader = false, compact = false, inline = false })=>{
    const { themeMode, setThemeMode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUI"])();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const selectorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isMobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMediaQuery"])('(max-width: 767px)');
    const options = [
        {
            id: 'light',
            label: 'Claro',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Sun
        },
        {
            id: 'dark',
            label: 'Escuro',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Moon
        },
        {
            id: 'system',
            label: 'Sistema',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Monitor
        }
    ];
    const cycleTheme = ()=>{
        const order = [
            'light',
            'dark',
            'system'
        ];
        const currentIndex = order.indexOf(themeMode);
        const nextIndex = (currentIndex + 1) % order.length;
        setThemeMode(order[nextIndex]);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleClickOutside = (e)=>{
            if (selectorRef.current && !selectorRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [
        isOpen
    ]);
    // Inline version (3 buttons side by side) for desktop header
    if (inline) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                gap: '4px',
                background: 'var(--bg-secondary)',
                borderRadius: '10px',
                padding: '4px',
                border: '1px solid var(--border)'
            },
            children: options.map((option)=>{
                const Icon = option.icon;
                const isActive = themeMode === option.id;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setThemeMode(option.id),
                    title: option.label,
                    "aria-label": `Tema ${option.label}`,
                    "aria-pressed": isActive,
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px',
                        background: isActive ? 'var(--primary)' : 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: isActive ? '#fff' : 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '16px',
                            height: '16px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {}, void 0, false, {
                            fileName: "[project]/frontend-next/src/components/common/ThemeSelector.tsx",
                            lineNumber: 78,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/common/ThemeSelector.tsx",
                        lineNumber: 77,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0))
                }, option.id, false, {
                    fileName: "[project]/frontend-next/src/components/common/ThemeSelector.tsx",
                    lineNumber: 62,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0));
            })
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/ThemeSelector.tsx",
            lineNumber: 52,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    const currentOption = options.find((o)=>o.id === themeMode);
    const CurrentIcon = currentOption?.icon || __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Sun;
    const darkHeaderStyles = {
        background: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#F4E4BC'
    };
    const normalStyles = {
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)'
    };
    const buttonStyles = inDarkHeader ? darkHeaderStyles : normalStyles;
    const handleClick = ()=>{
        if (isMobile) {
            cycleTheme();
        } else {
            setIsOpen(!isOpen);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: selectorRef,
        style: {
            position: 'relative'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleClick,
                "aria-label": `Tema atual: ${currentOption?.label}. Clique para alterar`,
                "aria-haspopup": !isMobile,
                "aria-expanded": isOpen,
                style: {
                    width: compact ? '36px' : '40px',
                    height: compact ? '36px' : '40px',
                    borderRadius: '10px',
                    ...buttonStyles,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: '18px',
                        height: '18px'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CurrentIcon, {}, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/common/ThemeSelector.tsx",
                        lineNumber: 129,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/components/common/ThemeSelector.tsx",
                    lineNumber: 128,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/common/ThemeSelector.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: 'var(--bg-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    padding: '6px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    minWidth: '140px',
                    zIndex: 50
                },
                children: options.map((option)=>{
                    const Icon = option.icon;
                    const isActive = themeMode === option.id;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setThemeMode(option.id);
                            setIsOpen(false);
                        },
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            width: '100%',
                            background: isActive ? 'var(--bg-secondary)' : 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            color: isActive ? 'var(--primary)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: '13px',
                            fontWeight: isActive ? '600' : '400',
                            transition: 'all 0.15s ease'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '16px',
                                    height: '16px'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {}, void 0, false, {
                                    fileName: "[project]/frontend-next/src/components/common/ThemeSelector.tsx",
                                    lineNumber: 160,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/common/ThemeSelector.tsx",
                                lineNumber: 159,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            option.label
                        ]
                    }, option.id, true, {
                        fileName: "[project]/frontend-next/src/components/common/ThemeSelector.tsx",
                        lineNumber: 145,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/common/ThemeSelector.tsx",
                lineNumber: 134,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/common/ThemeSelector.tsx",
        lineNumber: 113,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = ThemeSelector;
}),
"[project]/frontend-next/src/components/common/AdminToggle.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/icons.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const AdminToggle = ()=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [isTransitioning, setIsTransitioning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const isInAdmin = pathname.startsWith('/admin');
    const handleToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (isTransitioning) return;
        setIsTransitioning(true);
        document.body.classList.add('admin-transition-out');
        setTimeout(()=>{
            const targetRoute = isInAdmin ? '/' : '/admin';
            router.push(targetRoute);
            document.body.classList.remove('admin-transition-out');
            document.body.classList.add('admin-transition-in');
            setTimeout(()=>{
                document.body.classList.remove('admin-transition-in');
                setIsTransitioning(false);
            }, 200);
        }, 150);
    }, [
        isInAdmin,
        isTransitioning,
        router
    ]);
    if (!user?.is_admin) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: handleToggle,
        disabled: isTransitioning,
        title: isInAdmin ? 'Voltar ao Acervo' : 'Ir para Admin',
        "aria-label": isInAdmin ? 'Voltar ao Acervo' : 'Ir para Admin',
        style: {
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: isInAdmin ? 'linear-gradient(145deg, #D4AF37, #B8860B)' : 'linear-gradient(145deg, #722F37, #5C1A1B)',
            border: isInAdmin ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid rgba(212, 175, 55, 0.3)',
            color: isInAdmin ? '#3D1518' : '#D4AF37',
            cursor: isTransitioning ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            opacity: isTransitioning ? 0.7 : 1
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: '18px',
                height: '18px',
                transition: 'transform 0.3s ease',
                transform: isInAdmin ? 'rotate(45deg)' : 'rotate(0deg)'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Key, {}, void 0, false, {
                fileName: "[project]/frontend-next/src/components/common/AdminToggle.tsx",
                lineNumber: 65,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/common/AdminToggle.tsx",
            lineNumber: 60,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/frontend-next/src/components/common/AdminToggle.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = AdminToggle;
}),
"[project]/frontend-next/src/hooks/useNextRehearsal.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getNextRehearsal",
    ()=>getNextRehearsal
]);
const getNextRehearsal = ()=>{
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const rehearsalDays = [
        1,
        3
    ];
    const rehearsalHour = 19;
    const rehearsalEndHour = 21;
    const isRehearsalDay = rehearsalDays.includes(currentDay);
    const isDuringRehearsal = isRehearsalDay && currentHour >= rehearsalHour && currentHour < rehearsalEndHour;
    if (isDuringRehearsal) {
        const minutesLeft = (rehearsalEndHour - currentHour - 1) * 60 + (60 - currentMinute);
        return {
            isNow: true,
            minutesLeft
        };
    }
    let daysUntil = 0;
    let nextDay = currentDay;
    if (isRehearsalDay && currentHour >= rehearsalHour) {
        nextDay = (currentDay + 1) % 7;
        daysUntil = 1;
    }
    while(!rehearsalDays.includes(nextDay)){
        nextDay = (nextDay + 1) % 7;
        daysUntil++;
    }
    const nextRehearsal = new Date(now);
    nextRehearsal.setDate(now.getDate() + daysUntil);
    nextRehearsal.setHours(rehearsalHour, 0, 0, 0);
    const diff = nextRehearsal.getTime() - now.getTime();
    const totalMinutes = Math.floor(diff / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor(totalMinutes % (60 * 24) / 60);
    const minutes = totalMinutes % 60;
    const dayName = nextDay === 1 ? "segunda" : "quarta";
    return {
        isNow: false,
        days,
        hours,
        minutes,
        dayName
    };
};
const __TURBOPACK__default__export__ = getNextRehearsal;
}),
"[project]/frontend-next/src/utils/search.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "findSimilar",
    ()=>findSimilar,
    "levenshtein",
    ()=>levenshtein,
    "levenshteinDistance",
    ()=>levenshteinDistance
]);
const levenshteinDistance = (str1, str2)=>{
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    const costs = [];
    for(let i = 0; i <= s1.length; i++){
        let lastValue = i;
        for(let j = 0; j <= s2.length; j++){
            if (i === 0) {
                costs[j] = j;
            } else if (j > 0) {
                let newValue = costs[j - 1];
                if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                }
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
};
const findSimilar = (query, items, threshold = 3)=>{
    const q = query.toLowerCase().trim();
    if (q.length < 2) return null;
    let bestMatch = null;
    let bestDistance = Infinity;
    items.forEach((item)=>{
        const titleDist = levenshteinDistance(q, item.title);
        const titleWords = item.title.toLowerCase().split(" ");
        const wordDistances = titleWords.map((word)=>levenshteinDistance(q, word));
        const minWordDist = Math.min(...wordDistances);
        const minDist = Math.min(titleDist, minWordDist);
        if (minDist < bestDistance && minDist <= threshold && minDist > 0) {
            bestDistance = minDist;
            bestMatch = item.title;
        }
        const composerDist = levenshteinDistance(q, item.composer);
        if (composerDist < bestDistance && composerDist <= threshold && composerDist > 0) {
            bestDistance = composerDist;
            bestMatch = item.composer;
        }
    });
    return bestMatch;
};
const levenshtein = levenshteinDistance;
}),
"[project]/frontend-next/src/components/layout/DesktopHeader.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
// ===== DESKTOP HEADER =====
// Header para desktop com busca, data e notificacoes
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/UIContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/DataContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$NotificationContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/NotificationContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/icons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$CategoryIcon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/CategoryIcon.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$ThemeSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/ThemeSelector.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$AdminToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/common/AdminToggle.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useNextRehearsal$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/hooks/useNextRehearsal.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$utils$2f$search$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/utils/search.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/lib/api.ts [app-ssr] (ecmascript)");
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
// --- Utility functions ---
// Normaliza texto para busca (estilo YouTube)
const normalize = (str)=>{
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[ºª°]/g, '') // Remove indicadores ordinais
    .replace(/n[°º.]?\s*/gi, 'n') // "n. ", "n° " -> "n"
    .replace(/\./g, ' ') // Pontos viram espacos
    .replace(/\s+/g, ' ') // Colapsa espacos multiplos
    .trim();
};
// Transliteracoes de grafias antigas/alternativas para modernas
// Permite que "ninfas" encontre "nymphas", "filosofia" encontre "philosophia", etc.
const transliterate = (str)=>{
    return str// Grafias gregas/latinas antigas (ordem importa!)
    .replace(/mph/g, 'nf') // nymphas -> ninfas (nasal antes de ph)
    .replace(/ph/g, 'f') // philosophia -> filosofia
    .replace(/th/g, 't') // theatro -> teatro
    .replace(/y/g, 'i') // nymphas -> ninfas, lyra -> lira
    .replace(/ch(?=[aeiou])/g, 'c') // chronica -> cronica (antes de vogal)
    .replace(/rh/g, 'r') // rhetorica -> retorica
    // Duplicacoes antigas
    .replace(/ll/g, 'l') // belleza -> beleza
    .replace(/mm/g, 'm') // commando -> comando
    .replace(/nn/g, 'n') // anno -> ano
    .replace(/pp/g, 'p') // appello -> apelo
    .replace(/ss(?!$)/g, 's') // passo -> paso (exceto final)
    .replace(/tt/g, 't') // attender -> atender
    .replace(/cc/g, 'c') // accento -> acento
    .replace(/ff/g, 'f'); // affecto -> afeto
};
// --- Component ---
const DesktopHeader = ()=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { setShowNotifications } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUI"])();
    const { sheets, favorites, toggleFavorite, categoriesMap } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useData"])();
    const { unreadCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$NotificationContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useNotifications"])();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [showResults, setShowResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [modoRecesso, setModoRecesso] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API"].getModoRecesso().then((res)=>setModoRecesso(res.ativo));
    }, []);
    // Busca fuzzy nos sheets com transliteracao - TODAS as palavras devem ser encontradas
    const searchResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!searchQuery.trim()) return [];
        const query = normalize(searchQuery);
        const queryTranslit = transliterate(query);
        const queryWords = query.split(/\s+/).filter((w)=>w.length > 0);
        const queryWordsTranslit = queryWords.map((w)=>transliterate(w));
        return sheets.map((sheet)=>{
            const titleNorm = normalize(sheet.title);
            const titleTranslit = transliterate(titleNorm);
            const composerNorm = normalize(sheet.composer);
            const composerTranslit = transliterate(composerNorm);
            const category = categoriesMap.get(sheet.category);
            const categoryNorm = normalize(category?.name || '');
            let score = 0;
            // Match pela query completa (maior peso)
            if (titleNorm.startsWith(query)) score += 100;
            else if (titleNorm.includes(query)) score += 50;
            else if (titleTranslit.startsWith(queryTranslit)) score += 95;
            else if (titleTranslit.includes(queryTranslit)) score += 45;
            if (composerNorm.startsWith(query)) score += 80;
            else if (composerNorm.includes(query)) score += 40;
            else if (composerTranslit.startsWith(queryTranslit)) score += 75;
            else if (composerTranslit.includes(queryTranslit)) score += 35;
            if (categoryNorm.startsWith(query)) score += 60;
            else if (categoryNorm.includes(query)) score += 30;
            // Busca por palavras individuais - TODAS devem ser encontradas
            const searchText = `${titleNorm} ${composerNorm} ${categoryNorm}`;
            const wordMatches = queryWords.map((word, idx)=>{
                if (word.length < 1) return {
                    found: true,
                    score: 0
                };
                const wordTranslit = queryWordsTranslit[idx];
                let wordScore = 0;
                let found = false;
                if (titleNorm.includes(word)) {
                    wordScore += 25;
                    found = true;
                } else if (titleTranslit.includes(wordTranslit)) {
                    wordScore += 22;
                    found = true;
                } else if (composerNorm.includes(word)) {
                    wordScore += 20;
                    found = true;
                } else if (composerTranslit.includes(wordTranslit)) {
                    wordScore += 18;
                    found = true;
                } else if (categoryNorm.includes(word)) {
                    wordScore += 15;
                    found = true;
                }
                // Fuzzy match se nao encontrou
                if (!found) {
                    for (const tw of searchText.split(/\s+/)){
                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$utils$2f$search$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["levenshtein"])(word, tw) <= 1) {
                            wordScore += 5;
                            found = true;
                            break;
                        }
                    }
                }
                return {
                    found,
                    score: wordScore
                };
            });
            // TODAS as palavras devem ser encontradas
            if (!wordMatches.every((m)=>m.found)) {
                return {
                    ...sheet,
                    score: 0,
                    category
                };
            }
            wordMatches.forEach((m)=>{
                score += m.score;
            });
            if (queryWords.length > 1) score += 30;
            return {
                ...sheet,
                score,
                category
            };
        }).filter((sheet)=>sheet.score > 0).sort((a, b)=>b.score - a.score).slice(0, 8);
    }, [
        searchQuery,
        sheets,
        categoriesMap
    ]);
    // Controla exibicao dos resultados com delay para animacao de saida
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!searchQuery.trim()) {
            const timeout = setTimeout(()=>setShowResults(false), 200);
            return ()=>clearTimeout(timeout);
        }
    }, [
        searchQuery
    ]);
    // Mostra resultados imediatamente ao digitar, sem setState em effect
    const handleSearchChange = (value)=>{
        setSearchQuery(value);
        if (value.trim()) {
            setShowResults(true);
        }
    };
    // Usa a funcao global getNextRehearsal
    const rehearsalInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useNextRehearsal$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNextRehearsal"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            minWidth: '200px',
                            alignItems: 'flex-start'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: 'Outfit, sans-serif',
                                    fontSize: '13px',
                                    color: 'var(--text-muted)',
                                    whiteSpace: 'nowrap'
                                },
                                children: new Date().toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long'
                                })
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                lineNumber: 220,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            modoRecesso ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: '#D4AF37',
                                    color: '#3D1518',
                                    fontSize: '10px',
                                    fontFamily: 'Outfit, sans-serif',
                                    fontWeight: '700',
                                    padding: '5px 10px',
                                    borderRadius: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    whiteSpace: 'nowrap',
                                    display: 'inline-block'
                                },
                                children: "EM RECESSO"
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                lineNumber: 231,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)) : rehearsalInfo.isNow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            background: '#22C55E',
                                            animation: 'pulse 2s ease-in-out infinite'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                        lineNumber: 252,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: 'Outfit, sans-serif',
                                            fontSize: '13px',
                                            fontWeight: '700',
                                            color: '#22C55E'
                                        },
                                        children: "Ensaio agora!"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                        lineNumber: 259,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                lineNumber: 247,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: 'Outfit, sans-serif',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            color: 'var(--text-muted)'
                                        },
                                        children: "Proximo ensaio:"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                        lineNumber: 274,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            background: 'rgba(212, 175, 55, 0.15)',
                                            padding: '4px 10px',
                                            borderRadius: '8px'
                                        },
                                        children: [
                                            rehearsalInfo.days !== undefined && rehearsalInfo.days > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: 'Outfit, sans-serif',
                                                    fontSize: '14px',
                                                    fontWeight: '800',
                                                    color: '#D4AF37'
                                                },
                                                children: [
                                                    rehearsalInfo.days,
                                                    "d"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                                lineNumber: 291,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: 'Outfit, sans-serif',
                                                    fontSize: '14px',
                                                    fontWeight: '800',
                                                    color: '#D4AF37'
                                                },
                                                children: [
                                                    rehearsalInfo.hours,
                                                    "h",
                                                    rehearsalInfo.minutes !== undefined && rehearsalInfo.minutes > 0 ? ` ${rehearsalInfo.minutes}m` : ''
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                                lineNumber: 300,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: 'Outfit, sans-serif',
                                                    fontSize: '12px',
                                                    color: 'var(--text-muted)',
                                                    fontWeight: '500'
                                                },
                                                children: [
                                                    "(",
                                                    rehearsalInfo.dayName,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                                lineNumber: 308,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                        lineNumber: 282,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                lineNumber: 269,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                        lineNumber: 213,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1
                        }
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                        lineNumber: 322,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '100%',
                            maxWidth: '400px',
                            position: 'relative'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            "data-walkthrough": "search",
                            className: "search-bar",
                            role: "search",
                            style: {
                                padding: '10px 16px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "search-icon",
                                    width: "16",
                                    height: "16",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    "aria-hidden": "true",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "11",
                                            cy: "11",
                                            r: "8"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                            lineNumber: 332,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "m21 21-4.35-4.35"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                            lineNumber: 333,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                    lineNumber: 331,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Buscar partituras...",
                                    value: searchQuery,
                                    onChange: (e)=>handleSearchChange(e.target.value),
                                    "aria-label": "Buscar partituras",
                                    autoComplete: "off"
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                    lineNumber: 335,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "clear-btn",
                                    onClick: ()=>handleSearchChange(''),
                                    "aria-label": "Limpar busca",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "12",
                                        height: "12",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2.5",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        "aria-hidden": "true",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "18",
                                                y1: "6",
                                                x2: "6",
                                                y2: "18"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                                lineNumber: 346,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "6",
                                                y1: "6",
                                                x2: "18",
                                                y2: "18"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                                lineNumber: 346,
                                                columnNumber: 57
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                        lineNumber: 345,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                    lineNumber: 344,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                            lineNumber: 330,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                        lineNumber: 325,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1
                        }
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                        lineNumber: 354,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$ThemeSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                inline: true
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                lineNumber: 359,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowNotifications(true),
                                "aria-label": unreadCount > 0 ? `Notificações (${unreadCount} não lidas)` : 'Notificações',
                                style: {
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    transition: 'all 0.2s ease'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '18px',
                                            height: '18px'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Bell, {}, void 0, false, {
                                            fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                            lineNumber: 381,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                        lineNumber: 380,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: 'absolute',
                                            top: '-4px',
                                            right: '-4px',
                                            minWidth: '18px',
                                            height: '18px',
                                            padding: '0 5px',
                                            borderRadius: '9px',
                                            background: '#E74C3C',
                                            color: '#fff',
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            fontFamily: 'Outfit, sans-serif',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        },
                                        children: unreadCount > 99 ? '99+' : unreadCount
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                        lineNumber: 384,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                lineNumber: 362,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$AdminToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                lineNumber: 408,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                        lineNumber: 357,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                lineNumber: 207,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    maxHeight: showResults && (searchResults.length > 0 || searchQuery) ? '400px' : '0',
                    opacity: showResults && (searchResults.length > 0 || searchQuery) ? 1 : 0,
                    marginTop: showResults && (searchResults.length > 0 || searchQuery) ? '0' : '-20px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: 'var(--bg-card)',
                        borderRadius: '16px',
                        border: '1px solid var(--border)',
                        padding: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontFamily: 'Outfit, sans-serif',
                                fontSize: '12px',
                                color: 'var(--text-muted)',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            },
                            children: [
                                searchResults.length,
                                " resultado",
                                searchResults.length !== 1 ? 's' : '',
                                " encontrado",
                                searchResults.length !== 1 ? 's' : ''
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                            lineNumber: 427,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '10px'
                            },
                            children: searchResults.map((sheet, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: ()=>{
                                        router.push(`/acervo/${sheet.category?.id}/${sheet.id}`);
                                        setSearchQuery('');
                                    },
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        animation: `fadeSlideIn 0.3s ease ${index * 0.05}s both`
                                    },
                                    onMouseEnter: (e)=>e.currentTarget.style.transform = 'translateX(4px)',
                                    onMouseLeave: (e)=>e.currentTarget.style.transform = 'translateX(0)',
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: '44px',
                                                height: '44px',
                                                borderRadius: '10px',
                                                background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
                                                border: '1px solid rgba(212, 175, 55, 0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$common$2f$CategoryIcon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                categoryId: sheet.category?.id ?? "",
                                                size: 20,
                                                color: "#D4AF37"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                                lineNumber: 475,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                            lineNumber: 464,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                flex: 1,
                                                minWidth: 0
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontFamily: 'Outfit, sans-serif',
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        color: 'var(--text-primary)',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    },
                                                    children: sheet.title
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                                    lineNumber: 479,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontFamily: 'Outfit, sans-serif',
                                                        fontSize: '12px',
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: [
                                                        sheet.composer,
                                                        " • ",
                                                        sheet.category?.name
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                                    lineNumber: 490,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                            lineNumber: 478,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: (e)=>{
                                                e.stopPropagation();
                                                toggleFavorite(sheet.id);
                                            },
                                            "aria-label": favorites.includes(sheet.id) ? `Remover ${sheet.title} dos favoritos` : `Adicionar ${sheet.title} aos favoritos`,
                                            style: {
                                                background: favorites.includes(sheet.id) ? 'rgba(232,90,79,0.1)' : 'transparent',
                                                border: 'none',
                                                borderRadius: '8px',
                                                width: '32px',
                                                height: '32px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                color: favorites.includes(sheet.id) ? 'var(--primary)' : 'var(--text-muted)',
                                                transition: 'all 0.2s ease'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: '16px',
                                                    height: '16px'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Heart, {
                                                    filled: favorites.includes(sheet.id)
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                                    lineNumber: 520,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                                lineNumber: 519,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                            lineNumber: 499,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, sheet.id, true, {
                                    fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                    lineNumber: 444,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                            lineNumber: 438,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        searchQuery && searchResults.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                textAlign: 'center',
                                padding: '20px',
                                color: 'var(--text-muted)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontFamily: 'Outfit, sans-serif',
                                    fontSize: '14px'
                                },
                                children: [
                                    "Nenhuma partitura encontrada para “",
                                    searchQuery,
                                    "”"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                                lineNumber: 533,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                            lineNumber: 528,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                    lineNumber: 420,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
                lineNumber: 413,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/layout/DesktopHeader.tsx",
        lineNumber: 198,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = DesktopHeader;
}),
"[project]/frontend-next/src/components/layout/DesktopLayout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/UIContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/hooks/useMediaQuery.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$DesktopSidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/layout/DesktopSidebar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$DesktopHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/layout/DesktopHeader.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const DesktopLayout = ({ children, activeTab })=>{
    const isDesktop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMediaQuery"])(`(min-width: ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BREAKPOINTS"].desktop}px)`);
    const { sidebarCollapsed } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUI"])();
    if (!isDesktop) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "desktop-layout",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$DesktopSidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                activeTab: activeTab
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/layout/DesktopLayout.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "desktop-main",
                style: {
                    marginLeft: sidebarCollapsed ? '72px' : '260px',
                    width: sidebarCollapsed ? 'calc(100% - 72px)' : 'calc(100% - 260px)',
                    transition: 'all 0.3s ease'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$DesktopHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/DesktopLayout.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/layout/DesktopLayout.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/layout/DesktopLayout.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = DesktopLayout;
}),
"[project]/frontend-next/src/components/layout/BottomNav.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"use client";
;
;
;
;
;
;
const BottomNav = ({ activeTab })=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { theme, showNotifications } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUI"])();
    const [keyboardOpen, setKeyboardOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const isMobile = ("TURBOPACK compile-time value", "undefined") !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    const isHiding = showNotifications && isMobile;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const initialHeight = undefined;
        const handleResize = undefined;
    }, [
        isMobile
    ]);
    const tabs = [
        {
            id: "home",
            path: "/",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Home,
            label: "Início"
        },
        {
            id: "repertorio",
            path: "/repertorio",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].ListMusic,
            label: "Repertório"
        },
        {
            id: "search",
            path: "/buscar",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Search,
            label: "Buscar",
            isCenter: true
        },
        {
            id: "favorites",
            path: "/favoritos",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Heart,
            label: "Favoritos"
        },
        {
            id: "profile",
            path: "/perfil",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].User,
            label: "Perfil"
        }
    ];
    const isDark = theme === "dark";
    const shouldHide = isHiding || keyboardOpen;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "mobile-only",
        style: {
            position: 'fixed',
            bottom: '16px',
            left: '50%',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '12px 8px',
            zIndex: 999,
            width: 'calc(100% - 32px)',
            maxWidth: '420px',
            borderRadius: '28px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 0.5px 0 rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            background: isDark ? 'rgba(72, 20, 21, 0.85)' : 'rgba(92, 26, 27, 0.88)',
            transform: shouldHide ? 'translateX(-50%) translateY(100px)' : 'translateX(-50%) translateY(0)',
            opacity: shouldHide ? 0 : 1,
            pointerEvents: shouldHide ? 'none' : 'auto'
        },
        children: tabs.map((tab)=>{
            const isActive = activeTab === tab.id;
            if (tab.isCenter) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                    "data-walkthrough": "search",
                    "aria-label": tab.label,
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(145deg, #D4AF37 0%, #AA8C2C 100%)',
                        border: 'none',
                        color: '#3D1518',
                        cursor: 'pointer',
                        width: '62px',
                        height: '62px',
                        borderRadius: '50%',
                        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.35)',
                        flexShrink: 0
                    },
                    onClick: ()=>router.push(tab.path),
                    whileTap: {
                        scale: 0.9
                    },
                    transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 20
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '28px',
                            height: '28px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(tab.icon, {
                            filled: true
                        }, void 0, false, {
                            fileName: "[project]/frontend-next/src/components/layout/BottomNav.tsx",
                            lineNumber: 55,
                            columnNumber: 62
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/BottomNav.tsx",
                        lineNumber: 55,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0))
                }, tab.id, false, {
                    fileName: "[project]/frontend-next/src/components/layout/BottomNav.tsx",
                    lineNumber: 54,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0));
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                "data-nav": tab.id,
                "aria-label": tab.label,
                "aria-current": isActive ? "page" : undefined,
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    minWidth: '56px',
                    position: 'relative',
                    boxSizing: 'border-box',
                    color: isActive ? '#F4E4BC' : 'rgba(255, 255, 255, 0.7)'
                },
                onClick: ()=>router.push(tab.path),
                whileTap: {
                    scale: 0.9
                },
                transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 20
                },
                children: [
                    isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        layoutId: "bottomNavIndicator",
                        style: {
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(244, 228, 188, 0.15)',
                            borderRadius: '12px',
                            zIndex: 0
                        },
                        transition: {
                            type: "spring",
                            stiffness: 500,
                            damping: 35
                        }
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/BottomNav.tsx",
                        lineNumber: 61,
                        columnNumber: 26
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        style: {
                            width: '22px',
                            height: '22px',
                            position: 'relative',
                            zIndex: 1
                        },
                        animate: {
                            scale: isActive ? 1.1 : 1,
                            y: isActive ? -2 : 0
                        },
                        transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 20
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(tab.icon, {
                            filled: isActive
                        }, void 0, false, {
                            fileName: "[project]/frontend-next/src/components/layout/BottomNav.tsx",
                            lineNumber: 63,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/BottomNav.tsx",
                        lineNumber: 62,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].span, {
                        style: {
                            fontSize: '11px',
                            fontWeight: '700',
                            fontFamily: 'Outfit, sans-serif',
                            letterSpacing: '0.2px',
                            position: 'relative',
                            zIndex: 1
                        },
                        animate: {
                            opacity: isActive ? 1 : 0.7,
                            scale: isActive ? 1.05 : 1
                        },
                        transition: {
                            duration: 0.2
                        },
                        children: tab.label
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/layout/BottomNav.tsx",
                        lineNumber: 65,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, tab.id, true, {
                fileName: "[project]/frontend-next/src/components/layout/BottomNav.tsx",
                lineNumber: 60,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0));
        })
    }, void 0, false, {
        fileName: "[project]/frontend-next/src/components/layout/BottomNav.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = BottomNav;
}),
"[project]/frontend-next/app/(auth)/layout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuthLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/UIContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/hooks/useMediaQuery.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$DesktopLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/layout/DesktopLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$BottomNav$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/layout/BottomNav.tsx [app-ssr] (ecmascript)");
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
// SSR-safe hydration guard: returns false on server, true after mount
const emptySubscribe = ()=>()=>{};
function useHasMounted() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(emptySubscribe, ()=>true, ()=>false);
}
// Map pathname to tab ID for navigation highlighting
function getActiveTab(pathname) {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/repertorio")) return "repertorio";
    if (pathname.startsWith("/buscar")) return "search";
    if (pathname.startsWith("/favoritos")) return "favorites";
    if (pathname.startsWith("/perfil")) return "profile";
    if (pathname.startsWith("/acervo")) return "library";
    if (pathname.startsWith("/generos")) return "genres";
    if (pathname.startsWith("/compositores")) return "composers";
    if (pathname.startsWith("/admin")) return "admin";
    return "home";
}
function AuthLayout({ children }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const { toast, clearToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUI"])();
    const isDesktop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMediaQuery"])(`(min-width: ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BREAKPOINTS"].desktop}px)`);
    const mounted = useHasMounted();
    // Redirect to login if not authenticated
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (mounted && !user) {
            router.replace("/login");
        }
    }, [
        user,
        mounted,
        router
    ]);
    // Show nothing while checking auth or before mount
    if (!mounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                background: "var(--bg-primary)"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "3px solid var(--border)",
                    borderTopColor: "var(--primary)",
                    animation: "spin 0.8s linear infinite"
                }
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/layout.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend-next/app/(auth)/layout.tsx",
            lineNumber: 66,
            columnNumber: 7
        }, this);
    }
    // Don't render children if not authenticated
    if (!user) {
        return null;
    }
    const activeTab = getActiveTab(pathname);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$DesktopLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                activeTab: activeTab,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        paddingBottom: isDesktop ? "0" : "100px"
                    },
                    children: children
                }, void 0, false, {
                    fileName: "[project]/frontend-next/app/(auth)/layout.tsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/layout.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            !isDesktop && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$layout$2f$BottomNav$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                activeTab: activeTab
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/(auth)/layout.tsx",
                lineNumber: 99,
                columnNumber: 22
            }, this)
        ]
    }, void 0, true);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ef721978._.js.map