// worker/src/routes/router.js
import { getCorsHeaders } from '../infrastructure/security/cors.js';
import { errorResponse } from '../infrastructure/response/helpers.js';

/**
 * Router modular para Cloudflare Workers
 *
 * Suporta:
 * - Registro de rotas por method + path
 * - Path params (/api/partituras/:id)
 * - Middleware pipeline
 * - CORS preflight automático
 */
export class Router {
  constructor() {
    this.routes = [];
    this.globalMiddleware = [];
  }

  /**
   * Registra middleware global (executa para todas as rotas)
   * @param {Function} middleware - (request, env, next) => Response | Promise<Response>
   */
  use(middleware) {
    this.globalMiddleware.push(middleware);
  }

  /**
   * Registra uma rota
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param {string} path - Caminho da rota (pode conter :param)
   * @param {Function} handler - (request, env, params) => Response | Promise<Response>
   * @param {Array} middleware - Array de middleware específicos da rota
   */
  register(method, path, handler, middleware = []) {
    // Converter path com params para regex
    const paramNames = [];
    const regexPath = path.replace(/:([a-z0-9_]+)/gi, (match, paramName) => {
      paramNames.push(paramName);
      return '([^/]+)';
    });

    const regex = new RegExp(`^${regexPath}$`);

    this.routes.push({
      method: method.toUpperCase(),
      path,
      regex,
      paramNames,
      handler,
      middleware
    });
  }

  /**
   * Atalhos para métodos HTTP
   */
  get(path, handler, middleware = []) {
    this.register('GET', path, handler, middleware);
  }

  post(path, handler, middleware = []) {
    this.register('POST', path, handler, middleware);
  }

  put(path, handler, middleware = []) {
    this.register('PUT', path, handler, middleware);
  }

  delete(path, handler, middleware = []) {
    this.register('DELETE', path, handler, middleware);
  }

  /**
   * Extrai path params da URL
   * @param {RegExp} regex - Regex da rota
   * @param {Array} paramNames - Nomes dos parâmetros
   * @param {string} pathname - Pathname da URL
   * @returns {Object} - Objeto com params extraídos
   */
  extractParams(regex, paramNames, pathname) {
    const match = pathname.match(regex);
    if (!match) return {};

    const params = {};
    paramNames.forEach((name, index) => {
      params[name] = match[index + 1];
    });

    return params;
  }

  /**
   * Executa middleware pipeline
   * @param {Array} middlewareList - Lista de middleware
   * @param {Request} request - Request
   * @param {Object} env - Environment bindings
   * @param {Object} context - Contexto compartilhado entre middleware
   * @returns {Response|null} - Response se middleware interceptar, null caso contrário
   */
  async executeMiddleware(middlewareList, request, env, context = {}) {
    for (const middleware of middlewareList) {
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };

      const result = await middleware(request, env, next, context);

      // Se middleware retornou Response, parar pipeline
      if (result instanceof Response) {
        return result;
      }

      // Se next() não foi chamado e não retornou Response, bloquear
      if (!nextCalled && !result) {
        return errorResponse('Acesso negado', 403, request);
      }
    }

    return null; // Pipeline completo, continuar para handler
  }

  /**
   * Processa requisição
   * @param {Request} request - Request
   * @param {Object} env - Environment bindings
   * @returns {Response} - Response
   */
  async handle(request, env) {
    // CORS preflight automático
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request)
      });
    }

    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method.toUpperCase();

    try {
      // Buscar rota correspondente
      const route = this.routes.find(r => {
        return r.method === method && r.regex.test(pathname);
      });

      if (!route) {
        return errorResponse('Endpoint não encontrado', 404, request);
      }

      // Extrair path params
      const params = this.extractParams(route.regex, route.paramNames, pathname);

      // Contexto compartilhado entre middleware
      const context = { params };

      // Executar middleware global
      const globalResult = await this.executeMiddleware(
        this.globalMiddleware,
        request,
        env,
        context
      );

      if (globalResult) {
        return globalResult;
      }

      // Executar middleware específico da rota
      const routeResult = await this.executeMiddleware(
        route.middleware,
        request,
        env,
        context
      );

      if (routeResult) {
        return routeResult;
      }

      // Executar handler da rota
      const response = await route.handler(request, env, params, context);

      return response;

    } catch (error) {
      console.error('Router error:', error);
      return errorResponse('Erro interno do servidor', 500, request);
    }
  }
}
