"use client";

import Storage from "@lib/storage";
import { API_BASE_URL, TOKEN_EXPIRY_BUFFER_MS } from "@constants/api";

/* eslint-disable @typescript-eslint/no-explicit-any */

type OnTokenExpiredCallback = (() => void) | null;
let onTokenExpired: OnTokenExpiredCallback = null;

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const API = {
  setOnTokenExpired(callback: OnTokenExpiredCallback) {
    onTokenExpired = callback;
  },

  isTokenExpired(): boolean {
    const token = Storage.get<string | null>("authToken", null);
    const expiresAt = Storage.get<number | null>("tokenExpiresAt", null);
    if (!token) return false;
    if (!expiresAt) return true;
    return Date.now() > expiresAt - TOKEN_EXPIRY_BUFFER_MS;
  },

  clearAuth() {
    Storage.remove("authToken");
    Storage.remove("tokenExpiresAt");
    Storage.remove("user");
  },

  async request(endpoint: string, options: RequestOptions = {}): Promise<any> {
    try {
      if (this.isTokenExpired()) {
        this.clearAuth();
        if (onTokenExpired) onTokenExpired();
        throw new Error("Sess\u00e3o expirada. Fa\u00e7a login novamente.");
      }

      const token = Storage.get<string | null>("authToken", null);
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        const error = await response
          .json()
          .catch(() => ({ error: "N\u00e3o autorizado" }));
        this.clearAuth();
        if (onTokenExpired) onTokenExpired();
        throw new Error(
          error.error || "Sess\u00e3o expirada. Fa\u00e7a login novamente."
        );
      }

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ error: "Erro desconhecido" }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  },

  // ============ PARTITURAS ============

  async getPartituras(filters: {
    categoria?: string;
    busca?: string;
    destaque?: boolean;
  } = {}) {
    const params = new URLSearchParams();
    if (filters.categoria) params.append("categoria", filters.categoria);
    if (filters.busca) params.append("busca", filters.busca);
    if (filters.destaque) params.append("destaque", "1");
    const query = params.toString();
    return this.request(`/api/partituras${query ? `?${query}` : ""}`);
  },

  async getPartitura(id: string | number) {
    return this.request(`/api/partituras/${id}`);
  },

  async createPartitura(formData: FormData) {
    const token = Storage.get<string | null>("authToken", null);
    const response = await fetch(`${API_BASE_URL}/api/partituras`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Erro no upload" }));
      throw new Error(error.error);
    }
    return response.json();
  },

  async updatePartitura(id: string | number, data: Record<string, any>) {
    return this.request(`/api/partituras/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deletePartitura(id: string | number) {
    return this.request(`/api/partituras/${id}`, { method: "DELETE" });
  },

  async uploadPastaPartitura(formData: FormData) {
    const token = Storage.get<string | null>("authToken", null);
    const response = await fetch(
      `${API_BASE_URL}/api/partituras/upload-pasta`,
      {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      }
    );
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Erro no upload" }));
      throw new Error(error.error);
    }
    return response.json();
  },

  async getPartesPartitura(partituraId: string | number) {
    return this.request(`/api/partituras/${partituraId}/partes`);
  },

  async addPartePartitura(partituraId: string | number, formData: FormData) {
    const token = Storage.get<string | null>("authToken", null);
    const response = await fetch(
      `${API_BASE_URL}/api/partituras/${partituraId}/partes`,
      {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      }
    );
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Erro ao adicionar parte" }));
      throw new Error(error.error);
    }
    return response.json();
  },

  async replacePartePartitura(
    _partituraId: string | number,
    parteId: string | number,
    formData: FormData
  ) {
    const token = Storage.get<string | null>("authToken", null);
    const response = await fetch(
      `${API_BASE_URL}/api/partes/${parteId}/substituir`,
      {
        method: "PUT",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      }
    );
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Erro ao substituir parte" }));
      throw new Error(error.error);
    }
    return response.json();
  },

  async deletePartePartitura(
    _partituraId: string | number,
    parteId: string | number
  ) {
    return this.request(`/api/partes/${parteId}`, { method: "DELETE" });
  },

  // ============ DOWNLOAD ============

  getDownloadUrl(id: string | number, instrumento: string | null = null) {
    let url = `/api/download/${id}`;
    if (instrumento) url += `?instrumento=${instrumento}`;
    return url;
  },

  /**
   * Faz download autenticado de um endpoint e retorna o Blob.
   * Usa fetch com Authorization header, adequado para URLs que
   * nao podem ser abertas via window.open (que nao envia headers).
   */
  async downloadBlob(url: string): Promise<Blob> {
    const token = Storage.get<string | null>("authToken", null);
    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: `Erro HTTP ${response.status}` }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.blob();
  },

  // ============ CATEGORIAS E INSTRUMENTOS ============

  async getCategorias() {
    return this.request("/api/categorias");
  },

  async getInstrumentos() {
    return this.request("/api/instrumentos");
  },

  // ============ ESTATISTICAS ============

  async getEstatisticas() {
    return this.request("/api/estatisticas");
  },

  // ============ ATIVIDADES ============

  async getAtividades() {
    return this.request("/api/atividades");
  },

  async getMinhasAtividades() {
    return this.request("/api/minhas-atividades");
  },

  // ============ AUTH ============

  async login(username: string, pin: string, rememberMe = false) {
    const result = await this.request("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, pin, rememberMe }),
    });
    if (result.token) {
      Storage.set("authToken", result.token);
      if (result.expiresIn) {
        const expiresAt = Date.now() + result.expiresIn * 1000;
        Storage.set("tokenExpiresAt", expiresAt);
      }
    }
    return result;
  },

  async changePin(currentPin: string, newPin: string) {
    try {
      const result = await this.request("/api/change-pin", {
        method: "POST",
        body: JSON.stringify({ currentPin, newPin }),
      });
      if (result.token) {
        Storage.set("authToken", result.token);
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
        Storage.set("tokenExpiresAt", expiresAt);
      }
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  },

  logout() {
    this.clearAuth();
  },

  // ============ HEALTH CHECK ============

  async healthCheck() {
    try {
      const result = await this.request("/api/health");
      return result.status === "ok";
    } catch {
      return false;
    }
  },

  async getVersion() {
    try {
      return await this.request("/api/version");
    } catch {
      return null;
    }
  },

  // ============ PERFIL ============

  async getPerfil() {
    return this.request("/api/perfil");
  },

  async updatePerfil(data: Record<string, any>) {
    return this.request("/api/perfil", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async uploadFotoPerfil(file: File) {
    const token = Storage.get<string | null>("authToken", null);
    const formData = new FormData();
    formData.append("foto", file);
    const response = await fetch(`${API_BASE_URL}/api/perfil/foto`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Erro no upload" }));
      throw new Error(error.error);
    }
    return response.json();
  },

  // ============ FAVORITOS ============

  async getFavoritos() {
    return this.request("/api/favoritos");
  },

  async getFavoritosIds() {
    return this.request("/api/favoritos/ids");
  },

  async addFavorito(partituraId: string | number) {
    return this.request(`/api/favoritos/${partituraId}`, { method: "POST" });
  },

  async removeFavorito(partituraId: string | number) {
    return this.request(`/api/favoritos/${partituraId}`, { method: "DELETE" });
  },

  // ============ USUARIOS (ADMIN) ============

  async getUsuarios() {
    return this.request("/api/usuarios");
  },

  async getUsuario(id: string | number) {
    return this.request(`/api/usuarios/${id}`);
  },

  async createUsuario(data: Record<string, any>) {
    return this.request("/api/usuarios", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateUsuario(id: string | number, data: Record<string, any>) {
    return this.request(`/api/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteUsuario(id: string | number) {
    return this.request(`/api/usuarios/${id}`, { method: "DELETE" });
  },

  // ============ CATEGORIAS (ADMIN) ============

  async createCategoria(data: Record<string, any>) {
    return this.request("/api/categorias", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateCategoria(id: string | number, data: Record<string, any>) {
    return this.request(`/api/categorias/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteCategoria(id: string | number) {
    return this.request(`/api/categorias/${id}`, { method: "DELETE" });
  },

  async reorderCategorias(ordens: Array<{ id: string | number; ordem: number }>) {
    return this.request("/api/categorias/reorder", {
      method: "POST",
      body: JSON.stringify({ ordens }),
    });
  },

  // ============ ESTATISTICAS ADMIN ============

  async getEstatisticasAdmin() {
    return this.request("/api/admin/estatisticas");
  },

  // ============ MANUTENCAO ADMIN ============

  async limparNomesUsuarios() {
    return this.request("/api/admin/manutencao/limpar-nomes", {
      method: "POST",
    });
  },

  async configurarSuperAdmin(data: Record<string, any>) {
    return this.request("/api/admin/manutencao/super-admin", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // ============ REPERTORIO ============

  async getRepertorioAtivo() {
    return this.request("/api/repertorio/ativo");
  },

  async getRepertorio(id: string | number) {
    return this.request(`/api/repertorio/${id}`);
  },

  async getRepertorioInstrumentos(id: string | number) {
    return this.request(`/api/repertorio/${id}/instrumentos`);
  },

  async getRepertorios() {
    return this.request("/api/repertorios");
  },

  async createRepertorio(data: Record<string, any>) {
    return this.request("/api/repertorios", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateRepertorio(id: string | number, data: Record<string, any>) {
    return this.request(`/api/repertorio/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteRepertorio(id: string | number) {
    return this.request(`/api/repertorio/${id}`, { method: "DELETE" });
  },

  async addPartituraToRepertorio(
    repertorioId: string | number,
    partituraId: string | number
  ) {
    return this.request(`/api/repertorio/${repertorioId}/partituras`, {
      method: "POST",
      body: JSON.stringify({ partitura_id: partituraId }),
    });
  },

  async removePartituraFromRepertorio(
    repertorioId: string | number,
    partituraId: string | number
  ) {
    return this.request(
      `/api/repertorio/${repertorioId}/partituras/${partituraId}`,
      { method: "DELETE" }
    );
  },

  async reorderRepertorioPartituras(
    repertorioId: string | number,
    ordens: Array<{ id: string | number; ordem: number }>
  ) {
    return this.request(`/api/repertorio/${repertorioId}/reorder`, {
      method: "PUT",
      body: JSON.stringify({ ordens }),
    });
  },

  async duplicarRepertorio(id: string | number) {
    return this.request(`/api/repertorio/${id}/duplicar`, { method: "POST" });
  },

  async isPartituraInRepertorio(partituraId: string | number) {
    return this.request(`/api/partituras/${partituraId}/in-repertorio`);
  },

  getRepertorioDownloadUrl(
    id: string | number,
    instrumento: string | null,
    formato = "pdf",
    partituraIds: (string | number)[] | null = null
  ) {
    let url = `/api/repertorio/${id}/download?formato=${formato}`;
    if (instrumento)
      url += `&instrumento=${encodeURIComponent(instrumento)}`;
    if (partituraIds && partituraIds.length > 0) {
      url += `&partituras=${partituraIds.join(",")}`;
    }
    return url;
  },

  // ============ CONFIGURACOES ============

  async getModoRecesso() {
    try {
      return await this.request("/api/config/recesso");
    } catch {
      return { ativo: false };
    }
  },

  async setModoRecesso(ativo: boolean) {
    return this.request("/api/config/recesso", {
      method: "PUT",
      body: JSON.stringify({ ativo }),
    });
  },

  // ============ PRESENCA ============

  async getMinhaPresenca() {
    return this.request("/api/presenca/minhas");
  },

  async registrarPresencas(dataEnsaio: string, usuariosIds: number[]) {
    return this.request("/api/presenca", {
      method: "POST",
      body: JSON.stringify({
        data_ensaio: dataEnsaio,
        usuarios_ids: usuariosIds,
      }),
    });
  },

  async getTodasPresencas() {
    return this.request("/api/presenca/todas");
  },

  // ============ ENSAIOS ============

  async getPartiturasEnsaio(dataEnsaio: string) {
    return this.request(`/api/ensaios/${dataEnsaio}/partituras`);
  },

  async addPartituraEnsaio(
    dataEnsaio: string,
    partituraId: string | number
  ) {
    return this.request(`/api/ensaios/${dataEnsaio}/partituras`, {
      method: "POST",
      body: JSON.stringify({ partitura_id: partituraId }),
    });
  },

  async removePartituraEnsaio(dataEnsaio: string, id: string | number) {
    return this.request(`/api/ensaios/${dataEnsaio}/partituras/${id}`, {
      method: "DELETE",
    });
  },

  async reorderPartiturasEnsaio(
    dataEnsaio: string,
    ordens: Array<{ id: string | number; ordem: number }>
  ) {
    return this.request(`/api/ensaios/${dataEnsaio}/partituras/reorder`, {
      method: "PUT",
      body: JSON.stringify({ ordens }),
    });
  },
};

export const USE_API = true;
export default API;
