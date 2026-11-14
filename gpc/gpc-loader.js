/*
 * GPC Loader - tela de carregamento com a árvore do GPC crescendo de baixo pra cima.
 *
 * COMO USAR (resumo):
 *   1) Coloque gpc-loader.js e arvore-gpc.png na mesma pasta do seu HTML
 *   2) No HTML, antes de </body>:   <script src="gpc-loader.js"></script>
 *   3) Depois que o usuário fizer login, chame:
 *
 *        await GPCLoader.durante(async () => {
 *          // aqui vai a sua chamada ao backend (fetch do login etc.)
 *        });
 *        window.location.href = 'home.html';   // e então vá pra próxima página
 *
 * A árvore cresce enquanto o trabalho acontece e chega a 100% quando ele termina.
 * Ela fica na tela pelo menos 2,5 s pra animação aparecer direito (dá pra mudar).
 */
(function (global) {
  const ID = 'gpc-loader-overlay';
  let overlay, frente, texto, percentual, barra;
  let atual = 0, alvo = 0, raf = null, caminhoImagem = 'arvore-gpc.png';

  const CSS = `
  #${ID}{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;
    background:var(--gpcl-fundo,rgba(255,255,255,.72));-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);
    opacity:0;visibility:hidden;transition:opacity .35s ease,visibility .35s;
    font-family:"Segoe UI",Arial,sans-serif}
  #${ID}.gpcl-on{opacity:1;visibility:visible}
  #${ID} .gpcl-box{text-align:center}
  /* modo padrão: a tela de login continua visível (desfocada) e a logo aparece sozinha por cima */
  #${ID}:not(.gpcl-inline) .gpcl-arvore{width:min(260px,64vw)}
  /* modo "dentro do card": cobre só o formulário, não a página toda */
  #${ID}.gpcl-inline{position:absolute;inset:0;z-index:5;background:var(--gpcl-fundo,#fff);border-radius:inherit;
    -webkit-backdrop-filter:none;backdrop-filter:none}
  #${ID}.gpcl-inline .gpcl-box{width:100%}
  #${ID}.gpcl-inline .gpcl-arvore{width:min(230px,70%);margin-bottom:16px}
  #${ID}.gpcl-inline .gpcl-texto{font-size:.95rem}
  #${ID}.gpcl-inline .gpcl-barra{width:min(200px,70%)}
  #${ID} .gpcl-arvore{position:relative;width:min(300px,68vw);aspect-ratio:458/545;margin:0 auto 22px}
  #${ID} .gpcl-arvore img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
  #${ID} .gpcl-fundo{opacity:.1;filter:grayscale(1)}
  #${ID} .gpcl-frente{--p:0;
    -webkit-mask-image:linear-gradient(to top,#000 0%,#000 33.3%,transparent 50%);
            mask-image:linear-gradient(to top,#000 0%,#000 33.3%,transparent 50%);
    -webkit-mask-size:100% 300%;mask-size:100% 300%;
    -webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;
    -webkit-mask-position:0 calc((.25 + var(--p)*.75)*100%);
            mask-position:0 calc((.25 + var(--p)*.75)*100%)}
  #${ID} .gpcl-texto{color:#0b6b63;font-weight:600;letter-spacing:.08em;font-size:1rem}
  #${ID} .gpcl-texto span{font-variant-numeric:tabular-nums}
  #${ID} .gpcl-barra{width:min(240px,60vw);height:6px;margin:12px auto 0;background:#d6ebe8;border-radius:999px;overflow:hidden}
  #${ID} .gpcl-barra div{height:100%;width:0;background:#0b6b63;border-radius:999px}
  `;

  function criar() {
    if (overlay) return;
    const estilo = document.createElement('style');
    estilo.textContent = CSS;
    document.head.appendChild(estilo);

    overlay = document.createElement('div');
    overlay.id = ID;
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    overlay.innerHTML = `
      <div class="gpcl-box">
        <div class="gpcl-arvore">
          <img class="gpcl-fundo" alt="">
          <img class="gpcl-frente" alt="Logo GPC">
        </div>
        <p class="gpcl-texto"><b class="gpcl-msg">Carregando...</b> <span>0%</span></p>
        <div class="gpcl-barra"><div></div></div>
      </div>`;
    frente = overlay.querySelector('.gpcl-frente');
    texto = overlay.querySelector('.gpcl-msg');
    percentual = overlay.querySelector('.gpcl-texto span');
    barra = overlay.querySelector('.gpcl-barra div');
  }

  function aplicar(p) {
    frente.style.setProperty('--p', p);
    const pct = Math.round(p * 100);
    percentual.textContent = pct + '%';
    barra.style.width = pct + '%';
  }

  // a árvore "persegue" o valor desejado suavemente
  function loop() {
    atual += (alvo - atual) * 0.07;
    if (Math.abs(alvo - atual) < 0.001) atual = alvo;
    aplicar(atual);
    raf = requestAnimationFrame(loop);
  }

  const esperar = ms => new Promise(r => setTimeout(r, ms));

  // devolve o card ao tamanho original quando o loading sai
  let card = null;
  function restaurarCard() {
    if (!card) return;
    card.el.style.minHeight = card.minHeight;
    const { el, transition } = card;
    setTimeout(() => { el.style.transition = transition; }, 450);
    card = null;
  }

  const GPCLoader = {
    /**
     * Mostra o loading. opcoes: { texto, imagem, fundo, dentroDe }
     * dentroDe: um elemento (ou seletor CSS) onde a animação aparece, por exemplo o card
     * do login. Sem isso, a animação cobre a página inteira.
     */
    mostrar(opcoes = {}) {
      criar();
      restaurarCard();
      const alvoEl = typeof opcoes.dentroDe === 'string'
        ? document.querySelector(opcoes.dentroDe) : opcoes.dentroDe;
      if (alvoEl) {
        if (getComputedStyle(alvoEl).position === 'static') alvoEl.style.position = 'relative';
        // o card cresce um pouco, se precisar, pra caber a árvore
        card = { el: alvoEl, minHeight: alvoEl.style.minHeight, transition: alvoEl.style.transition };
        alvoEl.style.transition = 'min-height .4s ease';
        alvoEl.style.minHeight = Math.max(alvoEl.offsetHeight, 430) + 'px';
        overlay.classList.add('gpcl-inline');
        alvoEl.appendChild(overlay);
      } else {
        overlay.classList.remove('gpcl-inline');
        document.body.appendChild(overlay);
      }
      caminhoImagem = opcoes.imagem || caminhoImagem;
      overlay.querySelectorAll('img').forEach(i => (i.src = caminhoImagem));
      texto.textContent = opcoes.texto || 'Carregando...';
      if (opcoes.fundo) overlay.style.setProperty('--gpcl-fundo', opcoes.fundo);
      atual = alvo = 0;
      aplicar(0);
      overlay.classList.add('gpcl-on');
      if (!raf) raf = requestAnimationFrame(loop);
    },

    /** Troca a mensagem mostrada ao lado da porcentagem. */
    setTexto(t) {
      if (texto) texto.textContent = t;
    },

    /** Define o progresso manualmente (0 a 1). */
    setProgresso(p) {
      alvo = Math.max(0, Math.min(1, p));
    },

    /** Esconde o overlay (use se o usuário continuar na mesma página). */
    esconder() {
      if (!overlay) return;
      overlay.classList.remove('gpcl-on');
      restaurarCard();
      setTimeout(() => { cancelAnimationFrame(raf); raf = null; }, 400);
    },

    /**
     * Mostra o loading enquanto 'trabalho' (uma função async ou uma Promise) executa.
     * Devolve o resultado do trabalho. Se der erro, esconde o overlay e repassa o erro.
     * opcoes: { minimo: 2500 (ms), texto: 'Entrando...', imagem: 'arvore-gpc.png', esconderNoFim: false }
     */
    async durante(trabalho, opcoes = {}) {
      const minimo = opcoes.minimo ?? 2500;
      this.mostrar(opcoes);
      const inicio = performance.now();
      // enquanto espera, a árvore sobe devagar até ~90%
      const timer = setInterval(() => {
        const t = performance.now() - inicio;
        this.setProgresso(0.9 * (1 - Math.exp(-t / 1400)));
      }, 100);
      try {
        const resultado = await (typeof trabalho === 'function' ? trabalho() : trabalho);
        const falta = minimo - (performance.now() - inicio);
        if (falta > 0) await esperar(falta);
        clearInterval(timer);
        this.setProgresso(1);
        for (let i = 0; i < 40 && atual < 0.995; i++) await esperar(50);
        await esperar(450);
        if (opcoes.esconderNoFim) this.esconder();
        return resultado;
      } catch (erro) {
        clearInterval(timer);
        this.esconder();
        throw erro;
      }
    },
  };

  global.GPCLoader = GPCLoader;
})(window);
