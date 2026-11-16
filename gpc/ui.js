/*
 * ui.js — peças de interface compartilhadas: cabeçalho, avisos (toast), diálogos,
 * proteção de páginas por login/papel e pequenos construtores de elementos.
 * Depende de store.js (objeto global GPC).
 */
(function (global) {
  'use strict';

  /* ------------------------------------------------------ criar elementos */
  // h('div', { class: 'x', onclick: fn }, 'texto', outroElemento, [lista])
  function h(tag, attrs, ...filhos) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === false || v === null || v === undefined) continue;
      if (k === 'class') el.className = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    }
    (function anexar(lista) {
      lista.forEach((f) => {
        if (Array.isArray(f)) anexar(f);
        else if (f === null || f === undefined || f === false) return;
        else el.append(f instanceof Node ? f : document.createTextNode(String(f)));
      });
    })(filhos);
    return el;
  }

  /* ------------------------------------------------------------------ toast */
  const CSS_TOAST = `
  #gpc-toasts{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);display:flex;flex-direction:column;gap:8px;z-index:100000;width:min(92vw,420px);pointer-events:none}
  .gpc-toast{background:#1a2e3a;color:#fff;padding:12px 16px;border-radius:10px;font:14px/1.4 'Montserrat',Arial,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.25);border-left:4px solid #6ed3d9;animation:gpc-toast-in .25s ease}
  .gpc-toast.erro{background:#8f1d1d;border-left-color:#ffb4ab}
  @keyframes gpc-toast-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @media (prefers-reduced-motion:reduce){.gpc-toast{animation:none}}`;
  let areaToast = null;

  function toast(mensagem, tipo) {
    if (!areaToast) {
      const estilo = document.createElement('style');
      estilo.textContent = CSS_TOAST;
      document.head.appendChild(estilo);
      areaToast = h('div', { id: 'gpc-toasts', role: 'status', 'aria-live': 'polite' });
      document.body.appendChild(areaToast);
    }
    const t = h('div', { class: 'gpc-toast' + (tipo === 'erro' ? ' erro' : '') }, mensagem);
    areaToast.appendChild(t);
    setTimeout(() => t.remove(), tipo === 'erro' ? 6000 : 4000);
  }

  // Guarda um aviso para aparecer na PRÓXIMA página (útil antes de redirecionar)
  function avisoProximaPagina(mensagem, tipo) {
    try { sessionStorage.setItem('gpc:aviso', JSON.stringify({ mensagem, tipo: tipo || 'ok' })); } catch (e) { /* sem aviso */ }
  }
  function mostrarAvisoPendente() {
    try {
      const bruto = sessionStorage.getItem('gpc:aviso');
      if (!bruto) return;
      sessionStorage.removeItem('gpc:aviso');
      const a = JSON.parse(bruto);
      toast(a.mensagem, a.tipo);
    } catch (e) { /* ignora */ }
  }

  /* -------------------------------------------------------- acesso / guardas */
  const paginaAtual = () => (location.pathname.split('/').pop() || 'index.html') + location.search;

  // Garante login (e, opcionalmente, um papel). Devolve o usuário ou null (já redirecionando).
  function exigir(opcoes) {
    const papel = opcoes && opcoes.papel;
    const u = GPC.usuarioAtual();
    if (!u) {
      location.replace('login.html?next=' + encodeURIComponent(paginaAtual()));
      return null;
    }
    if (papel && !GPC.temPapel(u, papel)) {
      avisoProximaPagina('Você não tem permissão para acessar essa página.', 'erro');
      location.replace('index.html');
      return null;
    }
    return u;
  }

  const primeiroNome = (u) => u.nome.split(' ')[0];

  function linksDoUsuario(u) {
    if (GPC.temPapel(u, 'ADMINISTRADOR')) {
      return [['Início', 'index.html', 'inicio'], ['Pedidos pendentes', 'admin-pedidos.html', 'pedidos'], ['Usuários', 'admin-usuarios.html', 'usuarios']];
    }
    return [['Trilhas', 'trilhas.html', 'trilhas'], ['Perfil', 'perfil.html', 'perfil'], ['Perfil profissional', 'perfil-profissional.html', 'profissional']];
  }

  function sairDaConta(evento) {
    if (evento) evento.preventDefault();
    GPC.sair();
    location.href = 'login.html';
  }

  // Cabeçalho das páginas internas (app.css)
  function montarCabecalho(ativo) {
    const u = GPC.usuarioAtual();
    const destino = document.getElementById('cabecalho');
    if (!destino || !u) return;
    destino.replaceChildren(
      h('a', { class: 'pular', href: '#conteudo' }, 'Ir para o conteúdo'),
      h('header', { class: 'app-cab' },
        h('div', { class: 'app-cab-in' },
          h('a', { class: 'app-logo', href: 'index.html' }, h('img', { src: 'midia/GPClogo.png', alt: 'GPC — página inicial' })),
          h('nav', { class: 'app-nav', 'aria-label': 'Principal' },
            linksDoUsuario(u).map(([texto, href, chave]) => h('a', { href, 'aria-current': chave === ativo ? 'page' : false }, texto))),
          h('button', { class: 'btn btn-pri', type: 'button', onclick: sairDaConta }, `Sair (${primeiroNome(u)})`))));
  }

  // Cabeçalho das páginas "públicas" (index e trilhas), que têm o próprio visual
  function ajustarCabecalhoPublico(u) {
    const btn = document.getElementById('btnConta');
    if (!btn || !u) return;
    const nav = btn.parentElement;
    linksDoUsuario(u)
      .filter(([, href]) => !['index.html', 'trilhas.html'].includes(href))
      .forEach(([texto, href]) => nav.insertBefore(h('a', { class: 'nav-extra', href }, texto), btn));
    btn.textContent = `Sair (${primeiroNome(u)})`;
    btn.href = '#';
    btn.addEventListener('click', sairDaConta);
  }

  /* ---------------------------------------------------------------- pedaços */
  const ROTULO_STATUS = {
    CONCLUIDO: ['ok', 'CONCLUÍDO'], DISPONIVEL: ['disp', 'DISPONÍVEL'], BLOQUEADO: ['lk', 'BLOQUEADO'],
    PENDENTE: ['pend', 'PENDENTE'], APROVADO: ['ok', 'APROVADO'], REJEITADO: ['neg', 'REJEITADO'],
    ATIVA: ['ok', 'ATIVA'], INATIVA: ['lk', 'INATIVA'],
  };
  function chip(status, texto) {
    const [classe, rotulo] = ROTULO_STATUS[status] || ['', status];
    return h('span', { class: `chip ${classe}` }, texto || rotulo);
  }
  const chipPapel = (papel) => h('span', { class: 'chip papel' }, papel);

  function barra(pct, rotulo) {
    return h('div', { class: 'barra', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': pct, 'aria-label': rotulo || 'Progresso' },
      h('div', { style: `width:${pct}%` }));
  }

  function mensagemDeErro(e) {
    if (e instanceof GPC.Erro) return e.message;
    console.error(e);
    return 'Algo deu errado. Tente novamente.';
  }

  /* --------------------------------------------------------------- diálogos */
  /**
   * Abre um diálogo modal. Devolve uma Promise com o valor retornado por aoConfirmar
   * (ou true) quando confirmado, e null se o usuário cancelar.
   * aoConfirmar pode lançar GPC.Erro para mostrar a mensagem dentro do diálogo sem fechá-lo.
   */
  function dialogo({ titulo, corpo, rotuloConfirmar = 'Confirmar', perigo = false, aoConfirmar }) {
    return new Promise((resolve) => {
      let resultado = null;
      const idTitulo = 'dlg-titulo-' + Math.random().toString(36).slice(2, 8);
      const erro = h('p', { class: 'erro-campo', role: 'alert', hidden: true });
      const cancelar = h('button', { class: 'btn', type: 'button', autofocus: perigo, onclick: () => dlg.close() }, 'Cancelar');
      const form = h('form', { class: 'dlg-form', novalidate: true },
        h('h2', { id: idTitulo }, titulo), corpo, erro,
        h('div', { class: 'dlg-acoes' }, cancelar,
          h('button', { class: perigo ? 'btn btn-perigo-pri' : 'btn btn-pri', type: 'submit' }, rotuloConfirmar)));
      const dlg = h('dialog', { class: 'dlg', 'aria-labelledby': idTitulo }, form);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        try {
          const r = aoConfirmar ? aoConfirmar() : true;
          resultado = r === undefined ? true : r;
          dlg.close();
        } catch (err) {
          erro.textContent = mensagemDeErro(err);
          erro.hidden = false;
        }
      });
      dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
      dlg.addEventListener('close', () => { dlg.remove(); resolve(resultado); });
      document.body.appendChild(dlg);
      dlg.showModal();
    });
  }

  const confirmar = ({ titulo, mensagem, rotulo = 'Confirmar', perigo = false }) =>
    dialogo({ titulo, corpo: h('p', { class: 'dlg-texto' }, mensagem), rotuloConfirmar: rotulo, perigo }).then(Boolean);

  document.addEventListener('DOMContentLoaded', mostrarAvisoPendente);

  global.GPCUI = {
    h, toast, avisoProximaPagina, exigir, montarCabecalho, ajustarCabecalhoPublico,
    chip, chipPapel, barra, dialogo, confirmar, mensagemDeErro, primeiroNome,
  };
})(window);
