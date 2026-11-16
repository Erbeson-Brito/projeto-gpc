// Trilha: módulos, nós, status (concluído / disponível / bloqueado) e progresso do aluno.
(function () {
    const usuario = GPCUI.exigir();
    if (!usuario) return;
    GPCUI.montarCabecalho('trilhas');

    const { h } = GPCUI;
    const raiz = document.getElementById('conteudo');
    const id = new URLSearchParams(location.search).get('id');
    const estado = GPC.estadoTrilha(usuario.id, id);

    if (!estado) {
        raiz.replaceChildren(
            h('h1', {}, 'Trilha não encontrada'),
            h('div', { class: 'vazio' },
                h('p', {}, 'Não encontramos a trilha que você procurou.'),
                h('a', { class: 'btn btn-pri', href: 'trilhas.html' }, 'Ver trilhas')));
        return;
    }

    document.title = `${estado.trilha.titulo} · GPC`;
    const linkNo = (noId) => `atividade.html?trilha=${encodeURIComponent(estado.trilha.id)}&no=${encodeURIComponent(noId)}`;

    // ---- progresso geral
    let acao = null;
    if (estado.proximoNoId) {
        acao = h('a', { class: 'btn btn-pri', href: linkNo(estado.proximoNoId) },
            estado.concluidos === 0 ? 'Começar a trilha →' : 'Continuar de onde parou →');
    }
    const progresso = h('section', { class: 'cartao', 'aria-label': 'Progresso na trilha' },
        h('div', { class: 'linha' },
            h('strong', {}, 'Progresso'),
            GPCUI.barra(estado.pct, `Progresso em ${estado.trilha.titulo}`),
            h('span', { class: 'sm' }, `${estado.concluidos} de ${estado.total} nós · ${estado.pct}%`)),
        estado.completa ? h('p', { class: 'parabens' }, 'Parabéns! Você concluiu todos os nós desta trilha.') : null,
        acao ? h('div', { class: 'acoes-topo' }, acao) : null);

    // ---- módulos
    const modulos = estado.modulos.map((m) => {
        const classeNum = m.status === 'CONCLUIDO' ? 'feito' : m.status === 'BLOQUEADO' ? 'trava' : '';
        return h('section', { class: 'cartao', 'aria-labelledby': `mod-${m.id}` },
            h('div', { class: 'modulo-cab' },
                h('span', { class: `modulo-num ${classeNum}`, 'aria-hidden': 'true' }, m.status === 'CONCLUIDO' ? '✓' : String(m.ordem)),
                h('h2', { id: `mod-${m.id}` }, `${m.ordem} · ${m.titulo}`),
                h('span', { class: 'sm' }, `${m.concluidos}/${m.total}`),
                GPCUI.chip(m.status)),
            m.nos.map((n) => {
                const detalhe = n.status === 'CONCLUIDO'
                    ? `Melhor nota: ${n.nota}`
                    : (n.requer || '');
                const botao = n.status === 'BLOQUEADO'
                    ? h('button', { class: 'btn btn-peq', type: 'button', disabled: true, 'aria-label': `Abrir ${n.titulo} (bloqueado)` }, 'Abrir')
                    : h('a', { class: 'btn btn-peq', href: linkNo(n.id), 'aria-label': `${n.status === 'CONCLUIDO' ? 'Rever' : 'Abrir'} ${n.titulo}` }, n.status === 'CONCLUIDO' ? 'Rever' : 'Abrir');
                return h('div', { class: 'no' },
                    GPCUI.chip(n.status),
                    h('span', { class: 'no-titulo' }, n.titulo),
                    h('span', { class: 'sm' }, detalhe),
                    botao);
            }));
    });

    raiz.replaceChildren(
        h('div', { class: 'eyebrow' }, 'Trilha'),
        h('h1', {}, estado.trilha.titulo),
        h('p', { class: 'lead' }, estado.trilha.descricao),
        progresso,
        ...modulos);
})();
