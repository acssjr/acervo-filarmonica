(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend-next/src/lib/storage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DATA_VERSION",
    ()=>DATA_VERSION,
    "Storage",
    ()=>Storage,
    "checkAndClearOldData",
    ()=>checkAndClearOldData,
    "default",
    ()=>__TURBOPACK__default__export__
]);
const PREFIX = 'fil_';
const Storage = {
    get (key, defaultValue) {
        try {
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const item = localStorage.getItem(`${PREFIX}${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch  {
            return defaultValue;
        }
    },
    set (key, value) {
        try {
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
        } catch  {}
    },
    remove (key) {
        try {
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            localStorage.removeItem(`${PREFIX}${key}`);
        } catch  {}
    },
    clear (key) {
        try {
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            localStorage.removeItem(`${PREFIX}${key}`);
        } catch  {}
    }
};
const DATA_VERSION = 7;
const checkAndClearOldData = ()=>{
    const storedVersion = Storage.get('version', 0);
    if (storedVersion < DATA_VERSION) {
        Storage.clear('sheets');
        Storage.clear('user');
        Storage.set('version', DATA_VERSION);
    }
};
const __TURBOPACK__default__export__ = Storage;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/src/constants/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "TOKEN_EXPIRY_BUFFER_MS",
    ()=>TOKEN_EXPIRY_BUFFER_MS,
    "TOKEN_EXPIRY_SECONDS",
    ()=>TOKEN_EXPIRY_SECONDS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const isLocalhost = ("TURBOPACK compile-time value", "object") !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_BASE_URL = isLocalhost ? '' : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'https://acervo-filarmonica-api.acssjr.workers.dev';
const TOKEN_EXPIRY_SECONDS = 24 * 60 * 60;
const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API",
    ()=>API,
    "USE_API",
    ()=>USE_API,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/lib/storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/api.ts [app-client] (ecmascript)");
"use client";
;
;
let onTokenExpired = null;
const API = {
    setOnTokenExpired (callback) {
        onTokenExpired = callback;
    },
    isTokenExpired () {
        const token = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("authToken", null);
        const expiresAt = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("tokenExpiresAt", null);
        if (!token) return false;
        if (!expiresAt) return true;
        return Date.now() > expiresAt - __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_EXPIRY_BUFFER_MS"];
    },
    clearAuth () {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].remove("authToken");
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].remove("tokenExpiresAt");
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].remove("user");
    },
    async request (endpoint, options = {}) {
        try {
            if (this.isTokenExpired()) {
                this.clearAuth();
                if (onTokenExpired) onTokenExpired();
                throw new Error("Sess\u00e3o expirada. Fa\u00e7a login novamente.");
            }
            const token = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("authToken", null);
            const headers = {
                "Content-Type": "application/json",
                ...token && {
                    Authorization: `Bearer ${token}`
                },
                ...options.headers
            };
            const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}${endpoint}`, {
                ...options,
                headers
            });
            if (response.status === 401) {
                const error = await response.json().catch(()=>({
                        error: "N\u00e3o autorizado"
                    }));
                this.clearAuth();
                if (onTokenExpired) onTokenExpired();
                throw new Error(error.error || "Sess\u00e3o expirada. Fa\u00e7a login novamente.");
            }
            if (!response.ok) {
                const error = await response.json().catch(()=>({
                        error: "Erro desconhecido"
                    }));
                throw new Error(error.error || `HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    },
    // ============ PARTITURAS ============
    async getPartituras (filters = {}) {
        const params = new URLSearchParams();
        if (filters.categoria) params.append("categoria", filters.categoria);
        if (filters.busca) params.append("busca", filters.busca);
        if (filters.destaque) params.append("destaque", "1");
        const query = params.toString();
        return this.request(`/api/partituras${query ? `?${query}` : ""}`);
    },
    async getPartitura (id) {
        return this.request(`/api/partituras/${id}`);
    },
    async createPartitura (formData) {
        const token = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("authToken", null);
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/api/partituras`, {
            method: "POST",
            headers: {
                ...token && {
                    Authorization: `Bearer ${token}`
                }
            },
            body: formData
        });
        if (!response.ok) {
            const error = await response.json().catch(()=>({
                    error: "Erro no upload"
                }));
            throw new Error(error.error);
        }
        return response.json();
    },
    async updatePartitura (id, data) {
        return this.request(`/api/partituras/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        });
    },
    async deletePartitura (id) {
        return this.request(`/api/partituras/${id}`, {
            method: "DELETE"
        });
    },
    async uploadPastaPartitura (formData) {
        const token = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("authToken", null);
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/api/partituras/upload-pasta`, {
            method: "POST",
            headers: {
                ...token && {
                    Authorization: `Bearer ${token}`
                }
            },
            body: formData
        });
        if (!response.ok) {
            const error = await response.json().catch(()=>({
                    error: "Erro no upload"
                }));
            throw new Error(error.error);
        }
        return response.json();
    },
    async getPartesPartitura (partituraId) {
        return this.request(`/api/partituras/${partituraId}/partes`);
    },
    async addPartePartitura (partituraId, formData) {
        const token = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("authToken", null);
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/api/partituras/${partituraId}/partes`, {
            method: "POST",
            headers: {
                ...token && {
                    Authorization: `Bearer ${token}`
                }
            },
            body: formData
        });
        if (!response.ok) {
            const error = await response.json().catch(()=>({
                    error: "Erro ao adicionar parte"
                }));
            throw new Error(error.error);
        }
        return response.json();
    },
    async replacePartePartitura (_partituraId, parteId, formData) {
        const token = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("authToken", null);
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/api/partes/${parteId}/substituir`, {
            method: "PUT",
            headers: {
                ...token && {
                    Authorization: `Bearer ${token}`
                }
            },
            body: formData
        });
        if (!response.ok) {
            const error = await response.json().catch(()=>({
                    error: "Erro ao substituir parte"
                }));
            throw new Error(error.error);
        }
        return response.json();
    },
    async deletePartePartitura (_partituraId, parteId) {
        return this.request(`/api/partes/${parteId}`, {
            method: "DELETE"
        });
    },
    // ============ DOWNLOAD ============
    getDownloadUrl (id, instrumento = null) {
        let url = `${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/api/download/${id}`;
        if (instrumento) url += `?instrumento=${instrumento}`;
        return url;
    },
    // ============ CATEGORIAS E INSTRUMENTOS ============
    async getCategorias () {
        return this.request("/api/categorias");
    },
    async getInstrumentos () {
        return this.request("/api/instrumentos");
    },
    // ============ ESTATISTICAS ============
    async getEstatisticas () {
        return this.request("/api/estatisticas");
    },
    // ============ ATIVIDADES ============
    async getAtividades () {
        return this.request("/api/atividades");
    },
    async getMinhasAtividades () {
        return this.request("/api/minhas-atividades");
    },
    // ============ AUTH ============
    async login (username, pin, rememberMe = false) {
        const result = await this.request("/api/login", {
            method: "POST",
            body: JSON.stringify({
                username,
                pin,
                rememberMe
            })
        });
        if (result.token) {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("authToken", result.token);
            if (result.expiresIn) {
                const expiresAt = Date.now() + result.expiresIn * 1000;
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("tokenExpiresAt", expiresAt);
            }
        }
        return result;
    },
    async changePin (currentPin, newPin) {
        try {
            const result = await this.request("/api/change-pin", {
                method: "POST",
                body: JSON.stringify({
                    currentPin,
                    newPin
                })
            });
            if (result.token) {
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("authToken", result.token);
                const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("tokenExpiresAt", expiresAt);
            }
            return result;
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erro desconhecido"
            };
        }
    },
    logout () {
        this.clearAuth();
    },
    // ============ HEALTH CHECK ============
    async healthCheck () {
        try {
            const result = await this.request("/api/health");
            return result.status === "ok";
        } catch  {
            return false;
        }
    },
    async getVersion () {
        try {
            return await this.request("/api/version");
        } catch  {
            return null;
        }
    },
    // ============ PERFIL ============
    async getPerfil () {
        return this.request("/api/perfil");
    },
    async updatePerfil (data) {
        return this.request("/api/perfil", {
            method: "PUT",
            body: JSON.stringify(data)
        });
    },
    async uploadFotoPerfil (file) {
        const token = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("authToken", null);
        const formData = new FormData();
        formData.append("foto", file);
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/api/perfil/foto`, {
            method: "POST",
            headers: {
                ...token && {
                    Authorization: `Bearer ${token}`
                }
            },
            body: formData
        });
        if (!response.ok) {
            const error = await response.json().catch(()=>({
                    error: "Erro no upload"
                }));
            throw new Error(error.error);
        }
        return response.json();
    },
    // ============ FAVORITOS ============
    async getFavoritos () {
        return this.request("/api/favoritos");
    },
    async getFavoritosIds () {
        return this.request("/api/favoritos/ids");
    },
    async addFavorito (partituraId) {
        return this.request(`/api/favoritos/${partituraId}`, {
            method: "POST"
        });
    },
    async removeFavorito (partituraId) {
        return this.request(`/api/favoritos/${partituraId}`, {
            method: "DELETE"
        });
    },
    // ============ USUARIOS (ADMIN) ============
    async getUsuarios () {
        return this.request("/api/usuarios");
    },
    async getUsuario (id) {
        return this.request(`/api/usuarios/${id}`);
    },
    async createUsuario (data) {
        return this.request("/api/usuarios", {
            method: "POST",
            body: JSON.stringify(data)
        });
    },
    async updateUsuario (id, data) {
        return this.request(`/api/usuarios/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        });
    },
    async deleteUsuario (id) {
        return this.request(`/api/usuarios/${id}`, {
            method: "DELETE"
        });
    },
    // ============ CATEGORIAS (ADMIN) ============
    async createCategoria (data) {
        return this.request("/api/categorias", {
            method: "POST",
            body: JSON.stringify(data)
        });
    },
    async updateCategoria (id, data) {
        return this.request(`/api/categorias/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        });
    },
    async deleteCategoria (id) {
        return this.request(`/api/categorias/${id}`, {
            method: "DELETE"
        });
    },
    async reorderCategorias (ordens) {
        return this.request("/api/categorias/reorder", {
            method: "POST",
            body: JSON.stringify({
                ordens
            })
        });
    },
    // ============ ESTATISTICAS ADMIN ============
    async getEstatisticasAdmin () {
        return this.request("/api/admin/estatisticas");
    },
    // ============ MANUTENCAO ADMIN ============
    async limparNomesUsuarios () {
        return this.request("/api/admin/manutencao/limpar-nomes", {
            method: "POST"
        });
    },
    async configurarSuperAdmin (data) {
        return this.request("/api/admin/manutencao/super-admin", {
            method: "POST",
            body: JSON.stringify(data)
        });
    },
    // ============ REPERTORIO ============
    async getRepertorioAtivo () {
        return this.request("/api/repertorio/ativo");
    },
    async getRepertorio (id) {
        return this.request(`/api/repertorio/${id}`);
    },
    async getRepertorioInstrumentos (id) {
        return this.request(`/api/repertorio/${id}/instrumentos`);
    },
    async getRepertorios () {
        return this.request("/api/repertorios");
    },
    async createRepertorio (data) {
        return this.request("/api/repertorios", {
            method: "POST",
            body: JSON.stringify(data)
        });
    },
    async updateRepertorio (id, data) {
        return this.request(`/api/repertorio/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        });
    },
    async deleteRepertorio (id) {
        return this.request(`/api/repertorio/${id}`, {
            method: "DELETE"
        });
    },
    async addPartituraToRepertorio (repertorioId, partituraId) {
        return this.request(`/api/repertorio/${repertorioId}/partituras`, {
            method: "POST",
            body: JSON.stringify({
                partitura_id: partituraId
            })
        });
    },
    async removePartituraFromRepertorio (repertorioId, partituraId) {
        return this.request(`/api/repertorio/${repertorioId}/partituras/${partituraId}`, {
            method: "DELETE"
        });
    },
    async reorderRepertorioPartituras (repertorioId, ordens) {
        return this.request(`/api/repertorio/${repertorioId}/reorder`, {
            method: "PUT",
            body: JSON.stringify({
                ordens
            })
        });
    },
    async duplicarRepertorio (id) {
        return this.request(`/api/repertorio/${id}/duplicar`, {
            method: "POST"
        });
    },
    async isPartituraInRepertorio (partituraId) {
        return this.request(`/api/partituras/${partituraId}/in-repertorio`);
    },
    getRepertorioDownloadUrl (id, instrumento, formato = "pdf", partituraIds = null) {
        let url = `${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/api/repertorio/${id}/download?formato=${formato}`;
        if (instrumento) url += `&instrumento=${encodeURIComponent(instrumento)}`;
        if (partituraIds && partituraIds.length > 0) {
            url += `&partituras=${partituraIds.join(",")}`;
        }
        return url;
    },
    // ============ CONFIGURACOES ============
    async getModoRecesso () {
        try {
            const result = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/api/config/recesso`);
            if (!result.ok) return {
                ativo: false
            };
            return await result.json();
        } catch  {
            return {
                ativo: false
            };
        }
    },
    async setModoRecesso (ativo) {
        return this.request("/api/config/recesso", {
            method: "PUT",
            body: JSON.stringify({
                ativo
            })
        });
    },
    // ============ PRESENCA ============
    async getMinhaPresenca () {
        return this.request("/api/presenca/minhas");
    },
    async registrarPresencas (dataEnsaio, usuariosIds) {
        return this.request("/api/presenca", {
            method: "POST",
            body: JSON.stringify({
                data_ensaio: dataEnsaio,
                usuarios_ids: usuariosIds
            })
        });
    },
    async getTodasPresencas () {
        return this.request("/api/presenca/todas");
    },
    // ============ ENSAIOS ============
    async getPartiturasEnsaio (dataEnsaio) {
        return this.request(`/api/ensaios/${dataEnsaio}/partituras`);
    },
    async addPartituraEnsaio (dataEnsaio, partituraId) {
        return this.request(`/api/ensaios/${dataEnsaio}/partituras`, {
            method: "POST",
            body: JSON.stringify({
                partitura_id: partituraId
            })
        });
    },
    async removePartituraEnsaio (dataEnsaio, id) {
        return this.request(`/api/ensaios/${dataEnsaio}/partituras/${id}`, {
            method: "DELETE"
        });
    },
    async reorderPartiturasEnsaio (dataEnsaio, ordens) {
        return this.request(`/api/ensaios/${dataEnsaio}/partituras/reorder`, {
            method: "PUT",
            body: JSON.stringify({
                ordens
            })
        });
    }
};
const USE_API = true;
const __TURBOPACK__default__export__ = API;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/src/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/lib/storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const useAuth = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
_s(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const AuthProvider = ({ children, onTokenExpired })=>{
    _s1();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "AuthProvider.useState": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("user", null)
    }["AuthProvider.useState"]);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].logout();
            setUser(null);
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].remove("user");
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].remove("favorites");
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].remove("authToken");
        }
    }["AuthProvider.useCallback[logout]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].setOnTokenExpired({
                "AuthProvider.useEffect": ()=>{
                    logout();
                    if (onTokenExpired) onTokenExpired();
                }
            }["AuthProvider.useEffect"]);
            return ({
                "AuthProvider.useEffect": ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].setOnTokenExpired(null);
                }
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        logout,
        onTokenExpired
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if (__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["USE_API"] && __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].isTokenExpired()) {
                logout();
            }
        }
    }["AuthProvider.useEffect"], [
        logout
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("user", user);
        }
    }["AuthProvider.useEffect"], [
        user
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            setUser,
            logout
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend-next/src/contexts/AuthContext.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(AuthProvider, "k9fLUZ0HzI8YB69N8zrIlU8JGtw=");
_c = AuthProvider;
const __TURBOPACK__default__export__ = AuthContext;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/src/constants/categories.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CATEGORIES",
    ()=>CATEGORIES,
    "CATEGORIES_MAP",
    ()=>CATEGORIES_MAP,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getCategoryById",
    ()=>getCategoryById,
    "getCategoryName",
    ()=>getCategoryName
]);
const CATEGORIES = [
    {
        id: 'dobrados',
        name: 'Dobrados'
    },
    {
        id: 'marchas',
        name: 'Marchas'
    },
    {
        id: 'marchas-funebres',
        name: 'Marchas Fúnebres'
    },
    {
        id: 'marchas-religiosas',
        name: 'Marchas Religiosas'
    },
    {
        id: 'fantasias',
        name: 'Fantasias'
    },
    {
        id: 'polacas',
        name: 'Polacas'
    },
    {
        id: 'boleros',
        name: 'Boleros'
    },
    {
        id: 'valsas',
        name: 'Valsas'
    },
    {
        id: 'arranjos',
        name: 'Arranjos'
    },
    {
        id: 'hinos',
        name: 'Hinos'
    },
    {
        id: 'hinos-civicos',
        name: 'Hinos Cívicos'
    },
    {
        id: 'hinos-religiosos',
        name: 'Hinos Religiosos'
    },
    {
        id: 'preludios',
        name: 'Prelúdios'
    }
];
const CATEGORIES_MAP = new Map(CATEGORIES.map((cat)=>[
        cat.id,
        cat
    ]));
const getCategoryById = (id)=>CATEGORIES_MAP.get(id);
const getCategoryName = (id)=>getCategoryById(id)?.name || id;
const __TURBOPACK__default__export__ = CATEGORIES;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/src/constants/instruments.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_INSTRUMENTS",
    ()=>DEFAULT_INSTRUMENTS,
    "DEFAULT_INSTRUMENTS_MAP",
    ()=>DEFAULT_INSTRUMENTS_MAP,
    "DEFAULT_INSTRUMENT_NAMES",
    ()=>DEFAULT_INSTRUMENT_NAMES,
    "createInstrumentsMap",
    ()=>createInstrumentsMap
]);
const DEFAULT_INSTRUMENTS = [
    {
        id: 1,
        nome: 'Grade'
    },
    {
        id: 2,
        nome: 'Flautim'
    },
    {
        id: 3,
        nome: 'Flauta'
    },
    {
        id: 4,
        nome: 'Requinta'
    },
    {
        id: 5,
        nome: 'Clarinete Bb'
    },
    {
        id: 6,
        nome: 'Clarinete Bb 1'
    },
    {
        id: 7,
        nome: 'Clarinete Bb 2'
    },
    {
        id: 8,
        nome: 'Sax. Soprano'
    },
    {
        id: 9,
        nome: 'Sax. Alto'
    },
    {
        id: 10,
        nome: 'Sax. Alto 1'
    },
    {
        id: 11,
        nome: 'Sax. Alto 2'
    },
    {
        id: 12,
        nome: 'Sax. Tenor'
    },
    {
        id: 13,
        nome: 'Sax. Tenor 1'
    },
    {
        id: 14,
        nome: 'Sax. Tenor 2'
    },
    {
        id: 15,
        nome: 'Sax. Barítono'
    },
    {
        id: 16,
        nome: 'Trompete Bb'
    },
    {
        id: 17,
        nome: 'Trompete Bb 1'
    },
    {
        id: 18,
        nome: 'Trompete Bb 2'
    },
    {
        id: 19,
        nome: 'Trompa F'
    },
    {
        id: 20,
        nome: 'Trompa Eb'
    },
    {
        id: 21,
        nome: 'Trompa Eb 1'
    },
    {
        id: 22,
        nome: 'Trompa Eb 2'
    },
    {
        id: 23,
        nome: 'Barítono Bb'
    },
    {
        id: 24,
        nome: 'Barítono Bb 1'
    },
    {
        id: 25,
        nome: 'Barítono Bb 2'
    },
    {
        id: 26,
        nome: 'Trombone'
    },
    {
        id: 27,
        nome: 'Trombone 1'
    },
    {
        id: 28,
        nome: 'Trombone 2'
    },
    {
        id: 29,
        nome: 'Bombardino'
    },
    {
        id: 30,
        nome: 'Bombardino Bb'
    },
    {
        id: 31,
        nome: 'Baixo Eb'
    },
    {
        id: 32,
        nome: 'Baixo Bb'
    },
    {
        id: 33,
        nome: 'Caixa'
    },
    {
        id: 34,
        nome: 'Bombo'
    },
    {
        id: 35,
        nome: 'Pratos'
    }
];
const DEFAULT_INSTRUMENT_NAMES = DEFAULT_INSTRUMENTS.map(_c = (i)=>i.nome);
_c1 = DEFAULT_INSTRUMENT_NAMES;
const createInstrumentsMap = (instruments)=>{
    const map = new Map();
    instruments.forEach((inst)=>{
        map.set(inst.nome.toLowerCase(), inst);
    });
    return map;
};
const DEFAULT_INSTRUMENTS_MAP = createInstrumentsMap(DEFAULT_INSTRUMENTS);
_c2 = DEFAULT_INSTRUMENTS_MAP;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "DEFAULT_INSTRUMENT_NAMES$DEFAULT_INSTRUMENTS.map");
__turbopack_context__.k.register(_c1, "DEFAULT_INSTRUMENT_NAMES");
__turbopack_context__.k.register(_c2, "DEFAULT_INSTRUMENTS_MAP");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/src/contexts/DataContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataProvider",
    ()=>DataProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useData",
    ()=>useData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/lib/storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$categories$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/categories.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$instruments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/constants/instruments.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const DataContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const useData = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(DataContext);
    if (!context) {
        throw new Error("useData must be used within DataProvider");
    }
    return context;
};
_s(useData, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const generateSampleData = ()=>[
        {
            id: "1",
            title: "Verde e Branco",
            composer: "Estevam Moura",
            category: "dobrados",
            year: 1940,
            downloads: 567,
            featured: true
        },
        {
            id: "2",
            title: "Magnata",
            composer: "Estevam Moura",
            category: "dobrados",
            year: 1945,
            downloads: 489,
            featured: true
        },
        {
            id: "3",
            title: "Tusca",
            composer: "Estevam Moura",
            category: "dobrados",
            year: 1942,
            downloads: 423,
            featured: false
        },
        {
            id: "4",
            title: "Dois Corações",
            composer: "Pedro Salgado",
            category: "dobrados",
            year: 1935,
            downloads: 512,
            featured: true
        },
        {
            id: "5",
            title: "Os Corujas",
            composer: "Heraclio Guerreiro",
            category: "dobrados",
            year: 1920,
            downloads: 298,
            featured: true
        }
    ];
const DataProvider = ({ children })=>{
    _s1();
    const [sheets, setSheets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "DataProvider.useState": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("sheets", generateSampleData())
    }["DataProvider.useState"]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [apiOnline, setApiOnline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "DataProvider.useState": ()=>{
            const stored = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("categories", null);
            return stored || __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$categories$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORIES"];
        }
    }["DataProvider.useState"]);
    const [instruments, setInstruments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "DataProvider.useState": ()=>{
            const stored = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("instruments", null);
            return stored || __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$constants$2f$instruments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INSTRUMENTS"];
        }
    }["DataProvider.useState"]);
    const [favorites, setFavorites] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "DataProvider.useState": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("favorites", [])
    }["DataProvider.useState"]);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("home");
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedComposer, setSelectedComposer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DataProvider.useEffect": ()=>{
            const loadFromAPI = {
                "DataProvider.useEffect.loadFromAPI": async ()=>{
                    if (!__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["USE_API"]) {
                        setIsLoading(false);
                        return;
                    }
                    try {
                        const isOnline = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].healthCheck();
                        setApiOnline(isOnline);
                        if (isOnline) {
                            const [partituras, categoriasApi, instrumentosApi] = await Promise.all([
                                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].getPartituras(),
                                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].getCategorias(),
                                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].getInstrumentos()
                            ]);
                            if (partituras && partituras.length > 0) {
                                const mappedSheets = partituras.map({
                                    "DataProvider.useEffect.loadFromAPI.mappedSheets": (p)=>({
                                            id: String(p.id),
                                            title: p.titulo,
                                            composer: p.compositor,
                                            category: p.categoria_id,
                                            year: p.ano,
                                            downloads: p.downloads || 0,
                                            featured: p.destaque === 1,
                                            hasFile: !!p.arquivo_nome,
                                            apiId: p.id
                                        })
                                }["DataProvider.useEffect.loadFromAPI.mappedSheets"]);
                                setSheets(mappedSheets);
                                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("sheets", mappedSheets);
                            }
                            if (categoriasApi && categoriasApi.length > 0) {
                                const mappedCategories = categoriasApi.map({
                                    "DataProvider.useEffect.loadFromAPI.mappedCategories": (c)=>({
                                            id: c.id,
                                            name: c.nome
                                        })
                                }["DataProvider.useEffect.loadFromAPI.mappedCategories"]);
                                setCategories(mappedCategories);
                                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("categories", mappedCategories);
                            }
                            if (instrumentosApi && instrumentosApi.length > 0) {
                                const mappedInstruments = instrumentosApi.map({
                                    "DataProvider.useEffect.loadFromAPI.mappedInstruments": (i)=>({
                                            id: i.id,
                                            nome: i.nome
                                        })
                                }["DataProvider.useEffect.loadFromAPI.mappedInstruments"]);
                                setInstruments(mappedInstruments);
                                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("instruments", mappedInstruments);
                            }
                        }
                    } catch (error) {
                        console.error("Erro ao carregar da API:", error);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["DataProvider.useEffect.loadFromAPI"];
            loadFromAPI();
        }
    }["DataProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DataProvider.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("sheets", sheets);
        }
    }["DataProvider.useEffect"], [
        sheets
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DataProvider.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("favorites", favorites);
        }
    }["DataProvider.useEffect"], [
        favorites
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DataProvider.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("categories", categories);
        }
    }["DataProvider.useEffect"], [
        categories
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DataProvider.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("instruments", instruments);
        }
    }["DataProvider.useEffect"], [
        instruments
    ]);
    const categoriesMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DataProvider.useMemo[categoriesMap]": ()=>new Map(categories.map({
                "DataProvider.useMemo[categoriesMap]": (cat)=>[
                        cat.id,
                        cat
                    ]
            }["DataProvider.useMemo[categoriesMap]"]))
    }["DataProvider.useMemo[categoriesMap]"], [
        categories
    ]);
    const instrumentNames = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DataProvider.useMemo[instrumentNames]": ()=>instruments.map({
                "DataProvider.useMemo[instrumentNames]": (i)=>i.nome
            }["DataProvider.useMemo[instrumentNames]"])
    }["DataProvider.useMemo[instrumentNames]"], [
        instruments
    ]);
    const loadUserFavorites = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DataProvider.useCallback[loadUserFavorites]": async ()=>{
            const token = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("authToken", null);
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["USE_API"] || !token) return;
            try {
                const favoritosIds = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].getFavoritosIds();
                if (favoritosIds && Array.isArray(favoritosIds)) {
                    const favoritosStr = favoritosIds.map({
                        "DataProvider.useCallback[loadUserFavorites].favoritosStr": (id)=>String(id)
                    }["DataProvider.useCallback[loadUserFavorites].favoritosStr"]);
                    setFavorites(favoritosStr);
                    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("favorites", favoritosStr);
                }
            } catch  {
            // Silencioso
            }
        }
    }["DataProvider.useCallback[loadUserFavorites]"], []);
    const toggleFavorite = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DataProvider.useCallback[toggleFavorite]": (id)=>{
            const token = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("authToken", null);
            setFavorites({
                "DataProvider.useCallback[toggleFavorite]": (prev)=>{
                    const wasFavorito = prev.includes(id);
                    const newFavorites = wasFavorito ? prev.filter({
                        "DataProvider.useCallback[toggleFavorite]": (f)=>f !== id
                    }["DataProvider.useCallback[toggleFavorite]"]) : [
                        ...prev,
                        id
                    ];
                    if (__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["USE_API"] && token) {
                        const apiCall = wasFavorito ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].removeFavorito(id) : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].addFavorito(id);
                        apiCall.catch({
                            "DataProvider.useCallback[toggleFavorite]": ()=>{
                                setFavorites({
                                    "DataProvider.useCallback[toggleFavorite]": (currentState)=>{
                                        const isCurrentlyFavorito = currentState.includes(id);
                                        const expectedState = !wasFavorito;
                                        if (isCurrentlyFavorito === expectedState) {
                                            return wasFavorito ? [
                                                ...currentState,
                                                id
                                            ] : currentState.filter({
                                                "DataProvider.useCallback[toggleFavorite]": (f)=>f !== id
                                            }["DataProvider.useCallback[toggleFavorite]"]);
                                        }
                                        return currentState;
                                    }
                                }["DataProvider.useCallback[toggleFavorite]"]);
                            }
                        }["DataProvider.useCallback[toggleFavorite]"]);
                    }
                    return newFavorites;
                }
            }["DataProvider.useCallback[toggleFavorite]"]);
        }
    }["DataProvider.useCallback[toggleFavorite]"], []);
    const addSheet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DataProvider.useCallback[addSheet]": (sheet)=>{
            setSheets({
                "DataProvider.useCallback[addSheet]": (prev)=>[
                        ...prev,
                        sheet
                    ]
            }["DataProvider.useCallback[addSheet]"]);
        }
    }["DataProvider.useCallback[addSheet]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DataContext.Provider, {
        value: {
            sheets,
            setSheets,
            addSheet,
            favorites,
            setFavorites,
            toggleFavorite,
            loadUserFavorites,
            categories,
            categoriesMap,
            instruments,
            instrumentNames,
            activeTab,
            setActiveTab,
            selectedCategory,
            setSelectedCategory,
            selectedComposer,
            setSelectedComposer,
            searchQuery,
            setSearchQuery,
            isLoading,
            apiOnline
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend-next/src/contexts/DataContext.tsx",
        lineNumber: 216,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(DataProvider, "iTntg7mkY1bKtluzlGX9YynLnB4=");
_c = DataProvider;
const __TURBOPACK__default__export__ = DataContext;
var _c;
__turbopack_context__.k.register(_c, "DataProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/src/contexts/UIContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UIProvider",
    ()=>UIProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useUI",
    ()=>useUI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/lib/storage.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const UIContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const useUI = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(UIContext);
    if (!context) {
        throw new Error("useUI must be used within UIProvider");
    }
    return context;
};
_s(useUI, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const UIProvider = ({ children })=>{
    _s1();
    const [themeMode, setThemeMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "UIProvider.useState": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("themeMode", "system")
    }["UIProvider.useState"]);
    const getEffectiveTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UIProvider.useCallback[getEffectiveTheme]": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (themeMode === "system") {
                return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            }
            return themeMode;
        }
    }["UIProvider.useCallback[getEffectiveTheme]"], [
        themeMode
    ]);
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(getEffectiveTheme);
    const [toast, setToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const showToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UIProvider.useCallback[showToast]": (message, type = "success")=>setToast({
                message,
                type
            })
    }["UIProvider.useCallback[showToast]"], []);
    const clearToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UIProvider.useCallback[clearToast]": ()=>setToast(null)
    }["UIProvider.useCallback[clearToast]"], []);
    const [sidebarCollapsed, setSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedSheet, setSelectedSheet] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showNotifications, setShowNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [shareCart, setShareCart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showShareCart, setShowShareCart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const addToShareCart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UIProvider.useCallback[addToShareCart]": (item)=>{
            setShareCart({
                "UIProvider.useCallback[addToShareCart]": (prev)=>{
                    if (prev.some({
                        "UIProvider.useCallback[addToShareCart]": (i)=>i.parteId === item.parteId
                    }["UIProvider.useCallback[addToShareCart]"])) return prev;
                    return [
                        ...prev,
                        item
                    ];
                }
            }["UIProvider.useCallback[addToShareCart]"]);
        }
    }["UIProvider.useCallback[addToShareCart]"], []);
    const removeFromShareCart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UIProvider.useCallback[removeFromShareCart]": (parteId)=>{
            setShareCart({
                "UIProvider.useCallback[removeFromShareCart]": (prev)=>prev.filter({
                        "UIProvider.useCallback[removeFromShareCart]": (i)=>i.parteId !== parteId
                    }["UIProvider.useCallback[removeFromShareCart]"])
            }["UIProvider.useCallback[removeFromShareCart]"]);
        }
    }["UIProvider.useCallback[removeFromShareCart]"], []);
    const clearShareCart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UIProvider.useCallback[clearShareCart]": ()=>{
            setShareCart([]);
        }
    }["UIProvider.useCallback[clearShareCart]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UIProvider.useEffect": ()=>{
            const updateTheme = {
                "UIProvider.useEffect.updateTheme": ()=>{
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    const effectiveTheme = themeMode === "system" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : themeMode;
                    setTheme(effectiveTheme);
                }
            }["UIProvider.useEffect.updateTheme"];
            updateTheme();
            if ("TURBOPACK compile-time truthy", 1) {
                const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
                mediaQuery.addEventListener("change", updateTheme);
                return ({
                    "UIProvider.useEffect": ()=>mediaQuery.removeEventListener("change", updateTheme)
                })["UIProvider.useEffect"];
            }
        }
    }["UIProvider.useEffect"], [
        themeMode
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UIProvider.useEffect": ()=>{
            if (typeof document !== "undefined") {
                document.documentElement.setAttribute("data-theme", theme);
            }
        }
    }["UIProvider.useEffect"], [
        theme
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UIProvider.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("themeMode", themeMode);
        }
    }["UIProvider.useEffect"], [
        themeMode
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UIContext.Provider, {
        value: {
            theme,
            themeMode,
            setThemeMode,
            toast,
            showToast,
            clearToast,
            sidebarCollapsed,
            setSidebarCollapsed,
            selectedSheet,
            setSelectedSheet,
            showNotifications,
            setShowNotifications,
            shareCart,
            showShareCart,
            setShowShareCart,
            addToShareCart,
            removeFromShareCart,
            clearShareCart
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend-next/src/contexts/UIContext.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(UIProvider, "sfCR8PzsrIUxzKNqtoara6SuSVs=");
_c = UIProvider;
const __TURBOPACK__default__export__ = UIContext;
var _c;
__turbopack_context__.k.register(_c, "UIProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/src/contexts/NotificationContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationProvider",
    ()=>NotificationProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useNotifications",
    ()=>useNotifications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/lib/storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const NotificationContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const useNotifications = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within NotificationProvider");
    }
    return context;
};
_s(useNotifications, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const activityToNotification = (activity)=>{
    return {
        id: `activity-${activity.id}`,
        type: "nova_partitura",
        title: activity.titulo,
        composer: activity.detalhes,
        date: activity.criado_em,
        read: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`notification-read-${activity.id}`, false)
    };
};
const NotificationProvider = ({ children })=>{
    _s1();
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const loadNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotificationProvider.useCallback[loadNotifications]": async ()=>{
            try {
                setLoading(true);
                const activities = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"].getAtividades();
                if (activities && Array.isArray(activities)) {
                    const newSheets = activities.filter({
                        "NotificationProvider.useCallback[loadNotifications].newSheets": (a)=>a.tipo === "nova_partitura"
                    }["NotificationProvider.useCallback[loadNotifications].newSheets"]).slice(0, 30).map(activityToNotification);
                    setNotifications(newSheets);
                }
            } catch  {
                setNotifications([]);
            } finally{
                setLoading(false);
            }
        }
    }["NotificationProvider.useCallback[loadNotifications]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationProvider.useEffect": ()=>{
            loadNotifications();
        }
    }["NotificationProvider.useEffect"], [
        loadNotifications
    ]);
    const markNotificationAsRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotificationProvider.useCallback[markNotificationAsRead]": (id)=>{
            setNotifications({
                "NotificationProvider.useCallback[markNotificationAsRead]": (prev)=>prev.map({
                        "NotificationProvider.useCallback[markNotificationAsRead]": (n)=>{
                            if (n.id === id) {
                                const activityId = id.replace("activity-", "");
                                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set(`notification-read-${activityId}`, true);
                                return {
                                    ...n,
                                    read: true
                                };
                            }
                            return n;
                        }
                    }["NotificationProvider.useCallback[markNotificationAsRead]"])
            }["NotificationProvider.useCallback[markNotificationAsRead]"]);
        }
    }["NotificationProvider.useCallback[markNotificationAsRead]"], []);
    const markAllNotificationsAsRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotificationProvider.useCallback[markAllNotificationsAsRead]": ()=>{
            setNotifications({
                "NotificationProvider.useCallback[markAllNotificationsAsRead]": (prev)=>prev.map({
                        "NotificationProvider.useCallback[markAllNotificationsAsRead]": (n)=>{
                            const activityId = n.id.replace("activity-", "");
                            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set(`notification-read-${activityId}`, true);
                            return {
                                ...n,
                                read: true
                            };
                        }
                    }["NotificationProvider.useCallback[markAllNotificationsAsRead]"])
            }["NotificationProvider.useCallback[markAllNotificationsAsRead]"]);
        }
    }["NotificationProvider.useCallback[markAllNotificationsAsRead]"], []);
    const clearNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotificationProvider.useCallback[clearNotifications]": ()=>{
            setNotifications([]);
        }
    }["NotificationProvider.useCallback[clearNotifications]"], []);
    const refreshNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotificationProvider.useCallback[refreshNotifications]": ()=>{
            loadNotifications();
        }
    }["NotificationProvider.useCallback[refreshNotifications]"], [
        loadNotifications
    ]);
    const unreadCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "NotificationProvider.useMemo[unreadCount]": ()=>notifications.filter({
                "NotificationProvider.useMemo[unreadCount]": (n)=>!n.read
            }["NotificationProvider.useMemo[unreadCount]"]).length
    }["NotificationProvider.useMemo[unreadCount]"], [
        notifications
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NotificationContext.Provider, {
        value: {
            notifications,
            loading,
            markNotificationAsRead,
            markAllNotificationsAsRead,
            clearNotifications,
            refreshNotifications,
            unreadCount
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend-next/src/contexts/NotificationContext.tsx",
        lineNumber: 120,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(NotificationProvider, "TE+hoWyozq3PkjYH93YesicdlFM=");
_c = NotificationProvider;
const __TURBOPACK__default__export__ = NotificationContext;
var _c;
__turbopack_context__.k.register(_c, "NotificationProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend-next/src/components/Providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/DataContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/UIContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$NotificationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/src/contexts/NotificationContext.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UIProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$src$2f$contexts$2f$NotificationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotificationProvider"], {
                    children: children
                }, void 0, false, {
                    fileName: "[project]/frontend-next/src/components/Providers.tsx",
                    lineNumber: 14,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend-next/src/components/Providers.tsx",
                lineNumber: 13,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend-next/src/components/Providers.tsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend-next/src/components/Providers.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend-next_src_590ecfd0._.js.map