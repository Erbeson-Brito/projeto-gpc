// Cliente HTTP do backend Spring Boot local.
(function (global) {
  'use strict';
  const BASE = global.GPC_API_URL || 'http://localhost:8080';
  const SESSION_KEY = 'gpc:usuario-api';

  async function request(path, options = {}) {
    let response;
    try {
      response = await fetch(`${BASE}${path}`, {
        ...options,
        headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
      });
    } catch (_) {
      throw new global.GPC.Erro(`Não foi possível conectar à API em ${BASE}. Confirme se o backend está rodando.`);
    }
    if (response.status === 204) return null;
    const text = await response.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch (_) { data = text; }
    if (!response.ok) {
      const message = typeof data === 'string' ? data : data?.message || data?.error || `Erro HTTP ${response.status}`;
      throw new global.GPC.Erro(message);
    }
    return data;
  }

  const json = (method, body) => ({ method, body: JSON.stringify(body) });
  const adaptUser = (u) => u && ({ id: Number(u.id), nome: u.nome, email: u.email, papeis: (u.papeis || []).map(p => p === 'ADMIN' ? 'ADMINISTRADOR' : p), status: u.statusConta || 'ATIVA', objetivo: '', nivel: 'Iniciante', criadoEm: u.dataCriacao || null });
  const adaptVerification = (v, usuario) => ({ id: Number(v.id), usuarioId: Number(v.usuarioId), tipo: v.tipoPerfil, status: v.status, solicitadoEm: v.dataSolicitacao, analisadoEm: v.dataAnalise, nome: usuario?.nome || `Usuário #${v.usuarioId}`, email: usuario?.email || '—' });
  function session() { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (_) { return null; } }
  function saveSession(user) { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); return user; }

  const api = {
    adaptUser,
    usuarioAtual() { return session(); },
    async cadastrar(dados) { return saveSession(adaptUser(await request('/api/usuarios', json('POST', dados)))); },
    async entrar(email, senha) { return saveSession(adaptUser(await request('/api/auth/login', json('POST', { email, senha })))); },
    sair() { localStorage.removeItem(SESSION_KEY); },
    // Recuperação de senha
    async esqueciSenha(email) { return request('/api/auth/esqueci-senha', json('POST', { email })); },
    async validarTokenSenha(token) { return request(`/api/auth/redefinir-senha/validar?token=${encodeURIComponent(token)}`); },
    async redefinirSenha(token, novaSenha) { return request('/api/auth/redefinir-senha', json('POST', { token, novaSenha })); },
    async atualizarConta(id, dados) { const u = adaptUser(await request(`/api/usuarios/${id}`, json('PUT', dados))); saveSession(u); return u; },
    async listarUsuarios() { return (await request('/api/usuarios')).map(adaptUser); },
    async excluirUsuario(id) { await request(`/api/usuarios/${id}`, { method: 'DELETE' }); if (Number(session()?.id) === Number(id)) api.sair(); },
    async solicitarPerfil(usuarioId, tipo) { return adaptVerification(await request(`/api/verificacoes/usuario/${usuarioId}`, json('POST', { tipoPerfil: tipo }))); },
    async minhasVerificacoes(usuarioId) { return (await request(`/api/verificacoes/usuario/${usuarioId}`)).map(v => adaptVerification(v)); },
    async pendentes() {
      const [pedidos, usuarios] = await Promise.all([request('/api/verificacoes/pendentes'), request('/api/usuarios')]);
      const porId = new Map(usuarios.map(u => [Number(u.id), u]));
      return pedidos.map(v => adaptVerification(v, porId.get(Number(v.usuarioId))));
    },
    async decidirVerificacao(id, aprovar, adminId) {
      const acao = aprovar ? 'aprovar' : 'rejeitar';
      return adaptVerification(await request(`/api/verificacoes/${id}/${acao}?adminId=${encodeURIComponent(adminId)}`, { method: 'PUT' }));
    },
  };
  global.GPCAPI = api;
})(window);
