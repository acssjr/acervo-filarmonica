/**
 * Cliente de API tipado gerado a partir do OpenAPI spec
 *
 * Este cliente garante que:
 * 1. URLs corretas são sempre usadas (vêm do spec)
 * 2. Tipos de request/response são validados em tempo de compilação
 * 3. Erros de endpoint são impossíveis
 */

import createClient from 'openapi-fetch';
import type { paths } from '../api-types';
import { Storage } from '../utils/storage';

// Detecta ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

// Cria cliente tipado
const client = createClient<paths>({
  baseUrl: API_BASE_URL,
});

// Middleware para adicionar token de autenticação
client.use({
  onRequest: ({ request }) => {
    const token = Storage.get('authToken', null);
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },
});

/**
 * API Client Tipado
 *
 * Uso:
 *   const { data, error } = await api.GET('/api/partituras', { params: { query: { busca: 'teste' } } });
 *   const { data, error } = await api.POST('/api/login', { body: { username: 'user', pin: '1234' } });
 */
export const api = client;

// ============================================================
// Funções de conveniência que mantêm compatibilidade com api.js
// ============================================================

export const ApiTyped = {
  // ==================== AUTH ====================
  async login(username: string, pin: string) {
    const { data, error } = await api.POST('/api/login', {
      body: { username, pin },
    });
    if (error) throw new Error(error.error || 'Erro ao fazer login');
    return data;
  },

  async checkUser(username: string) {
    const { data, error } = await api.POST('/api/check-user', {
      body: { username },
    });
    if (error) throw new Error(error.error || 'Erro ao verificar usuário');
    return data;
  },

  async changePin(pinAtual: string, pinNovo: string) {
    const { data, error } = await api.POST('/api/change-pin', {
      body: { pin_atual: pinAtual, pin_novo: pinNovo },
    });
    if (error) throw new Error(error.error || 'Erro ao alterar PIN');
    return data;
  },

  // ==================== PARTITURAS ====================
  async getPartituras(params?: { categoria?: number; busca?: string; destaque?: '1' }) {
    const { data, error } = await api.GET('/api/partituras', {
      params: { query: params },
    });
    if (error) throw new Error(error.error || 'Erro ao carregar partituras');
    return data;
  },

  async getPartitura(id: number) {
    const { data, error } = await api.GET('/api/partituras/{id}', {
      params: { path: { id } },
    });
    if (error) throw new Error(error.error || 'Partitura não encontrada');
    return data;
  },

  async updatePartitura(id: number, dados: {
    titulo?: string;
    compositor?: string;
    arranjador?: string;
    categoria_id?: number;
    ano?: number;
    descricao?: string;
    destaque?: number;
  }) {
    const { data, error } = await api.PUT('/api/partituras/{id}', {
      params: { path: { id } },
      body: dados,
    });
    if (error) throw new Error(error.error || 'Erro ao atualizar partitura');
    return data;
  },

  async deletePartitura(id: number) {
    const { data, error } = await api.DELETE('/api/partituras/{id}', {
      params: { path: { id } },
    });
    if (error) throw new Error(error.error || 'Erro ao deletar partitura');
    return data;
  },

  // ==================== PARTES ====================
  async getPartesPartitura(partituraId: number) {
    const { data, error } = await api.GET('/api/partituras/{id}/partes', {
      params: { path: { id: partituraId } },
    });
    if (error) throw new Error(error.error || 'Erro ao carregar partes');
    return data;
  },

  /**
   * Substituir arquivo de uma parte
   * IMPORTANTE: O endpoint é /api/partes/{id}/substituir (não /api/partituras/{partituraId}/partes/{parteId})
   */
  async substituirParte(parteId: number, arquivo: File) {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    // openapi-fetch não suporta bem FormData, então usamos fetch direto
    const token = Storage.get('authToken', null);
    const response = await fetch(`${API_BASE_URL}/api/partes/${parteId}/substituir`, {
      method: 'PUT',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao substituir parte');
    }

    return response.json();
  },

  /**
   * Deletar parte
   * IMPORTANTE: O endpoint é /api/partes/{id} (não /api/partituras/{partituraId}/partes/{parteId})
   */
  async deleteParte(parteId: number) {
    const { data, error } = await api.DELETE('/api/partes/{id}', {
      params: { path: { id: parteId } },
    });
    if (error) throw new Error(error.error || 'Erro ao deletar parte');
    return data;
  },

  // ==================== CATEGORIAS ====================
  async getCategorias() {
    const { data, error } = await api.GET('/api/categorias');
    if (error) throw new Error(error.error || 'Erro ao carregar categorias');
    return data;
  },

  async createCategoria(dados: { nome: string; emoji?: string; cor?: string }) {
    const { data, error } = await api.POST('/api/categorias', {
      body: dados,
    });
    if (error) throw new Error(error.error || 'Erro ao criar categoria');
    return data;
  },

  async updateCategoria(id: number, dados: { nome?: string; emoji?: string; cor?: string }) {
    const { data, error } = await api.PUT('/api/categorias/{id}', {
      params: { path: { id } },
      body: dados,
    });
    if (error) throw new Error(error.error || 'Erro ao atualizar categoria');
    return data;
  },

  async deleteCategoria(id: number) {
    const { data, error } = await api.DELETE('/api/categorias/{id}', {
      params: { path: { id } },
    });
    if (error) throw new Error(error.error || 'Erro ao deletar categoria');
    return data;
  },

  async reorderCategorias(ordem: number[]) {
    const { data, error } = await api.POST('/api/categorias/reorder', {
      body: { ordem },
    });
    if (error) throw new Error(error.error || 'Erro ao reordenar categorias');
    return data;
  },

  // ==================== FAVORITOS ====================
  async getFavoritos() {
    const { data, error } = await api.GET('/api/favoritos');
    if (error) throw new Error(error.error || 'Erro ao carregar favoritos');
    return data;
  },

  async getFavoritosIds() {
    const { data, error } = await api.GET('/api/favoritos/ids');
    if (error) throw new Error(error.error || 'Erro ao carregar IDs dos favoritos');
    return data;
  },

  async addFavorito(partituraId: number) {
    const { data, error } = await api.POST('/api/favoritos/{id}', {
      params: { path: { id: partituraId } },
    });
    if (error) throw new Error(error.error || 'Erro ao adicionar favorito');
    return data;
  },

  async removeFavorito(partituraId: number) {
    const { data, error } = await api.DELETE('/api/favoritos/{id}', {
      params: { path: { id: partituraId } },
    });
    if (error) throw new Error(error.error || 'Erro ao remover favorito');
    return data;
  },

  // ==================== ATIVIDADES ====================
  async getAtividades() {
    const { data, error } = await api.GET('/api/atividades');
    if (error) throw new Error(error.error || 'Erro ao carregar atividades');
    return data;
  },

  async getMinhasAtividades() {
    const { data, error } = await api.GET('/api/minhas-atividades');
    if (error) throw new Error(error.error || 'Erro ao carregar minhas atividades');
    return data;
  },

  // ==================== ESTATISTICAS ====================
  async getEstatisticas() {
    const { data, error } = await api.GET('/api/estatisticas');
    if (error) throw new Error(error.error || 'Erro ao carregar estatísticas');
    return data;
  },

  async getInstrumentos() {
    const { data, error } = await api.GET('/api/instrumentos');
    if (error) throw new Error(error.error || 'Erro ao carregar instrumentos');
    return data;
  },

  async getEstatisticasAdmin() {
    const { data, error } = await api.GET('/api/admin/estatisticas');
    if (error) throw new Error(error.error || 'Erro ao carregar estatísticas admin');
    return data;
  },

  // ==================== USUARIOS (ADMIN) ====================
  async getUsuarios() {
    const { data, error } = await api.GET('/api/usuarios');
    if (error) throw new Error(error.error || 'Erro ao carregar usuários');
    return data;
  },

  async getUsuario(id: number) {
    const { data, error } = await api.GET('/api/usuarios/{id}', {
      params: { path: { id } },
    });
    if (error) throw new Error(error.error || 'Usuário não encontrado');
    return data;
  },

  async createUsuario(dados: {
    username: string;
    nome: string;
    instrumento: string;
    pin: string;
    is_admin?: number;
  }) {
    const { data, error } = await api.POST('/api/usuarios', {
      body: dados,
    });
    if (error) throw new Error(error.error || 'Erro ao criar usuário');
    return data;
  },

  async updateUsuario(id: number, dados: {
    nome?: string;
    instrumento?: string;
    is_admin?: number;
  }) {
    const { data, error } = await api.PUT('/api/usuarios/{id}', {
      params: { path: { id } },
      body: dados,
    });
    if (error) throw new Error(error.error || 'Erro ao atualizar usuário');
    return data;
  },

  async deleteUsuario(id: number) {
    const { data, error } = await api.DELETE('/api/usuarios/{id}', {
      params: { path: { id } },
    });
    if (error) throw new Error(error.error || 'Erro ao deletar usuário');
    return data;
  },

  // ==================== PERFIL ====================
  async getPerfil() {
    const { data, error } = await api.GET('/api/perfil');
    if (error) throw new Error(error.error || 'Erro ao carregar perfil');
    return data;
  },

  async updatePerfil(dados: { nome?: string; instrumento?: string }) {
    const { data, error } = await api.PUT('/api/perfil', {
      body: dados,
    });
    if (error) throw new Error(error.error || 'Erro ao atualizar perfil');
    return data;
  },

  // ==================== REPERTORIO ====================
  async getRepertorioAtivo() {
    const { data, error } = await api.GET('/api/repertorio/ativo');
    if (error) throw new Error(error.error || 'Nenhum repertório ativo');
    return data;
  },

  async getRepertorio(id: number) {
    const { data, error } = await api.GET('/api/repertorio/{id}', {
      params: { path: { id } },
    });
    if (error) throw new Error(error.error || 'Repertório não encontrado');
    return data;
  },

  async getRepertorioInstrumentos(id: number) {
    const { data, error } = await api.GET('/api/repertorio/{id}/instrumentos', {
      params: { path: { id } },
    });
    if (error) throw new Error(error.error || 'Erro ao carregar instrumentos do repertório');
    return data;
  },

  async isPartituraInRepertorioAtivo(partituraId: number) {
    const { data, error } = await api.GET('/api/partituras/{id}/in-repertorio', {
      params: { path: { id: partituraId } },
    });
    if (error) return { in_repertorio: false };
    return data;
  },

  async listRepertorios() {
    const { data, error } = await api.GET('/api/repertorios');
    if (error) throw new Error(error.error || 'Erro ao listar repertórios');
    return data;
  },

  async createRepertorio(dados: { nome: string; descricao?: string }) {
    const { data, error } = await api.POST('/api/repertorios', {
      body: dados,
    });
    if (error) throw new Error(error.error || 'Erro ao criar repertório');
    return data;
  },

  async updateRepertorio(id: number, dados: { nome?: string; descricao?: string; ativo?: number }) {
    const { data, error } = await api.PUT('/api/repertorio/{id}', {
      params: { path: { id } },
      body: dados,
    });
    if (error) throw new Error(error.error || 'Erro ao atualizar repertório');
    return data;
  },

  async deleteRepertorio(id: number) {
    const { data, error } = await api.DELETE('/api/repertorio/{id}', {
      params: { path: { id } },
    });
    if (error) throw new Error(error.error || 'Erro ao deletar repertório');
    return data;
  },

  async addPartituraToRepertorio(repertorioId: number, partituraId: number) {
    const { data, error } = await api.POST('/api/repertorio/{id}/partituras', {
      params: { path: { id: repertorioId } },
      body: { partitura_id: partituraId },
    });
    if (error) throw new Error(error.error || 'Erro ao adicionar partitura ao repertório');
    return data;
  },

  async removePartituraFromRepertorio(repertorioId: number, partituraId: number) {
    const { data, error } = await api.DELETE('/api/repertorio/{repertorioId}/partituras/{partituraId}', {
      params: { path: { repertorioId, partituraId } },
    });
    if (error) throw new Error(error.error || 'Erro ao remover partitura do repertório');
    return data;
  },

  async reorderPartiturasRepertorio(repertorioId: number, ordem: number[]) {
    const { data, error } = await api.PUT('/api/repertorio/{id}/reorder', {
      params: { path: { id: repertorioId } },
      body: { ordem },
    });
    if (error) throw new Error(error.error || 'Erro ao reordenar partituras');
    return data;
  },

  async duplicarRepertorio(id: number) {
    const { data, error } = await api.POST('/api/repertorio/{id}/duplicar', {
      params: { path: { id } },
    });
    if (error) throw new Error(error.error || 'Erro ao duplicar repertório');
    return data;
  },
};

export default ApiTyped;
