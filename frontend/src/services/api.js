// ===== API SERVICE =====
// Conecta com o backend Cloudflare Workers

import Storage from './storage';
import { API_BASE_URL, TOKEN_EXPIRY_BUFFER_MS } from '@constants/api';

// Callback para notificar quando token expirar
let onTokenExpired = null;

export const API = {
  // Registra callback para expiração de token
  setOnTokenExpired(callback) {
    onTokenExpired = callback;
  },

  // Verifica se o token JWT expirou
  isTokenExpired() {
    const token = Storage.get('authToken', null);
    const expiresAt = Storage.get('tokenExpiresAt', null);

    // Se não há token, não está expirado (não está logado)
    if (!token) return false;

    // Se há token mas não há expiresAt, considera expirado
    // (token antigo sem controle de expiração)
    if (!expiresAt) return true;

    // Considera expirado alguns minutos antes para evitar problemas
    return Date.now() > (expiresAt - TOKEN_EXPIRY_BUFFER_MS);
  },

  // Limpa autenticação
  clearAuth() {
    Storage.remove('authToken');
    Storage.remove('tokenExpiresAt');
    Storage.remove('user');
  },

  // Helper para fazer requisicoes
  async request(endpoint, options = {}) {
    try {
      // Verifica expiração do token antes de requisições autenticadas
      if (this.isTokenExpired()) {
        this.clearAuth();
        if (onTokenExpired) {
          onTokenExpired();
        }
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      const token = Storage.get('authToken', null);
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      // Se receber 401, token pode ter expirado no servidor
      if (response.status === 401) {
        const error = await response.json().catch(() => ({ error: 'Não autorizado' }));
        // Verifica se é erro de expiração
        if (error.error?.includes('expirad') || error.error?.includes('expired')) {
          this.clearAuth();
          if (onTokenExpired) {
            onTokenExpired();
          }
        }
        throw new Error(error.error || 'Não autorizado');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  },

  // ============ PARTITURAS ============

  async getPartituras(filters = {}) {
    const params = new URLSearchParams();
    if (filters.categoria) params.append('categoria', filters.categoria);
    if (filters.busca) params.append('busca', filters.busca);
    if (filters.destaque) params.append('destaque', '1');

    const query = params.toString();
    return this.request(`/api/partituras${query ? `?${query}` : ''}`);
  },

  async getPartitura(id) {
    return this.request(`/api/partituras/${id}`);
  },

  async createPartitura(formData) {
    const token = Storage.get('authToken', null);
    const response = await fetch(`${API_BASE_URL}/api/partituras`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro no upload' }));
      throw new Error(error.error);
    }

    return response.json();
  },

  async updatePartitura(id, data) {
    return this.request(`/api/partituras/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deletePartitura(id) {
    return this.request(`/api/partituras/${id}`, {
      method: 'DELETE'
    });
  },

  async uploadPastaPartitura(formData) {
    const token = Storage.get('authToken', null);
    const response = await fetch(`${API_BASE_URL}/api/partituras/upload-pasta`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro no upload' }));
      throw new Error(error.error);
    }

    return response.json();
  },

  async getPartesPartitura(partituraId) {
    return this.request(`/api/partituras/${partituraId}/partes`);
  },

  async addPartePartitura(partituraId, formData) {
    const token = Storage.get('authToken', null);
    const response = await fetch(`${API_BASE_URL}/api/partituras/${partituraId}/partes`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro ao adicionar parte' }));
      throw new Error(error.error);
    }

    return response.json();
  },

  async replacePartePartitura(partituraId, parteId, formData) {
    const token = Storage.get('authToken', null);
    const response = await fetch(`${API_BASE_URL}/api/partituras/${partituraId}/partes/${parteId}`, {
      method: 'PUT',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro ao substituir parte' }));
      throw new Error(error.error);
    }

    return response.json();
  },

  async deletePartePartitura(partituraId, parteId) {
    return this.request(`/api/partituras/${partituraId}/partes/${parteId}`, {
      method: 'DELETE'
    });
  },

  // ============ DOWNLOAD ============

  getDownloadUrl(id, instrumento = null) {
    let url = `${API_BASE_URL}/api/download/${id}`;
    if (instrumento) url += `?instrumento=${instrumento}`;
    return url;
  },

  // ============ CATEGORIAS E INSTRUMENTOS ============

  async getCategorias() {
    return this.request('/api/categorias');
  },

  async getInstrumentos() {
    return this.request('/api/instrumentos');
  },

  // ============ ESTATISTICAS ============

  async getEstatisticas() {
    return this.request('/api/estatisticas');
  },

  // ============ ATIVIDADES ============

  async getAtividades() {
    return this.request('/api/atividades');
  },

  async getMinhasAtividades() {
    return this.request('/api/minhas-atividades');
  },

  // ============ AUTH ============

  async login(username, pin, rememberMe = false) {
    const result = await this.request('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, pin, rememberMe })
    });

    if (result.token) {
      Storage.set('authToken', result.token);

      // Armazena tempo de expiração (expiresIn em segundos)
      if (result.expiresIn) {
        const expiresAt = Date.now() + (result.expiresIn * 1000);
        Storage.set('tokenExpiresAt', expiresAt);
      }
    }

    return result;
  },

  async changePin(currentPin, newPin) {
    try {
      const result = await this.request('/api/change-pin', {
        method: 'POST',
        body: JSON.stringify({ currentPin, newPin })
      });

      // Se a mudança de PIN retornou novo token, atualiza
      if (result.token) {
        Storage.set('authToken', result.token);
        // Token tem mesma duração de 24h
        const expiresAt = Date.now() + (24 * 60 * 60 * 1000);
        Storage.set('tokenExpiresAt', expiresAt);
      }

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  logout() {
    this.clearAuth();
  },

  // ============ HEALTH CHECK ============

  async healthCheck() {
    try {
      const result = await this.request('/api/health');
      return result.status === 'ok';
    } catch {
      return false;
    }
  },

  // ============ PERFIL ============

  async getPerfil() {
    return this.request('/api/perfil');
  },

  async updatePerfil(data) {
    return this.request('/api/perfil', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async uploadFotoPerfil(file) {
    const token = Storage.get('authToken', null);
    const formData = new FormData();
    formData.append('foto', file);

    const response = await fetch(`${API_BASE_URL}/api/perfil/foto`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro no upload' }));
      throw new Error(error.error);
    }

    return response.json();
  },

  // ============ FAVORITOS ============

  async getFavoritos() {
    return this.request('/api/favoritos');
  },

  async getFavoritosIds() {
    return this.request('/api/favoritos/ids');
  },

  async addFavorito(partituraId) {
    return this.request(`/api/favoritos/${partituraId}`, {
      method: 'POST'
    });
  },

  async removeFavorito(partituraId) {
    return this.request(`/api/favoritos/${partituraId}`, {
      method: 'DELETE'
    });
  },

  // ============ USUARIOS (ADMIN) ============

  async getUsuarios() {
    return this.request('/api/usuarios');
  },

  async getUsuario(id) {
    return this.request(`/api/usuarios/${id}`);
  },

  async createUsuario(data) {
    return this.request('/api/usuarios', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateUsuario(id, data) {
    return this.request(`/api/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteUsuario(id) {
    return this.request(`/api/usuarios/${id}`, {
      method: 'DELETE'
    });
  },

  // ============ CATEGORIAS (ADMIN) ============

  async createCategoria(data) {
    return this.request('/api/categorias', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateCategoria(id, data) {
    return this.request(`/api/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteCategoria(id) {
    return this.request(`/api/categorias/${id}`, {
      method: 'DELETE'
    });
  },

  async reorderCategorias(ordens) {
    return this.request('/api/categorias/reorder', {
      method: 'POST',
      body: JSON.stringify({ ordens })
    });
  },

  // ============ ESTATISTICAS ADMIN ============

  async getEstatisticasAdmin() {
    return this.request('/api/admin/estatisticas');
  },

  // ============ MANUTENÇÃO ADMIN ============

  async limparNomesUsuarios() {
    return this.request('/api/admin/manutencao/limpar-nomes', {
      method: 'POST'
    });
  },

  async configurarSuperAdmin(data) {
    return this.request('/api/admin/manutencao/super-admin', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

// Flag para usar API ou dados locais (fallback)
export const USE_API = true;

export default API;
