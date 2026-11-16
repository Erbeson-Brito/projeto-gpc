// Atividade do nó: conteúdo, questões, envio das respostas e resultado (nota 0–100).
(function () {
    const usuario = GPCUI.exigir();
    if (!usuario) return;
    GPCUI.montarCabecalho('trilhas');

    const { h } = GPCUI;
    const raiz = document.getElementById('conteudo');
    const params = new URLSearchParams(location.search);
    const trilhaId = params.get('trilha');
    const noId = params.get('no');
    const info = GPC.buscarNo(trilhaId, noId);

    const naoEncontrado = (titulo, texto, href, rotulo) => raiz.replaceChildren(
        h('h1', {}, titulo),
        h('div', { class: 'vazio' }, h('p', {}, texto), h('a', { class: 'btn btn-pri', href }, rotulo)));

    if (!info) {
        naoEncontrado('Atividade não encontrada', 'Não encontramos essa atividade.', 'trilhas.html', 'Ver trilhas');
        return;
    }

    const voltar = `trilha.html?id=${encodeURIComponent(info.trilha.id)}`;
    const estado = GPC.estadoTrilha(usuario.id, info.trilha.id);
    const noEstado = estado.modulos.flatMap((m) => m.nos).find((n) => n.id === info.no.id);

    if (noEstado.status === 'BLOQUEADO') {
        naoEncontrado('Nó bloqueado', 'Conclua o nó anterior da trilha para liberar esta atividade.', voltar, 'Voltar à trilha');
        return;
    }

    document.title = `${info.no.titulo} · GPC`;
    const nomeCurto = info.trilha.titulo.replace('Desenvolvimento ', '');
    let jaConcluido = noEstado.status === 'CONCLUIDO';

    // ---- conteúdo do nó
    const conteudo = h('section', { class: 'cartao conteudo-no', 'aria-labelledby': 'tit-conteudo' },
        h('h2', { id: 'tit-conteudo' }, 'Conteúdo'),
        info.no.conteudo.map((bloco) => (typeof bloco === 'string'
            ? h('p', {}, bloco)
            : h('pre', { class: 'codigo' }, h('code', {}, bloco.codigo)))));

    // ---- questões
    const inputs = info.no.questoes.map((q, i) => h('input', {
        type: 'text', id: `q${i}`, placeholder: 'Resposta em texto', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false',
        'aria-describedby': 'dica-envio',
    }));
    const blocos = info.no.questoes.map((q, i) => h('div', { class: 'questao' },
        h('label', { for: `q${i}` }, `${i + 1}. ${q.enunciado}`, h('span', { class: 'chip' }, q.dificuldade)),
        inputs[i]));

    const erro = h('p', { class: 'erro-campo', role: 'alert', hidden: true });
    const form = h('form', { novalidate: true },
        blocos, erro,
        h('div', { class: 'acoes-form' },
            h('button', { class: 'btn btn-pri', type: 'submit' }, 'Enviar respostas'),
            h('span', { class: 'sm', id: 'dica-envio' }, 'Responda todas as questões do nó')));
    const questoes = h('section', { class: 'cartao', 'aria-labelledby': 'tit-questoes' }, h('h2', { id: 'tit-questoes' }, 'Questões'), form);

    // ---- resultado
    const resultado = h('section', { class: 'cartao resultado', tabindex: '-1', 'aria-live': 'polite', 'aria-labelledby': 'tit-resultado' });
    function resultadoInicial() {
        resultado.replaceChildren(
            h('h2', { id: 'tit-resultado' }, 'Resultado'),
            h('div', { class: 'linha' },
                h('div', { class: 'nota' + (jaConcluido ? ' ok' : '') }, jaConcluido ? String(noEstado.nota) : '—'),
                h('span', { class: 'sm' }, jaConcluido
                    ? `Você já concluiu este nó (melhor nota: ${noEstado.nota}). Pode refazer quando quiser.`
                    : `Nota ${GPC.NOTA_MINIMA} ou mais: nó concluído. Abaixo disso: tentar novamente.`)));
    }
    resultadoInicial();

    function mostrarResultado(res) {
        const ok = res.aprovado;
        const proxEstado = GPC.estadoTrilha(usuario.id, info.trilha.id);
        const proxNo = info.proximoNo;
        const proxLiberado = proxNo && proxEstado.modulos.flatMap((m) => m.nos).find((n) => n.id === proxNo.id).status !== 'BLOQUEADO';

        const titulo = ok
            ? (jaConcluido ? 'Muito bem! Você acertou o suficiente.' : 'Parabéns! Nó concluído.')
            : 'Quase lá! A nota ficou abaixo de ' + GPC.NOTA_MINIMA + '.';
        const detalhe = ok
            ? (proxLiberado ? 'O próximo nó da trilha já está liberado.' : 'Você chegou ao fim desta trilha.')
            : (res.concluido ? 'Seu progresso neste nó continua salvo como concluído.' : 'Releia o conteúdo e tente novamente.');

        const lista = h('ol', { class: 'feedback' }, res.detalhes.map((d, i) => h('li', { class: d.correta ? 'certa' : 'errada' },
            h('span', { class: 'marca' }, d.correta ? '✓ Correta' : '✗ Incorreta'),
            h('div', {}, `${i + 1}. ${info.no.questoes[i].enunciado}`),
            ok ? h('div', { class: 'explica' }, (d.correta ? '' : `Resposta esperada: ${d.esperada}. `) + d.explicacao) : null)));

        const acoes = h('div', { class: 'acoes-form' },
            ok && proxLiberado ? h('a', { class: 'btn btn-pri', href: `atividade.html?trilha=${encodeURIComponent(info.trilha.id)}&no=${encodeURIComponent(proxNo.id)}` }, 'Próximo nó →') : null,
            !ok ? h('button', { class: 'btn btn-pri', type: 'button', onclick: () => { inputs[0].focus(); inputs[0].select(); } }, 'Tentar novamente') : null,
            h('a', { class: ok && !proxLiberado ? 'btn btn-pri' : 'btn', href: voltar }, 'Voltar à trilha'));

        resultado.replaceChildren(
            h('h2', { id: 'tit-resultado' }, 'Resultado'),
            h('div', { class: 'linha' },
                h('div', { class: 'nota ' + (ok ? 'ok' : 'ruim'), role: 'img', 'aria-label': `Nota ${res.nota} de 100` }, String(res.nota)),
                h('div', { class: 'grow' }, h('p', { class: 'res-titulo' }, titulo), h('p', { class: 'sm' }, detalhe))),
            lista, acoes);

        // marca cada campo como certo/errado
        blocos.forEach((b, i) => {
            b.classList.remove('certa', 'errada');
            b.classList.add(res.detalhes[i].correta ? 'certa' : 'errada');
        });
        resultado.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        resultado.focus({ preventScroll: true });
        if (ok) jaConcluido = true;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        erro.hidden = true;
        const respostas = inputs.map((i) => i.value);
        const vazio = respostas.findIndex((r) => !r.trim());
        if (vazio >= 0) {
            erro.textContent = 'Responda todas as questões do nó antes de enviar.';
            erro.hidden = false;
            inputs[vazio].focus();
            return;
        }
        try {
            mostrarResultado(GPC.enviarRespostas(usuario.id, info.trilha.id, info.no.id, respostas));
        } catch (err) {
            erro.textContent = GPCUI.mensagemDeErro(err);
            erro.hidden = false;
        }
    });

    // limpar a marcação ao editar uma resposta
    inputs.forEach((inp, i) => inp.addEventListener('input', () => blocos[i].classList.remove('certa', 'errada')));

    raiz.replaceChildren(
        h('nav', { class: 'migalhas', 'aria-label': 'Você está em' },
            h('a', { href: voltar }, nomeCurto), ' › ', info.modulo.titulo, ' › ', `Nó ${info.no.ordem}`),
        h('h1', {}, info.no.titulo),
        h('div', {}, GPCUI.chip(noEstado.status)),
        conteudo, questoes, resultado);
})();
