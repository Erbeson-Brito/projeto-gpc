/*
 * store.js — o "backend" do GPC rodando no navegador.
 *
 * Tudo é salvo no localStorage (chave "gpc:db"), então cada navegador tem os seus próprios dados.
 * Regras de negócio (cadastro, login, trilhas, correção, pedidos de perfil profissional)
 * ficam aqui; as páginas só chamam estas funções e desenham a tela.
 *
 * IMPORTANTE: como não existe servidor, isto é uma simulação para o projeto/apresentação.
 * A senha é guardada com hash + salt, mas qualquer pessoa com acesso ao navegador consegue
 * ler os dados. Num sistema real, esta parte volta para o backend.
 */
(function (global) {
  'use strict';

  const CHAVE_DB = 'gpc:db';
  const CHAVE_SESSAO = 'gpc:sessao';
  const NOTA_MINIMA = 60;
  const PAPEIS_PROFISSIONAIS = ['PROFESSOR', 'TUTOR', 'RECRUTADOR'];
  const NIVEIS = ['Iniciante', 'Intermediário', 'Sênior'];
  const ADMIN_EMAIL = 'admin@gpc.com';
  const ADMIN_SENHA = 'admin123';
  const ROTULOS = { ALUNO: 'Aluno', PROFESSOR: 'Professor', TUTOR: 'Tutor', RECRUTADOR: 'Recrutador', ADMINISTRADOR: 'Administrador' };

  class ErroGPC extends Error {}

  /* ------------------------------------------------------------ armazenamento */
  const memoria = {};
  let usaDisco = true;
  try {
    localStorage.setItem('gpc:teste', '1');
    localStorage.removeItem('gpc:teste');
  } catch (e) {
    usaDisco = false; // navegação privada/bloqueio: os dados duram só enquanto a aba estiver aberta
  }
  const disco = {
    ler(k) { return usaDisco ? localStorage.getItem(k) : (k in memoria ? memoria[k] : null); },
    gravar(k, v) { if (usaDisco) localStorage.setItem(k, v); else memoria[k] = v; },
    apagar(k) { if (usaDisco) localStorage.removeItem(k); else delete memoria[k]; },
  };

  /* --------------------------------------------------------------- SHA-256 */
  const K = new Uint32Array(64);
  const H0 = new Uint32Array(8);
  (function constantes() {
    let n = 0;
    for (let c = 2; n < 64; c++) {
      let primo = true;
      for (let d = 2; d * d <= c; d++) if (c % d === 0) { primo = false; break; }
      if (!primo) continue;
      if (n < 8) H0[n] = Math.floor((Math.pow(c, 0.5) % 1) * 4294967296);
      K[n] = Math.floor((Math.pow(c, 1 / 3) % 1) * 4294967296);
      n++;
    }
  })();

  function sha256(texto) {
    const bytes = new TextEncoder().encode(texto);
    const len = bytes.length;
    const total = ((len + 9 + 63) >> 6) << 6;
    const buf = new Uint8Array(total);
    buf.set(bytes);
    buf[len] = 0x80;
    const dv = new DataView(buf.buffer);
    dv.setUint32(total - 8, Math.floor((len * 8) / 4294967296));
    dv.setUint32(total - 4, (len * 8) >>> 0);
    const h = Uint32Array.from(H0);
    const w = new Uint32Array(64);
    const rr = (x, n) => (x >>> n) | (x << (32 - n));
    for (let off = 0; off < total; off += 64) {
      for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
      for (let i = 16; i < 64; i++) {
        const s0 = rr(w[i - 15], 7) ^ rr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rr(w[i - 2], 17) ^ rr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }
      let [a, b, c, d, e, f, g, hh] = h;
      for (let i = 0; i < 64; i++) {
        const S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25);
        const ch = (e & f) ^ (~e & g);
        const t1 = (hh + S1 + ch + K[i] + w[i]) >>> 0;
        const S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22);
        const mj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + mj) >>> 0;
        hh = g; g = f; f = e; e = (d + t1) >>> 0;
        d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      const novo = [a, b, c, d, e, f, g, hh];
      for (let i = 0; i < 8; i++) h[i] = (h[i] + novo[i]) >>> 0;
    }
    return Array.from(h, (x) => x.toString(16).padStart(8, '0')).join('');
  }

  function aleatorio(n = 16) {
    const v = new Uint8Array(n);
    if (global.crypto && crypto.getRandomValues) crypto.getRandomValues(v);
    else for (let i = 0; i < n; i++) v[i] = Math.floor(Math.random() * 256);
    return Array.from(v, (x) => x.toString(16).padStart(2, '0')).join('');
  }

  /* ----------------------------------------------------------------- banco */
  const agora = () => new Date().toISOString();

  function semente() {
    const salt = aleatorio();
    return {
      versao: 1,
      seq: { usuario: 1, verificacao: 0 },
      usuarios: [{
        id: 1, nome: 'Administrador', email: ADMIN_EMAIL, salt, hash: sha256(salt + ADMIN_SENHA),
        papeis: ['ADMINISTRADOR'], status: 'ATIVA', objetivo: '', nivel: 'Iniciante', criadoEm: agora(),
      }],
      progresso: {},
      verificacoes: [],
    };
  }

  function carregar() {
    let d = null;
    try { d = JSON.parse(disco.ler(CHAVE_DB)); } catch (e) { d = null; }
    if (!d || d.versao !== 1) { d = semente(); salvar(d); }
    return d;
  }
  function salvar(d) { disco.gravar(CHAVE_DB, JSON.stringify(d)); }

  const publico = (u) => (u ? { id: u.id, nome: u.nome, email: u.email, papeis: u.papeis.slice(), status: u.status, objetivo: u.objetivo || '', nivel: u.nivel || 'Iniciante', criadoEm: u.criadoEm } : null);
  const achar = (d, id) => d.usuarios.find((u) => u.id === Number(id));

  /* ------------------------------------------------------------ validações */
  const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  function vNome(n) {
    n = String(n || '').trim().replace(/\s+/g, ' ');
    if (n.length < 2) throw new ErroGPC('Informe seu nome completo.');
    if (n.length > 80) throw new ErroGPC('O nome pode ter no máximo 80 caracteres.');
    return n;
  }
  function vEmail(e) {
    e = String(e || '').trim().toLowerCase();
    if (!emailOk(e)) throw new ErroGPC('Informe um e-mail válido.');
    return e;
  }
  function vSenha(s) {
    s = String(s || '');
    if (s.length < 6) throw new ErroGPC('A senha precisa ter pelo menos 6 caracteres.');
    return s;
  }
  function vEmailLivre(d, email, ignorarId) {
    if (d.usuarios.some((u) => u.email === email && u.id !== ignorarId)) throw new ErroGPC('Já existe uma conta com esse e-mail.');
  }
  const adminsAtivos = (d) => d.usuarios.filter((u) => u.papeis.includes('ADMINISTRADOR') && u.status === 'ATIVA');

  /* ---------------------------------------------------------------- sessão */
  function usuarioAtual() {
    const id = Number(disco.ler(CHAVE_SESSAO));
    if (!id) return null;
    const u = achar(carregar(), id);
    if (!u || u.status !== 'ATIVA') { disco.apagar(CHAVE_SESSAO); return null; }
    return publico(u);
  }
  const temPapel = (u, papel) => !!u && u.papeis.includes(papel);

  function cadastrar({ nome, email, senha }) {
    const d = carregar();
    nome = vNome(nome); email = vEmail(email); senha = vSenha(senha);
    vEmailLivre(d, email);
    const salt = aleatorio();
    const u = {
      id: ++d.seq.usuario, nome, email, salt, hash: sha256(salt + senha),
      papeis: ['ALUNO'], status: 'ATIVA', objetivo: '', nivel: 'Iniciante', criadoEm: agora(),
    };
    d.usuarios.push(u);
    salvar(d);
    disco.gravar(CHAVE_SESSAO, String(u.id));
    return publico(u);
  }

  function entrar(email, senha) {
    const d = carregar();
    email = String(email || '').trim().toLowerCase();
    const u = d.usuarios.find((x) => x.email === email);
    if (!u || u.hash !== sha256(u.salt + String(senha || ''))) throw new ErroGPC('E-mail ou senha inválidos.');
    if (u.status !== 'ATIVA') throw new ErroGPC('Esta conta está inativa. Fale com um administrador.');
    disco.gravar(CHAVE_SESSAO, String(u.id));
    return publico(u);
  }

  function sair() { disco.apagar(CHAVE_SESSAO); }

  /* -------------------------------------------------------------- usuários */
  function atualizarConta(id, { nome, email }) {
    const d = carregar();
    const u = achar(d, id);
    if (!u) throw new ErroGPC('Usuário não encontrado.');
    nome = vNome(nome); email = vEmail(email);
    vEmailLivre(d, email, u.id);
    u.nome = nome; u.email = email;
    salvar(d);
    return publico(u);
  }

  function atualizarAluno(id, { objetivo, nivel }) {
    const d = carregar();
    const u = achar(d, id);
    if (!u) throw new ErroGPC('Usuário não encontrado.');
    objetivo = String(objetivo || '').trim().replace(/\s+/g, ' ');
    if (objetivo.length > 120) throw new ErroGPC('O objetivo pode ter no máximo 120 caracteres.');
    if (!NIVEIS.includes(nivel)) throw new ErroGPC('Escolha um nível de experiência válido.');
    u.objetivo = objetivo; u.nivel = nivel;
    salvar(d);
    return publico(u);
  }

  function listarUsuarios() {
    return carregar().usuarios.map(publico).sort((a, b) => a.id - b.id);
  }

  // Edição feita por um administrador (nome, e-mail e status)
  function editarUsuario(id, { nome, email, status }, porId) {
    const d = carregar();
    const u = achar(d, id);
    if (!u) throw new ErroGPC('Usuário não encontrado.');
    nome = vNome(nome); email = vEmail(email);
    if (!['ATIVA', 'INATIVA'].includes(status)) throw new ErroGPC('Status inválido.');
    vEmailLivre(d, email, u.id);
    if (status === 'INATIVA' && u.status === 'ATIVA' && u.papeis.includes('ADMINISTRADOR')) {
      if (u.id === Number(porId)) throw new ErroGPC('Você não pode desativar a sua própria conta.');
      if (adminsAtivos(d).length <= 1) throw new ErroGPC('Não é possível desativar o último administrador.');
    }
    u.nome = nome; u.email = email; u.status = status;
    salvar(d);
    return publico(u);
  }

  function excluirUsuario(id) {
    const d = carregar();
    const u = achar(d, id);
    if (!u) throw new ErroGPC('Usuário não encontrado.');
    if (u.papeis.includes('ADMINISTRADOR') && u.status === 'ATIVA' && adminsAtivos(d).length <= 1) {
      throw new ErroGPC('Não é possível excluir o último administrador.');
    }
    d.usuarios = d.usuarios.filter((x) => x.id !== u.id);
    delete d.progresso[u.id];
    d.verificacoes = d.verificacoes.filter((v) => v.usuarioId !== u.id);
    salvar(d);
    if (Number(disco.ler(CHAVE_SESSAO)) === u.id) disco.apagar(CHAVE_SESSAO);
  }

  /* ----------------------------------------------------------------- trilhas */
  const trilhas = () => global.GPC_TRILHAS;
  const trilha = (id) => trilhas().find((t) => t.id === id) || null;

  function sequencia(t) {
    const lista = [];
    t.modulos.forEach((m) => m.nos.forEach((n) => lista.push({ modulo: m, no: n })));
    return lista;
  }

  // Estado completo de uma trilha para um usuário: módulos, nós, status e progresso
  function estadoTrilha(usuarioId, trilhaId) {
    const t = trilha(trilhaId);
    if (!t) return null;
    const prog = carregar().progresso[usuarioId] || {};
    const seq = sequencia(t);
    const feito = (n) => !!(prog[n.id] && prog[n.id].concluido);
    const estadoNo = {};
    seq.forEach((item, i) => {
      const prev = i > 0 ? seq[i - 1] : null;
      const liberado = !prev || feito(prev.no);
      const status = feito(item.no) ? 'CONCLUIDO' : liberado ? 'DISPONIVEL' : 'BLOQUEADO';
      let requer = null;
      if (prev) requer = !liberado && prev.modulo.id !== item.modulo.id ? 'Módulo anterior pendente' : `Requer: ${prev.no.titulo}`;
      const reg = prog[item.no.id];
      estadoNo[item.no.id] = {
        id: item.no.id, titulo: item.no.titulo, ordem: item.no.ordem, status, requer,
        nota: reg ? reg.melhorNota : null, tentativas: reg ? reg.tentativas : 0,
      };
    });
    const modulos = t.modulos.map((m) => {
      const nos = m.nos.map((n) => estadoNo[n.id]);
      const concluidos = nos.filter((n) => n.status === 'CONCLUIDO').length;
      const status = concluidos === nos.length ? 'CONCLUIDO' : nos[0].status === 'BLOQUEADO' ? 'BLOQUEADO' : 'DISPONIVEL';
      return { id: m.id, titulo: m.titulo, ordem: m.ordem, status, nos, concluidos, total: nos.length };
    });
    const total = seq.length;
    const concluidos = seq.filter((i) => feito(i.no)).length;
    const proximo = seq.find((i) => estadoNo[i.no.id].status === 'DISPONIVEL');
    return {
      trilha: { id: t.id, titulo: t.titulo, descricao: t.descricao },
      modulos, total, concluidos,
      pct: total ? Math.round((concluidos / total) * 100) : 0,
      completa: concluidos === total,
      proximoNoId: proximo ? proximo.no.id : null,
    };
  }

  function resumoTrilhas(usuarioId) {
    return trilhas().map((t) => {
      const e = estadoTrilha(usuarioId, t.id);
      return { id: t.id, titulo: t.titulo, total: e.total, concluidos: e.concluidos, pct: e.pct, proximoNoId: e.proximoNoId, completa: e.completa };
    });
  }

  // Conteúdo de um nó + vizinhos (para navegação e breadcrumb)
  function buscarNo(trilhaId, noId) {
    const t = trilha(trilhaId);
    if (!t) return null;
    const seq = sequencia(t);
    const i = seq.findIndex((x) => x.no.id === noId);
    if (i < 0) return null;
    return {
      trilha: t, modulo: seq[i].modulo, no: seq[i].no,
      proximoNo: i + 1 < seq.length ? seq[i + 1].no : null,
    };
  }

  /* ---------------------------------------------------------------- correção */
  function normalizar(texto) {
    return String(texto == null ? '' : texto)
      .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, ' ').trim().replace(/[.;,]+$/, '');
  }

  function corrigir(questao, resposta) {
    const r = normalizar(resposta);
    if (!r) return false;
    const porChave = (questao.chaves || []).some((grupo) => grupo.every((p) => r.includes(normalizar(p))));
    if (porChave) return true;
    return (questao.padroes || []).some((p) => new RegExp(p).test(r));
  }

  function enviarRespostas(usuarioId, trilhaId, noId, respostas) {
    const info = buscarNo(trilhaId, noId);
    if (!info) throw new ErroGPC('Nó não encontrado.');
    const estado = estadoTrilha(usuarioId, trilhaId);
    const noEstado = estado.modulos.flatMap((m) => m.nos).find((n) => n.id === noId);
    if (noEstado.status === 'BLOQUEADO') throw new ErroGPC('Este nó ainda está bloqueado. Conclua o nó anterior primeiro.');
    const qs = info.no.questoes;
    if (!Array.isArray(respostas) || respostas.length !== qs.length || respostas.some((r) => !String(r || '').trim())) {
      throw new ErroGPC('Responda todas as questões do nó.');
    }
    const detalhes = qs.map((q, i) => ({ correta: corrigir(q, respostas[i]), esperada: q.esperada, explicacao: q.explicacao }));
    const acertos = detalhes.filter((x) => x.correta).length;
    const nota = Math.round((acertos / qs.length) * 100);
    const aprovado = nota >= NOTA_MINIMA;

    const d = carregar();
    const prog = (d.progresso[usuarioId] = d.progresso[usuarioId] || {});
    const reg = (prog[noId] = prog[noId] || { tentativas: 0, melhorNota: 0, concluido: false });
    reg.tentativas += 1;
    reg.melhorNota = Math.max(reg.melhorNota, nota);
    reg.ultimaNota = nota;
    reg.ultimaEm = agora();
    if (aprovado && !reg.concluido) { reg.concluido = true; reg.concluidoEm = agora(); }
    salvar(d);
    return { nota, aprovado, detalhes, melhorNota: reg.melhorNota, concluido: reg.concluido, tentativas: reg.tentativas };
  }

  /* ----------------------------------------------------- perfis profissionais */
  function solicitarPerfil(usuarioId, tipo) {
    if (!PAPEIS_PROFISSIONAIS.includes(tipo)) throw new ErroGPC('Escolha o tipo de perfil que deseja solicitar.');
    const d = carregar();
    const u = achar(d, usuarioId);
    if (!u) throw new ErroGPC('Usuário não encontrado.');
    if (u.papeis.includes(tipo)) throw new ErroGPC(`Você já possui o perfil de ${ROTULOS[tipo]}.`);
    if (d.verificacoes.some((v) => v.usuarioId === u.id && v.tipo === tipo && v.status === 'PENDENTE')) {
      throw new ErroGPC(`Você já tem um pedido pendente para ${ROTULOS[tipo]}.`);
    }
    const v = { id: ++d.seq.verificacao, usuarioId: u.id, tipo, status: 'PENDENTE', solicitadoEm: agora(), analisadoEm: null, analisadoPor: null };
    d.verificacoes.push(v);
    salvar(d);
    return v;
  }

  const minhasVerificacoes = (usuarioId) => carregar().verificacoes
    .filter((v) => v.usuarioId === Number(usuarioId))
    .sort((a, b) => b.solicitadoEm.localeCompare(a.solicitadoEm) || b.id - a.id);

  function pendentes() {
    const d = carregar();
    return d.verificacoes
      .filter((v) => v.status === 'PENDENTE')
      .sort((a, b) => a.solicitadoEm.localeCompare(b.solicitadoEm) || a.id - b.id)
      .map((v) => {
        const u = achar(d, v.usuarioId);
        return { ...v, nome: u ? u.nome : '(usuário removido)', email: u ? u.email : '—' };
      });
  }

  function decidirVerificacao(id, aprovar, adminId) {
    const d = carregar();
    const v = d.verificacoes.find((x) => x.id === Number(id));
    if (!v) throw new ErroGPC('Pedido não encontrado.');
    if (v.status !== 'PENDENTE') throw new ErroGPC('Este pedido já foi analisado.');
    v.status = aprovar ? 'APROVADO' : 'REJEITADO';
    v.analisadoEm = agora();
    v.analisadoPor = Number(adminId) || null;
    if (aprovar) {
      const u = achar(d, v.usuarioId);
      if (u && !u.papeis.includes(v.tipo)) u.papeis.push(v.tipo);
    }
    salvar(d);
    return v;
  }

  /* ------------------------------------------------------------------ extras */
  function redefinirTudo() {
    disco.apagar(CHAVE_DB);
    disco.apagar(CHAVE_SESSAO);
    carregar();
  }

  const fmtData = (iso) => (iso ? new Date(iso).toLocaleDateString('pt-BR') : '—');
  const rotulo = (papel) => ROTULOS[papel] || papel;

  global.GPC = {
    Erro: ErroGPC, NOTA_MINIMA, PAPEIS_PROFISSIONAIS, NIVEIS, ADMIN_EMAIL, ADMIN_SENHA,
    usuarioAtual, temPapel, cadastrar, entrar, sair,
    atualizarConta, atualizarAluno, listarUsuarios, editarUsuario, excluirUsuario,
    trilhas, trilha, estadoTrilha, resumoTrilhas, buscarNo, enviarRespostas,
    solicitarPerfil, minhasVerificacoes, pendentes, decidirVerificacao,
    redefinirTudo, fmtData, rotulo,
    _teste: { sha256, normalizar, corrigir },
  };
})(window);
