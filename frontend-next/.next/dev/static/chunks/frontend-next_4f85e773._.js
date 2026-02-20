(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend-next/src/hooks/useLoginForm.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// ===== USE LOGIN FORM HOOK =====
// Hook com toda a logica de autenticacao do login
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/UIContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/DataContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/lib/storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/api.ts [app-client] (ecmascript)");
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
const useLoginForm = ({ onClose })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { setUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { showToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUI"])();
    const { setFavorites } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useData"])();
    // Estados do formulario
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [pin, setPin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        '',
        '',
        '',
        ''
    ]);
    const [rememberMe, setRememberMe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useLoginForm.useState": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('rememberMe', false)
    }["useLoginForm.useState"]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [userFound, setUserFound] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [userNotFound, setUserNotFound] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [checkingUser, setCheckingUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [userInfo, setUserInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Refs
    const pinRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([
        null,
        null,
        null,
        null
    ]);
    const cardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const checkUserTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Scroll suave para o card quando teclado abre (mobile)
    const scrollToCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLoginForm.useCallback[scrollToCard]": ()=>{
            if (cardRef.current && window.innerWidth < 768) {
                setTimeout({
                    "useLoginForm.useCallback[scrollToCard]": ()=>{
                        cardRef.current?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }["useLoginForm.useCallback[scrollToCard]"], 300);
            }
        }
    }["useLoginForm.useCallback[scrollToCard]"], []);
    // Funcao para verificar usuario na API
    const checkUserExists = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLoginForm.useCallback[checkUserExists]": async (usernameToCheck)=>{
            if (!usernameToCheck || usernameToCheck.length < 2) {
                setUserFound(false);
                setUserNotFound(false);
                setUserInfo(null);
                return;
            }
            setCheckingUser(true);
            try {
                const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/api/check-user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: usernameToCheck
                    })
                });
                const data = await response.json();
                if (data.exists) {
                    setUserFound(true);
                    setUserNotFound(false);
                    setUserInfo({
                        name: data.nome,
                        instrument: data.instrumento
                    });
                    setTimeout({
                        "useLoginForm.useCallback[checkUserExists]": ()=>pinRefs.current[0]?.focus()
                    }["useLoginForm.useCallback[checkUserExists]"], 100);
                } else {
                    setUserFound(false);
                    setUserNotFound(true);
                    setUserInfo(null);
                }
            } catch (e) {
                console.error('Erro ao verificar usuario:', e);
                setUserFound(false);
                setUserNotFound(false);
                setUserInfo(null);
            } finally{
                setCheckingUser(false);
            }
        }
    }["useLoginForm.useCallback[checkUserExists]"], []);
    // Carrega usuario salvo se "Lembrar-me" estava ativo
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useLoginForm.useEffect": ()=>{
            if (rememberMe) {
                const savedUsername = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('savedUsername', '');
                if (savedUsername) {
                    setUsername(savedUsername);
                    checkUserExists(savedUsername);
                }
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- executa apenas na montagem
        }
    }["useLoginForm.useEffect"], []);
    // Verifica se usuario existe quando digita (com debounce reduzido)
    const handleUsernameChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLoginForm.useCallback[handleUsernameChange]": (value)=>{
            const normalized = value.toLowerCase().replace(/\s/g, '');
            setUsername(normalized);
            setError('');
            if (checkUserTimeout.current) {
                clearTimeout(checkUserTimeout.current);
            }
            if (!normalized || normalized.length < 2) {
                setUserFound(false);
                setUserNotFound(false);
                setUserInfo(null);
                setCheckingUser(false);
                return;
            }
            // Inicia loading imediatamente ao digitar
            setCheckingUser(true);
            // Debounce reduzido para 150ms
            checkUserTimeout.current = setTimeout({
                "useLoginForm.useCallback[handleUsernameChange]": ()=>{
                    checkUserExists(normalized);
                }
            }["useLoginForm.useCallback[handleUsernameChange]"], 150);
        }
    }["useLoginForm.useCallback[handleUsernameChange]"], [
        checkUserExists
    ]);
    // Handler do PIN - autologin quando completo
    const handlePinChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLoginForm.useCallback[handlePinChange]": async (index, value)=>{
            if (value && !/^\d$/.test(value)) return;
            const newPin = [
                ...pin
            ];
            newPin[index] = value;
            setPin(newPin);
            setError('');
            if (value && index < 3) {
                pinRefs.current[index + 1]?.focus();
            }
            // Verifica se completou o PIN - AUTOLOGIN
            if (value && index === 3) {
                const fullPin = newPin.join('');
                const normalizedUsername = username.toLowerCase().replace(/\s/g, '');
                if (!normalizedUsername) {
                    setError('Digite seu usuario');
                    setPin([
                        '',
                        '',
                        '',
                        ''
                    ]);
                    return;
                }
                setIsLoading(true);
                try {
                    if (__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["USE_API"]) {
                        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].login(normalizedUsername, fullPin, rememberMe);
                        if (result.success && result.user) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set('rememberMe', rememberMe);
                            if (rememberMe) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set('savedUsername', normalizedUsername);
                            } else {
                                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].remove('savedUsername');
                            }
                            const userData = {
                                id: result.user.id,
                                username: result.user.username,
                                nome: result.user.nome,
                                is_admin: result.user.admin,
                                instrumento: result.user.instrumento_nome || 'Musico',
                                instrumento_id: result.user.instrumento_id,
                                foto_url: result.user.foto_url
                            };
                            setUser(userData);
                            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set('user', userData);
                            try {
                                const favoritosIds = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].getFavoritosIds();
                                if (favoritosIds && Array.isArray(favoritosIds)) {
                                    const favoritosStr = favoritosIds.map({
                                        "useLoginForm.useCallback[handlePinChange].favoritosStr": (id)=>String(id)
                                    }["useLoginForm.useCallback[handlePinChange].favoritosStr"]);
                                    setFavorites(favoritosStr);
                                    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set('favorites', favoritosStr);
                                }
                            } catch  {
                            // Silencioso - favoritos serao carregados depois
                            }
                            showToast(`Bem-vindo, ${result.user.nome.split(' ')[0]}!`);
                            // Redireciona apos login bem-sucedido
                            if (onClose) {
                                onClose();
                            } else {
                                // TODOS os usuarios (admin ou nao) vao para home /
                                // Admin pode acessar area administrativa via AdminToggle no header
                                router.push('/');
                            }
                            setIsLoading(false);
                            return;
                        }
                    }
                    setError('Usuario ou PIN incorreto');
                    setPin([
                        '',
                        '',
                        '',
                        ''
                    ]);
                    // Delay para garantir que o PIN foi limpo antes de focar
                    setTimeout({
                        "useLoginForm.useCallback[handlePinChange]": ()=>{
                            pinRefs.current[0]?.focus();
                        }
                    }["useLoginForm.useCallback[handlePinChange]"], 100);
                    if (navigator.vibrate) {
                        navigator.vibrate([
                            100,
                            50,
                            100
                        ]);
                    }
                } catch (err) {
                    console.error('Erro no login:', err);
                    setError('Usuario ou PIN incorreto');
                    setPin([
                        '',
                        '',
                        '',
                        ''
                    ]);
                    // Delay para garantir que o PIN foi limpo antes de focar
                    setTimeout({
                        "useLoginForm.useCallback[handlePinChange]": ()=>{
                            pinRefs.current[0]?.focus();
                        }
                    }["useLoginForm.useCallback[handlePinChange]"], 100);
                    if (navigator.vibrate) {
                        navigator.vibrate([
                            100,
                            50,
                            100
                        ]);
                    }
                }
                setIsLoading(false);
            }
        }
    }["useLoginForm.useCallback[handlePinChange]"], [
        pin,
        username,
        rememberMe,
        onClose,
        router,
        setUser,
        setFavorites,
        showToast
    ]);
    // Handler do backspace no PIN
    const handlePinKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLoginForm.useCallback[handlePinKeyDown]": (index, e)=>{
            if (e.key === 'Backspace' && !pin[index] && index > 0) {
                pinRefs.current[index - 1]?.focus();
            }
        }
    }["useLoginForm.useCallback[handlePinKeyDown]"], [
        pin
    ]);
    // Toggle remember me
    const toggleRememberMe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLoginForm.useCallback[toggleRememberMe]": ()=>{
            setRememberMe({
                "useLoginForm.useCallback[toggleRememberMe]": (prev)=>!prev
            }["useLoginForm.useCallback[toggleRememberMe]"]);
        }
    }["useLoginForm.useCallback[toggleRememberMe]"], []);
    return {
        // Estados
        username,
        pin,
        rememberMe,
        isLoading,
        error,
        userFound,
        userNotFound,
        checkingUser,
        userInfo,
        // Refs
        pinRefs,
        cardRef,
        // Handlers
        handleUsernameChange,
        handlePinChange,
        handlePinKeyDown,
        toggleRememberMe,
        scrollToCard
    };
};
_s(useLoginForm, "pppI73lNsO7rjZ+yDdFve5PbQF4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUI"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useData"]
    ];
});
const __TURBOPACK__default__export__ = useLoginForm;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/src/components/login/LoginBackground.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
// ===== LOGIN BACKGROUND COMPONENT =====
// Background decorativo com imagem e overlay do login
const LoginBackground = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    background: `
          linear-gradient(135deg, rgba(61, 21, 24, 0.92) 0%, rgba(92, 26, 27, 0.88) 50%, rgba(61, 21, 24, 0.92) 100%),
          url('/assets/images/banda/foto-banda-sao-goncalo.webp')
        `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.9)',
                    zIndex: -2
                }
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/login/LoginBackground.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    opacity: 0.03,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    pointerEvents: 'none',
                    zIndex: -1
                }
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/login/LoginBackground.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_c = LoginBackground;
const __TURBOPACK__default__export__ = LoginBackground;
var _c;
__turbopack_context__.k.register(_c, "LoginBackground");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/src/components/login/LoginHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
// ===== LOGIN HEADER COMPONENT =====
// Cabecalho do login com logo, titulo e badge de status
const LoginHeader = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            textAlign: 'center',
            marginBottom: '32px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
                    border: '2px solid rgba(212, 175, 55, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)',
                    overflow: 'hidden',
                    padding: '8px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: "/assets/images/ui/brasao-256x256.png",
                    alt: "Brasao Filarmonica 25 de Marco",
                    style: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                    }
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/components/login/LoginHeader.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/login/LoginHeader.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                style: {
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#F4E4BC',
                    marginBottom: '4px'
                },
                children: "Acervo Digital"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/login/LoginHeader.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '14px',
                    color: 'rgba(244, 228, 188, 0.6)'
                },
                children: "S.F. 25 de Marco - Feira de Santana"
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/login/LoginHeader.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '12px',
                    padding: '6px 12px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    borderRadius: '20px',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#22C55E',
                            animation: 'pulse 2s ease-in-out infinite'
                        }
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/login/LoginHeader.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#22C55E',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        },
                        children: "Sistema Online"
                    }, void 0, false, {
                        fileName: "[project]/frontend-next/src/components/login/LoginHeader.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/login/LoginHeader.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/login/LoginHeader.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = LoginHeader;
const __TURBOPACK__default__export__ = LoginHeader;
var _c;
__turbopack_context__.k.register(_c, "LoginHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/src/components/login/PinInput.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
const PinInput = ({ pin, pinRefs, isLoading, onPinChange, onKeyDown, onFocus })=>{
    const handleFocus = (e)=>{
        e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
        onFocus?.();
    };
    const handleBlur = (e, digit)=>{
        if (!digit) {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            e.target.style.background = 'rgba(255, 255, 255, 0.06)';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            marginBottom: '20px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'rgba(244, 228, 188, 0.8)',
                    marginBottom: '12px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "16",
                        height: "16",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "3",
                                y: "11",
                                width: "18",
                                height: "11",
                                rx: "2",
                                ry: "2"
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/login/PinInput.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M7 11V7a5 5 0 0 1 10 0v4"
                            }, void 0, false, {
                                fileName: "[project]/frontend-next/src/components/login/PinInput.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-next/src/components/login/PinInput.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    "PIN"
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-next/src/components/login/PinInput.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px'
                },
                children: pin.map((digit, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: (el)=>{
                            if (pinRefs.current) pinRefs.current[index] = el;
                        },
                        type: "password",
                        inputMode: "numeric",
                        maxLength: 1,
                        value: digit,
                        onChange: (e)=>onPinChange(index, e.target.value),
                        onKeyDown: (e)=>onKeyDown(index, e),
                        disabled: isLoading,
                        style: {
                            width: '56px',
                            minWidth: '56px',
                            maxWidth: '56px',
                            height: '56px',
                            borderRadius: '12px',
                            background: digit ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                            border: digit ? '2px solid rgba(212, 175, 55, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
                            color: '#F4E4BC',
                            fontSize: '22px',
                            fontFamily: 'Outfit, sans-serif',
                            fontWeight: '700',
                            textAlign: 'center',
                            outline: 'none',
                            transition: 'all 0.2s ease',
                            boxSizing: 'border-box',
                            flexShrink: 0,
                            flexGrow: 0
                        },
                        onFocus: (e)=>handleFocus(e),
                        onBlur: (e)=>handleBlur(e, digit)
                    }, index, false, {
                        fileName: "[project]/frontend-next/src/components/login/PinInput.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/login/PinInput.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/src/components/login/PinInput.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = PinInput;
const __TURBOPACK__default__export__ = PinInput;
var _c;
__turbopack_context__.k.register(_c, "PinInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/app/login/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useLoginForm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/hooks/useLoginForm.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$login$2f$LoginBackground$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/login/LoginBackground.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$login$2f$LoginHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/login/LoginHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$login$2f$PinInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/components/login/PinInput.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function LoginPage() {
    _s();
    const { username, pin, rememberMe, isLoading, error, userFound, userNotFound, checkingUser, userInfo, pinRefs, cardRef, handleUsernameChange, handlePinChange, handlePinKeyDown, toggleRememberMe, scrollToCard } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useLoginForm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({});
    // Determina a cor da borda do input
    const getInputBorderColor = ()=>{
        if (userFound) return "rgba(34, 197, 94, 0.4)";
        if (userNotFound) return "rgba(239, 68, 68, 0.4)";
        return "rgba(255, 255, 255, 0.12)";
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$login$2f$LoginBackground$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/frontend-next/app/login/page.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    minHeight: "min-content"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: cardRef,
                    style: {
                        position: "relative",
                        width: "100%",
                        maxWidth: "400px",
                        background: "rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        borderRadius: "24px",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.1)",
                        padding: "40px 32px",
                        margin: "20px 0",
                        animation: "scaleInLogin 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$login$2f$LoginHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/frontend-next/app/login/page.tsx",
                            lineNumber: 110,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: "20px"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                fontFamily: "Outfit, sans-serif",
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                color: "rgba(244, 228, 188, 0.8)",
                                                marginBottom: "8px"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "16",
                                                    height: "16",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    strokeWidth: "2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend-next/app/login/page.tsx",
                                                            lineNumber: 129,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                            cx: "12",
                                                            cy: "7",
                                                            r: "4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend-next/app/login/page.tsx",
                                                            lineNumber: 130,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend-next/app/login/page.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 17
                                                }, this),
                                                "Usuario",
                                                checkingUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        marginLeft: "auto",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                        color: "rgba(212, 175, 55, 0.8)",
                                                        fontSize: "11px"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                width: "12px",
                                                                height: "12px",
                                                                border: "2px solid rgba(212, 175, 55, 0.3)",
                                                                borderTopColor: "#D4AF37",
                                                                borderRadius: "50%",
                                                                animation: "spin 0.8s linear infinite"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend-next/app/login/page.tsx",
                                                            lineNumber: 145,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Verificando..."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend-next/app/login/page.tsx",
                                                    lineNumber: 135,
                                                    columnNumber: 19
                                                }, this),
                                                !checkingUser && userFound && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        marginLeft: "auto",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                        color: "#22C55E",
                                                        fontSize: "11px"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            width: "14",
                                                            height: "14",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            strokeWidth: "2",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M20 6L9 17l-5-5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend-next/app/login/page.tsx",
                                                                lineNumber: 171,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend-next/app/login/page.tsx",
                                                            lineNumber: 170,
                                                            columnNumber: 21
                                                        }, this),
                                                        userInfo?.name
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend-next/app/login/page.tsx",
                                                    lineNumber: 160,
                                                    columnNumber: 19
                                                }, this),
                                                !checkingUser && userNotFound && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        marginLeft: "auto",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                        color: "#EF4444",
                                                        fontSize: "11px"
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
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                    cx: "12",
                                                                    cy: "12",
                                                                    r: "10"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend-next/app/login/page.tsx",
                                                                    lineNumber: 189,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                    x1: "15",
                                                                    y1: "9",
                                                                    x2: "9",
                                                                    y2: "15"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend-next/app/login/page.tsx",
                                                                    lineNumber: 190,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                    x1: "9",
                                                                    y1: "9",
                                                                    x2: "15",
                                                                    y2: "15"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend-next/app/login/page.tsx",
                                                                    lineNumber: 191,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend-next/app/login/page.tsx",
                                                            lineNumber: 188,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Nao encontrado"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend-next/app/login/page.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend-next/app/login/page.tsx",
                                            lineNumber: 116,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            name: "username",
                                            autoComplete: "username",
                                            placeholder: "seuusuario",
                                            value: username,
                                            onChange: (e)=>handleUsernameChange(e.target.value),
                                            className: "login-input",
                                            style: {
                                                width: "100%",
                                                padding: "14px 16px",
                                                borderRadius: "12px",
                                                background: "rgba(255, 255, 255, 0.06)",
                                                border: `1px solid ${getInputBorderColor()}`,
                                                color: "#F4E4BC",
                                                fontSize: "16px",
                                                fontFamily: "Outfit, sans-serif",
                                                outline: "none",
                                                transition: "all 0.2s ease",
                                                boxSizing: "border-box"
                                            },
                                            onFocus: (e)=>{
                                                e.target.style.borderColor = "rgba(212, 175, 55, 0.5)";
                                                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                                                scrollToCard();
                                            },
                                            onBlur: (e)=>{
                                                e.target.style.borderColor = getInputBorderColor();
                                                e.target.style.background = "rgba(255, 255, 255, 0.06)";
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/app/login/page.tsx",
                                            lineNumber: 197,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend-next/app/login/page.tsx",
                                    lineNumber: 115,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$components$2f$login$2f$PinInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    pin: pin,
                                    pinRefs: pinRefs,
                                    isLoading: isLoading,
                                    onPinChange: handlePinChange,
                                    onKeyDown: handlePinKeyDown,
                                    onFocus: scrollToCard
                                }, void 0, false, {
                                    fileName: "[project]/frontend-next/app/login/page.tsx",
                                    lineNumber: 231,
                                    columnNumber: 13
                                }, this),
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: "rgba(239, 68, 68, 0.15)",
                                        border: "1px solid rgba(239, 68, 68, 0.3)",
                                        borderRadius: "10px",
                                        padding: "12px 16px",
                                        marginBottom: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        animation: "shake 0.5s ease"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "18",
                                            height: "18",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "#EF4444",
                                            strokeWidth: "2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: "12",
                                                    cy: "12",
                                                    r: "10"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend-next/app/login/page.tsx",
                                                    lineNumber: 256,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "15",
                                                    y1: "9",
                                                    x2: "9",
                                                    y2: "15"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend-next/app/login/page.tsx",
                                                    lineNumber: 257,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "9",
                                                    y1: "9",
                                                    x2: "15",
                                                    y2: "15"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend-next/app/login/page.tsx",
                                                    lineNumber: 258,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend-next/app/login/page.tsx",
                                            lineNumber: 255,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontFamily: "Outfit, sans-serif",
                                                fontSize: "13px",
                                                color: "#EF4444"
                                            },
                                            children: error
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/app/login/page.tsx",
                                            lineNumber: 260,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend-next/app/login/page.tsx",
                                    lineNumber: 242,
                                    columnNumber: 15
                                }, this),
                                isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "16px",
                                        padding: "24px",
                                        background: "rgba(212, 175, 55, 0.08)",
                                        borderRadius: "16px",
                                        marginBottom: "20px",
                                        border: "1px solid rgba(212, 175, 55, 0.2)"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                alignItems: "flex-end",
                                                justifyContent: "center",
                                                gap: "4px",
                                                height: "40px"
                                            },
                                            children: [
                                                0,
                                                1,
                                                2,
                                                3,
                                                4
                                            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        width: "6px",
                                                        borderRadius: "3px",
                                                        background: "linear-gradient(to top, #D4AF37, #F4E4BC)",
                                                        animation: "equalizer 1s ease-in-out infinite",
                                                        animationDelay: `${i * 0.1}s`
                                                    }
                                                }, i, false, {
                                                    fileName: "[project]/frontend-next/app/login/page.tsx",
                                                    lineNumber: 299,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/app/login/page.tsx",
                                            lineNumber: 289,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontFamily: "Outfit, sans-serif",
                                                fontSize: "14px",
                                                fontWeight: "600",
                                                color: "#D4AF37"
                                            },
                                            children: "Entrando..."
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/app/login/page.tsx",
                                            lineNumber: 311,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend-next/app/login/page.tsx",
                                    lineNumber: 274,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    onClick: toggleRememberMe,
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        cursor: "pointer"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: "20px",
                                                height: "20px",
                                                borderRadius: "6px",
                                                background: rememberMe ? "#D4AF37" : "rgba(255, 255, 255, 0.06)",
                                                border: rememberMe ? "none" : "1px solid rgba(255, 255, 255, 0.2)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "all 0.2s ease",
                                                flexShrink: 0
                                            },
                                            children: rememberMe && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "12",
                                                height: "12",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "#3D1518",
                                                strokeWidth: "3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                    points: "20 6 9 17 4 12"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend-next/app/login/page.tsx",
                                                    lineNumber: 350,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/frontend-next/app/login/page.tsx",
                                                lineNumber: 349,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/app/login/page.tsx",
                                            lineNumber: 334,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontFamily: "Outfit, sans-serif",
                                                fontSize: "13px",
                                                color: "rgba(244, 228, 188, 0.7)"
                                            },
                                            children: "Lembrar meu acesso"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/app/login/page.tsx",
                                            lineNumber: 354,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend-next/app/login/page.tsx",
                                    lineNumber: 325,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend-next/app/login/page.tsx",
                            lineNumber: 113,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: "28px",
                                paddingTop: "20px",
                                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    color: "rgba(244, 228, 188, 0.4)",
                                    fontSize: "11px",
                                    fontFamily: "Outfit, sans-serif"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "14",
                                        height: "14",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend-next/app/login/page.tsx",
                                            lineNumber: 388,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-next/app/login/page.tsx",
                                        lineNumber: 387,
                                        columnNumber: 15
                                    }, this),
                                    "Conexao Segura"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-next/app/login/page.tsx",
                                lineNumber: 377,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/frontend-next/app/login/page.tsx",
                            lineNumber: 367,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                textAlign: "center",
                                marginTop: "16px",
                                fontSize: "11px",
                                fontFamily: "Outfit, sans-serif",
                                color: "rgba(244, 228, 188, 0.3)"
                            },
                            children: "Sociedade Filarmonica 25 de Marco - Fundada em 1868"
                        }, void 0, false, {
                            fileName: "[project]/frontend-next/app/login/page.tsx",
                            lineNumber: 394,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend-next/app/login/page.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend-next/app/login/page.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-next/app/login/page.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
_s(LoginPage, "8bK3JU2ykBX2uL/W0FcijtkENN8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$hooks$2f$useLoginForm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = LoginPage;
var _c;
__turbopack_context__.k.register(_c, "LoginPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/frontend-next/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=frontend-next_4f85e773._.js.map